+++
title = "Intro to Package Maintenance: Advanced Techniques"
description = "This article is sponsored by Commit-O-Matic™"
+++

> So you want to make a package, you've got the urge to make a package, you've got the nerve to make a package, so go ahead, so go ahead, so go ahead and make a package we can use\!

After learning the [basics](@/developer/packaging/basics.md) about building packages, we can now start exploring some advanced techniques.

Please note that you don't have to read this documentation word-by-word, as it should serve as a point of reference for your future work. Just take a quick look, remember these concepts, and come back when you encounter a problem.

# Advanced Operations in Autobuild3

We've already seen that with many packages, Autobuild3 can automatically determine the build system used in the source tree, then generate and execute build scripts accordingly. But there are many (complex or primitive) programs that require more steps to build and install, or they may require specific build parameters and compiler flags.

We will now introduce how to deal with these issues in AOSC OS's build system.

## Manually Select Different Build Systems

Sometimes, Autobuild3 may make wrong assumptions about the build system, and this would probably result a build failure. In other cases, when building projects where multiple build systems are avaliable, it may not select the optimal one (for build time or reliability).

In this case, we can manually specify which build system to use by defining `ABTYPE=` in the `autobuild/defines` file.

Currently, these build types are supported:

  - `self`: When a autobuild/build file is provided, uses user created autobuild/build as build script.
  - `autotools`: Generally used for GNU autotools-based source trees, with an available configure script in source root, or defined $configure script.
  - `cmake`: Used for CMake-based source trees, generates and executes Makefiles, Autobuild3 detects for CMakeList.txt in the source trees.
  - `cmakeninja`: Same as above, but generates and executes Ninja build scripts.
  - `dummy`: Generates an empty package, typically used only for creating meta-packages.
  - `dune`: Used for Dune-based source trees (generally used for OCaml sources).
  - `gomod`: Used for Gomod adapted Go langauge source trees.
  - `meson`: Used for Meson-based source trees, generates and executes Ninja build scripts.
  - `npm`: Used for NPM modules (generally used for Node.js module sources).
  - `perl`: Used for standard CPAN source trees.
  - `plainmake`: Used for source trees with a written Makefile, and therefore is able to be built with make command.
  - `python`: Used for standard PyPI source trees.
  - `qtproj`: Used for Qt projects with .pro files in the source trees.
  - `ruby`: Used for RubyGems source trees.
  - `rust`: Used for Cargo source trees (generally used for Rust sources).
  - `waf`: Used for Waf-based source trees, Autobuild3 detects for waf file/script in the source trees.
  
## Custom Build System/Compiler Parameters

Autobuild3 integrates a list of optimal build parameters. However, sometimes these parameters are not entirely compatible with the software and may cause troubles. In this case, have a look at [Autobuild3's default parameters](https://github.com/AOSC-Dev/autobuild3/blob/master/etc/autobuild/ab3_defcfg.sh#L105), and override them accordingly. A complete list of parameters can be found at the [Autobuil3 Wiki](https://github.com/AOSC-Dev/aosc-os-abbs/wiki/Autobuild3).

One problem that stands out is LTO (or Link Time Optimization). This technique can improve run-time efficiency and reduce the size of the binary, but for now enabling LTO may result build failure (the number is constantly decreasing), and consumes a lot of RAM during build-time. Autobuild3 enable LTO by default in interest of performance (and sometimes binary sizes), but if you encounter LTO related issues, you can disable it via adding `NOLTO=1` in `autobuild/defines`.

## Custom Build Scripts

In some cases, the software uses a special build system (or they don't need a build system at all, like pre-built binaries). In this case, you may take control over the build process by writing build scripts in Bash.

The build script is located in `autobuild/build`. If this script exists, the build type will be locked to `self` (unless overriden if another `ABTYPE=` was defined), which means Autobuild3 will not try to determine the build system and execute its integrated build script, but simply execute this script.

This script should look very similar to what you would do to manually compile programs. But one key difference is that you should **NOT** install the compiled program to the system root directory. Instead, it should be installed in `$PKGDIR`, where later Autobuild3 will make the deb based on the file inside this directory. For example, if the compiled binary is called `hugo` in the root of the build directory, you should install it to the `bin` directory of the package by:

``` bash
abinfo "Installing Hugo binary ..."
install -Dvm755 hugo \
    "$PKGDIR"/usr/bin/hugo
```

Notice that the `abinfo()` function in the above example is used to print log information to the build log, and it works similarly to `echo`. Just call `abinfo "Desired build infomation"` in the script, and it will be recorded into the build log. It is considered a good practice to use `abinfo()` as a way to comment your build scripts, as this could be beneficial for maintainers who may come after. There is also `abwarn()` which works in an identical fashion, if you would like to print a warning.

## Post-Build Tweaks

Sometimes Autobuild3 handles the build process just fine, but the finished product may need some extra tweaks (i.e: wrong directory for man pages, shell completion scripts need to be copied into the `$PKGDIR`, and so on). In this case, we use the `autobuild/beyond` script, which, like `autobuild/build`, is executed as a plain Bash script. It will be executed after the build process.

This is an example taken from `TREE/extra-web/aria2`. Here, we need to install `aria2c`'s bash completion file, so we use the `autobuild/beyond` script.

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

In some other cases, the patches will not apply if they are not on a strip level (directory hierarchy that need to be stripped) of 1 (one). Here below is an example header from a strip level 1 patch:

    --- a/kernel/init.c
    +++ a/kernel/init.c

But sometimes, sources may come in different strip levels, for instance, this patch with a strip level of 3:

    --- dev/working/jelly/kernel/init.c
    +++ dev/working/lion/kernel/init.c

In this case, you would need to write your own `autobuild/patch`, which is also a plain Bash script, call your own `patch` commands from the script.

## Enable Tests

Autobuild3 provides testing functionalities.

Testing features are disabled by default, to enable them, add `NOTEST=no` to your `autobuild/defines` file.

For some `ABTYPE`s, Autobuild3 provides pre-defined testing templates and can match and enable them automatically. To disable automatic detection, use `ABTEST_AUTO_DETECT=no`.

If your `ABTYPE` is not covered by the default testing templates, you can write your own `autobuild/check` script. For example:

```bash
make -C $BLDDIR -k check
```

Or to `/etc/autobuild3/ab3cfg.sh` to enable testing globally.

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
