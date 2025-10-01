+++
title = "软件包维护入门：基础教程"
description = "了解 AOSC OS 打包流程"
date = 2020-08-04T02:13:57.919Z
+++

**注意**：这篇指南假定您对 Linux 、它的命令行界面和 Git 有一定的认识。此外，您还需要装有 Linux 且有 `root` 访问权限的电脑。

# 打包工具

我们使用如下几个工具维护 AOSC OS 软件包：

  - [Ciel](https://github.com/AOSC-Dev/ciel-rs/)
      - 用于管理独立的 AOSC OS 构建环境（systemd-nspawn(1) 容器）。
  - [ACBS](https://github.com/AOSC-Dev/acbs/)
      - 用于管理软件包树（如我们的主树，*<https://github.com/AOSC-Dev/aosc-os-abbs>*）及各类构建配置。
      - 运行时，调用 Autobuild4 读取软件包构建配置并执行构建脚本。
  - [Autobuild4](https://github.com/AOSC-Dev/autobuild4)
      - 用于读取软件包构建配置并执行构建脚本。

接下来几个章节中，我们会一一介绍这些工具的使用方式。

# 发行方式

AOSC OS 是滚动发行版，这意味着 AOSC OS 整体发行时不使用版本号（类似于其他滚动更新的发行版，如 openSUSE Tumbleweed 和 Arch Linux）。但与其他滚动发行版不同，[aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs) 树中有一组特殊的，包含核心运行时 (GNU C 库等）和工具链（GCC 等）的软件包，我们将它们统称为 [AOSC OS Core](https://github.com/AOSC-Dev/aosc-os-abbs/blob/stable/README.CORE.md)。AOSC OS Core 整体以版本号表示组件更新（Core 7.0.1, 7.0.2, 7.1.1 等）。

作为滚动发行版，我们只有一个面向用户的分支：`stable`。在更新或引入新软件包时，开发者们在软件包树（前面提到的 aosc-os-abbs）创建专用分支，基于分支更改创建 Pull Request，构建测试用软件包并开展测试。用户可以使用 `oma topics` 来提前测试更新或新包。软件包测试通过后，开发者将商议合并 Pull Request，使用自动化设施基于 `stable` 环境重构软件包并推送至 `stable` 软件源。

我们称该工作流程为“主题制迭代模型（Topic-Base Iteration Model)”。该迭代模型的设计初衷是降低开发者的工作压力并保障软件包质量。您可以阅读[主题制维护指南 (Topic-Based Maintenance Guidelines)](@/developer/packaging/topic-based-maintenance-guideline.md) 了解详情。

# 配置环境

配置环境的第一步是安装 Ciel，如果您在使用 AOSC OS，您可以直接使用 `oma install ciel` 安装 Ciel。

Ciel 的主要功能为管理独立的 AOSC OS 构建环境（通称 BuildKit），因此 Ciel 不一定需要在 AOSC OS 上运行。如果您使用的是 Arch Linux，可以通过 AUR 安装 Ciel。

接下来，我们可以开始配置 Ciel 工作区了。 **注意：Ciel 需要使用 `root` 身份运行。** 可以使用 `sudo -i` 命令以提权（此时会进入root shell，`~`会指向`/root`），也可在每条命令前添加`sudo `（此时`~`的对应目录不会改变）。

**在创建工作区的过程中，需要从 GitHub 下载内容，请确保您的网络环境能够顺畅访问 GitHub。**

请先在合适的地方新建一个文件夹（文件夹所在的分区建议留出 10 GiB 或以上的可用空间）并切换到这个文件夹，然后运行以下命令，开始配置 Ciel 工作区。在向导询问目标架构时（Target Architecture），一般是选择当前这台设备的处理器架构；询问维护者信息时（Maintainer Information）时，请参照示例填写自己的信息；其余选项使用默认值即可；询问是否需要创建新实例时（Do you want to add a new instance now?），请选择是，并创建一个名为 `main` 的实例。

``` bash
ciel new
```

工作区配置完成后，我们建议使用以下命令更新 BuildKit 环境。BuildKit 指的是 AOSC OS 构建环境，一般运行在 Ciel 的容器中。我们建议定期或不定期更新 BuildKit 环境，以减少构建前的准备耗时。

``` bash
# 如果这一步耗时很长，您可以考虑通过 "ciel config -g" 设置 APT 源配置 (sources.list)。
ciel update-os
```

# 初试打包

一切准备就绪，我们来尝试构建一个已在树中的软件包。我们先挑个简单的 `app-multimedia/flac` 来打。

执行如下命令即可构建 `flac` 软件包。

``` bash
# -i 参数用于指定实例名。
ciel build -i main flac
```

如果构建过程成功完成并显示 `BUILD SUCCESSFUL` 提示，恭喜，您的处女包打出来啦！您刚刚打出来的包已由 Autobuild4 存放于 `OUTPUT-stable/debs`。

# 引入新包

本章节介绍如何引入软件包，为此我们需要从头编写软件包配置。

首先，切换至 `TREE` 目录，在这个目录中有许多用于分类整理的，以 `core-`、`app-`、`desktop-` 等开头的子目录；子目录的分类标准详见 [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs)。这些目录中就是各个软件包的配置文件夹了。

以 `i3` 为例，这个软件包位于 `desktop-wm/i3`，在切换到这个目录后，我们会发现其内部文件结构如下（此包没有补丁，因此在 `autobuild` 文件夹下没有 `patches` 文件夹）：

``` bash
    .
    ├── autobuild
    │   ├── beyond
    │   ├── conffiles
    │   ├── defines
    │   ├── overrides
    │   │   └── usr
    │   │       ├── bin
    │   │       │   └── i3exit
    │   │       └── share
    │   │           └── pixmaps
    │   │               └── i3-logo.svg
    │   └── prepare
    └── spec
```

接下来，我们来简要了解一下每个文件和文件夹的作用。未尽细节可在[《软件包样式指南》(Package Styling Manual)](@/developer/packaging/package-styling-manual.zh.md) 等文章查阅。

## `spec`

`spec` 文件提供用于指示 ACBS 下载源码文件的配置，以及软件包版本和修订 (Revision) 级别。该文件内容大致如下：

``` bash
VER=4.24  # 软件版本。
# REL=0 软件修订级别。该变量默认赋值为 0。

# 如使用源码压缩包 (tarball) 。
SRCS="tbl::https://i3wm.org/downloads/i3-$VER.tar.xz" # 源码包下载地址。
CHKSUMS="sha256::5baefd0e5e78f1bafb7ac85deea42bcd3cbfe65f1279aa96f7e49661637ac981" # 源码包校验和。

# 如使用 Git 源码。
SRCS="git::commit=$COMMIT_ID::https://some.git.hosting/somewhere"
CHKSUMS="SKIP"

# 如使用多个源码。
SRCS="git::commit=$COMMIT_ID::https://some.git.hosting/somewhere \
      tbl::https://some.domain/source_tarball.tar.gz \
      file::https://some.domain/souce_code_file"
CHKSUMS="SKIP sha256::some_checksum sha256::sume_checksum"
```

在这里尤其需要注意修订级别的值：在引入新软件包或更新现有软件包时，您可以忽略 `REL=` 变量，但在对进行软件包修订且软件包版本不变时，您需要通过提高某个软件包的修订级别以告知软件包管理器需要更新该软件包。在这种情况下，将 `REL=` 值加 1 即可。

## `autobuild/`

该文件夹存放 Autobuild4 定义及脚本文件。Autobuild4 可以通过解析这些文件（使用什么构建系统？使用什么构建参数？等）来组织构建流程。

## `autobuild/defines`

该文件定义软件包的各项核心配置：

  - `PKGNAME` : 软件包名。
  - `PKGDES` : 软件包简介。
  - `PKGSEC` : 软件包所在板块（类别）。需要注意的是，板块（类别）名并不一定与软件包在软件包树的子目录名称的一部分相同，例如 `i3` 处于软件包树的 `desktop-wm` 子目录，但它的所在板块是 `x11`。AOSC OS 所接受的软件包所在板块（类别）可查阅 [Autobuild4 的相关文件](https://github.com/AOSC-Dev/autobuild4/blob/master/sets/section)。
  - `PKGDEP` : 软件包依赖。
  - `PKGCONFL` : 软件包冲突信息。
  - `BUILDDEP` : 构建依赖（仅在构建时需要的软件包）。
  - `PKGRECOM` : 推荐依赖，在安装软件包时会自动安装，但可根据用户需要卸载。
  - `ABHOST` : 用于定义软件包是否属于 `noarch` 。

上面列出的只是最常见的几个配置项。Autobuild4 还有许多其他配置参数，但如果软件包依赖信息和构建流程相对标准，一般不会需要使用其他参数。Autobuild4 会自动填入编译器参数、构建系统等其他构建参数。

以 `desktop-wm/i3` 为例：

``` bash
PKGNAME=i3
PKGSEC=x11
PKGDEP="libev libxkbcommon pango perl-anyevent-i3 perl-json-xs \
        startup-notification xcb-util-cursor xcb-util-keysyms \
        xcb-util-wm yajl xcb-util-xrm"
PKGRECOM="i3lock i3status dex nm-applet dmenu xss-lock"
BUILDDEP="graphviz doxygen xmlto"
PKGDES="Improved tiling WM (window manager)"
PKGBREAK="i3-gaps<=4.21.1"
PKGREP="i3-gaps<=4.21.1"

ABTYPE=meson
```

此外，`defines` 也支持 Bash 逻辑判断式，便于定义针对特定平台的配置或依赖等，但是这一用法现在已**不推荐使用**，以后也会禁止这种用法。如需定义特定平台的各项配置信息，请使用 `$VAR__$ARCH`（如 `AUTOTOOLS_AFTER__AMD64`）变量。

如需了解其他 Autobuild4 参数，请参阅 [Autobuild3 用户及开发者手册 (Autobuild3 User and Developer Manual)](@/developer/packaging/autobuild3-manual.md)

## `autobuild/prepare`

该文件是在构建过程开始前运行的脚本，常用于准备文件或设置构建过程中使用的环境变量。

## `autobuild/patches/`

该文件夹存放构建前要应用的补丁文件，将补丁文件放入该文件夹即可。如有必要，应在 AOSC-Tracking 追踪对应项目并同步补丁更改。

# 实操案例：GNU Hello

接下来，我们来实战软件包配置编写。在该章节，我们来尝试打包 [hello](https://www.gnu.org/software/hello/) ，这是一个由 GNU 编写的简易问候程序，可在屏幕上打印一句“Hello, world!”。本软件没有依赖项，故而非常适合入门。

先切换到 `TREE` 目录并确定目前处于 `stable` 分支，然后执行 `git pull` 确保与上游同步，然后给软件包创建一个新的 Git 分支，分支名称应按 [AOSC OS 主题制维护指南 (AOSC OS Topic-Based Maintenance Guidelines)](@/developer/packaging/topic-based-maintenance-guideline.md) 编写。我们现在是要引入新软件包，所以分支名称格式应为 `$PKGNAME-$PKGVER-new`，即 `hello-2.12.1-new`。

创建分支后，就可以切换到这个分支上。因为 `hello` 属于实用工具，我们要在 `app-utils` 下创建 `hello` 目录。

``` bash
cd app-utils
mkdir hello
cd hello
```

接下来，编写 `spec` 文件。首先，查阅项目网站，并找到最新版本源码包的下载 URL；下载文件并确认无误后，需计算其哈希值（如 SHA-256、MD5 等），并将各项信息填入文件。本例中使用了 SHA-256，可以使用命令 `sha256sum hello-2.12.1.tar.gz` 来计算。

``` bash
VER=2.12.1
SRCS="tbl::https://ftp.gnu.org/gnu/hello/hello-$VER.tar.gz"
CHKSUMS="sha256::8d99142afd92576f30b0cd7cb42a8dc6809998bc5d607d88761f512e26c7db20"
```

注意：我们在源码包 URL 中使用了 `$VER` 变量。这是个好习惯——因为这样一来，在更新软件包时就不需要再编辑 URL 了。

随后要创建的是 `autobuild` 文件夹和其中的 `defines` 文件。本软件由于是动态可执行文件但没有其他依赖项，故 `PKGDEP` 项只需填写 `"glibc"`；编写软件包名称、依赖、描述等之后，应留一个空行，再编写编译功能和选项；由于 Autobuild4 会重新生成 configure 脚本，会导致编译 `hello` 时遇到版本冲突的问题，需使用 `RECONF=0` 关闭重新生成 configure 脚本的功能（但这不代表编译其他软件包时需要关闭此功能）。完成后的 `defines` 大致如下：

``` bash
PKGNAME=hello
PKGSEC=utils
PKGDEP="glibc"
PKGDES="A hello world demo program"
ABTYPE=autotools

RECONF=0
```

一切就绪！现在即可运行如下命令构建 `hello`：

``` bash
ciel build -i main hello
```

注意，虽然 Autobuild4 能自动判断出这个包需要使用 `autotools`（即 `./configure && make && make install`）流程进行构建，应新版软件包样式指南要求，我们必须显式声明 `ABTYPE` 的值。

然后，在 Ciel 的工作区目录下，您就能在相关的 OUTPUT 文件夹内看到构建出来的 `.deb` 软件包。此时，您可以在 AOSC OS 双击安装 / 使用 oma 安装 / 使用 dpkg 安装 之后测试这个软件包是否可以正常工作。例如，要测试 `hello` 是否正常，我们应在终端运行 `hello`，在 `LANG` 设置为 `zh_CN.UTF-8` 时会输出“世界您好！”。

## Git 提交

在跟着上面的步骤简单尝试打包之后，您就可以开始尝试打包自己真正想要为 AOSC OS 新增或更新的软件包了。如果是为 AOSC OS 新增一个软件包，需要考虑的要素会比上文中打包 GNU Hello 时要多，例如整理运行时依赖与构建依赖；如果在此期间遇到问题，可以在社区群组或者社区论坛询问。

用户打包一个软件包，并不等于一定要上传到 AOSC OS 主树。但我们建议，只要软件是允许 AOSC OS 维护者打包与重分发的，并且软件包在主树不存在或不是最新，那么欢迎把软件包信息提交到主树，一起建设 AOSC OS 的软件仓库。但相对地，个别软件并不允许 AOSC OS 维护者打包与重分发（例如个别专有软件和“免费商用”但不允许重分发的字体），或者不适合继续提供给用户（例如已有后续项目，原项目不再更新，前后具有继承关系），或者官方对重分发并不友好（例如某专有软件特意限制自动拉取软件包，需要动态密钥和时间戳才能下载），此时如您想用软件包形式来管理它们（这是个好习惯），您也可以只为自己打包。

软件包构建完成并测试可用，确认软件的授权允许打包与重分发之后，就可以着手开始提交您的构建脚本了。在提交之前，您可使用 [pakfixer](https://github.com/AOSC-Dev/pfu) 检查您编写的构建脚本，并做适当修改。

为了有效追溯对主树的更改，AOSC OS 主树对 Git 提交信息提出了较为严格的要求，详见[《软件包样式指南 (Package Styling Manual)》](@/developer/packaging/package-styling-manual.zh.md)，以下节选一部分常见格式。

```
$PKG_NAME: new, $VER  # 引入新软件包
```

引入新软件包时，原则上不应出现多笔提交（如有，则需使用 `git rebase -i` 进入可视化变基，以将多笔提交合并为一笔）

```
hello: new, 2.12.1  # 以前文提到的 hello 为例
```

```
$PKG_NAME: update to $NEW_VER  # 更新现有软件包
bash: update to 5.2  # 以bash为例，若要将其版本升级至 5.2
```

如果在更新现有软件包时对软件包的构建配置进行了更改（如依赖变化、特性开关或补丁增减等），则需在提交信息中进行详细描述，如下例：

```
bash: update to 5.2

- Make a symbolic link from /bin/bash to /bin/sh for program compatibility.
- Install HTML documentations.
- Build with -O3 optimisation.
```

## 上传软件包

软件包构建完成并测试可用，且成功使用 Git 执行提交（commit）操作后，您可以将主树 fork 到自己的 GitHub 账号上，将本地 Git 分支（如 `hello-2.12.1-new`）推送至您的 fork，随后在主树创建拉取请求（Pull Request, PR），按模板要求填入信息。

接下来，请静候 PR 审核。社区的贡献者会审阅并提出修改意见（如有），在修改和测试通过后，社区的贡献者会通过您的 PR 并合入 stable 分支。最后，您就可以使用自动化设施发起构建，并向所有用户推送软件包。目前，软件包的上传与推送工作由自动化设施完成，相关内容请见[使用自动化设施构建软件包](@/developer/packaging/buildit-bot.zh.md)。

对 AOSC OS 主树等 AOSC OS 仓库贡献一次提交后，即可成为贡献者。在成为贡献者后，您可以将本地 Git 分支直接推送到主树，之后使用自动化设施创建 PR 、测试构建软件包，自行安装并测试、生成审计报告（`/dickens`），等待其他贡献者审阅与通过 PR 后，将软件包合入 stable 分支并**再次**构建软件包。

# 结语

恭喜，您已掌握为 AOSC OS 引入、更新、构建和上传软件包的基础技能！

但如您所见，本文只概述了软件包维护的基础知识点。在需要构建更复杂的软件包和批量更新软件包之前，您还需要学习一些进阶知识。请参阅[软件包维护入门：进阶教程](@/developer/packaging/advanced-techniques.zh.md)。
