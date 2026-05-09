+++
title = "第二章：发行版维护基础"
weight = 2
[taxonomies]
tags = ["onboarding"]
+++

[htop]: https://htop.dev
[pcp]: https://pcp.io
[arch-pkgsite]: https://archlinux.org/packages
[fedora-pkgsite]: https://packages.fedoraproject.org
[debian-pkgsite]: https://www.debian.org/distrib/packages
[fhs]: https://specifications.freedesktop.org/fhs/latest/
[meson-build-options]: https://mesonbuild.com/Build-options.html#build-options
[chapter-3]: @/developer/packaging/onboarding/chapter-3.zh.md

本章内容将先介绍构建系统相关概念，然后基于通用的编译 “三连” 来介绍一些主流的构建系统的用法。

{% card(type="tips") %}
您可以根据自己对相关概念的熟悉程度，选择性地阅读本章内容，或者完全跳过本章内容。

**请确保您了解安同 OS 的文件系统结构。**
{% end %}

# 认识构建系统

由于软件可能会在多个平台、不同系统上运行，因此需要一款能够统一处理软件编译过程的程序来简化开发流程。如，Windows 下的编译器可能不是 MSVC、macOS 上可能只有 LLVM/Clang、Linux 下各种依赖库的路径可能不一样等等。这类程序会根据项目维护者编写的构建配置，自动生成一系列执行的编译器命令。同时，这类程序还能检测依赖是否满足，或根据依赖的存在情况自动开关项目特性。

构建系统就是根据构建配置及系统环境自动生成编译序列的程序，为了统一软件在不同平台和环境下的编译过程而设立。目前主流的构建系统有如下几个：

- GNU Autoconf: 与 GNU Automake 及 GNU libtool 合称为 GNU Autotools，是大多数软件包使用的构建系统，负责根据项目配置生成 Makefile，即可使用 `make` 命令编译；其设计较为古老，但非常可靠
- CMake: 较为现代化的构建系统；支持多种编译型语言，可以为多种构建序列执行器生成构建序列，如 GNU Make、Ninja 等；也可以使用 `cmake --build` 发起构建
- Meson: 较为灵活的构建系统；Meson 与 CMake 类似，也支持多种编译型语言

此外，一些编程语言随附的包管理器也具有构建系统的功能：

- Cargo: Rust 的包管理器，负责管理项目的依赖包 (Crate)；同时也担当绝大多数 Rust 项目的构建系统，使用 `cargo build` 即可发起构建
- Go: Go 集编译器、包管理器和构建系统为一体，负责构建项目，以及管理 Go 项目的依赖 (module)
<!-- - PEP 517: 针对 Python 模块的 “构建系统”。在大多数情况下，Python 的包只是复制粘贴；但 PEP 517 可以统一这类操作；同时也支持编译针对其它语言的绑定 (Binding)。 -->

# 构建系统相关概念

在介绍构建系统之前，您需要先了解关于目录结构、工作原理和依赖组件相关的内容。

## 源码目录和构建工作区

构建系统要从源码目录读取构建信息，并在构建工作区中生成供构建系统和编译器使用的文件。因此，您需要能够区分源码目录和构建目录。绝大部分构建系统都会单独区分这两个目录，以保持源码目录不受生成的文件污染。

源码目录（**S**ou**rc**e **Dir**ectory，简称 srcdir），是软件（或项目）源码所在的文件夹。在源码目录中有项目的说明 (README)、构建系统配置（定义）文件、开源协议全文、安装或编译说明 (INSTALL) 等文件。有些项目会将源码直接放在源码目录下，也有些项目会将源码放在源码目录的 `src` 文件夹下，以保持源码根目录结构清晰。

构建工作区 (Build directory)，是构建系统存放生成的构建信息、中间文件以及输出二进制文件的目录。这些内容可以直接存放于源码目录中，但可能会污染源码目录。因此构建系统支持将源码目录独立存放，以尽量减小对源码目录的污染。

如果要独立存放构建工作区，一般会将其放置在源码目录中，如源码目录下的 `build` 文件夹。您也可以将构建目录放在源码目录之外，但在运行构建系统时需要指定源码目录的路径。我们将独立于源码目录生成构建信息并构建的过程称为**独立构建 (Shadow Build)**。

## 安同 OS 的文件系统层次结构约定 (FHS)

[文件系统层次结构标准 (Filesystem Hierarchy Standard)][fhs]规定了 Linux 发行版中根分区的目录结构，FHS 标准由 Linux 协会制定。有些发行版不完全遵守这个约定，但在一定程度上兼容。

安同 OS 所采用的目录结构与通用的 FHS 有一些区别。安同 OS 要求任何项目的安装目录前缀 (Prefix) 都必须为 `/usr`。接下来，各类文件按如下目录放置：

- `/usr`: 一切安装的文件的基础（配置文件及运行时数据除外）
- `/usr/bin`: 存放可执行文件，不管文件是二进制还是脚本
- `/usr/lib`: 存放共享库文件（如 `lib*.so.*`）
- `/usr/libexec`: 存放属于主程序的协助程序的可执行文件（不应该被直接执行）
- `/usr/share`: 存放程序所使用的资源文件
- `/etc`: 程序配置文件存放目录的基础
- `/var`: 可变数据文件存放目录的基础

其中，“可变数据文件” 一般指程序运行后产生的数据、数据库等程序需要频繁读取和写入的数据。运行时的临时数据一般存放在 `/run` 或 `/tmp` 中。

{% card(type="info", title="例外情况") %}
对于一些规模较大的项目，它们有时会在 `/etc` 或 `/usr` 目录下安装配置、图标、快捷方式等文件，但程序本身集中在一个目录下，如 `/opt/程序名`。典型的软件包括任何基于 Electron 框架或 Chromium 的项目、VMware Workstation、NVIDIA 显卡驱动程序等闭源软件。

我们规定将此类程序的程序目录安装至 `/usr/lib/应用程序名`，如 VMware Workstation 的程序主目录安装在 `/usr/lib/vmware` 中。
{% end %}

## 路径前缀 (prefix) 和安装目标路径 (DESTDIR)

在编译系统中通常会用到两个路径相关的参数：一个是路径前缀 (prefix)，一个是安装目标路径 (`DESTDIR`, **Dest**ination **Dir**ectory)。

**路径前缀**是存放不同类型文件的目录（如存放可执行文件的目录 `bin`、存放共享库的目录 `lib`）的起点。路径前缀必须是以根目录 `/` 开始的绝对路径。如上文的目录结构中，`/usr` 就是发行版规定的路径前缀。例如，二进制文件会安装到 `$PREFIX/bin`, 程序的共享数据文件会被安装到 `$PREFIX/share` 目录中。

路径前缀一般情况下在没有指定时默认为 `/usr/local`，以避免直接覆盖系统文件。但在打包的情景中，任何软件包打包时都必须指定 `/usr` 为路径前缀，因为最终编译出的文件要安装到系统中，而非本地测试所用。当然，不是所有目录都要以 `/usr` 开始。例如，存放配置文件的目录是 `/etc`，存放可变数据文件的目录是 `/var`。

**安装目标路径**是构建系统按目录结构安装文件时的起始点。也就是说，安装的文件都以指定的 DESTDIR 为起点，再加上前缀，然后是对应分类的目录。如前缀为 `/usr` 的情况下，可执行文件会被安装到 `$DESTDIR/usr/bin`。`DESTDIR` 不指定时默认为空，这样所有文件会直接安装到系统中（例如可执行文件会被直接安装到 `/usr/bin`，共享库文件会被直接安装到 `/usr/lib`）。

{% card(type="info", title="区分路径前缀与 DESTDIR") %}
可以将 `DESTDIR` 视为一个假的（或临时的）系统目录：在 `DESTDIR` 中有 `etc`, `usr`（路径前缀）和 `var` 文件夹。安装时指定了 `DESTDIR` 的话，该目录中就会出现系统目录结构，软件的所有文件都将安装其中。
{% end %}

{% card(type="danger", title="尤其注意") %}
除非在为发行版打包，否则您无论如何都不能将路径前缀设置为 `/usr`。将路径前缀设置为 `/usr` 意味着执行安装步骤时，程序将直接覆盖系统下的文件（因为系统本身使用了 `/usr` 路径前缀）。
您可以不设置路径前缀，此时路径前缀会保持默认 (`/usr/local`)。您也可以将路径前缀设置到您可以直接读写的目录（无需 `sudo` 就可以安装的位置，如家目录下的某个专门存放编译程序的文件夹 `~/apps`）。
{% end %}

## 项目的依赖组件

“依赖” (Dependency) 是软件项目利用的外部代码。大部分项目为了简化开发，通常会集成第一方或第三方实现的代码（称为**库**），或者利用第三方工具为本项目提供服务（如生成项目的文档需要 DocBook 工具），这些库和工具就是项目的依赖。

软件项目的依赖一般分为两类：

- **构建时依赖 (build-time dependency)**: 软件构建时所需的构建系统、模块、静态链接库、头文件及编译器，以及生成或渲染项目文档、多媒体资源所需的工具
  - 典型的构建时依赖主要包括文档和图表生成器（Graphviz、GNU Plot、Jinja2、Pandoc 及 Doxygen 等）及辅助生成其他文件的工具，如归档及压缩工具、ImageMagick（生成位图图标）等
- **运行时依赖 (run-time dependency)**: 运行软件二进制或脚本时所需的动态链接库、模块和第三方工具
  - 典型的运行时依赖包括共享库本身（如 `lib` 开头的包）以及项目运行期间可能会调用的程序

由于软件构建时需要链接运行时需要用到的动态链接库，因此在编译项目前需要同时安装构建依赖和运行时依赖。


以 Kodi 为例，Kodi 作为一款功能完备的家庭娱乐中心软件，其运行期间必须能够解码各类多媒体文件，因此需要 FFmpeg、dav1d 等解码器库的帮助；除此之外，Kodi 项目中也有一份完备的开发和用户文档。这些文档是在构建期间生成的，供用户及开发者阅览。同时，Kodi 在构建期间需要生成一些图片资源。这些在构建期间生成文件需要的工具就是构建依赖，因为在日常运行期间不需要这些工具。

{% card(type="warning", title="请勿大意") %}
虽然编译期间需要同时安装运行时依赖及构建依赖，您仍旧需要区分构建依赖和运行时依赖。软件在日常运行期间不需要 Doxygen 等文档生成工具，因此不应将其作为运行时依赖安装在系统中。
{% end %}

## 调查项目依赖的方式

有以下几种方式可以调查软件项目所需要的依赖：

### 阅读软件说明文档

维护状况较好的软件项目一般会在其说明文件中（自述文件 `README`、编译安装指南 `INSTALL` 等）明确标出依赖的软件项目。此时，按照文档中所描述的依赖列表，使用系统中的包管理程序安装相应依赖即可。

### 参考其他发行版的打包信息

有些情况下软件项目的文档并不清晰，无法从文档中找到依赖的软件项目。此时最快的方法是参考其他发行版的打包信息。成规模的发行版都会有查阅软件包信息的网站（俗称 “包站”），您可以在其他发行版的包站中搜索对应的软件包，即可得出该软件项目的依赖。值得参考的发行版有 [Arch Linux][arch-pkgsite]、[Fedora][fedora-pkgsite] 及 [Debian][debian-pkgsite]。

当然，便利的方法不一定是最可靠的。Arch Linux 和其他发行版一样，多少会存在打包质量问题，有的时候依赖可能不完整。因此，一般的建议是以其他发行版为参考，而后以源码和编译结果为准，慢工出细活。

### 阅读构建系统的定义文件

通常来说，检查各类构建系统的配置脚本也是整理依赖的一个办法。各类构建系统的配置脚本将在下文介绍。

### 排除法

排除法是以上几种方法都无法整理出依赖的情况下才用到的方法，同时也是最笨的办法。简单来说，排除法就是 “编译，看错误，装依赖”。先尝试编译一次项目，出错时检查构建日志里的 “not found” 等字样，然后按特征文件查找对应的软件包，并记录下来。一般来说，最容易出现依赖缺失的是各类文档生成器（如 `doxygen` 和 `xmlto` 等）和可选数据生成器（如 `appstream-glib`、`gobject-introspection` 等）。

# 识别构建系统

您只需要看一看项目的根目录下有哪个构建系统的配置文件，即可确定这个项目所使用的构建系统。

{% card(type="warning" title="注意调查") %}
有些项目里包含了多个构建系统的构建配置文件。您需要阅读项目的说明文件（如 `README`, `INSTALL`, `HACKING` 等）及对应关键文件的修改历史来确定这个项目所推荐的构建系统。
{% end %}

## GNU Autotools

对于 GNU Autotools 套件，您需要查找项目目录下的如下文件之一：

- `configure`: 生成好的构建系统配置脚本。
- `configure.ac`: 用于生成 `configure` 脚本的定义文件，包含项目的依赖、构建序列及接受的可选依赖、定制选项。
- `configure.in`: 同上，是 `configure.ac` 的平替，但已经不再于新项目中使用。
- `Makefile.in`: Automake 生成 Makefile 时采取的模板或定义文件。
- `autogen.sh`: 用于生成 `configure` 脚本的脚本。
- `bootstrap`（可执行）: 用于获取完整的项目源码、资源等的脚本。会自动调用 Autoconf 生成 `configure` 脚本。

由于历史久远，且 Autotools 的扩展性非常强，才会有这么多特征文件。但这些项目中一定存在 `configure.ac` 或 `configure.in` 。

{% card(type="tips") %}
Autobuild 只依靠项目文件夹中的 `autogen.sh`, `configure.ac` 及 `bootstrap` 文件来确定该项目是否在使用 Autotools。
{% end %}

{% card(type="warning", title="注意甄别") %}
有些项目编写了 `configure` 脚本，但它并不是 Autotools 套件生成的——这样做只是为了照应开发及打包者的习惯，它们的参数也不与 Autotools 兼容。因此您无法使用 Autotools 模板编译这些 “假的 Autotools 项目”。

要区分 configure 脚本真假与否，请检查项目中是否存在其他特征文件。有些项目中的 `configure` 脚本的名称也不是全小写的，如 OpenSSL 的构建脚本叫 `Configure`。这类项目主要所用的构建系统一定不是 Autotools！请使用其他特征文件来确定项目是否真的在使用 Autotools。
{% end %}

## CMake

要确定项目是否在用 CMake，您只需要找项目的根目录下是否存在文件 `CMakeLists.txt`，且大小写一致。

`CMakeLists.txt` 尽管使用了纯文本文件的后缀名 `.txt`，但里面的内容则是 CMake 脚本。该脚本里记录了项目所需的依赖、构建序列及接受的可选依赖和定制选项。

## Meson

Meson 的构建系统定义文件名为 `meson.build`，内含配置逻辑、项目所需的依赖及构建序列。有时您可以在项目的根目录下看到另一个文件 `meson.options`（或 `meson_options.txt`）。该文件存放着运行构建系统时可以接受的定制选项。

一般来说，您只需检查项目中是否存在 `meson.build` 文件就能确定该项目是否为 Meson 项目。

<!-- ### PEP 517

PEP 517 统一了 Python 界混乱的构建系统。PEP 517 指定的项目定义文件是 `pyproject.toml`。对于任何 Python 项目，请检查这个文件是否存在。

> [!Note] 提示
> 有些项目同时提供 Setuptools 的定义文件 `setup.py`。请优先使用 PEP 517。
 -->
# 认识构建三连

“构建三连” 指利用构建系统构建软件包时的通用环节，即配置 (configure)、编译 (build/make) 和安装 (install)。下面将先介绍三连本身，然后再针对一些常用的构建系统讲述如何运行构建三连。

## 构建三连之配置 (Configure) 环节

配置环节是构建三连的第一步。配置环境负责生成构建序列，以供构建环节使用。配置环节的流程简述如下：

- 检测系统基本信息（如系统平台、编译器及链接器的类型和版本）
- 检测编译器及链接器特性
- 检测编译需要的头文件的存在情况
- 检查编译依赖（库）的存在情况
- 根据执行时提供的参数确定及检查项目包含的特性和（可选及特性依赖的必选）依赖
- 生成与系统环境及定制选项强相关的头文件（如 `config.h`）
- 生成供第二阶段的构建系统（GNU Make, Ninja 等）使用的构建序列文件

构建序列文件内包含所有需要编译的源码文件名、这些文件所属的模块以及模块之间的依赖关系，以及针对所有文件的编译器命令。

## 构建三连之构建 (make) 环节

之所以称之为 “make”，是因为广泛使用的 Autotools 的构建三连中，构建环节需要执行 `make` 命令。在 make 环节，构建系统会调用构建系统执行器（如 GNU make 及 Ninja，Windows 还可以有 MSBuild），编译整个项目。

为了最大化构建机器的利用率，这些构建系统的执行器一般都支持并行编译 (Parallel building/compilation)。并行编译是指，按系统所拥有的 CPU 核心数量，发起对应数量的构建作业。如，包含 2,000 个文件的项目，用单个线程编译（一个接一个地调用 GCC）和同时用 8 个线程（一次发起 8 个 GCC）编译所花的时间有天壤之别。

对于大部分的构建系统来说，构建步骤一定会开启并行编译。您也可以指定 `-j` 参数，设置并行编译期间同时执行的编译作业数量：

```sh
# 基本上所有构建系统均使用 `-j` 指定线程数量
make -j16          # 同时运行 16 个编译作业
make -j$(nproc)    # 同时运行与处理器数量相同的编译作业
```

## 构建三连之安装 (install) 环节

“安装”，是指将编译好的二进制、生成的文档及其他资源（图片、数据定义等）复制到系统内或指定目录。这些文件的目录结构在一定程度上遵循文件系统层次约定 (FHS)。

与普通的 “安装到系统” 不同的是，打包中的 “安装” 会把各类文件按目录层次先安装到特定目录下，以便基于该目录打包，即将特定目录视为文件系统的起始点。通常来说，指定这种目录的参数都叫 `DESTDIR`，大小写不一。这个变量名也是从 GNU 那里继承来的——大多数生成 Makefile 的构建系统一般都遵循这个不成文的约定。

# 不同构建系统的构建三连

## GNU Autotools

GNU Autotools 的构建三连非常直接，大多数接触过 Linux 系统开发的人应该或多或少地了解过。首先，进入项目的根目录，然后依次运行构建三连：

1. `./configure`: 执行 configure 脚本，配置项目，生成编译序列文件
2. `make`: 调用生成在项目根目录的 Makefile，编译项目。
3. `make install DESTDIR=/some/where`: 执行 Makefile 中的安装步骤，将项目文件安装至指定目录中。

{% card(type="warning", title="注意") %}
除非您明确要将编译的项目安装到系统中，否则请在执行 `make install` 时指定 `DESTDIR` 参数，并且确保 DESTDIR 没有指向根目录！
{% end %}

有些项目源码包在分发时可能没有预生成 `configure` 脚本，尤其是克隆的 Git 源码。有些项目即便有源码包可供下载，但里面预生成的 `configure` 脚本可能与源码支持的特性不同步。因此，在您执行 `configure` 脚本之前需要先生成一次 `configure` 脚本：

1. 如果源码目录下有 `bootstrap` 脚本，您可以直接执行 `./bootstrap` 脚本；`configure` 脚本会自动生成
    - `bootstrap` 脚本可能会拉取源码分发期间未集成的翻译文件及第三方依赖，如 Gnulib、翻译编目 (`*.po`) 文件等
2. 否则，如果源码目录下有 `autogen.sh` 脚本，您可以直接执行 `./autogen.sh` 脚本；`configure` 脚本会自动生成
3. 否则，如果源码目录下有 `configure.ac` 定义文件，您需要执行 `autoreconf -f -i` 命令，手动运行 Autoconf 生成 `configure` 脚本

## CMake

CMake 的三连也很简单，但 CMake 相比于 Autotools 较为灵活。CMake 严格区分源码目录和构建工作区，因此在运行时请注意指定路径参数。

CMake 的构建三连命令如下：

1. `cmake -S . -B build`: 读取当前目录 (`.`) 下的定义文件，执行配置步骤。该步骤将会在 `-B` 参数指定的目录 (`build`) 内生成构建序列文件。
2. `cmake --build build`: 读取 `build` 目录中的构建信息，调用对应的构建执行器，发起编译。
3. `cmake --install --prefix /somewhere/else/usr build`: 读取 `build` 目录中的构建信息，执行对应的安装步骤。安装的文件将安装在 `/somewhere/else/usr` 目录下。

{% card(type="info", title="注意") %}
绝大多数 CMake 项目均不允许将编译文件直接放置在源码目录中。因此，在执行 CMake 的配置阶段时，需要用 `-S` 参数指定源码目录，以及用 `-B` 参数指定构建工作区。
指定的构建工作区一般为 `build`（存放在源码目录下），您也可以自行起名，或将其放置于源码目录外。
之后的步骤均以生成的构建工作区为准，因此后续步骤均需要提供构建目录的路径。
{% end %}

{% card(type="info", title="区分 CMake 的安装前缀和真正的系统前缀及 DESTDIR") %}
CMake 安装步骤的 `--prefix` 参数不完全与 DESTDIR 等价。由于 CMake 只处理 `bin`, `lib`, `share` 等二级目录，因此在指定 `--prefix` 参数时务必加上 `/usr`，即 `--prefix=DESTDIR/usr`。
{% end %}

## Meson

Meson 的构建三连和 CMake 类似，Meson 也严格区分源码目录和构建工作区，因此 Meson 的配置阶段要求您至少提供构建工作区。Meson 的构建三连命令如下：

1. `meson setup build`: 读取当前目录的 `meson.build` 文件，运行配置步骤，随后在 `build` 目录下生成编译信息。
2. `meson compile -C build`: 进入编译目录 `build`，运行构建系统执行器，编译整个软件或项目。
3. `meson install --destdir /somewhere/else -C build`: 进入编译目录 `build`，将软件或项目安装至 `/somewhere/else`。

{% card(type="tips") %}
- Meson 的配置命令是 `meson setup`。Meson 拥有 `meson configure` 命令，但其与实际的配置步骤不同。`meson configure` 用于在已经生成的构建工作区中更改配置的值。
- Meson 在 Linux 中只会生成供 Ninja 使用的构建序列文件。除非需要手动指定，否则您无需在编译时指定并行作业数量——Ninja 默认按系统处理器的核心数发起并行作业。
- 因此，您也可以进入构建工作区运行 `ninja` 命令来运行编译过程。
{% end %}

# 独立构建 (Shadow build)

我们在前文中讲述了源码目录和构建工作区的区别，并强调大多数情况下构建系统均要求单独放置编译工作区目录。独立构建就是将构建目录单独放置，不直接在源码目录中生成文件，避免污染源码。

由于独立构建不受构建工作区及源码目录的位置影响，因此只要您指定了正确的源码目录，就可以在任何位置发起构建。

这里将分构建系统介绍各个构建系统的独立构建的使用方法及注意事项。

## GNU Autotools

GNU Autotools 不严格要求独立构建。但有一些项目可能要求独立构建，也有一些古老的项目无法独立构建。因此，您在编译 Autotools 项目时，请先使用独立构建，如果出错，再直接于源码目录下配置项目。

要执行独立构建，您需要先在源码目录中（或其他地方）新建一个空目录，然后进入该目录：

```sh
# 进入源码目录
cd /path/to/source
# 创建构建工作区
mkdir build
cd build
```

接下来，调用源码目录中的 `configure` 脚本（相对或绝对路径均可），在当前编译工作目录中执行三连：

```sh
# 调用处于上级目录的源码目录中的 configure 脚本
../configure --prefix=/usr
make -j16
make install DESTDIR=/somewhere/else
```

{% card(type="tips") %}
- 执行 `make` 和 `make install` 时，请确保当前目录是由 `configure` 脚本生成的构建工作区。
- 您也可以在其他位置执行 `make`，但您需要指定 `-C 构建工作区` 参数，好让 Make 找到正确的地方读取 Makefile。
{% end %}

如项目无法独立构建，则需要直接在源码目录中运行 `configure` 脚本：

```sh
# 进入源码目录
cd /path/to/source
# 直接在源码目录下运行三连
./configure
make -j16
make install DESTDIR=/somewhere/else
```

## CMake

CMake 默认要求独立编译，无法直接在源码目录中生成构建序列文件。不过，您无需在运行 CMake 的配置命令前手动创建构建工作区，CMake 会帮您按指定名称创建构建。

CMake 配置阶段的命令参数非常多样。您可以选择其中一种：

- `cmake 源码目录 -B 构建工作区`
- `cmake -S 源码目录 -B 构建工作区`
- 创建并进入构建工作区，然后执行 `cmake 源码目录`，如 `mkdir build && cd build && cmake ..`

在编译及安装阶段，您必须指定构建工作区路径。CMake 在这两个阶段只读取指定构建工作区的构建信息：

```sh
# 构建 CMake 项目
cmake --build 构建工作区
# 安装 CMake 项目至指定位置
cmake --install 构建工作区 --install-prefix /somewhere/else/usr
# 或者设置 DESTDIR 环境变量
DESTDIR=/somewhere/else cmake --install 构建工作区
```

## Meson

Meson 和 CMake 一样严格区分源码目录和构建工作区，也会自动帮您创建构建目录。

Meson 的调用方式也非常灵活。您可以选择其中一种来运行 Meson 的配置步骤：

- 在源码目录执行 `meson setup 构建工作区`
- 在任意位置执行 `meson setup 构建工作区 源码目录`

至于构建和安装步骤，调用方式也非常灵活。您也可以采取其中一种：

```sh
# 在任意位置运行构建，需要指定构建工作区
meson compile -C 构建工作区
# 或者进入构建工作区，无需指定路径：
cd 构建工作区
meson compile
# 或者进入构建工作区，直接运行 ninja:
cd 构建工作区
ninja
```
```sh
# 在任意位置运行安装步骤，需要指定构建工作区
meson install -C 构建工作区 --destdir=/somewhere/else
# 或者进入构建工作区，无需指定路径：
cd 构建工作区
meson install --destdir=/somewhere/else
```

# 提供定制选项

绝大多数项目都允许在项目配置阶段指定参数，定制项目。定制的范围大致有：

- 指定编译时使用的编译器：GCC 或 Clang、GCCGo 或 Golang
- 微调传给编译器的参数：启用特定指令集优化、链接期间使用链接时优化 (LTO)、加固 (hardening) 二进制等
- 选择项目所依赖的库的不同实现：例如，SSL 实现有 OpenSSL, mbedTLS, WolfSSL 等
- 开关项目的特性：有些使用正则表达式的项目默认不开 PCRE2 支持
- 开关项目需要编译的组件：如 LLVM 套件中 Clang 是可选的
- 调整路径前缀（一般情况下路径前缀默认为 `/usr/local`）
- 调整文件安装的位置
- 选择是否编译调试逻辑及调试信息，也就是以调试模式 (Debug build) 或发布模式 (Release build) 编译

正是因为构建系统的存在，项目的构建过程才能如此灵活，适应各种发行版的需求。本节内容也将按构建系统分别讲述如何确定能使用哪些参数，以及如何指定定制选项及编译器参数。

## 指定编译器及链接器

有时您也许会优先使用 GCC 构建项目，有时您也许会优先使用 Clang 构建项目，在 Windows 下您可能会优先使用 MSVC 构建项目。幸运的是，主流的构建系统都允许您选择希望使用的编译器。在介绍如何指定之前，先介绍一些行业黑话：

- `CC`: 即 **C C**ompiler，C 语言编译器。
- `CXX`: 即 **C++** (Compiler)，C++ 语言编译器（写作 `CXX` 是因为 `+` 普遍被用作特殊用途，因此采用与其外观相近的 X 作为替代）。
- `LD`: 即 Linker，链接器。Unix 界的链接器由于历史原因一直都称作 `ld`，取自二进制加载器 (**L**oa**d**er) 及二进制链接编辑器 (**L**ink E**d**itor) 之名。
- `CPP`: 即 **C P**re**p**rocessor，C 语言预处理器。CPP 负责展开所有的预处理宏（`#include`, `#if`, `#ifdef` 等）。
- `AS`: 即 **As**sembler，汇编器。

{% card(type="info" title="注意区分") %}
C++ 有时也叫做 CPP (**CP**lus**P**lus)，而且其源代码的扩展名也是 `.cpp`。但是切勿与这里的 CPP 混淆：一般在构建系统中，我们以 CXX 称呼 C++，因为 CPP 代表预处理器。
{% end %}

这些简写非常常见，因此需要您牢记。本节内容将使用以上简写代替完整的名称。

对于 Autotools，其配置阶段可以按如下方式指定编译器及链接器：

```sh
../configure CC=gcc CXX=g++ LD=ld.gold
```

对于 CMake，其配置阶段需要按照 CMake 的方式指定编译器及链接器：

```sh
cmake .. -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ -DCMAKE_LINKER_TYPE=LLD
```

{% card(type="tips") %}
CMake 2.39 起才支持使用 `CMAKE_LINKER_TYPE` 指定项目使用的链接器。较旧版本的 CMake 需要在指定编译器参数时指定，具体见下节内容。
{% end %}

对于 Meson，需要您设置对应的环境变量来指定编译器及链接器：

```sh
# 以一行流的方式指定变量，然后运行 Meson：
CC=gcc CC_LD=ld.gold meson setup build 
CXX=g++ CXX_LD=ld.gold meson setup build
# 您也可以将它们合在一起：
CC=clang CC_LD=ld.lld CXX=clang++ CXX_LD=ld.lld meson setup build
# 或者显式地设置环境变量，然后运行 Meson：
export CC=gcc CXX=g++
export CC_LD=ld.bfd CXX_LD=ld.bfd
meson setup build
```

## 指定编译器参数

有时您想在编译时启用比较激进的优化，或者指定编译器生成特定指令集扩展的指令，以此在一定程度上提升软件的性能。绝大多数构建系统均允许您在配置阶段追加编译期间传递给编译器的参数。

除了编译器外，您也可以为其他构建期间调用的编译工具传递参数。这些参数均以某种变量的形式存在，且其变量名一般都以 `FLAGS` 结尾，我们将其统称为 `FLAGS` 变量：

|      编译工具      |  简写  | 传参变量名  |
|:------------------:|:------:|:-----------:|
|      C 编译器      |  `CC`  |  `CFLAGS`   |
|     C++ 编译器     | `CXX`  | `CXXFLAGS`  |
| Objective-C 编译器 | `OBJC` | `OBJCFLAGS` |
| Rust 编译器        | `RUST` | `RUSTFLAGS` |
|       汇编器       |  `AS`  |  `ASFLAGS`  |
|       链接器       |  `LD`  |  `LDFLAGS`  |

通常情况下，您需要为每个工具指定多个参数，如启用优化并设置编译器至多生成哪些指令集的指令。举个例子，按以上条件用 GCC 手动编译 C 源文件：

```sh
# 运行 GCC，启用优化，并让编译器生成至多到 AVX2 指令集的指令（Haswell 之前的处理器将无法运行程序）：
gcc -O2 -march=x86-64-v2 -mtune=haswell -mavx2
```

上例中，`-O2`、`-march=x86-64-v2`、`-mtune=haswell` 和 `-mavx2` 都是要指定给编译器的参数，都是 `CFLAGS` 的内容。`FLAGS` 变量是一整个字符串，传递的参数间用空格隔开。因为字符串内有空格，所以设置 `FLAGS` 时需要将变量的内容用引号括起来：

```sh
export CFLAGS="-O2 -march=x86-64-v2 -mtune=haswell -mavx2"
```

接下来将分别介绍前文中三个主流构建系统指定编译器参数的方法。

对于 Autotools，您有两种方法指定构建工具的参数。一种方法是将其导出至环境变量，另一种是作为 `configure` 脚本的参数传递：

```shell
# 导出至环境变量
export CFLAGS="-O2 -march=x86-64 -mtune=sandybridge"
export CXXFLAGS="-O2 -march=x86-64 -mtune=sandybridge"
export LDFLAGS="-flto"
export CC=gcc CXX=g++ LD=ld.bfd
../configure --prefix=/usr ...
# 或者，作为 configure 的参数传递
../configure --prefix=/usr ... \
    CFLAGS="-O2 -march=x86-64 -mtune=sandybridge" \
    CXXFLAGS="-O2 -march=x86-64 -mtune=sandybridge" \
    LDFLAGS="-flto"
```

同样地，CMake 也有两种方式指定这些参数，环境变量或定制选项：

```shell
# 导出至环境变量
export CFLAGS="-O2 -march=x86-64 -mtune=sandybridge"
export CXXFLAGS="-O2 -march=x86-64 -mtune=sandybridge"
export LDFLAGS="-flto"
cmake -S . -B build ...
# 或者，按照 CMake 参数提供：
cmake -S . -B build \
    -DCMAKE_C_FLAGS="-O2 -march=x86-64 -mtune=sandybridge" \
    -DCMAKE_CXX_FLAGS="-O2 -march=x86-64 -mtune=sandybridge" \
    -DCMAKE_EXE_LINKER_FLAGS="-flto" \
    -DCMAKE_SHARED_LINKER_FLAGS="-flto"
```

对于 Meson，您需要将各编译工具的参数导出至环境变量中：

```shell
# 导出至环境变量
export CFLAGS="-O2 -march=x86-64 -mtune=sandybridge"
export CXXFLAGS="-O2 -march=x86-64 -mtune=sandybridge"
export LDFLAGS="-flto"
meson setup build --prefix=/usr
```

## 调查能够指定的定制选项列表

“定制选项” 是配置阶段向构建系统提供的、会影响项目功能特性的参数。因此前文中才有 “定制” 一说。由于每个项目能够定制的范围不同，因此除了一些通用的路径方面的参数（如系统前缀及各种目录）及编译器相关的参数外，不同项目会有不同的定制选项。在您执行配置步骤前，您需要了解要构建的软件项目接受的自定义参数。

总的来说，构建系统可以使用的参数分为如下几类：

- 系统路径定制参数：用于指定系统前缀，以及微调各类文件安装的位置。单独指定安装位置的参数可以无视系统前缀，如将系统前缀指定为 `/usr`，但将共享库的安装位置指定到 `/my/libs`。
- 项目特性定制参数：用于启用或禁用项目特性。这些特性包括额外的文件或数据格式支持、通信协议支持、与其他编程语言的集成组件、项目默认没有启用的功能等。
- 可选依赖定制参数：用于启用项目默认没有依赖的组件。这些可选依赖同样也会增强项目的功能，只不过需要额外的库才能实现。不是所有系统都有这些组件，因此不会默认开启。
- 构建模式参数：用于启用调试信息或通常不会用到的调试逻辑。也就是选择调试模式 (Debug build) 或发行模式 (Release build)。通常情况下，发行模式中不会包含调试逻辑，并且会启用更激进的编译器优化。

{% card(type="tips") %}
有些构建系统会提供带调试信息的发行模式。这意味着项目会以发行模式构建，但也会带上调试符号信息——这有助于软件出问题时协助用户调查原因。由于一般情况下用户不需要调试信息，因此在打包时，这些调试信息会被分离出软件包，转而打成专门的调试符号包。
{% end %}

不同构建系统查看可接受的参数的方式不同，指定定制选项的方式也不同。因此需要按构建系统分别讲述。

#### 2.7.3.1 Autotools

对于 Autotools，您可以在执行 `configure` 脚本时加上 `--help` 参数，`configure` 脚本会输出项目能够接受的参数列表。下例是 dpkg 的 `configure --help` 的输出：

<details>
<summary>点击展开或收起</summary>

```
$ ./configure --help
'configure' configures dpkg 1.22.11-30-ga45d7 to adapt to many kinds of systems.

Usage: ./configure [OPTION]... [VAR=VALUE]...

To assign environment variables (e.g., CC, CFLAGS...), specify them as
VAR=VALUE.  See below for descriptions of some of the useful variables.

Defaults for the options are specified in brackets.

Configuration:
  -h, --help              display this help and exit
      --help=short        display options specific to this package
      --help=recursive    display the short help of all the included packages
  -V, --version           display version information and exit
  -q, --quiet, --silent   do not print 'checking ...' messages
      --cache-file=FILE   cache test results in FILE [disabled]
  -C, --config-cache      alias for '--cache-file=config.cache'
  -n, --no-create         do not create output files
      --srcdir=DIR        find the sources in DIR [configure dir or '..']

Installation directories:
  --prefix=PREFIX         install architecture-independent files in PREFIX
                          [/usr/local]
  --exec-prefix=EPREFIX   install architecture-dependent files in EPREFIX
                          [PREFIX]

By default, 'make install' will install all the files in
'/usr/local/bin', '/usr/local/lib' etc.  You can specify
an installation prefix other than '/usr/local' using '--prefix',
for instance '--prefix=$HOME'.

For better control, use the options below.

Fine tuning of the installation directories:
  --bindir=DIR            user executables [EPREFIX/bin]
  --sbindir=DIR           system admin executables [EPREFIX/sbin]
  --libexecdir=DIR        program executables [EPREFIX/libexec]
  --sysconfdir=DIR        read-only single-machine data [PREFIX/etc]
  --sharedstatedir=DIR    modifiable architecture-independent data [PREFIX/com]
  --localstatedir=DIR     modifiable single-machine data [PREFIX/var]
  --runstatedir=DIR       modifiable per-process data [LOCALSTATEDIR/run]
  --libdir=DIR            object code libraries [EPREFIX/lib]
  --includedir=DIR        C header files [PREFIX/include]
  --oldincludedir=DIR     C header files for non-gcc [/usr/include]
  --datarootdir=DIR       read-only arch.-independent data root [PREFIX/share]
  --datadir=DIR           read-only architecture-independent data [DATAROOTDIR]
  --infodir=DIR           info documentation [DATAROOTDIR/info]
  --localedir=DIR         locale-dependent data [DATAROOTDIR/locale]
  --mandir=DIR            man documentation [DATAROOTDIR/man]
  --docdir=DIR            documentation root [DATAROOTDIR/doc/dpkg]
  --htmldir=DIR           html documentation [DOCDIR]
  --dvidir=DIR            dvi documentation [DOCDIR]
  --pdfdir=DIR            pdf documentation [DOCDIR]
  --psdir=DIR             ps documentation [DOCDIR]

Program names:
  --program-prefix=PREFIX            prepend PREFIX to installed program names
  --program-suffix=SUFFIX            append SUFFIX to installed program names
  --program-transform-name=PROGRAM   run sed PROGRAM on installed program names

System types:
  --build=BUILD     configure for building on BUILD [guessed]
  --host=HOST       cross-compile to build programs to run on HOST [BUILD]

Optional Features:
  --disable-option-checking  ignore unrecognized --enable/--with options
  --disable-FEATURE       do not include FEATURE (same as --enable-FEATURE=no)
  --enable-FEATURE[=ARG]  include FEATURE [ARG=yes]
  --enable-dependency-tracking
                          do not reject slow dependency extractors
  --disable-dependency-tracking
                          speeds up one-time build
  --enable-silent-rules   less verbose build output (undo: "make V=1")
  --disable-silent-rules  verbose build output (undo: "make V=0")
  --disable-nls           do not use Native Language Support
  --disable-rpath         do not hardcode runtime library paths
  --enable-shared[=PKGS]  build shared libraries [default=no]
  --enable-static[=PKGS]  build static libraries [default=yes]
  --enable-fast-install[=PKGS]
                          optimize for fast installation [default=yes]
  --disable-libtool-lock  avoid locking (might break parallel builds)
  --disable-dselect       do not build or use dselect
  --disable-start-stop-daemon
                          do not build or use start-stop-daemon
  --disable-update-alternatives
                          do not build or use update-alternatives
  --disable-devel-docs    build release docs
  --enable-coverage       whether to enable code coverage
  --disable-largefile     omit support for large files
  --disable-unicode       do not use Unicode (wide chars) support
  --enable-mmap           enable usage of unrealiable mmap if available
  --enable-disk-preallocate
                          enable usage of disk size pre-allocation
  --disable-compiler-warnings
                          Disable (detected) additional compiler warnings
  --enable-compiler-sanitizer
                          Enable compiler sanitizer support
  --enable-compiler-analyzer
                          Enable compiler analyzer support
  --disable-compiler-optimizations
                          Disable (detected) compiler optimizations
  --disable-linker-optimizations
                          Disable (detected) linker optimizations
  --enable-year2038       support timestamps after 2038

Optional Packages:
  --with-PACKAGE[=ARG]    use PACKAGE [ARG=yes]
  --without-PACKAGE       do not use PACKAGE (same as --with-PACKAGE=no)
  --with-gnu-ld           assume the C compiler uses GNU ld [default=no]
  --with-libiconv-prefix[=DIR]  search for libiconv in DIR/include and DIR/lib
  --without-libiconv-prefix     don't search for libiconv in includedir and libdir
  --with-libintl-prefix[=DIR]  search for libintl in DIR/include and DIR/lib
  --without-libintl-prefix     don't search for libintl in includedir and libdir
  --with-pic[=PKGS]       try to use only PIC/non-PIC objects [default=use
                          both]
  --with-aix-soname=aix|svr4|both
                          shared library versioning (aka "SONAME") variant to
                          provide on AIX, [default=aix].
  --with-gnu-ld           assume the C compiler uses GNU ld [default=no]
  --with-sysroot[=DIR]    Search for dependent libraries within DIR (or the
                          compiler's sysroot if not specified).
  --with-perllibdir=DIR   perl modules directory
  --with-devlibdir=DIR    dpkg development library directory [LIBDIR]
  --with-pkgconfdir=DIR   dpkg configuration directory [SYSCONFDIR/dpkg]
  --with-docspecdir=DIR   dpkg specifications directory [DOCDIR/spec]
  --with-methodsdir=DIR   dpkg download methods directory
                          [LIBEXECDIR/dpkg/methods]
  --with-admindir=DIR     dpkg database directory [LOCALSTATEDIR/lib/dpkg]
  --with-backupsdir=DIR   dpkg database backups directory
                          [LOCALSTATEDIR/backups]
  --with-logdir=DIR       system logging directory [LOCALSTATEDIR/log]
  --with-pkgconfigdir=DIR pkg-config .pc fragments directory
                          [DEVLIBDIR/pkgconfig]
  --with-aclocaldir=DIR   aclocal m4 fragments files directory
                          [DATADIR/aclocal]
  --with-polkitactionsdir=DIR
                          polkit .policy actions directory
                          [DATADIR/polkit-1/actions]
  --with-bashcompletionsdir=DIR
                          bash completions directory
                          [DATADIR/bash-completion/completions]
  --with-zshcompletionsdir=DIR
                          zsh vendor completions directory
                          [DATADIR/zsh/vendor-completions]
  --with-deb-compressor=COMP
                          change default dpkg-deb build compressor
  --with-libz             use z library for compression and decompression
  --with-libz-ng          use z-ng library for compression and decompression
  --with-libbz2           use bz2 library for compression and decompression
  --with-liblzma          use lzma library for compression and decompression
  --with-libzstd          use zstd library for compression and decompression
  --with-libselinux       use selinux library to set security contexts

Some influential environment variables:
  CC          C compiler command
  CFLAGS      C compiler flags
  LDFLAGS     linker flags, e.g. -L<lib dir> if you have libraries in a
              nonstandard directory <lib dir>
  LIBS        libraries to pass to the linker, e.g. -l<library>
  CPPFLAGS    (Objective) C/C++ preprocessor flags, e.g. -I<include dir> if
              you have headers in a nonstandard directory <include dir>
  CPP         C preprocessor
  LT_SYS_LIBRARY_PATH
              User-defined run-time library search path.
  PERL        Perl interpreter
  PERL_LIBDIR Perl library directory
  DPKG_SHELL  default POSIX shell interpreter used by dpkg
  DPKG_PAGER  default pager program used by dpkg
  CXX         C++ compiler command
  CXXFLAGS    C++ compiler flags
  CXXCPP      C++ preprocessor
  PATCH       GNU patch program
  TAR         GNU tar program
  PO4A        po4a program
  POD2MAN     pod2man program
  RT_LIBS     linker flags for rt library
  MD_LIBS     linker flags for md library
  Z_LIBS      linker flags for z library
  Z_NG_LIBS   linker flags for z-ng library
  BZ2_LIBS    linker flags for bz2 library
  LZMA_LIBS   linker flags for lzma library
  ZSTD_LIBS   linker flags for zstd library
  PKG_CONFIG  path to pkg-config utility
  PKG_CONFIG_PATH
              directories to add to pkg-config's search path
  PKG_CONFIG_LIBDIR
              path overriding pkg-config's built-in search path
  SELINUX_LIBS
              linker flags for selinux library
  SELINUX_CFLAGS
              C compiler flags for SELINUX, overriding pkg-config
  CURSES_LIBS linker flags for curses library
  SOCKET_LIBS linker flags for socket library
  PS_LIBS     linker flags for ps library
  KVM_LIBS    linker flags for kvm library

Use these variables to override the choices made by 'configure' or to help
it to find libraries and programs with nonstandard names/locations.

Report bugs to 	<debian-dpkg@lists.debian.org>.
dpkg home page: <https://wiki.debian.org/Teams/Dpkg>.

```

</details>

Autotools 的参数大致分为三部分：定制系统路径的参数、开关软件特性的参数及引入可选依赖的参数。

- 系统路径定制参数需要指定值，否则没有意义。除了 `--prefix` 外，路径定制参数一般均以 `--XXXXdir` 的形式存在，如上例中的 `--bindir`、`--libdir` 等。
- 特性定制参数一般以 `--enable-X` 或 `--disable-X` 形式存在，因此参数本身足够表达其意义，无需指定 `yes` 或 `no`。
- 可选依赖定制参数一般以 `--with-X` 的形式存在，指定后项目就会依赖上对应的组件，如上例中的 `--with-libz`（zlib 压缩支持）、`--with-libzstd`（ZStandard 压缩支持）等。

{% card(type="tips") %}
有些目录定制参数也会以 `--with-X=DIR` 的形式出现，如上例中指定 Bash 命令行补全文件路径的参数 `--with-bashcompletionsdir=DIR`。这类参数不属于依赖定制参数。

有些依赖定制参数也会混进 `--enable-X` 的选项中，也有一部分会采用 `--with-X[=DIR]` 的形式出现。后者接受可选的路径，以方便 Autotools 查找不在标准路径下（共享库在 `/usr/lib`、头文件在 `/usr/include`）的组件，如 `--with-openssl`（自动检测）或 `--with-openssl=/home/my/custom/openssl`（非标准路径）。
{% end %}

#### 2.3.7.2 CMake

由于 CMake 是动态读取 CMake 脚本的，因此无法直接给出可以指定的选项。不过，CMake 项目所接受的定制选项均通过 `CMakeLists.txt` 定义。您可以通过以下几种方式确定该项目可接受的变量：

- 阅读项目的 README、INSTALL 等构建文档。通常情况下，项目的文档会列出所有项目定制相关的 CMake 变量。有些项目的文档可能会集中在项目知识库 (Wiki) 中，请仔细查找。
- 阅读 `CMakeLists.txt`：这是最直接的方式，同样也最麻烦，也较为考验技能。不过，大部分定制相关的变量均以如下形式存在于定义文件中：
  ```cmake
  IF(ENABLE_SOMETHING)
      # ENABLE_SOMETHING 被设置时需要执行的操作，如设置额外的链接库参数
      message(STATUS "Something is enabled")
      target_link_libraries(project PUBLIC somelibrary)
  ENDIF()
  # 接下来就可以在调用 CMake 配置项目时启用这个选项了：
  # cmake -S . -B build -DENABLE_SOMETHING=ON ...
  ```
  或者：
  ```cmake
  option(SOME_OPTION "Enable some feature" OFF)
  # 同理，可以按以下方式启用该选项：
  # cmake -S . -B build -DSOME_OPTION=ON ...
  ```
- 使用 `ccmake` 命令行界面：`ccmake` 是 CMake 的终端图形界面 (TUI) 版。`ccmake` 在刷新一次缓存后会显示配置期间用到的所有变量。但是这些变量中大部分均与项目定制无关。
- 借鉴其他发行版：您可以查找对应软件包在其他发行版中的打包脚本，借鉴其中选用的编译参数。

#### 2.3.7.3 Meson

Meson 专门提供了参数定义文件 `meson.options`，方便项目开发者定义可以接受的定制参数，同时也方便了维护者参考。一些没有及时更新的项目依旧使用旧的参数定义文件名 `meson_options.txt`。

`meson.options` 的内容一般按如下形式组成：

<!-- NOTE: Gaillo, the syntax hightlighting engine used by Zola, does not support Meson as a language. Using Python instead. -->
```python
option(
    'option_name',         # 参数名
    type : 'option_type',  # 参数类型，可以是布尔值 boolean、字符串 string、
                           # 用于定制功能的类型 feature 及多选一 selection
    value : default_value, # 该参数的默认值，可以是空，也可以是 auto
    description: 'some'    # 该参数的描述，如启用该参数后的效果
)
```

## 指定定制选项

只有在了解项目接受哪些定制参数后，才能执行配置步骤。如您所见，不同构建系统指定定制参数的方式也不同。

对于 Autotools，指定参数的方式非常直接。在了解可以指定哪些选项后，您只需要在执行配置脚本时加上您想要指定的选项即可：

```sh
../configure --prefix=/usr \
             --with-libzstd \
             --with-zlib \
             --with-libbz2 \
             --with-liblzma \
             --enable-nls ...
```

{% card(type="tips") %}
有些选项是以变量定义的形式出现的，如 `--prefix=`、`--XXXdir=`。 因此请勿忘记指定这些参数的值。
{% end %}

CMake 不采用 `--with`、`--enable` 或 `--disable` 等形式的选项。CMake 需要您在执行配置阶段时定义变量的值来定制项目。CMake 指定定制选项的方式是 `-D变量名=值`。也就是说，需要在 CMake 执行 CMake 脚本时定义需要的变量来完成项目定制：

```shell
cmake .. -GNinja \
         -DCMAKE_BUILD_TYPE=Debug \
         -DCMAKE_C_COMPILER=/usr/bin/clang \
         -DCMAKE_CXX_COMPILER=/usr/bin/clang++ \
         -DLLVM_TARGETS_TO_BUILD="X86;Mips;ARM;AArch64" \
         -DLLVM_ENABLE_PROJECTS="clang;lld;lldb" \
         -DLLVM_ENABLE_ASSERTIONS=ON \
         -DLLVM_USE_LINKER=lld ...
```

CMake 用于控制选项开关的布尔值有 `ON`/`OFF` 及 `TRUE`/`FALSE`。所有使用 `option()` 定义的定制选项均为布尔值。

Meson 与 CMake 类似，但在打包 Meson 项目时需要用 `--prefix` 指定系统前缀，同时以 `-D变量=值` 的形式配置项目：

```shell
meson setup build --prefix=/usr \
            -Dlibmpv=true \
            -Dcdda=enabled \
            -Dlibarchive=enabled \
            -Ddvbin=enabled \
            -Dopenal=enabled \
            -Dsdl2=enabled \
            -Dpipewire=enabled \
            -Dvapoursynth=disabled ...
```

[Meson 可供定义的值][meson-build-options]有许多类型：

| 类型 | 类型名 | 可选值 | 用途 |
| :----: | :----: | :----: | :----: |
| 布尔值 | `bool` | `true`, `false` | 启用或禁用项目内的代码及特性等 |
| 特性开关 | `feature` | `enabled`, `disabled`, `auto` | 控制项目特性（如未指定则自动探测）|
| 字符串 | `string` | 任意字符串 | 设置项目版本后缀、问题报告链接、维护者信息等 |
| 单选 | `combo` | `values` 参数内定义的值之一 | 多种选择中单选，如选择某种协议的具体实现 |
| 多选 | `array` | `values` 参数内定义的多个任意值 | 多种选择中多选，如选择启用的模块 |

# 安同 OS 的打包过程

发行版的 “打包” 实际上就是按照发行版的规范配置、编译软件，再将编译出来的软件安装在一个临时的目标目录（也就是上面提到的 `DESTDIR`）内，并使用打包工具将其归档成一个可供包管理器安装的软件包的过程。安同 OS 有数千个软件包，因此为了方便和规范打包过程，我们严格使用 Ciel-ACBS-Autobuild 打包体系打包，确保软件包的质量。

以下是第一次为安同 OS 打包的简要流程；之后的几个章节将详细介绍这些流程。

1. 准备打包环境：使用 Ciel 工具初始化打包环境及 ABBS 树
2. 改动 ABBS 树：在工作区内的 ABBS 树中新建分支并作出修改，添加或更新软件包
3. 使用 Ciel 测试打包：运行 `ciel build` 命令测试修改，检查打包是否顺利通过
4. 修改打包脚本：如果打包失败，则需要修改打包脚本并重新测试打包
4. 推送修改：提交 (Commit) 修改，并推送到仓库中
5. 提交 PR 并审阅：在 GitHub 上提交 PR，等待审阅
6. 修改：根据审阅意见修改提交
7. 合并：重复上述两步，直到审阅通过，即可合并。

## 开发准备

恭喜您，您即将踏入安同 OS 开发的旅程！在出发之前，请按照下列清单，为您的安同 OS 开发入门之旅做好充足准备：

- 安同 OS 系统环境（虚拟机或实体机安装）
- 稳定的网络（不支持 HTTP 代理）
- 充足的硬盘空间（100GB 以上）
- 足够的耐心
- 操作命令行的能力

# 总结

- 编译一个程序或项目大致分为配置 (configure)、构建 (build) 及安装 (install) 三个步骤。
- 绝大多数项目都会使用构建系统简化项目的构建过程。
- 借助构建系统提供的灵活度，大多数项目在不同程度上允许各位开发者及打包者定制项目。
- 开发者及打包者需要在执行配置阶段时指定配置选项来定制项目，不同构建系统提供定制选项的方式不同。
- 对于打包者来说，系统前缀 (prefix) 须指定为 `/usr`，并且需要额外指定安装目标目录 (DESTDIR) 来避免直接覆盖系统文件。
- 而对于开发者或偶尔编译试用的用户来说，可以不指定系统前缀 (`/usr/local`)，或者将系统前缀指定到家目录中，避免安装期间使用 root 身份。同样地，也无需指定安装目标目录。

------

继续阅读[第三章][chapter-3]
