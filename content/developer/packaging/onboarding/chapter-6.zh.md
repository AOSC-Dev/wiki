+++
title = "第五章：编写打包脚本"
weight =6
[taxonomies]
tags = ["onboarding"]
+++

笼统地讲，为发行版 “打包” 就是按照 `/usr` 或发行版规定的系统前缀及分类路径、以发行版要求的依赖及打包标准构建软件包，然后将其安装至临时目录；再以临时目录为起点，将安装目录的内容压缩成一个压缩包，同时带上软件信息。打出的软件包随后会通过软件仓库等方式分发给最终用户，通过包管理器安装到用户的系统中。

本章内容将教您如何直接在源码目录中使用 Autobuild 构建软件包。

# Autobuild 介绍

Autobuild 是安同 OS 的打包工具，负责读取软件包信息，自动运行构建三连，构建源码并打出 `deb` 软件包。因此，Autobuild 属于安同 OS 打包工具链中最底层的一环。十几年来，Autobuild 经过四个大版本，逐渐成为完善的自动构建系统，支持主流语言的包管理器，以及主流的构建系统。

Autobuild 的主要逻辑均采用 Bash 编写，给开发者及维护者提供了极大便利。少数需要用到的函数等 Shell 中难以处理的功能被移至 C++ 实现中，以换取稳定度及可维护性。

Autobuild 在全局范围定义了发行版中规定的标准，以及默认启用或禁用的编译参数：

1. 默认系统前缀及各类文件的安装路径
    - `--prefix=/usr` 系统前缀
    - `--bindir=/usr/bin`、`--sbindir=/usr/bin`、`--libdir=/usr/lib` 等各类文件的默认安装路径
2. 默认启用或禁用的编译器参数，如优化、LTO、加固等；这些参数可以通过软件包定义的变量再次启用或禁用
    - `-flto`: 默认启用链接时优化 (LTO)
    - `-O2`: 默认启用编译期优化
3. 默认的编译器参数（架构基线指令集）
    - `-march=`: 基线指令集（或扩展），任何不支持该指令集的处理器均无法运行程序
    - `-mtune=`: 针对优化指令集（或扩展），程序在支持该指令集（扩展）的处理器上性能最佳
4. 默认的链接器参数（共享库搜索路径 RPATH 等）

因此，您无需在定制参数中重复指定上述选项。不过，除系统标准路径外，每个软件都可以在软件包定义中修改或重新定义上述内容。

## 构建流程

Autobuild 简单来说就是构建三连的包装，使得开发者可以用更小的脚本完成打包工作。在此同时，开发者也能够在构建三连前后运行脚本，灵活控制构建过程。Autobuild 的运行流程如下：

1. 读取 `autobuild` 目录中的软件包定义，获得基本信息
2. 运行构建前的 QA 检查（确保必需定义都存在）
3. 根据软件包定义设置编译器参数及链接器参数
4. 如果有，按顺序应用源码补丁
5. 如果有，运行 `prepare` 脚本（构建三连前的自定义脚本）
6. 根据构件模板的探测情况运行对应的构建模板（或自定义构建脚本 `build`）
7. 如果有，运行 `beyond` 脚本（构建三连后的自定义脚本）
8. 运行构建后的 QA 检查（检查路径等）
9. 运行后处理步骤（分离调试符号、压缩手册页等）
10. 调用 `dpkg-deb` 工具打包
11. 尝试安装新打出的软件包

同时，Autobuild 也支持自定义用户安装软件包时执行的操作。这些操作是由包管理器运行的：

- `prerm`、`postrm`: 包管理器卸载软件包前后执行的操作
- `preinst`、`postinst`: 包管理器解压软件包内容前后执行的操作

Autobuild 的整个构建流程可以用下图表示：

![image](https://hackmd.io/_uploads/BJVjZQcjA.png)

## 目录结构

Autobuild 以源码目录为工作区，读取软件包定义，执行构建三连打包。除全局配置文件外，Autobuild 所需的文件全部存放于源码目录中的 `autobuild` 文件夹下。Autobuild 不支持将 `autobuild` 目录置于其他位置，请知悉。以 Htop 为例，Autobuild 所需的主要文件如下：

- `/etc/autobuild/ab4cfg.sh`: 全局 Autobuild 配置文件，记录贡献者信息及第二阶段自举模式等。
- `htop-3.3.0/`: Htop 3.3.0 版本的源码目录。
  - `autobuild/`: Autobuild 构建定义文件所在目录。
    - `defines`: 软件包描述信息。Autobuild 目录下必须存在该文件。
    - `prepare`: 构建三连前执行的脚本，用于（选择性地）设置编译器参数（`CFLAGS` 等）。
    - `beyond`: 构建三连后执行的脚本，用于安装额外的文件、设置软链接等。
    - `build`: 自定义构建脚本。只有在构建模板无法满足需求、或者没有合适的构建模板时使用。
    - `patches/`: 用于存放以 `.patch` 结尾的源码补丁文件。

在构建中，Autobuild 会以源码目录 `htop-3.3.0` 为起点自动创建及处理源码目录和安装目标目录：

- `abbuild`: 启用独立编译时创建的构建目录。
- `abdist`: 安装目标路径所在目录。

安同 OS 和 Autobuild 没有 fakeroot 支持，因此在打包时会直接使用 `root` 权限。

## 语言规范

安同 OS 开发中，用于记录软件包元信息的语言叫做 APML（ACBS 软件包元数据语言，ACBS Package Metadata Language）。APML 是安同 OS 开发工具链所使用的语言，是 Bash 的子集，因此 Autobuild 可以直接读取文件。除了 `prepare`、`build` 及 `beyond` 等构建脚本外，所有软件包定义文件均受 APML 的约束。

APML 规定了软件包定义中 Bash 语言的使用范围：

- 只允许存在变量定义。
- 可以使用注释。
- 变量的值可以是字符串，可以是数组。
- 定义变量时可以引用参数，可以使用参数变换 (Parameter expansion)。
- 允许在字符串中使用行接续符（`\` 加上换行符）将字符串分成多行。
- 不允许 Here Documents。
- 不允许分支条件及循环控制。
- 不允许执行命令。
- 不允许使用管道。

## 一般工作流程

一般情况下，用 Autobuild 打包软件项目的流程分为如下步骤：

1. 调查阶段：收集软件包信息
   1.1 确定软件包名、版本、分类及描述
   1.1 调查软件项目使用的构建系统
   1.2 调查可以接受的定制参数（参考 2.2.5 节中的描述）
   1.3 结合系统情况选择要启用的特性或扩展
   1.4 收集需要指定的定制参数（`--prefix` 等路径相关的参数除外）
2. 定义阶段：编写软件包定义及构建脚本（如果有需要）
    2.1 编写软件包定义 `autobuild/defines`
    2.2 如果没有使用构建系统或构建系统不受 Autobuild 支持，则需要编写自定义脚本 `autobuild/build`
3. 构建测试阶段：确保编译通过
    3.1 在源码目录中运行 Autobuild
    3.2 如果出错，则需要调整定制参数或编译器参数，或者需要在构建前后运行处理脚本 (`autobuild/prepare`、`autobuild/beyond`)

# Autobuild 的构建模板

构建模板是运行构建系统的逻辑或脚本。构建模板从构建过程中隐藏了构建三连命令本身，因此打包者无需再手动编写构建脚本，只需要在软件包定义中指定项目的定制参数即可。

Autobuild 支持多种构建系统，每种构建系统都有自己的构建模板（这些构建系统的使用方法不尽相同），构建模板中包含如下定义及逻辑：

- 系统路径范围的定制选项（系统前缀、各类文件安装的位置等）
- 针对构建系统编写的构建三连
- 控制构建模板行为的变量（如对于 Autotools 是否重新生成 `configure` 脚本）

Autobuild 中存在如下构建模板：

- `autotools`: 处理使用 Autotools 构建系统的项目。
- `cmakeninja`: 处理使用 CMake 构建系统的项目，并让 CMake 生成 Ninja 构建系统执行器的构建序列文件。
- `cmake`: 处理使用 CMake 构建系统的项目，生成供 GNU Make 执行的 Makefile。
- `meson`: 处理使用 Meson 构建系统的项目。
- `waf`: 处理使用 WAF 构建系统的项目。
- `dune`: 负责处理 OCaml 软件包。Dune 是 OCaml 程序的构建系统。
- `perl`: 负责处理 Perl 软件包。
- `python`: 负责处理使用 Setuptools (`setup.py`) 的 Python 项目。
- `rust`: 负责调用 Rust 的包管理器兼构建系统 Cargo。
- `pep517`: 负责处理使用 PEP 517 构建系统的项目，并调用`build` 模块和 `install` 模块。
- `qtproj`: 负责处理使用 QMake 构建系统的项目（源码目录包含任何 `.pro` 结尾的文件）。

然而有时 Autobuild 提供的模板可能不够灵活，或者暂时还没有某个构建系统的模板支持，抑或是项目只需要执行 `make` 即可编译。在这种情况下，您可以使用自定义脚本，绕过 Auotbuild 的构建模板。

# 热身

在您动手使用 Autobuild 之前，请先确保您已经搭建好了安同 OS 的开发环境。由于在系统中直接运行 Auotbuild 会影响系统本身，因此在接触 Ciel 之前，我们强烈建议您使用虚拟机。您可以利用下面的检查表来确认：

- [ ] 独立的系统环境（开发机或虚拟机）
- [ ] 安装了 `devel-base`
- [ ] 安装了 `autobuild4` 和 `acbs`
- [ ] 确定要使用的用户名和邮箱
- [ ] 能够下载或克隆源码

在着手操作 Autobuild 之前，您需要先真正地编译一次软件。本节我们以著名的进程管理器 htop 为例，带您手动构建，然后转移至 Autobuild。

## 构建热身

[htop][htop] 是一个酷炫实用的进程（任务）管理器，可以查看处理器、内存和 I/O 的使用情况，可以按照某种指标排序，可以管理进程。本节先带您动手执行 Autotools 构建系统的构建三连：

1. 找个位置，或创建一个文件夹，作为工作目录：

    ```shell
    /tmp $ cd ~
    ~ $ mkdir aosc-build
    ~ $ cd aosc-build
    ```

2. 从网站或 GitHub 上下载其源码发行 (tarball) 并解压：

    ```shell
    ~/aosc-build $ wget https://github.com/htop-dev/htop/releases/download/3.3.0/htop-3.3.0.tar.xz
    ~/aosc-build $ tar xf htop-3.3.0.tar.xz
    ~/aosc-build $ cd htop-3.3.0/
    ```

3. 进入源码目录后，查找 Htop 选用的构建系统，确定可以指定的定制选项。

     源码目录中存在 `configure.ac` 文件，因此 Htop 是一个 Autotools 项目。同时，源码目录中有生成好的 `configure` 脚本，因此我们不需要重新生成。先看看 `configure` 脚本提供哪些参数：

    ```shell
    htop-3.3.0 $ ./configure --help
    ```

    浏览脚本的输出，可以找到一些有关定制 Htop 的功能的信息：

    - `--enable-pcp`: 启用 [PCP][pcp]（一款系统性能数据分析工具）支持
    - `--enable-unicode`: 启用 Unicode 支持
    - `--enable-affinity`: 启用进程相关性支持（绑定进程到某个 CPU 核心）
    - `--enable-capabilities`: 启用进程权限 (Capabilities) 支持
    - `--enable-sensors`: 启用传感器支持（用于显示处理器温度）

4. 决定要启用哪些定制选项。
    这里我们只启用能够显示处理器温度的选项 `--enable-sensors` 及 Unicode 支持。

5. 调查当前配置下所需要的依赖组件。

    Htop 的 README 非常清晰，列出了 Htop 需要的必要依赖组件，以及启用功能时额外所依赖的组件。我们需要记录所有必要依赖，并且根据上面的定制情况记录其他依赖：
    - 基本依赖有：编译器、Autotools 套件、NCurses 终端库
    - 启用传感器支持后引入的额外依赖：`libsensors`

    > [!Note]
    > `libsensors` 中以 `lib` 开头。按照业界的软件包命名规律，libsensors 属于共享库 (Library)。调查依赖期间遇到共享库时，您可能需要了解该共享库是否属于项目的一部分。
    > `libsensors` 是 [lm-sensors](https://hwmon.wiki.kernel.org/lm_sensors) 的一部分。lm-sensors 提供了查看传感器状态的工具，以及供其他程序实现温度监控的传感器库。

    在安同 OS 中，这些组件对应的包名分别为 `gcc`、`autoconf`、`automake`、`ncurses` 及 `lm-sensors`。而安同 OS 提供更简便的安装常用构建工具链的方式：您可以直接安装 `devel-base`，编译器及常见的构建系统会同时引入。

6. 安装依赖组件。

    将依赖组件与安同 OS 的软件包一一对应之后，用包管理器安装即可：
    ```shell
    htop-3.3.0 $ oma install devel-base ncurses lm-sensors
    ```

7. 按照选用的参数运行构建三连。

    > [!Note]
    > 本次热身仅作构建说明之用，您无需也不应该将安装前缀指定到 `/usr`。同时，您也无需指定 `DESTDIR`。
    > 在本次编译中，我们将系统前缀设置为家目录下的 `aosc-build` 文件夹，避免在构建阶段使用 `sudo`。

    万事俱备，现在就可以运行构建三连了！

    ```shell
    htop-3.3.0 $ mkdir build
    htop-3.3.0 $ cd build
    build $ ../configure --prefix=$HOME/aosc-build/apps \
                              --enable-sensors
    build $ make -j$(nproc)
    build $ make install
    build $ cd ..
    ```

8. 安装完毕后运行程序：

    由于安装的位置不属于标准路径，因此您无法直接使用 `htop` 命令运行刚才构建出的 Htop。您需要指定安装后的 Htop 的完整路径：

    ```shell
    htop-3.3.0 $ ~/aosc-build/apps/bin/htop
    ```

以上介绍了自行构建期间大致需要的步骤。您为安同 OS 打包时也需要采取类似的步骤，具体的细节会在后面讲到。

## 配置 Autobuild

都准备好了吗？那么我们就继续吧！您需要先告诉 Autobuild 您的维护者身份。以 root 身份编辑 `/etc/autobuild/ab4cfg.sh`，将您的信息填写至此：

```shell
MTER="Some Packager <some@packager.com>"
```

我们将继续以 Htop 为例讲述如何用 Autobuild 软件包。您现在可以删除之前安装的 Htop 及构建目录了：

```shell
htop-3.3.0 $ make -C build uninstall # 进入构建目录，卸载安装到 ~/aosc-build 的 Htop
htop-3.3.0 $ rm -r build # 移除构建目录
htop-3.3.0 $ rm -r ~/aosc-build/apps
```

现在，请您创建 `autobuild` 文件夹，准备动手编写 Autobuild 文件。

# 编写软件包定义

软件包定义记录在 `autobuild/defines` 文件中。`defines` 文件遵循 APML 的约束，因此该文件的内容只包含变量定义，即 `变量名=值`。

> [!Important]
> 等号左右不允许有空格，否则会被认定为命令。下面的例子都是不正确的：
> ```bash
> PKGNAME = bash
> # Bash 会认为 PKGNAME 是一个命令，“=” 和 “bash” 是 PKGNAME 命令的参数
> PKGNAME =bash
> # Bash 会认为 PKGNAME 是一个命令，“=bash” 是 PKGNAME 命令的参数
> PKGNAME= bash
> # Bash 会设置一个值为空的环境变量 PKGNAME，然后执行命令 “bash”
> ```

Autobuild 的软件包定义中包含了除源码信息外的所有内容：

- 软件包信息：包名、软件版本等
- 构建系统参数：使用的构建模板、构建系统的定制参数等
- 编译器特性：LTO、优化、切换到 Clang 编译器等

## 软件包基本信息

`defines` 文件中必须存在如下定义，否则该包视为无效：

|  变量名   |  类型  |                         约束                         | 作用                                                                          |
|:---------:|:------:|:----------------------------------------------------:| ----------------------------------------------------------------------------- |
| `PKGVER`  | 字符串 | 只允许出现小写字母、数字和符号；不允许出现短横 (`-`) | 记录软件包的版本。版本号遵循安同 OS 的版本记录规范，在本节中先忽略。          |
| `PKGNAME` | 字符串 |     一般只包含小写字母、数字、短横、加号及下划线     | 记录软件包的名称。                                                            |
| `PKGSEC`  | 字符串 |                        特定值                        | dpkg 包管理器规定的软件包分类。参考 `/usr/lib/autobuild4/sets/section` 文件。 |
| `PKGDES`  | 字符串 |                大小写字母、空格和数字                | 一句简短的、对软件包功能的英文描述。不允许出现偏向广告或宣传的形容词。        |

> [!Important]
> 由于软件包描述目前没有任何明确的规范，您需要与其他贡献者一起讨论如何编写软件包描述，如修缮模糊的描述、移除广告说辞等。

> [!Warning]
> 由于 ACBS 负责下载源码，因此 `PKGVER` 是由 ACBS 自动注入的。但是我们还未接触 ACBS，因此 `PKGVER` 需要手动定义。引入 ACBS 后，您就不能指定 `PKGVER` 了。

## 软件包依赖信息

除此之外，软件包定义文件中还需要记录构建相关的信息，如依赖关系、构建参数及编译器功能开关等。以下列举一些常用的依赖关系定义：

| 变量名 | 类型 | 约束 | 作用 |
| :--: | :--: | :--: | :--:|
| `PKGDEP` | 字符串 | 空格隔开的包名 | 软件包的运行时依赖列表 |
| `BUILDDEP` | 字符串 | 空格隔开的包名 | 软件包的构建时依赖列表 |
| `PKGPROV` | 字符串 | 空格隔开的包名及其约束 | 软件包提供的别名列表 |
| `PKGREP` | 字符串 | 空格隔开的包名及其约束 | 软件包取代的包名列表 |
| `PKGRECOM` | 字符串 | 空格隔开的包名 | 软件包推荐的包名列表 |
| `PKGBREAK` | 字符串 | 空格隔开的包名及其约束 | 软件包冲突的包名列表 |

> [!Important]
> - 这些字符串均允许使用行接续符，以避免字符串将一行撑得太长。
> - 软件包的约束使用 dpkg 接受的格式，也就是 “包名 + 约束符 + 版本”。这些约束指定软件包会提供、取代或冲突满足特定条件的包，如取代大于某个版本的包、与大于某个版本的包冲突等，如 `llvm<=17.0.2`。

## 软件包构建参数

对于构建参数，Autobuild 的定义如下：

|      变量名       |     类型     |     适用的构建系统      |                               作用                                |
|:-----------------:|:------------:|:-----------------------:|:-----------------------------------------------------------------:|
|     `ABTYPE`      |    字符串    |            -            |            跳过自动检测步骤，手动指定要使用的构建系统             |
| `AUTOTOOLS_AFTER` | 数组 |      GNU Autotools      | 指定额外的 Autotools 参数（`--with`、`--enable`、`--disable` 等） |
|   `CMAKE_AFTER`   | 数组 |          CMake          |             指定额外的 CMake 定义（`-DSOMETHING=ON`）             |
|   `MESON_AFTER`   | 数组 |          Meson          |                       指定额外的 Meson 定义                       |
|  `QTPROJ_AFTER`   | 数组 |          QMake          |                       指定额外的 QMake 参数                       |
|      `ABMK`       |    字符串    | Autotools、CMake、Meson |                  指定执行 make 阶段时的构建目标                   |

> [!Warning]
> 尽管 Autobuild 能够自动探测构建系统，我们依旧建议您手动指定，尤其是源码中出现多个构建系统的定义文件的情况。

> [!Important]
> 建议您使用数组定义这些变量，以避免空格、引号等引发的歧义。

## 编译器特性开关

定义文件中还允许您自定义构建时启用的编译器特性，如禁用 LTO、使用 Clang 作为编译器等。除非特殊说明，这些开关只接受布尔值，即 `yes` 或 `no` 和 `1` 或 `0`。一些常用的编译器特性开关如下：

|       变量名       |                 默认值                  |                              描述                               |
|:------------------:|:---------------------------------------:|:---------------------------------------------------------------:|
|      `NOLTO`       |                  `no`                   |                            禁用 LTO                             |
|      `RECONF`      |                  `yes`                  |                是否自动重新生成 `configure` 脚本                |
|     `USECLANG`     |                  `no`                   |          将 Clang、Clang++ 作为 C 和 C++ 语言的编译器           |
|     `ABSHADOW`     |                  `yes`                  |                        是否启用独立构建                         |
|     `NOSTATIC`     |                  `yes`                  |                是否保留编译的静态库（`.a` 文件）                |
| `AUTOTOOLS_STRICT` |                  `yes`                  | 是否启用 Autotools 的构建选项检查功能（遇到不认识的选项会报错） |
|     `ABSPRIAL`     |                  `yes`                  |     是否生成 Debian 兼容包名（Sprial 泛 Debian 兼容性支持）     |
|    `NOPARALLEL`    |                  `no`                   |                        是否启用并行编译                         |
|    `ABTHREADS`     | `$((nproc + 1))` （处理器核心数量 + 1） |                   发起的并行作业数量（整数）                    |
|   `AB_FLAGS_O3`    |                  `no`                   |             是否启用激进的编译器优化（`-O3` 参数）              |

## 编写定义

继续使用前面的 Htop 例子。根据之前的例子，我们得知：

- 软件包名是 `htop`，版本是 `3.3.0`
- 构建系统是 Autotools
- 需要为 Htop 启用传感器及 Unicode 支持，因此：
- Htop 运行时除了必要的依赖 `ncurses` 之外还有 `sensors` 软件包
- 启用上述支持的参数分别为 `--enable-unicode` 和 `--enable-sensors`

我们还需访问 [Htop 官网][htop]，了解官网中对 Htop 的描述：

> An Interactive Process Viewer
>
> _—— Htop 官网_

官网的描述有些模糊。由于 htop 的界面与经典 Unix 任务管理器 `top` 的界面类似，我们可以修缮官网的描述，使其符合规范：

> An top-like interactive process viewer
>
> _—— 修缮后的描述_

至此，我们已经拥有了全部的软件包定义。确保您当前处于 Htop 的源码目录后，您就可以新建 `autobuild` 文件夹，启动编辑器编写定义了。编辑 `autobuild/defines`，填入以下内容：

```bash
# 软件包基本信息
PKGNAME=htop
PKGSEC=admin
PKGDES="A top-like interactive process viewer"
PKGVER=3.3.0

# 依赖信息
PKGDEP="ncurses lm-sensors"

# 构建参数
ABTYPE=autotools
AUTOTOOLS_AFTER=(
    --enable-sensors
    --enable-unicode
)
```

以上就是本例的 Autobuild 软件包定义文件。

# 使用构建模板打包

在构建模板支持的情况下，编写软件包定义后可以立即开始打包。如果指定的定制参数正确，打包过程一般会非常顺利。您只需要在源码目录中以 root 身份执行 `autobuild`，坐等 Autobuild 出包即可:

![image](https://hackmd.io/_uploads/Byx5DDhsA.png)

<p style="text-align: center">
    <i>Autobuild 自动编译 htop 进行时</i>
</p>

![image](https://hackmd.io/_uploads/SykxOD3oC.png)

<p style="text-align: center">
    <i>Autobuild 打包成功</i>
</p>

如果构建出错，Autobuild 会提前退出，并且给出错误点。如下图，软件包定义中指定了额外的定制参数，但没有安装对应的依赖。于是，`configure` 脚本就会因为找不到依赖报错退出，`autobuild` 因此无法继续，并报告运行 `configure` 脚本出错（退出状态码不是 0 即代表运行出错）：

![image](https://hackmd.io/_uploads/H1AxKP3i0.png)

<p style="text-align: center">
    <i>构建失败时 Autobuild 的提示</i>
</p>

要解决此类错误，只需要在软件包的依赖列表中加入需要的依赖即可：

```diff
- PKGDEP="ncurses lm-sensors"
+ PKGDEP="ncurses lm-sensors pcp"
```

# 自定义构建脚本

有时 Autobuild 的构建模板无法完全满足构建软件包的需求，如需要额外增减编译器参数 （`CFLAGS`、`CXXFLAGS` 等），或者需要额外安装文件。Autobuild 允许在构建三连前后运行脚本，方便开发者或打包者处理上述情况。

当然，Autobuild 的构建模板虽然多，但总有不支持的构建系统，或者有些项目不使用构建系统，直接使用 `Makefile` 编译。此时您需要手动编写构建脚本，代替 Autobuild 的构建模板完成构建三连。

![image](https://hackmd.io/_uploads/BJVu0P3j0.png)

<p style="text-align: center">
    <i>Autobuild 的自定义脚本及流程</i>
</p>

> [!Important]
> 除非有必要，否则不建议使用 `patch` 脚本——用 `sed` 修改源码的方法并不稳定。
> 强烈建议修改源码后导出补丁，然后复制到 `autobuild/patches` 文件夹中。
>
> 导出为补丁有助于在更新期间发现补丁中的问题，因为 `sed` 等行编辑工具无法识别错误。同时用补丁可以清晰地描述补丁的目的。

## Autobuild 提供的实用函数

Autobuild 提供了一些方便开发者的实用函数，可以在自定义脚本里使用：

|     函数名      |    参数    |                                        描述                                        |
|:---------------:|:----------:|:----------------------------------------------------------------------------------:|
|    `abinfo`     | 任意字符串 |                                    输出提示信息                                    |
|    `abwarn`     | 任意字符串 |                                    输出警告信息                                    |
|     `aberr`     | 任意字符串 |                                    输出错误信息                                    |
|     `abdie`     | 任意字符串 |                            输出错误信息并以出错状态退出                            |
| `ab_match_arch` |  架构名称  | 判断当前系统的架构是否为指定架构，用作逻辑判断条件：如 `ab_match_arch loongarch64` |
| `ab_apply_patch` | 文件路径 | 手动应用指定的补丁文件 |

## prepare

prepare 脚本在构建三连之前运行。prepare 脚本主要的应用场景如下：

- 添加额外的编译器参数（`CFLAGS`、`CXXFLAGS` 等）
- 移除特定会导致编译错误的编译器参数
- 调整源码中的文件位置
- 移除部分不应出现的文件

以下是几个例子：

- `grub/autobuild/prepare`: 在构建之前需要将下载的翻译文件复制到构建系统期望的位置，并生成语言列表。这些步骤执行后方可使用构建模板执行构建三连：
```bash=
abinfo "Copying translation files ..."
find "$SRCDIR" -maxdepth 1 -type f -o -type l -name '*.po' -exec install -vt "$SRCDIR"/grub-2.12/po {} \;
abinfo "Generating LINGUAS file ..."
# See linguas.sh inside GRUB source tree.
autogenerated="en@quot en@hebrew de@hebrew en@cyrillic en@greek en@arabic en@piglatin de_CH"
for x in $autogenerated; do
    rm -f "po/$x.po";
done
(
    (
        cd "$SRCDIR"/grub-2.12/po && ls *.po | tee | cut -d. -f1
        for x in $autogenerated; do
            echo "$x";
        done
    ) | sort | uniq | xargs
) > "$SRCDIR"/grub-${__GRUBVER}/po/LINGUAS
```

- `qemu/autobuild/prepare`: 在构建之前需要针对特定架构关闭编译器特性，并设置时区，以使 Sphinx 正常运行：

```bash=
abwarn "FIXME: Hardening breaks build ..."
export CFLAGS="${CFLAGS} -fPIC"
export LDFLAGS="${LDFLAGS} -fPIC"

abinfo "tree vectorize is broken on ppc64"
if [[ "${CROSS:-$ARCH}" = "ppc64" ]]; then
    export CFLAGS="${CFLAGS/-ftree-vectorize/}"
fi

abinfo "Sphinx really want TZ to be set..."
export TZ=Etc/UTC
```

## build

build 脚本用于代替构建模板手动运行构建三连。一般情况下，绝大多数采用 Autobuild 支持的构建系统的项目，您无需对其自行编写构建脚本。但是遇到以下情况时，您必须自行编写构建脚本：

1. 项目所使用的构建系统不受 Autobuild 支持（如部分软件使用了 SConstruct，以及火狐浏览器有自己的构建系统）的
2. Autobuild 提供的模板无法完全满足需求，但可以复用模板中定义的过程的
3. 项目即便使用了支持的构建系统，但构建流程非常复杂，完全无法复用模板的（如 `glibc`、`gcc` 的自举阶段构建脚本）
4. 项目无需配置，直接调用 `make` 执行 Makefile 构建的——Autobuild 曾经提供 `plainmake` 模板，但由于大家的 Makefile 接受的参数及行为各不相同，因此该模板被弃用
5. 项目根本没有构建系统，需要手动逐个编译、手动链接的
6. 软件本身是二进制，只需在解压后以安同 OS 的路径标准及依赖包名重新打包的（如 NVIDIA 驱动、Discord 等各类私有软件）

上述情况中除第五条外，在安同 OS 中都可以找到例子，下面将详细解释这些情况。

**项目的构建系统不受 Autobuild 支持**：Autobuild 尚未提供对应构建系统的模板，因此需要将构建三连编写成脚本。例如，火狐浏览器及 Thunderbird 邮件客户端使用 `mozbuild` ，且构建流程较为复杂；Sunpinyin（拼音输入法引擎）等软件使用了一款较为小众的构建系统 SConstruct；Haskell 编写的软件（如 Pandoc，文档生成引擎）的构建流程也尚未总结成模板。下面是 Pandoc 的构建脚本：

```bash=
abinfo "Building pandoc ..."
cabal update
cabal v2-build pandoc-cli -j -v

abinfo "Installing pandoc ..."
cabal v2-install pandoc-cli \
        -j -v \
        --install-method=copy \
        --installdir="$PKGDIR"/usr/bin
```

**Autobuild 提供的模板无法完全满足需求**：项目使用构建系统有对应的构建模板，但基于实际应用情况需要额外执行一些步骤，总体上又可以复用构建模板里定义的过程。例如，libxcrypt 需要针对新旧 API 分别构建两次，但同时也无需写两遍构建三连的命令，转而直接调用构建模板中包装的函数，因此将这种情况归类为 “不完全满足需求且可以复用模板” 。qbittorrent 也属于此类情况，因为需要分别编译带图形界面前端和不带图形界面前端 (`qbittorrent-nox`) 的程序。以下是 libxcrypt 的构建脚本：

```bash=
# FIXME: MAKE_AFTER must be set if reusing the routines from autobuild4
export MAKE_AFTER=""

abinfo "Configuring libxcrypt (new API) ..."
build_autotools_configure

abinfo "Building libxcrypt (new API) ..."
build_autotools_build

abinfo "Installing libxcrypt (new API) ..."
build_autotools_install

abinfo "Resetting source tree ..."
rm -rv "$BLDDIR"

abinfo "Configuring libxcrypt (old API) ..."
export AUTOTOOLS_AFTER=(${AUTOTOOLS_AFTER__COMPAT[@]})
build_autotools_configure

abinfo "Building libxcrypt (old API) ..."
build_autotools_build

abinfo "Installing libxcrypt (old API) ..."
# Save PKGDIR first
export SAVED_PKGDIR="$PKGDIR"
export PKGDIR="$SRCDIR"/compat
build_autotools_install

export PKGDIR="$SAVED_PKGDIR"
install -Dvm755 "$SRCDIR"/compat/usr/lib/libcrypt.so.1.1.0 \
    -t "$PKGDIR"/usr/lib/

abinfo "Creating a symlink libxcrypt.so.1 => libxcrypt.so.1 ..."
ln -sv libcrypt.so.1.1.0 \
    "$PKGDIR"/usr/lib/libcrypt.so.1
```

**项目即使用了支持的构建系统，但构建流程非常复杂无法复用构建模板**：项目即便采用了支持的构建系统，但项目的配置、构建及安装阶段间需要更为复杂的步骤，无法一次性执行某个步骤，因此无法复用模板中定义的过程。用于构建安同 OS i686 兼容环境的编译器就需要复杂的自举步骤：GCC 需要分别在 32 位 glibc 构建前后构建一次，因为 glibc 不存在时无法构建 GCC 运行时。

**项目无需配置，直接调用 Makefile 构建**：项目结构较为简单，因此没有采用构建系统，取而代之的是一系列自行编写的 Makefile。编译这类项目时，通常只需要执行 `make`。大部分 Makefile 均遵循一部分的 GNU Makefile 约定，即：

- 拥有 `all`（构建整个项目）及 `install`（用于安装文件）两个构建目标，并且没有指定目标时默认为 `all`
- 支持指定系统前缀 `PREFIX` 及安装目标路径 `DESTDIR` 变量

此类项目可能还接受其他参数，以启用或禁用项目特性。具体请参考项目的文档。ZStandard 就属于此类项目:

```bash=
abinfo "Building zstd ..."
make

abinfo "Installing zstd ..."
make install \
    DESTDIR="$PKGDIR" \
    PREFIX=/usr

abinfo "Building pzstd ..."
make -C "$SRCDIR"/contrib/pzstd

abinfo "Installing pzstd ..."
make install -C contrib/pzstd \
    DESTDIR="$PKGDIR" \
    PREFIX=/usr
```

**软件本身就是二进制，只需要重打包**：所有私有软件（不开放源代码的）只发行预编译的二进制。安同 OS 的软件仓库中有一些允许重分发 (Redistribution) 的私有软件，但这些包因为种种原因无法直接进入安同 OS 的软件仓库，因此需要将依赖信息转换成安同 OS 中对应的软件包，并适当修改其他信息，按照安同 OS 的路径标准重新打包。

安同 OS 中有许多这样的软件，其中包括 NVIDIA 显卡驱动、各类商业软件、Google Chrome 浏览器、Discord 语音聊天软件等。与此同时，安同 OS 也会重打包维护难度较高的开源软件的二进制，如 .NET 运行时。下面是 Google Chrome 的 “构建脚本”，可见其中只有解压和复制粘贴：

```bash=
abinfo "Extracting archive file ..."
dpkg -x "$SRCDIR"/google-chrome-stable_current_amd64.deb \
    "$SRCDIR"/chrome/

abinfo "Deploying files ..."
mkdir -pv "$PKGDIR"/usr/{lib/google-chrome,share/pixmaps}
cp -arv "$SRCDIR"/chrome/opt/google/chrome/* \
    "$PKGDIR"/usr/lib/google-chrome/
cp -rv "$SRCDIR"/chrome/usr \
    "$PKGDIR"/

abinfo "Setting executable bits on shared objects ..."
chmod -v +x "$PKGDIR"/usr/lib/google-chrome/*.so*

abinfo "Installing icons ..."
ln -sfv ../../lib/google-chrome/product_logo_256.png \
       "$PKGDIR"/usr/share/pixmaps/google-chrome.png

abinfo "Installing symlink to google-chrome ..."
ln -sfv ../lib/google-chrome/google-chrome \
       "$PKGDIR"/usr/bin/google-chrome-stable

abinfo "Removing cron job for APT updates ..."
rm -fv /etc/cron.daily/google-chrome
```

## beyond

beyond 脚本是在构建三连后执行的。beyond 脚本常见的用途有：

- 追加没有被构建系统安装的文件
- 修正文件的权限
- 调整部分文件的位置
- 生成或修改 pkg-config 配置文件
- 生成手册页和文档
- 生成 Shell 的命令补全

通常 beyond 文件所做的操作都属于小修小补，偶尔也有追加编译的情况。下面举几个例子。

1. btrfsprogs 默认不安装 Shell 命令补全文件，需要在 beyond 脚本中手动安装：

```bash=
abinfo "Installing bash completions ..."
install -Dvm644 "$SRCDIR"/btrfs-completion \
    "$PKGDIR"/usr/share/bash-completion/completions/btrfs
```

2. Linux 的用户管理和鉴权套件 Shadow 需要在安装后修正 `su` 程序的权限，并且需要将 `/sbin` 里的可执行文件移动到 `/bin`（安同 OS 不使用 `/usr/sbin`）：

```bash=
abinfo "Installing groupmems PAM configuration ..."
install -Dvm644 "$SRCDIR"/etc/pam.d/groupmems \
    "$PKGDIR"/etc/pam.d/groupmems

abinfo "Dropping logoutd ..."
rm -v "$PKGDIR"/usr/sbin/logoutd

abinfo "Setting SUID for /usr/bin/su ..."
chmod u+s "$PKGDIR"/usr/bin/su

abinfo "Move everything else to /usr/bin, because this isn't handled by ./configure..."
mv "$PKGDIR"/usr/sbin/* "$PKGDIR"/usr/bin
rm -rv "$PKGDIR"/usr/sbin
```

# 总结

- Autobuild 是安同 OS 打包过程中直接接触软件源码、构建打包的一环。
- 供 Autobuild 读取使用的打包信息存储在源码目录中的 `autobuild` 文件夹下。
- 每个软件包必须有 `autobuild/defines` 文件，即软件包定义。
- Autobuild 能够处理很多种常见的构建系统，自动根据系统规定和打包者指定的参数执行构建三连。
- Autobuild 也允许打包者在构建三连前后运行自定义脚本（`prepare` 和 `beyond`），灵活定制构建过程。
- 在 Autobuild 不能自动处理构建过程的时候，开发者可以自行编写构建脚本（`build`）以代替构件模板执行构建。
- 自行编写构建脚本时需要尽可能复用模板中包装的函数和过程。
