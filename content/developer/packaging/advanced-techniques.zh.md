+++
title = "软件包维护入门：进阶"
description = "本文由 Commit-O-Matic™ 赞助"
+++

> **注意：本入门所描述的维护指南自 2020 年 10 月 25 日起已被弃用。**我们已经开始实践新提出的[话题制维护指南 (English)](@/developer/packaging/topic-based-maintenance-guideline.md)。在我们更新这篇文档之前，您可以左转阅读那份指南，或者坐等更新。

在学习了软件包构建的 [基本技能](@/developer/packaging/basics.zh.md) 之后，让我们来进一步了解打包过程中经常用到的一些进阶技术吧！

请注意，您并不需要逐字阅读这篇文档，只需快速浏览一下，记住其中关键的概念，在实际开发过程中遇到问题时再回来参考这篇文档。

# `Autobuild3` 进阶操作

在大多数的情况下，`Autobuild3` 都可以根据源代码树的特点，自动选择合适的构建系统并生成与执行相应的构建脚本。但仍有一些程序在构建的时候需要执行更多的操作，也有一些程序需要特定的构建参数和编译器标志。

现在，我们将介绍如何在 AOSC OS 的构建系统中处理这些问题。

## 手动指定构建系统

有些时候 `Autobuild3` 无法为项目选择最优的构建系统，这很有可能导致构建时间延长、可靠性降低，甚至导致构建失败。在这种情况下，我们可以通过在 `autobuild/defines` 文件中定义 `ABTYPE=` 来手动指定要使用的构建系统。

可供选择的构建系统类型包括：

- `self`：直接使用用户提供的构建脚本（若有）。
- `autotools`：适用于基于 GNU autotools 的源代码树，Autobuild3 将在源代码树中检测 `configure` 文件。
- `cmake`：适用于基于 CMake 的源代码树，Autobuild3 将在源代码树中检测 `CMakeList.txt`，生成并执行对应的 Makefile。
- `cmakeninja`：与上面相同，但是生成并执行 Ninja 构建脚本。
- `waf`：适用于基于 Waf 的源代码树，Autobuild3 将在源代码树中检测 waf 文件和脚本。
- `plainmake`：适用于带有 Makefile 的源代码树，Autobuild3 将使用 make 命令来构建软件包。
- `haskell`：适用于标准的 Haskell Cabal 或 Hackage 源代码树。
- `perl`：适用于标准的 CPAN 源代码树。
- `python`：适用于标准的 PyPI 源代码树。
- `qtproj`：适用于源代码树中带有 `.pro` 文件的 Qt 项目。
- `ruby`：适用于 RubyGems 源代码树。

## 自定义构建系统与编译器参数

在默认情况下，`Autobuild3` 在软件包构建时会自动选用一系列的「最优参数」。但是，有时这些参数并不和软件兼容，最终导致了一系列的问题。在这种情况下，请阅读 [Autobuild3 默认参数列表](https://github.com/AOSC-Dev/autobuild3/blob/master/etc/autobuild/ab3_defcfg.sh#L105) 并使用合适的参数替换它们。您可以在 [Autobuil3 Wiki](https://github.com/AOSC-Dev/aosc-os-abbs/wiki/Autobuild3) 上找到完整的参数列表。

一个突出的问题是 LTO（链路时间优化）。这种技术可以提升软件的运行时效率并优化二进制文件的大小，但在某些情况下启用 LTO 可能会导致构建失败，并在构建期间消耗大量内存。Autobuild3 在 AMD64 架构上默认使用 LTO，如果您遇到与 LTO 相关的问题，可以通过在 `autobuild/defines` 中添加 `NOLTO=1` 来禁用它，更多详情请阅读 [常见问题](@/developer/packaging/quirks.zh.md)。

## 自定义构建脚本

某些应用程序的构建需要到特殊的构建系统（或者根本不需要构建系统）。在这种情况下，您可以使用编写 Bash 脚本来控制构建过程。

构建脚本应该放置于 `autobuild/build`。一旦这样做，则构建脚本类型将被自动指定为 `self`（除非您手动声明了 `ABTYPE=`），这意味着 `Autobuild3` 会直接执行此脚本而不再做其它尝试。

构建脚本本身看起来应该和您手动编译程序时使用到的一些脚本非常相似。但是一个关键的区别是编译好的程序不应被安装到系统根目录下。相反，它应该安装在 `$PKGDIR` 中，这样子 `Autobuild3` 才可以基于该目录中的文件生成正确的 DEB 包。例如，如果您有一个名为 `hugo` 的二进制文件，则应通过下面的方式将其安装到目标路径的 `bin` 目录中：

``` bash
abinfo "Installing Hugo binary..."
install -Dvm755 hugo "$PKGDIR"/usr/bin/hugo
```

在这里我们使用了一个叫做 `abinfo()` 的函数将构建信息 "Installing Hugo binary..." 输出到日志中。利用 `abinfo()` 为构建脚本添加注释是一种很好的做法，这很大程度上能帮助到后续的维护人员。

## 构建后操作

在多数情况下 `Autobuild3` 可以很好地处理构建过程，但构建完成之后，您可能希望对构建产物做一些额外的调整（例如将 Manual 文档放置到正确的目录、将一些脚本复制到 `$PKGDIR` 等等）。这种情况下，我们应该使用 `autobuild/beyond` 脚本。`Autobuild3` 会将这个脚本视作普通的 Bash 脚本，在构建完成后即执行。

我们不妨以 `TREE/extra-web/aria2` 作为示例。这里，我们希望为 `aria2c` 添加 Bash 自动补全支持，因此我们使用 `autobuild/beyond` 脚本：

``` bash
install -dv "$PKGDIR"/usr/share/bash-completion/completions
install -vm644 "$PKGDIR"/usr/share/doc/aria2/bash_completion/aria2c \
    "$PKGDIR"/usr/share/bash-completion/completions
```

## `autobuild/override` 目录

有些软件提供的源码包缺失了关键文件，或包含了错误的文件。这种情况下，我们可以将正确的文件放在 `autobuild/override` 目录中覆盖源码包中的文件。

要注意的是，文件需要参照最终安装到 `$PKGDIR` 的位置摆放在 `autobuild/override` 目录中。举个例子，如果我们在为 `foo` 打包且 `foo` 的源码包缺少了一个为桌面环境准备的 `.desktop` 文件。这种情况下我们只需要自己制作一个 `.desktop` 文件然后放置到：

```
autobuild/overrides/usr/share/applications/foo.desktop
```

## 补丁文件管理进阶

[基础篇](@/developer/packaging/basics.zh.md) 曾经提到，只需将补丁放在 `autobuild/patches` 目录中，就可以修补源代码。但有时补丁必须按特定的顺序应用才能正常工作。

为了解决这个问题，我们引入了 `autobuild/patches/series` 文件。您可以在这个文件填写补丁应用顺序（每行一个文件名）。一旦创建了这个文件，`Autobuild3` 就会将根据文件中的顺序应用补丁。

除此之外，如果您的补丁涉及到底层目录重命名，这个补丁不一定会被自动应用，例如：

```
--- dev/working/jelly/kernel/init.c
+++ dev/working/lion/kernel/init.c
```

这种情况下，您可能需要自己编写 `autobuild/patch`。在应用补丁时，我们会把这个文件视作 Bash 脚本直接运行。您可以在这个文件填写您的 `patch` 逻辑。

# 软件包组

有时候我们可能需要对一整组软件包作更新和重构建处理，如果我们逐个软件包更改版本号和校验和，那将是令人沮丧的。

因此，我们的维护者编写了一些自动化工具来简化这个过程。下面我们以 `TREE/extra-gnome` 为例，演示如何将该软件包中所有包更新到最新的增补版本。

## 批量更新软件包版本号

首先让我们使用 [PISS](https://github.com/AOSC-Dev/piss)（全称 Project Information Storage System）<sup>\[1\]</sup> 监视上游的更新。PISS 提供一个 API 来获取和分析这些信息。

接下来让我们看看 `git diff`，您应该能够看到 `VER` 和 `REL` 行上的一系列更改。

要注意的是，如果您希望为软件进行跨版本更新，请使用 `findupd` 而不是 `findupd-stable`。

## 批量更新校验和

虽然 `VER` 已被修改，但在 `CHKSUM=` 定义的校验和仍然仅适用于旧源码包。如果不对其进行更新，由于它与新源码包的实际校验和不匹配，ACBS 将拒绝处理这个软件包。

目前我们还没有推出自动更新校验和的工具，但是至少有一名维护者在使用下面的方法：

``` bash
cd TREE/
# First, generate a temporary group.
git --no-pager diff --name-only | grep spec | sed 's/\/spec//' > groups/gnome-changes
# Use addchksum.py to generate a patch of all the checksums
for i in `cat groups/gnome-changes`; do; python3 ../abbs-meta/tools/addchksum.py $i/spec 2> dev/null\ndone > checksums.patch
# Then, apply the patch
patch -Np0 -i checksums.patch
```

当然也有其它的实现方法。下面的方法在更新校验和的时候不会创建然任何的临时文件，在进一步完善后我们会将其收录到我们的 [`scriptlets`](https://github.com/AOSC-Dev/scriptlets) 仓库。

``` bash
#!/bin/sh
for i in `git status | grep modified | grep /spec | awk '{ print $2 }'`; do
    python3 ../abbs-meta/tools/addchksum.py $i
done | patch -Np0 -i -
```

现在，所有的校验和应该都更新好了。

## 批量构建软件包

现在我们构建这些新软件包了，批量构建其实并不难：

``` bash
cd ciel/ # Enter ciel root directory
ciel build -i INSTANCE groups/gnome-changes
```

## 批量提交更改

如果所有包都能被成功构建，我们就可以使用 [commit-o-matic](https://github.com/AOSC-Dev/scriptlets/tree/master/commit-o-matic) 提交我们的更改。与 `findupd` 类似，您只需下载脚本，将其放入您的 `PATH` 中并执行脚本就好啦。

要注意的是，如果您对某个软件包做了额外的修改，在调用 `commit-o-matic` 之前，应该从暂存区中删除这个包，然后手动提交它。这样子才可以在 Git 提交记录中记录上述修改。

``` bash
commit-o-matic.sh groups/gnome-changes
```

## 批量推送更改

最后，我们将构建好的软件包推送到我们的 [软件仓库](https://repo.aosc.io/)：

``` bash
pushpkg LDAP_IDENTITY BRANCH
```

这里的 `LDAP_IDENTITY` 和 `BRANCH` 指代的是软件仓库系统的 LDAP 身份信息和分支信息。如果您还没有取得 LDAP 身份，在您第一次向 ABBS 软件包树提交合并请求时，我们会跟您取得联系讨论相关事宜。

---

1.  PISS 这个名字起得不错吧（笑）。

    为了真正利用上游的版本信息，我们开发了一个叫做 [findupd](https://github.com/AOSC-Dev/scriptlets/tree/master/findupd) 的工具，它会自动从 `PISS` 获取信息并更改每个软件包 `spec` 文件中的版本信息。您需要做的就是克隆 `findupd` 的仓库，将所有可执行文件和 Python 脚本复制到 `PATH` 中，然后执行：

    ``` bash
    cd TREE/
    findupd-stable extra-gnome
    ```
