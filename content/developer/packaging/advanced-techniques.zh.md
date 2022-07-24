+++
title = "软件包维护入门：进阶教程"
description = "本文由 Commit-O-Matic™ 强力驱动"
+++

> 所以你想、你渴望、你有勇气去打一个包，所以请开始打包，打出一个我们能用的包！

在学习了关于构建包的 [基础](@/developer/packaging/basics.md) 之后，我们现在可以开始探索一些高级技术了。

请注意，您不必逐字阅读本文档，因为它应该作为您未来工作的参考点。 快速浏览一下，记住这些概念，遇到问题再回来。

# Autobuild3 中的高级操作

我们已经看到，对于许多包，Autobuild3 可以自动确定源代码树中使用的构建系统，然后相应地生成和执行构建脚本。 但是有许多（复杂或原始）程序需要更多步骤来构建和安装，或者它们可能需要特定的构建参数和编译器标志。

我们现在将介绍如何在 AOSC OS 的构建系统中处理这些问题。

## 手动选择不同的构建系统

有时，Autobuild3 可能会对构建系统做出错误的假设，这可能会导致构建失败。 在其他情况下，当构建多个构建系统可用的项目时，它可能不会选择最佳的一个（对于构建时间或可靠性）。

在这种情况下，我们可以通过在 `autobuild/defines` 文件中定义 `ABTYPE=` 来手动指定要使用的构建系统。

目前，支持这些构建类型：

  - `self`：提供自动构建 / 构建文件时，使用用户创建的自动构建/构建作为构建脚本。
  - `autotools`：通常用于基于 GNU autotools 的源代码树，在源根目录中具有可用的配置脚本，或定义的 $configure 脚本。
  - `cmake`：用于基于 CMake 的源代码树，生成并执行 Makefiles，Autobuild3 检测源代码树中的 CMakeList.txt。
  - `cmakeninja`：与上面相同，但生成并执行 Ninja 构建脚本。
  - `dummy`：生成一个空包，用于生成元包。
  - `dune`：用于基于 Dune 的源代码树（通常用于 OCaml 源代码）。
  - `gomod`：用于 Gomod 改编的 Go 语言源代码树。
  - `meson`：用于基于 Meson 的源代码树，生成并执行 Ninja 构建脚本。
  - `npm`：用于 NPM 模块（通常用于 Node.js 模块源）。
  - `perl`：用于标准 CPAN 源代码树。
  - `plainmake`：用于具有书面 Makefile 的源代码树，因此可以使用 make 命令构建。
  - `python`：用于标准 PyPI 源代码树。
  - `qtproj`：用于源代码树中带有 .pro 文件的 Qt 项目。
  - `ruby`：用于 RubyGems 源代码树。
  - `rust`：用于 Cargo 源代码树（通常用于 Rust 源代码）。
  - `waf`：用于基于 Waf 的源代码树，Autobuild3 检测源代码树中的 waf 文件/脚本。

## 自定义构建系统/编译器参数

Autobuild3 集成了一系列最佳构建参数。 但是，有时这些参数与软件不完全兼容，可能会引起麻烦。 在这种情况下，请查看 [Autobuild3 的默认参数](https://github.com/AOSC-Dev/autobuild3/blob/master/etc/autobuild/ab3_defcfg.sh#L105)，并相应地覆盖它们。 完整的参数列表可以在 [Autobuil3 Wiki](https://github.com/AOSC-Dev/aosc-os-abbs/wiki/Autobuild3) 中找到。

一个突出的问题是 LTO（链接时间优化）。 这种技术可以提高运行时效率并减少二进制文件的大小，但目前启用 LTO 可能会导致构建失败（数量不断减少），并在构建时消耗大量 RAM。 Autobuild3 默认启用 LTO 以提高性能和二进制大小，但如果您遇到 LTO 相关问题，您可以通过在 `autobuild/defines` 中添加 `NOLTO=1` 来禁用它。

## 自定义构建脚本

在某些情况下，该软件使用特殊的构建系统（或者它们根本不需要构建系统，例如预构建的二进制文件）。在这种情况下，您可以通过在 Bash 中编写构建脚本来控制构建过程。

构建脚本位于`autobuild/build`。如果此脚本存在，构建类型将被锁定为 `self`（除非在定义了另一个 `ABTYPE=` 时被覆盖），这意味着 Autobuild3 将不会尝试确定构建系统并执行其集成的构建脚本，而只是执行此脚本。

该脚本看起来应该与您手动编译程序的操作非常相似。但是一个关键的区别是您应该**不**将编译后的程序安装到系统根目录。相反，它应该安装在 `$PKGDIR` 中，稍后 Autobuild3 将根据该目录中的文件制作 deb。例如，如果编译后的二进制文件在 build 目录的根目录中名为 `hugo`，则应通过以下方式将其安装到包的 `bin` 目录中：

``` bash
abinfo "Installing Hugo binary ..."
install -Dvm755 hugo \
    "$PKGDIR"/usr/bin/hugo
```

请注意，我们使用了一个名为 `abinfo()` 的简单函数将日志信息打印到构建日志中。`abinfo()` 的工作方式类似于 `echo` 程序。只需在脚本中调用 `abinfo "Desired build infomation"`，它就会被记录到构建日志中。使用 `abinfo()` 作为评论构建脚本的一种方式被认为是一种很好的做法，因为这可能对后续的维护者有益。如果您想打印警告，还有 `abwarn()` 以相同的方式工作。

## 构建后调整

有时 Autobuild3 可以很好地处理构建过程，但最终产品可能需要一些额外的调整（即：手册页目录错误，需要将 shell 完成脚本复制到 `$PKGDIR` 中，等等）。 在这种情况下，我们使用 `autobuild/beyond` 脚本，它与 `autobuild/build` 一样，作为纯 Bash 脚本执行。它将在构建过程之后执行。

这是一个取自 `TREE/extra-web/aria2` 的例子。 在这里，我们需要安装 `aria2c` 的 bash<sub>completion</sub> 文件，所以我们使用如下的 `autobuild/beyond` 脚本。

``` bash
abinfo "Installing Bash completions ..."
install -Dvm644 "$PKGDIR"/usr/share/doc/aria2/bash_completion/aria2c \
    "$PKGDIR"/usr/share/bash-completion/completions/aria2c
```

## `autobuild/override` 目录

有时源代码不包含（或包含不适当的版本）包所需的某些文件。 在这种情况下，我们可以将文件放在 `autobuild/override` 目录中。 请注意，文件需要放在各自的目录中（就像它们安装在 `$PKGDIR` 中一样。

例如，如果我们正在构建一个名为 `foo` 的包，它在源代码树中不包含桌面环境所需的 `.desktop` 文件，我们可以编写自己的 `.desktop` 文件并将其放置在：

    autobuild/overrides/usr/share/applications/foo.desktop

## 高级补丁管理

我们已经在 *基础* 中讨论过，我们可以通过简单地将补丁放在 `autobuild/patches` 目录中来修补源代码。 但有时必须按特定顺序应用补丁才能正常工作。

为了缓解这个问题，我们引入了 `autobuild/patches/series` 文件。 该文件包含补丁名称的有序列表（每行一个文件名）。 如果此文件存在，Autobuild3 将应用列表中指定的补丁。

在其他一些情况下，如果补丁不在条带级别 1 上，补丁将不会应用。下面是一个条带级别 1 补丁的示例标题：

    --- a/kernel/init.c
    +++ a/kernel/init.c

但有时，源可能有不同的条带级别，例如，此补丁的条带级别为 3：

    --- dev/working/jelly/kernel/init.c
    +++ dev/working/lion/kernel/init.c

在这种情况下，您需要编写自己的 `autobuild/patch`（一个普通的 Bash 脚本），再从脚本中调用自己的 `patch` 命令。

# 处理软件包组

在维护包时，通常需要同时处理一堆包（例如 KDE 应用程序）。 如果我们必须手动更改它们的版本号和校验和，那将是令人沮丧的。

因此，我们的维护人员编写了几个自动化工具来简化这个过程。 我们将在此处尝试将所有软件包更新到 `TREE/extra-gnome` 中的最新版本。

## 自动更新版本号

为了监控包更新，我们使用 [aosc-findupdate](https://github.com/AOSC-Dev/aosc-findupdate) 工具（如果您使用 AOSC OS,您可以安装 `aosc-findupdate` 包来获得），它可以从各种来源拉取包的信息，例如 Fedora 的 [Anitya](https://release-monitoring.org/)、GitHub、GitLab，或来自使用自定义正则表达式解析的 HTML 文件。

然后，观察 `git diff` 的运行结果，你应该可以看到各种 `VER` 和 `REL` 行的一系列变化。

## 自动更新校验和

然而，只是自动更新版本号还不够。 虽然 `VER` 已被修改，但在 `CHKSUM=` 下定义的校验和仍然适用于旧 tarball，并且由于它与新 tarball 的实际校验和不匹配，ACBS 将拒绝处理 tarball。

还有一些方法可以自动化这个过程，但还没有标准的脚本。 但是，至少有一个维护者使用以下方法：

``` bash
cd TREE/
# 首先，生成一个临时组。
git --no-pager diff --name-only | grep spec | sed 's/\/spec//' > groups/gnome-changes
# 进入 Ciel 环境。
ciel shell
# 使用 ACBS 更新校验和。
acbs-build -gw groups/gnome-changes
```

在此之后，校验和应该是最新的。

## 自动构建更新

然后我们可以尝试构建新的包。这应该很简单：

``` bash
# 将 $INSTANCE 替换为您的实例名称。
ciel build -i $INSTANCE groups/gnome-changes
```

## 自动提交更改

如果所有包都成功构建，我们可以继续提交我们的更改。 我们的 [commit-o-matic](https://github.com/AOSC-Dev/scriptlets/tree/master/commit-o-matic) 将实现这一点。 只需下载脚本，将其放入您的`PATH`，调用脚本，就行了。

请注意，如果需要任何额外的修改，您必须在 git 日志中记录上述修改。 也就是说，在调用 `commit-o-matic` 之前，您应该首先从临时组中删除修改后的包，然后手动提交。

``` bash
commit-o-matic groups/gnome-changes update
```

如果您想使用和通用的 `update to ...` 不同的提交消息，例如，当某些包被上游孤立而需要被删除时，您可以按照以下方式进行操作。

``` bash
commit-o-matic groups/gnome-changes bump-rel 'drop, orphaned'
```

## 自动推送更改

最后，我们可以将构建的包推送到主存储库。

``` bash
pushpkg LDAP_IDENTITY BRANCH
```

请注意，`LDAP_IDENTITY` 和 `BRANCH` 被定义为我们的 [社区仓库](https://repo.aosc.io/) 上的用户和存储库。 在我们的基础设施工作组授予 LDAP 身份之前，对贡献者进行审核 - 我们将通过您对我们 ABBS 树的第一个 PR 与您联系。

# Ciel 的高级技术

在使用 Ciel 时，有一些技巧可以让您的生活更轻松。

## 自动指定实例名称

您应该注意到了您必须如何将 `-i $INSTANCE` 参数附加到每个 `ciel build` 命令。这里有一个节约打字
的小窍门。 首先，我们在 Ciel 工作区根目录中创建一个名为 `.env` 的文件，然后在该文件中输入以下内容。

``` bash
# Replace $INSTANCE name with your own.
CIEL_INST=$INSTANCE
```

保存文件，您现在可以在没有 `-i` 参数的情况下构建包。

``` bash
ciel build gnome-shell
```

## 在任何目录下使用 Ciel

使用 Ciel 版本 >= 3.0.6，您可以像使用 Git 一样使用 Ciel——它会尝试查找目录树并找到 Ciel 工作区根。 无需切换到 Ciel 工作区根目录即可运行任何 Ciel 命令，比如说，您不必离开 `TREE/` 目录，这是很方便的。