+++
title = "软件包维护入门：基础教程"
description = "了解 AOSC OS 打包流程"
date = 2020-08-04T02:13:57.919Z
+++

**注意**：这篇指南假定您对 Linux 和它的命令行界面有一定的认识。此外，您还需要装有 Linux 且有 `root` 访问权限的电脑。

# 打包工具

我们使用如下几个工具维护 AOSC OS 软件包：

  - [Ciel](https://github.com/AOSC-Dev/ciel-rs/)
      - 用于管理 systemd-nspawn(1) 容器。
  - [ACBS](https://github.com/AOSC-Dev/acbs/)
      - 用于管理软件包树（如我们的主树，*<https://github.com/AOSC-Dev/aosc-os-abbs>*）及各类构建配置。
      - 运行时，调用 Autobuild4 读取软件包构建配置并执行构建脚本。
  - [Autobuild4](https://github.com/AOSC-Dev/autobuild4)
      - 用于读取软件包构建配置并执行构建脚本。
  - [pushpkg](https://github.com/AOSC-Dev/scriptlets/tree/master/pushpkg)
      - 用于将构建后的软件包推送至社区软件源。
      
接下来几个章节中，我们会一一介绍这些工具的使用方式。

# 发行方式

AOSC OS 是滚动发行版，这意味着 AOSC OS 整体发行时不使用版本号（类似于其他滚动更新的发行版，如 openSUSE Tumbleweed 和 Arch Linux）。但与其他滚动发行版不同，[aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs) 树中有一组特殊的，包含核心运行时 (GNU C 库等）和工具链（GCC 等）的软件包，我们将它们统称为 [AOSC OS Core](https://github.com/AOSC-Dev/aosc-os-abbs/blob/stable/README.CORE.md)。AOSC OS Core 整体以版本号表示组件更新（Core 7.0.1, 7.0.2, 7.1.1 等）。

作为滚动发行版，我们只有一个面向用户的分支：`stable`。在更新或引入新软件包时，开发者们在软件包树（前面提到的 aosc-os-abbs）中创建专用分支，基于分支更改创建 Pull Request，并将测试用软件包上传到独立的软件源分支中。用户可以通过使用 [AOSC OS APT Topic Manager](https://github.com/AOSC-Dev/atm)（简称 ATM）提前测试更新或新包。软件包测试通过后，开发者将商议合并 Pull Request 并基于 `stable` 环境重构软件包，并推送至 `stable` 软件源。

我们称该工作流程为“主题制迭代模型（Topic-Base Iteration Model)”。该迭代模型的设计初衷是降低开发者的工作压力并保障软件包质量。您可以阅读[主题制维护指南 (Topic-Based Maintenance Guidelines)](@/developer/packaging/topic-based-maintenance-guideline.md) 了解详情。

# 配置环境

配置环境的第一步是安装 Ciel，如果您在使用 AOSC OS，您可以直接使用 `oma install ciel` 安装 Ciel。

Ciel 的主要功能为管理独立的 AOSC OS 构建环境（通称 BuildKit），因此 Ciel 不一定需要在 AOSC OS 上运行。如果您使用的是 Arch Linux，可以通过 AUR 安装 Ciel。

接下来，我们可以开始配置 Ciel 工作区了。该教程使用 `~/ciel` 作为 Ciel 工作区路径进行演示。注意：Ciel 需要使用 `root` 运行，且不能在 Docker 容器中运行；在创建工作区的过程中，需要从 GitHub 下载内容，请确保您的网络环境能够访问 GitHub。

请运行如下几个命令并跟随屏幕指示配置 Ciel 工作区。前几个选项使用默认值即可，在向导问是否需要创建新实例时（Do you want to add a new instance now?），请选择是，并创建一个名为 `main` 的实例。

``` bash
mkdir ~/ciel
cd ~/ciel
ciel new
```

工作区配置完成后，我们建议更新 BuildKit 环境（AOSC OS 打包者必须保证 BuildKit 环境为最新）。

``` bash
# 如果这一步耗时很长，您可以考虑通过 "ciel config" 设置 APT 源配置 (sources.list)。
ciel update-os
```

# 初试打包

一切准备就绪，我们来尝试构建一个已在树中的软件包。我们先挑个简单的 `app-multimedia/flac` 来打。

执行如下命令即可构建 `flac` 软件包。

``` bash
# -i 参数用于指定实例名。
ciel build -i main flac
```

如果构建过程成功完成并显示 `Build Summary` 提示，恭喜，您的处女包打出来啦！您刚刚打出来的包已由 Autobuild4 存放于 `OUTPUT-stable/debs`。

# 引入新包

本章节介绍如何引入软件包，为此我们需要从头编写软件包配置。

首先，切换至 `TREE` 目录，在这个目录中有许多用于分类整理的，以 `core-`、`app-`、`desktop-` 等开头的子目录；子目录的分类标准详见 [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs)。这些目录中就是各个软件包的配置文件夹了。

以 `i3` 为例，这个软件包位于 `desktop-wm/i3`，在切换到这个目录后，我们会发现其内部文件结构如下：

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
    │   ├── patches
    │   │   └── 0001-Use-OVER-operator-for-drawing-text.patch
    │   └── prepare
    └── spec
```

接下来，我们来了解下每个文件和文件夹的作用。

## `spec`

`spec` 文件提供用于指示 ACBS 下载源码文件的配置，以及软件包版本和修订 (Revision) 级别。该文件内容大致如下：

``` bash
VER=4.24  # 软件版本。
# REL=0 软件修订级别。该变量默认赋值为 0。

# 如使用源码压缩包 (tarball) 。
SRCS="tbl::https://i3wm.org/downloads/i3-$VER.tar.xz" # 源码包下载地址。
CHKSUMS="sha256::5baefd0e5e78f1bafb7ac85deea42bcd3cbfe65f1279aa96f7e49661637ac981" # 源码包校验。

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
  - `PKGSEC` : 软件包所在板块（类别）。
  - `PKGDEP` : 软件包依赖。
  - `PKGCONFL` : 软件包冲突信息。
  - `BUILDDEP` : 构建依赖（仅在构建时需要的软件包）。
  - `PKGRECOM` : 推荐依赖，在安装软件包时会自动安装，但可根据用户需要卸载。

上面列出的只是最常见的几个配置项。Autobuild4 还有许多其他配置参数，但如果软件包依赖信息和构建流程相对标准，一般不会需要使用其他参数。Autobuild3 会自动填入编译器参数、构建系统等其他构建参数。

以 `desktop-wm/i3` 为例：

``` bash
PKGNAME=i3
PKGSEC=x11
PKGDEP="dmenu libev libxkbcommon pango perl-anyevent-i3 perl-json-xs \
        startup-notification xcb-util-cursor xcb-util-keysyms \
        xcb-util-wm yajl xcb-util-xrm"
PKGRECOM="i3lock i3status"
BUILDDEP="graphviz doxygen xmlto"
PKGDES="Improved tiling WM (window manager)"

PKGCONFL="i3-gaps"
```

此外，`defines` 也支持 Bash 逻辑判断式，便于定义针对特定平台的配置或依赖等，但是这一用法现在已**不推荐使用**，以后也会禁止这种用法。如需定义特定平台的各项配置信息，请使用 `$VAR__$ARCH`（如 `AUTOTOOLS_AFTER__AMD64`）变量。

如需了解其他 Autobuild3 参数，请参阅 [Autobuild3 用户及开发者手册 (Autobuild3 User and Developer Manual)](@/developer/packaging/autobuild3-manual.md)

## `autobuild/prepare`

该文件是在构建过程开始前运行的脚本，常用于准备文件或设置构建过程中使用的环境变量。

## `autobuild/patches/`

该文件夹存放构建前要应用的补丁文件，将补丁文件放入该文件夹即可。

# 实操案例：GNU Hello

接下来，我们来实战软件包配置编写。该章节介绍 [hello](https://www.gnu.org/software/hello/) ，这是一个由 GNU 编写的简易问候程序，可在屏幕上打印一句“Hello, world!”。本软件没有依赖项，故而非常适合入门。

首先切换到 `TREE` 目录，并确定我们目前处于正确的 Git 分支。如前面提到的主题制迭代流程所要求，您需要首先为这个包创建一个 Git 分支。由于要引入新软件包，根据 [AOSC OS 主题制维护指南 (AOSC OS Topic-Based Maintenance Guidelines)](@/developer/packaging/topic-based-maintenance-guideline.md)，分支名称应为 `$PKGNAME-$PKGVER-new`，即 `hello-2.12.1-new`。

因为 `hello` 属于实用工具，我们要在 `app-utils` 下创建 `hello` 目录。

``` bash
cd TREE/app-utils
mkdir hello
cd hello
```

接下来，编写 `spec` 文件。首先，查阅项目网站，并找到最新版本源码包的下载 URL；下载文件并确认无误后，需计算其哈希值（如 SHA-256、MD5 等），并将各项信息填入文件。本例中使用了 SHA-256，可以使用命令 `sha256sum hello-2.12.1.tar.gz` 来计算。

``` bash
VER=2.12.1
SRCS="tbl::https://ftp.gnu.org/gnu/hello/hello-$VER.tar.gz"
CHKSUMS="sha256::8d99142afd92576f30b0cd7cb42a8dc6809998bc5d607d88761f512e26c7db20"
```

注意：我们在源码包 URL 中使用了 `$VER` 变量，这是个好习惯——因为这样一来，在更新软件包时就不需要再编辑 URL 了。

随后要创建的是 `autobuild` 文件夹和其中的 `defines` 文件。在本软件中，由于没有依赖项，故无需填写 `PKGDEP`；且为了避免编译时遇到版本冲突，需使用 `RECONF=0` 关闭重新生成 configure 脚本的功能。完成后的 `defines` 大致如下：

``` bash
PKGNAME=hello
PKGSEC=utils
PKGDES="A hello world demo program"
RECONF=0
```

一切就绪！现在即可运行如下命令构建 `hello`：

``` bash
ciel build -i main hello
```

很简单，对吧？这是因为 Autobuild4 的自动探测功能判断出这个包需要使用 `autotools`（即 `./configure && make && make install`）流程进行构建。

## Git 操作规范

软件包构建完成后，接下来要做的就是提交你的构建脚本了。AOSC OS 对 Git 提交说明有着相当严格的要求，下面介绍的是几个常用格式。我们在[软件包风格手册 (Package Styling Manual)](@/developer/packaging/package-styling-manual.zh.md) 描述了全部打包风格规范，建议择时阅读。

如需往树内增加软件包，Git 提交信应遵循如下格式：

```
$PKG_NAME: new, $VER
```
    
若以前文提到的 hello 为例，则提交信息为：

```
hello: new, 2.12.1
```

如需更新现有软件包，提交信息应遵循如下格式：

```
$PKG_NAME: update to $NEW_VER
```

现在以bash为例，若要将其版本升级至 5.2，则提交信息为：
```
bash: update to 5.2
```

另外，如果对软件包的构建配置进行了更改（如依赖变化、特性开关等），则需在提交信息中进行详细描述，如下例：

```
bash: update to 5.2

- Make a symbolic link from /bin/bash to /bin/sh for program compatibility.
- Install HTML documentations.
- Build with -O3 optimisation.
```

## 上传软件包

在成功构建软件包后，您可以将本地 Git 分支（如 `hello-2.12.1-new`）推送至您的 fork 中（如有提交权限，可推送至主树中）。随后，您需要创建拉取请求（Pull Request, PR）并按模板要求填入信息，最后即可将软件包推送至社区软件源的测试分支中供用户测试。

目前，软件包的上传与推送工作由自动化设施完成，相关内容请见[使用自动化设施构建软件包](@/developer/packaging/build-bot.zh.md)。

接下来，请静候 PR 审核和软件包测试。如果一切顺利，在您的 PR 被合并后，请重构相关软件包并将其上传至 `stable` 源。

# 结语

恭喜，您已掌握为 AOSC OS 引入、更新、构建和上传软件包的基础技能！

但如您所见，本文只概述了软件包维护的基础知识点。在需要构建更复杂的软件包和批量更新软件包之前，您还需要学习一些进阶知识。请参阅[软件包维护入门：进阶教程](@/developer/packaging/advanced-techniques.zh.md)。
