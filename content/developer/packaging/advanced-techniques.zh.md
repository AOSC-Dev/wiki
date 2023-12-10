+++
title = "软件包维护入门：进阶教程"
description = "本文由 Commit-O-Matic™ 强力驱动"
+++

> 所以您想、您渴望、您有勇气去打一个包，所以请开始打包，打出一个我们能用的包！

在学习了关于构建包的 [基础](@/developer/packaging/basics.md) 之后，我们现在可以开始探索一些高级技术了。

请注意，您不必逐字阅读本文档，因为这篇文档应该作为您未来工作的参考。您只需要快速浏览一下，记住这些概念，当您遇到问题时再回来查。

# Autobuild3 中的高级操作

我们已经看到，对于许多包，Autobuild3 可以自动确定源代码树中使用的构建系统，然后相应地生成和执行构建脚本。但是有许多（复杂的或原始的）程序需要更多步骤来构建和安装，或者可能需要特定的构建参数和编译参数。

现在我们将介绍如何在 AOSC OS 的构建系统中处理这些问题。

## 手动选择不同的构建系统

有时 Autobuild3 可能对选择错误的构建系统，并可能会导致构建失败。比如当一个项目有多个构建系统可用时，Autobuild3 可能不会选择（对于构建时间或可靠性来说）最好的一个。

在这种情况下，我们可以通过在 `autobuild/defines` 文件中定义 `ABTYPE=` 来手动指定要使用的构建系统。

目前，支持这些构建类型：

  - `self`：当存在 `autobuild/build` 文件时，直接使用该文件作为为构建脚本。
  - `autotools`：通常用于基于 GNU autotools 的源代码树，在源根目录中具有可用的 configure 脚本，或定义的 $configure 脚本。
  - `cmake`：用于基于 CMake 的源代码树，生成并执行 Makefile，Autobuild3 在源代码树中 CMakeList.txt。
  - `cmakeninja`：与上面相同，但生成并执行 Ninja 构建脚本。
  - `dummy`：生成空包，通常只用于生成元包。
  - `dune`：用于基于 Dune 的源代码树（通常用于 OCaml 源代码）。
  - `gomod`：用于使用了 Gomod 的 Go 语言源代码树。
  - `meson`：用于基于 Meson 的源代码树，生成并执行 Ninja 构建脚本。
  - `npm`：用于 NPM 模块（通常用于 Node.js 模块的源代码）。
  - `perl`：用于标准 CPAN 源代码树。
  - `plainmake`：用于包含已经写好的 Makefile 的源代码树，因此可以使用 make 命令构建。
  - `python`：用于标准的 PyPI 源代码树。
  - `qtproj`：用于源代码树中包含 .pro 文件的 Qt 项目。
  - `ruby`：用于 RubyGems 源代码树。
  - `rust`：用于 Cargo 源代码树（通常用于 Rust 源代码）。
  - `waf`：用于基于 Waf 的源代码树，Autobuild3 检测源代码树中的 waf 文件或脚本。

## 自定义构建系统/编译器参数

Autobuild3 集成了一系列最佳构建参数。但是，有时这些参数与软件不完全兼容，可能会引起问题。在这种情况下，请查看 [Autobuild3 的默认参数](https://github.com/AOSC-Dev/autobuild3/blob/master/etc/autobuild/ab3_defcfg.sh#L105)，并根据需要覆盖对应的参数。完整的参数列表可以在 [Autobuil3 Wiki](https://github.com/AOSC-Dev/aosc-os-abbs/wiki/Autobuild3) 中找到。

其中一个突出的问题是 LTO（链接时优化）。这种技术可以提高运行时的效率，并减小二进制文件的大小，但目前启用 LTO 可能导致构建失败（这种情况的数量在不断减少），并且在构建时消耗大量内存。Autobuild3 默认启用 LTO 以提高性能（有时也是为了减小二进制文件的大小）。但如果您遇到与 LTO 相关的问题，可以通过在 `autobuild/defines` 中添加 `NOLTO=1` 来禁用 LTO。

## 自定义构建脚本

在某些情况下，软件使用特殊的构建系统（或者根本不需要构建系统，如预构建的二进制文件）。在这种情况下，您可以通过使用 Bash 编写构建脚本来控制构建过程。

构建脚本位于 `autobuild/build`。如果存在该脚本，构建类型将被锁定为 `self`（除非通过定义了另一个 `ABTYPE=` 覆盖了构建类型），这意味着 Autobuild3 不会尝试确定构建系统并执行其集成的构建脚本，而是简单地执行这个脚本。

这个脚本应该看起来非常类似于手动编译程序的过程。但是有一个关键的区别：您 **不** 应该将编译后的程序安装到系统根目录。而是应该安装在 `$PKGDIR` 中，稍后 Autobuild3 将根据此目录中的文件创建 deb 包。例如，如果编译后的二进制文件在构建目录的根目录中称为 `hugo`，那么您应该将其安装到软件包的 `bin` 目录中，如下所示：

``` bash
abinfo "Installing Hugo binary ..."
install -Dvm755 hugo \
    "$PKGDIR"/usr/bin/hugo
```

请注意，上述例子中的 `abinfo()` 用于在构建日志中输出状态信息，其工作方式类似于 `echo`。只需要在脚本中调用 `abinfo "Desired build information"`，这段信息就会被记录到构建日志中。使用 `abinfo()` 对构建脚本进行注释是一个好习惯，因为这会帮助到对后来可能的维护者。另一个类似的函数是 `abwarn()`，这个函数用于输出警告。

## 构建后的调整

有时 Autobuild3 可以很好地处理构建过程，但最终产出的包可能需要一些额外的调整（例如：man 页面的目录不对，需要将 shell 自动补全脚本复制到 `$PKGDIR` 等）。在这种情况下，我们使用 `autobuild/beyond` 脚本。与 `autobuild/build` 类似，这个脚本作为纯 Bash 脚本在构建后执行。

这是一个来自 `TREE/extra-web/aria2` 的例子。这里我们需要安装 `aria2c` 的 bash 命令行补全支持文件，所以我们使用如下的 `autobuild/beyond` 脚本。

``` bash
abinfo "Installing Bash completions ..."
install -Dvm644 "$PKGDIR"/usr/share/doc/aria2/bash_completion/aria2c \
    "$PKGDIR"/usr/share/bash-completion/completions/aria2c
```

## `autobuild/override` 目录

有时源代码不包含（或包含不适当的版本）包所需的某些文件。在这种情况下，我们可以将文件放在 `autobuild/override` 目录中。请注意，文件需要放在与 `$PKGDIR` 中的文件结构对应的目录下。

例如，如果我们正在构建名为 `foo` 的包，这个包的源代码树中不包含桌面环境所需的 `.desktop` 文件，我们可以编写自己的 `.desktop` 文件，并将其放置在：

    autobuild/overrides/usr/share/applications/foo.desktop
    
## 高级补丁管理

我们已经在 *基础* 部分讨论过，我们可以通过简单地将补丁放置在 `autobuild/patches` 目录中来对源代码打补丁。但有时为了使补丁生效，必须按照特定顺序应用补丁。

为了缓解这个问题，我们引入了 `autobuild/patches/series` 文件。这个文件包含补丁名称的有序列表（每行一个文件名）。如果存在这个文件，Autobuild3 将按照列表中指定的顺序应用补丁。

在某些情况下，补丁只有在 strip level（需要剥离的目录层级）为 1 时才能应用。下面是一个 strip level 为 1 的补丁的示例标题：

    --- a/kernel/init.c
    +++ a/kernel/init.c

但有时，源代码可能具有不同的 strip level，例如，这个补丁的 strip level 为 3：

    --- dev/working/jelly/kernel/init.c
    +++ dev/working/lion/kernel/init.c

在这种情况下，您需要使用 Bash 编写自己的 `autobuild/patch` 脚本，再手动在脚本中调用 `patch` 命令。

## 启用测试

Autobuild3 提供测试功能。

测试功能默认情况下是禁用的，可以在 `autobuild/defines` 文件中添加 `NOTEST=no` 来启用。

对于一些 `ABTYPE`，Autobuild3 提供了预定义的测试模板，并且可以自动匹配并使用。要禁用自动检测，可以使用 `ABTEST_AUTO_DETECT=no`。

如果您的 `ABTYPE` 没有对应的预定义测试模板，您可以编写自己的 `autobuild/check` 脚本。例如：

```bash
make -C $BLDDIR -k check
```

# 处理软件包组

在维护软件包时，有时会遇到需要一堆软件包（例如 KDE 程序）一起更新和 / 或构建的情况。如果我们不得不手动修改版本号和校验和，那将会很令人沮丧。

因此，我们的维护者编写了一些自动化工具来简化这个过程。在这里，我们将尝试将 `TREE/extra-gnome` 中的所有软件包更新到最新版本。

## 自动更新版本号

为了监控软件包更新，我们使用 [aosc-findupdate](https://github.com/AOSC-Dev/aosc-findupdate) 工具（在 AOSC OS 中作为 `aosc-findupdate` 软件包提供），该工具从各种来源获取软件包更新信息，例如 Fedora 的 [Anitya](https://release-monitoring.org/)，GitHub、GitLab 或者从使用自定义正则表达式解析的 HTML 文件中提取。

接着，查看 `git diff`，您应该能够看到各种 `VER` 和 `REL` 行上的一系列更改。

## 自动更新校验和

然而，仅仅修改了 `VER` 是不够的。尽管 `VER` 已经被修改，但是 `CHKSUM=` 后面的校验和仍然是旧 tarball 的校验和，由于与新 tarball 的校验和不匹配，ACBS 将拒绝处理新 tarball。

还有一些自动化这个过程的方法，但目前还没有标准脚本。但是至少有一名维护者使用以下方法：

``` bash
cd TREE/
# 首先，生成一个临时组。
git --no-pager diff --name-only | grep spec | sed 's/\/spec//' > groups/gnome-changes
# 进入 Ciel 环境。
ciel shell
# 使用 ACBS 更新校验和。
acbs-build -gw groups/gnome-changes
```

完成这些步骤后，校验和就会是最新的了。

## 自动构建更新

然后，我们可以简单地尝试构建新的软件包：

``` bash
# 将 $INSTANCE 替换为您的实例名称。
ciel build -i $INSTANCE groups/gnome-changes
```

## 自动提交更改

如果所有包都成功构建，我们就可以提交更改了。我们的 [commit-o-matic](https://github.com/AOSC-Dev/scriptlets/tree/master/commit-o-matic) 将实现这一点。只需下载脚本，将其放入您的 `PATH`，然后调用脚本就行了。

请注意，您必须在 git 日志中记录任何额外的修改。也就是说，在调用 `commit-o-matic` 之前，您应该首先从临时组中删除修改后的包，然后手动提交。

``` bash
commit-o-matic groups/gnome-changes update
```

如果您想使用和通用的 `update to ...` 不同的 commit message，例如，当某些包被上游弃用而需要被删除时，您可以按照以下方式进行操作。

``` bash
commit-o-matic groups/gnome-changes bump-rel 'drop, orphaned'
```

## 自动推送更改

最后，我们可以将构建的包推送到主存储库。

``` bash
pushpkg LDAP_IDENTITY BRANCH
```

请注意，`LDAP_IDENTITY` 和 `BRANCH` 被定义为我们的 [社区仓库](https://repo.aosc.io/) 上的用户和存储库。贡献者在由我们的基础设施工作组审核之后，会获得 LDAP 身份——我们将通过您对我们 ABBS 树的第一个 PR 与您联系。

# Ciel 的高级技术

在使用 Ciel 时，有一些技巧可以让您的生活更轻松。

## 自动指定实例名称

您应该注意到了，您每次都必须在每个 `ciel build` 命令后附加 `-i $INSTANCE` 参数。为了节约时间，您可以这么做：首先，在 Ciel 工作区根目录中创建名为 `.env` 的文件，然后在该文件中输入以下内容。

``` bash
# Replace $INSTANCE name with your own.
CIEL_INST=$INSTANCE
```

保存文件，您现在可以在没有 `-i` 参数的情况下构建包。

``` bash
ciel build gnome-shell
```

## 在任何目录下使用 Ciel

当您的 Ciel 版本 >= 3.0.6 时，您可以像使用 Git 一样使用 Ciel——Ciel 会尝试在目录树上向上查找并找到工作区的根目录。所以，无需切换到根目录就可以运行任何 Ciel 命令，比如说，您不必离开 `TREE/` 目录，这是很方便的。
