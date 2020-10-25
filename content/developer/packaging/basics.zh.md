+++
title = "软件包维护入门：基础"
description = "了解 AOSC OS 打包流程"
date = 2020-08-04T02:13:57.919Z
+++

> **注意：本入门所描述的维护指南自 2020 年 10 月 25 日起已被弃用。**我们已经开始实践新提出的[话题制维护指南 (English)](@/developer/packaging/topic-based-maintenance-guideline.md)。在我们更新这篇文档之前，您可以左转阅读那份指南，或者坐等更新。

**注意**：这篇指南假定您对 Linux 和它的命令行界面有一定的认识。此外，您还需要有一台您本人拥有 `root` 访问权限的装有 Linux 的电脑。

# 需要用到的工具

我们需要这些工具来构建软件包。先不用纠结怎么用它们，我们会在后面提及。

  - [Ciel](https://github.com/AOSC-Dev/ciel/)
      - 用于管理 systemd-nspawn(1) 容器。
  - [ACBS](https://github.com/AOSC-Dev/acbs/)
      - 用于管理软件包树（例如我们的 [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs)）。
      - 可以调用 Autobuild3 以读取打包脚本（AOSC 使用由我们自行开发的 Autobuild3 打包系统，有一套特殊的打包脚本格式）并构建指定的软件包。
  - [Autobuild3](https://github.com/AOSC-Dev/autobuild3/)
      - 用于运行构建脚本。
  - [pushpkg](https://github.com/AOSC-Dev/scriptlets/tree/master/pushpkg)
      - 将构建好的软件包推送到官方软件仓库。

# 发行周期

AOSC OS 采用的是半滚动更新模型，通常每个发布周期都为时三个月。这意味着 AOSC OS 和 Arch Linux 等滚动发行版一样是没有版本号的。但是，在 [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs) 树中，[AOSC OS Core](https://github.com/AOSC-Dev/AOSC-os-abbs/blob/testing-proposed/README.CORE.md) 是由一组软件包构建而成的，这组软件包由运行时库（例如 GNU C Library）和工具链（例如 GCC）组成。这组包以版本化的方式更新（Core 7.0.1、7.0.2、7.1.1 等）。此外，AOSC OS 软件仓库中所有更新都需要在一个 `*-proposed` 软件仓库中作经过一段时间的测试。

我们有两个主要分支，分别是 `stable` 和 `testing`，还有三个开发分支 `stable-proposed`、`testing-proposed` 和 `explosive`。

`stable-proposed` 没有冻结期，但这个分支只接受小版本更新（也就是说版本号 `x.y.z` 中只有 `z` 变动了）、安全更新、漏洞修复，还有 [一些例外](@/developer/packaging/cycle-exceptions.md)，这个分支的更新每周都会被合并到 `stable` 分支。

`testing-proposed` 是主要的工作分支。引入新软件包和已有软件包的大版本更新（例如 Firefox 78 -> 79）通常都在此分支进行。开发工作遵循三个月一周期的迭代计划（可以参考 [Winter 2020 的迭代计划](https://github.com/AOSC-Dev/AOSC-os-abbs/issues/2073))。在前两个月，开发人员会构建新软件包或主要版本更新，随后在 `testing-proposed` 进行测试。

在最后一个月的开头，`testing-proposed` 会被合并到 `testing`。在这个月，启用 `testing` 软件仓库的用户将收到更新，并帮助测试它们。如果一切顺利，到月底，`testing` 就会被合并到 `stable`，从而完成整个周期。在这段时间内，`testing-proposed` 分支则会被冻结，不再接受新更改。

`explosive` 则像一个实验田，通常用于放置不适合当前周期的软件包和更新。在 `testing-proposed` 冻结期间，开发人员可能会提前向这一分支推送更新，因为 `explosive` 会在新周期开始时被合并到 `testing-proposed`。

# 配置打包环境

首先我们要在电脑上安装 `ciel`。在 AOSC OS，直接在官方软件仓库获取并安装即可。Ciel 管理的是标准化的 AOSC OS 构建环境（或者说 [BuildKit](https://aosc.io/downloads/#buildkit)），而构建的流程不一定要在 AOSC OS 上进行，如果您在使用 Arch Linux，您也可以在 AUR 获取 Ciel。

接下来，我们会初始化一个 Ciel 的工作区，这里我们会使用 `~/ciel` 作为演示。请注意您需要使用 `root` 运行 Ciel。而且，您不能在 Docker 容器里运行 Ciel。

``` bash
mkdir ~/ciel
cd ~/ciel
ciel init
```

接下来我们部署 `BuildKit`。`BuildKit` 是一个最小化的 AOSC OS 变体，专门用于打包或容器化开发。它包含了 ACBS 和 Autobuild3，因此我们不需要做额外的配置。

``` bash
ciel load-os
# 或者如果您已经下好了一份 BuildKit 的话
ciel load-os PATH_TO_BUILDKIT
```

接下来我们强烈推荐您将 `BuildKit` 更新到最新状态（如果您想把您的工作发布到 AOSC OS 的官方软件源里面的话，这一步是必须的）。

``` bash
ciel update-os
```

下一步，我们加载 ACBS 树。这里我们加载的是我们默认的的 `aosc-os-acbs` 树。

``` bash
ciel load-tree # 默认情况下，ciel 会加载官方的树
# 或者，您也可以将您想使用的树 git clone 到 ciel/TREE
```

# 构建我们的第一个软件包！

好了，现在我们已经把打包环境配置好，可以尝试构建一个已有的包了。让我们从一个相对简单的例子开始，`extra-multimedia/flac`。

在此之前，我们需要创建一个 Ciel 实例。建议对不同的分支使用不同的实例：

``` bash
ciel add stable # 因为我们准备为 stable 分支构建这个包
```

确保我们的树在 `stable` 分支上。

``` bash
cd TREE
git checkout stable
cd ..
```

然后，我们需要配置 Ciel 以使用正确的软件仓库。为了避免产生错误的依赖关系，打包环境应该使用与分支匹配的包（`stable-proposed` 只使用来自 `stable` 的依赖项，是一个例外）。比如：
+ 当构建 `stable` 仓库的软件包时，我们需要 `stable` 仓库
+ 当构建 `testing` 仓库的软件包时，需要`testing`、`stable-proposed` 和 `stable` 仓库

``` bash
ciel config -i stable
```
首先输入您的信息，选择是否启用 DNSSEC，然后 Ciel 会询问您是否编辑 `source.list`，选择是并编辑。

``` INI
# 为 stable 仓库构建软件包时:
deb https://repo.aosc.io/debs stable main

# 为 testing 仓库构建软件包时:
deb https://repo.aosc.io/debs testing main
deb https://repo.aosc.io/debs stable-proposed main
deb https://repo.aosc.io/debs stable main

# And you get the idea.
```

现在我们可以正式开始构建我们的软件包啦！只需要执行：

``` bash
ciel build -i stable flac
# 使用 -i 参数是来指定要使用的 ciel 实例
```

如果没有报错出现，并能见到 `Build Summary`，那么祝贺您，您成功构建了您的第一个软件包！现在您应该能在 `OUTPUT/debs` 看到构建好的 DEB 包。

# 添加一个新的软件包

已经掌握了如何构建一个已有的软件包？接下来我们再进一步，尝试从零开始构建一个软件包。

进入 `TREE` 文件夹，您会看到很多文件夹，包括一些以 `base-` 和 `core-` 开头的文件夹，还有一些以 `extra-` 开头的文件夹，我们使用这些文件夹给软件包分类。在文件夹里面，您会发现各种软件包的构建脚本。

例如说 `i3`，这个包很显然能在 `TREE/extra-wm/i3` 被找到。进入这个目录之后，应该能见到以下的目录树：

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

我们会进一步探索这些目录。

## `spec`

这个文件会告诉 `acbs` 在什么地方下载源码文件，并声明软件包的版本号和发布号。一个 `spec` 文件看起来应该是这样子的：

``` bash
VER=4.17.1  # 软件包版本
# REL=0 修订号. 如果这一项不存在的话, 那这个包的修订号就是 0.
SRCTBL="https://i3wm.org/downloads/i3-$VER.tar.bz2" # 源代码的下载地址
CHKSUM="sha256::1e8fe133a195c29a8e2aa3b1c56e5bc77e7f5534f2dd92e09faabe2ca2d85f45" # 源代码压缩包的校验和, 可以用 sha256, sha512等等
```

有一点值得注意的是修订号。如果您在创建一个新的包，您可以忽略这一行，但在某些情形下（例如应用一个安全补丁），版本号不会更改，但我们仍然需要通知用户电脑上的包管理器有可用的更新。在这种情况下，只需将 `$REL` 变量增加 1。

## `autobuild/`

这是所有 `Autobuild3` 脚本和声明文件所在的目录。`Autobuild3` 是一个复杂的构建系统，它可以自动规划构建的流程，比如使用哪个构建系统，使用哪个构建参数等等。

## `autobuild/defines`

这个文件包含了一些核心的配置项，例如：

  - `PKGNAME` : 软件的名称。
  - `PKGDES` : 软件的描述。
  - `PKGSEC` : 软件的类别。
  - `PKGDEP` : 软件的生成和运行时必须先行安装的软件列表。
  - `PKGCONFL` : 与软件有冲突关系的软件列表。
  - `BUILDDEP` : 仅在软件生成时需要的软件包列表。
  - `PKGRECOM` : 软件的生成和运行时推荐先行安装的软件列表。

这些只是最常见的配置项。有更多的配置项，但对于大部分软件这些配置就足够了。`Autobuild3` 可以自动检查源代码并检测出相应的打包参数，比如使用哪个 C 编译器标志，使用哪个构建系统。

这是 `TREE/extra-multimedia/i3` 的配置：

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

实际上，您可以在 `defines` 中写 Bash 逻辑。这在为特定平台添加标志或依赖项时很有用，但我们**不建议**您这样做，将来也可能直接禁止这样做。要为特定平台添加信息，请使用 `$VAR__$ARCH`。

要查看完整的可用配置项，请查看 [Autobuild3 维基](https://github.com/AOSC-Dev/aosc-os-abbs/wiki/Autobuild3)。

## `autobuild/prepare`

此文件是将在构建过程开始之前执行的脚本。通常用于文件准备或设置构建过程中需要到的环境变量。

## `autobuild/patches/`

这个目录用于放置所有需要在构建开始前添加到源码的补丁。只需要将补丁丢进这个目录就行了。:)

# 一个完整的例子：`light`

现在您已经掌握了构建一个软件包所需要的基本技能，现在让我们将所学的东西应用到实践中吧，现在我们来构建 [light](https://github.com/haikarainen/light)。

这个程序提供了一个简单的命令以控制笔记本电脑的背光。因为它只使用文件 API 与背光子系统交互，所以这个程序非常简单，不需要依赖除了 `glibc` 之外的其它东西。

我们假定您已经配置好了 Ciel，让我们返回到 `TREE` 目录。首先，确保您位于正确的分支。如上所述，在每个周期的前两个月，您应该使用 `testing-proposed`，而最后一个月，您应该使用 `explosive`。

由于这个软件很显然是一个实用工具，我们在 `TREE/extra-utils` 下创建目录 `light`。

``` bash
cd TREE/extra-utils
mkdir light
cd light
```

接下来，我们创建 `spec` 文件。前往项目网站并找到最新版本源码的下载链接，下载一个源码包并校验它的 `sha256`，然后我们就可以完善这个文件了。

``` bash
VER=1.2.1
SRCTBL="https://github.com/haikarainen/light/archive/v$VER.tar.gz"
CHKSUM="sha256::53d1e74f38813de2068e26a28dc7054aab66d1adfedb8d9200f73a57c73e7293"
```

这个我们将源码包下载链接中的版本号替换为了变量 `$VER`，这是一个很好的做法，在更新这个软件包的时候减少了编辑量。

接下来我们创建 `autobuild` 目录，然后创建 `defines` 文件。

由于这是一个在 GUI 视图下使用到的应用，我们将其类别设定为 `x11`，完整的 `defines` 文件看起来是这样子的：

``` bash
PKGNAME=light
PKGSEC=x11
PKGDES="Program to easily change brightness on backlight-controllers."
```

一切准备就绪！让我们回到 Ciel 工作目录（`~/ciel`），然后执行以下命令：

``` bash
ciel build -i stable light
```

尽管我们没有声明如何构建这个包，但是 `Autobuild3` 会自动使用 `autotools` 构建这个包（也就是经典的 `./configure && make && make install` 逻辑）。如果您希望再做检查，可以使用 `dpkg-deb -c DEB_FILE` 查看 DEB 包里的文件。

## Git 提交记录格式规范

AOSC OS 对提交记录有着非常严格的格式要求。这里我们会提及我们最常用的一些格式。要想查看完整的打包与开发指导意见，请前往 [这个页面](@/developer/packaging/package-styling-manual.md)。

例如，我们现在要往软件包树里面添加一个新的软件包，那么提交记录应该长这样子：

    light: new, 1.2.1
    $PKG_NAME: new, $VER

如果您在更新一个已有的软件包，那么提交记录应该长这样子：

    bash: update to 5.2
    $PKG_NAME: update to $NEW_VER

这里我们建议您额外提及您对软件包做了哪些修改（例如依赖项的修改、标志的选择等等），例如：

    bash: update to 5.2

    - Make a symbolic link from /bin/bash to /bin/sh for program compatibility.
    - Install HTML documentations.
    - Build with -O3 optimisation.

## 将软件包推送到软件仓库

在成功构建软件包之后，软件包维护者会将把本地 Git 更改推送到树中，并将相应的包推送到官方软件仓库。

将软件包推送到官方软件仓库可以用 [pushpkg](https://github.com/AOSC-Dev/scriptlets/tree/master/pushpkg) 完成。操作起来也很简单，只需下载脚本，将脚本添加到 PATH 并确保它是可执行的（`0755`）。然后，在 `OUTPUT` 目录中调用 `pushpkg`。在这个过程中，您需要提供 LDAP 凭据，并指定目标软件仓库（`stable`、`testing` 等）。

# 后记

就这么简单！您已经初步了解如何为 AOSC OS 构建软件包，并知道如何更新、构建和上传它们！

当然，本文也只是一些皮毛，当您真正参与到 AOSC OS 的维护中，面对更复杂的构建系统或大量需要更新的软件包时，您就会意识到，还有许多技能有待您去探索和挖掘。请参考 [软件包维护入门：进阶](@/developer/packaging/advanced-techniques.zh.md) 这篇文。
