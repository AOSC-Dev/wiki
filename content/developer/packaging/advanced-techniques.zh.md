+++
title = "软件包维护入门：进阶教程"
description = "This article is sponsered by Commit-O-Matic™"
+++

> So you want to make a package, you've got the urge to make a package, you've got the nerve to make a package, so go ahead, so go ahead, so go ahead and make a package we can use\!

在学习过软件包维护入门 [基础教程](@/developer/packaging/basics.md) 之后，我们现在可以开始探索一些进阶技巧了。

请注意，你不必对这篇文档字字计较，因为它应当为你未来的工作提供参考。快速浏览一下，记住这些概念，遇到问题后再回来。

# Autobuild3 中的进阶操作

我们已经见识到，对于许多软件包，Autobuild3 可以自动判定其源代码树中使用的构建系统，然后生成并执行相应的构建脚本。但是有许多程序需要多一些步骤来构建和安装，或者它们需要指定的构建参数和编译器标记（complier flags）。

我们现在将介绍如何在 AOSC OS 的构建系统中应对这些问题。

## 手动选择不同的构建系统

有时，Autobuild3 可能会对构建系统做出错误假设，而这很有可能最终导致构建失败。还有其他情况是，当要构建的项目有多个构建系统可用时，Autobuild3 出于构建时间成本或可靠性考虑，可能不会选择最佳的那一个。

此时，我们可以在 `autobuild/defines` 文件中定义 `ABTYPE=` 变量来手动指定要用哪一个构建系统。

目前，Autobuild3 支持下列构建类型：

  - `self`：当提供 autobuild/build 文件时，使用用户创建的 autobuild/build 作为构建脚本。
  - `autotools`：通常用于基于 GNU autotools 的源代码树，源码根目录下会有一个可用的 configure 脚本，或已定义的 $configure 脚本。
  - `cmake`：用于基于 CMake 的源代码树，生成并执行 Makefile，Autobuild3 会检测源代码树中的 CMakeList.txt。
  - `cmakeninja`：同上，但是会生成和执行 Ninja 构建脚本。
  - `dummy`：生成空软件包，这在生成元软件包时会有用。
  - `dune`：用于基于 Dune 的源代码树（通常用于 OCaml 源代码）。
  - `gomod`：用于 Gomod 改编过的 Go 语言源代码树。
  - `meson`：用于基于 Meson 的源代码树，生成并执行 Ninja 构建脚本。
  - `npm`：用于 NPM 模块（通常用于 Node.js 模块源代码）。
  - `perl`：用于标准 CPAN 源代码树。
  - `plainmake`：用于带有成文 Makefile 的源代码树，因此能够使用 make 命令构建。
  - `python`：用于标准 PyPI 源代码树。
  - `qtproj`：用于源代码树中有 .pro 文件的 Qt 项目。
  - `ruby`：用于 RubyGems 源代码树。
  - `rust`：用于 Cargo 源代码树（通常用于 Rust 源代码）。
  - `waf`：用于基于 Waf 的而源代码树，Autobuild3 会检测源代码树中的 waf 文件或脚本。
  
## 自定义构建系统/编译器参数

Autobuild3 内置了一份最佳构建参数列表。不过，有时这些参数并不完全与软件相容，而且可能会引发问题。这时，请看一看 [Autobuild3 的默认参数](https://github.com/AOSC-Dev/autobuild3/blob/master/etc/autobuild/ab3_defcfg.sh#L105)，并重写相应的参数。你可以在 [Autobuil3 Wiki](https://github.com/AOSC-Dev/aosc-os-abbs/wiki/Autobuild3) 中找到完整的参数列表。

链接时优化（Link Time Optimization，LTO）是一个突出的问题。这项技术可以改善运行时效率并减小二进制文件的体积，但是目前来讲启用 LTO 可能会导致构建失败（这样的数量正在持续降低），并且会在构建过程中消耗更多内存。Autobuild3 默认启用 LTO 以提高性能（有时也为了减小二进制体积），但是如果遇到了 LTO 相关问题，可以通过在 `autobuild/defines` 中添加 `NOLTO=1` 变量来禁用 LTO。

## Custom Build Scripts

In some cases, the software uses a special build system (or they don't need a build system at all, like pre-built binaries). In this case, you may take control over the build process by writing build scripts in Bash.

The build script is located in `autobuild/build`. If this script exists, the build type will be locked to `self` (unless overriden if another `ABTYPE=` was defined), which means Autobuild3 will not try to determine the build system and execute its integrated build script, but simply execute this script.

This script should look very similar to what you would do to manually compile programs. But one key difference is that you should **NOT** install the compiled program to the system root directory. Instead, it should be installed in `$PKGDIR`, where later Autobuild3 will make the deb based on the file inside this directory. For example, if the compiled binary is called `hugo` in the root of the build directory, you should install it to the `bin` directory of the package by:

``` bash
abinfo "Installing Hugo binary ..."
install -Dvm755 hugo \
    "$PKGDIR"/usr/bin/hugo
```

Notice that we used a simple function to print log information to the build log called `abinfo()`. `abinfo()` works similarly to the `echo` program. Just call `abinfo "Desired build infomation"` in the script, and it will be recorded into the build log. It is considered a good practice to use `abinfo()` as a way to comment your build scripts, as this could be beneficial for maintainers who may come after. There is also `abwarn()` which works in an identical fashion, if you would like to print a warning.

## Post-Build Tweaks

Sometimes Autobuild3 handles the build process just fine, but the finished product may need some extra tweaks (i.e: wrong directory for man pages, shell completion scripts need to be copied into the `$PKGDIR`, and so on). In this case, we use the `autobuild/beyond` script, which, like `autobuild/build`, is executed as a plain Bash script. It will be executed after the build process.

This is an example taken from `TREE/extra-web/aria2`. Here, we need to install `aria2c`'s bash<sub>completion</sub> file, so we use the `autobuild/beyond` script.

``` bash
abinfo "Installing Bash completions ..."
install -Dvm644 "$PKGDIR"/usr/share/doc/aria2/bash_completion/aria2c \
    "$PKGDIR"/usr/share/bash-completion/completions/aria2c
```

## The `autobuild/override` Directory

Sometimes the source code does not contain (or contain an inappropriate version of) some files needed for the package. In this case, we can place files in the `autobuild/override` directory. Notice that files need to be put in their respective directory (as though they are installed in `$PKGDIR`.

For example, if we are building a package called `foo` and it does not contain the `.desktop` file needed for desktop environments in the source tree, we can just write our own `.desktop` file and place it in:

    autobuild/overrides/usr/share/applications/foo.desktop

## Advanced Patch Management

We have already discussed in the *Basics* that we can patch the source code by simply placing patches inside the `autobuild/patches` directory. But sometimes the patches has to be applied in a specific order in order to work.

To mitigate this issue, we introduced the `autobuild/patches/series` file. This file contains an ordred list of the names of the patches (one filename per line). If this file is present, Autobuild3 will apply patches as specified in the list.

In some other cases, the patches will not apply if they are not on a strip level of 1 (one). Here below is an example header from a strip level 1 patch:

    --- a/kernel/init.c
    +++ a/kernel/init.c

But sometimes, sources may come in different strip levels, for instance, this patch with a strip level of 3:

    --- dev/working/jelly/kernel/init.c
    +++ dev/working/lion/kernel/init.c

In this case, you would need to write your own `autobuild/patch`, which is also a plain Bash script, call your own `patch` commands from the script.

# Dealing with Package Groups

When maintaining packages, it is common that a batch of packages (for example, KDE Applications) need to be updated and/or built together. It would be frustrating if we have to manually change the version number and checksum.

So, there are several automation tools written by our maintainers to simplify this process. We will try to update all packages to the latest versions in `TREE/extra-gnome` here.

## Update Version Numbers, Automatically

For monitoring package updates, we use the [aosc-findupdate](https://github.com/AOSC-Dev/aosc-findupdate) tool (available from AOSC OS as the `aosc-findupdate` package), which pulls package update information from various sources, such as Fedora's [Anitya](https://release-monitoring.org/), GitHub, GitLab, or from an HTML file parsed with a custom regex expression.

Then, have a look at `git diff`, you should be able to see a bunch of changes on various of `VER` and `REL` lines.

## Update Checksums, Automatically

This is not enough, however. Although the `VER` has been modified, the checksum defined under `CHKSUM=` is still for the old tarball, and since it does not match with the actual checksum for the new tarball, ACBS will refuse to process the tarball.

There's also ways to automate this process, but there's not a standard script yet. However, at least one maintainer uses the following method:

``` bash
cd TREE/
# First, generate a temporary group.
git --no-pager diff --name-only | grep spec | sed 's/\/spec//' > groups/gnome-changes
# Enter the Ciel environment.
ciel shell
# Update source checksums using ACBS.
acbs-build -gw groups/gnome-changes
```

After this, checksums should be up-to-date.

## Build Updates, Automatically

Then we can try to build the new packages. This should be as simple as:

``` bash
# Replace $INSTANCE with your instance name.
ciel build -i $INSTANCE groups/gnome-changes
```

## Commit Changes, Automatically

If all packages are built successfully, we can go ahead and commit our changes. Our [commit-o-matic](https://github.com/AOSC-Dev/scriptlets/tree/master/commit-o-matic) will accomplish just that. Simply download the script, put it into your `PATH`, invoke the script, and bob's your uncle.

Note that if any extra modification was needed, you must note the said modifications in the git log. That said, before invoking `commit-o-matic`, you should first remove the modified package from the temporary group, and commit it manually.

``` bash
commit-o-matic groups/gnome-changes update
```

If you would like to use a different commit message than the generic `update to ...`, say, you would like to drop a set of package due to upstream orphaning them, you may do so as follows.

``` bash
commit-o-matic groups/gnome-changes bump-rel 'drop, orphaned'
```

## Push Changes, Automatically

Finally, we can push the built packages to the main repository.

``` bash
pushpkg LDAP_IDENTITY BRANCH
```

Note that `LDAP_IDENTITY` and `BRANCH` are by definition users and repositories on our [Community Repository](https://repo.aosc.io/). Contributors are audited before an LDAP identities are granted by our Infrustructure Work Group - we will get in touch with you via your first PR to our ABBS tree.

# Advanced Techniques in Ciel

There are some tips to make your life easier while using Ciel, here are a few.

## Automatically Specify Instance Name

Notice how you had to append the `-i $INSTANCE` parameter to each `ciel build` command? Here's a tip to save your nails. First, we create a file in the Ciel workspace root called `.env`, and input the following to the file.

``` bash
# Replace $INSTANCE name with your own.
CIEL_INST=$INSTANCE
```

Save the file, and you can now build packages without the `-i` parameter.

``` bash
ciel build gnome-shell
```

## Ciel, Ciel Everywhere!

With Ciel version >= 3.0.6, you can use Ciel like you would with Git - it will try and seek up the directory tree and find the Ciel workspace root. No need to switch to the Ciel workspace root to run any Ciel command, if it's convenient in the `TREE/`, stay comfortable there.
