+++
title = "Intro to Package Maintenance: Basics"
description = "Introductory Guide to AOSC OS Packaging"
date = 2020-08-03T12:01:46.691Z
+++

**NOTICE**: This guide assumes you have moderate knowledge about Linux, its CLI (command line interface) and Git. Also, you need to have access to a Linux computer with `root` access.

# Meet the tools

We will need these tools in order to build packages.

  - [Ciel](https://github.com/AOSC-Dev/ciel-rs/)
      - Manages standardised AOSC OS build environments (systemd-nspawn(1) containers).
  - [ACBS](https://github.com/AOSC-Dev/acbs/)
      - Manages a tree (like our main tree, *<https://github.com/AOSC-Dev/aosc-os-abbs>*) of package build specs.
      - Calls Autobuild4 to (actually) read and build the package(s) as specified.
  - [Autobuild4](https://github.com/AOSC-Dev/autobuild4/)
      - Reads package specifications and run the build scripts.

Don't worry about them for now, we will introduce them later.

# Release model

AOSC OS is maintained with a rolling release model. This means that there's no version number attached to a full AOSC OS release (similar to other rolling release Linux distros, like openSUSE Tumbleweed and Arch Linux). However, within the [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs) tree, there is a set of packages that constructs the [AOSC OS Core](https://github.com/AOSC-Dev/aosc-os-abbs/blob/stable/README.CORE.md), which consists of core runtime (the GNU C Library, etc.) and toolchains (GCC, etc.). This set of packages are updated in a versioned fashion (Core 7.0.1, 7.0.2, 7.1.1, etc.).

Thanks to the rolling model, there's only one update channel for the users - `stable`. When updating or introducing new packages, developers work on a separate branch in the tree (the aforementioned aosc-os-abbs), create a Pull Request about the modification, then upload the package built to a separate repository and carry out testing. Thus, the users may test the updated packages by using `oma topics`. Then, if the package is proven to be working, the pull request is merged and then the package is rebuilt against a clean `stable` environment with automated tools, and pushed to the main repository.

This process is called topic-based iteration model. This model is employed in order to reduce stress for the developers and ensure the quality of the packages. If you want to learn more about this model, you may want to check [Topic-Based Maintenance Guidelines](@/developer/packaging/topic-based-maintenance-guideline.md).

# Setting up the environment

The first thing is to install Ciel on the computer. On AOSC OS, just execute the command `oma install ciel`.

Since Ciel manages standardised AOSC OS build environment (or the BuildKit), the build process does not have to happen on an AOSC OS machine. If you are using Arch Linux, you can install Ciel from AUR.

Next, we will initialise and configure a Ciel workspace. **Note: Ciel needs to be run as `root`.** You may use `sudo -i` to gain a root shell and `~` will now point to `/root`. You can also add `sudo` before each command (the corresponding directory of `~` will not change).

First, create a new folder in the appropriate place (it is recommended to leave 10 GiB or more free space in the partition where the folder is located) and switch to this folder, and then execute the following command to start configuring the Ciel workspace. When the wizard asks about the Target Architecture, it is generally to select the processor architecture of the current device. When asking for Maintainer Information, please refer to the example to fill in your own information. You can use the default values ​​for the remaining options. When asked if you would like to create an instance, please create one - we will call it `main` here.

``` bash
ciel new
```

It is always a good idea to keep the BuildKit environment up-to-date (and this saves time for AOSC OS packagers). BuildKit refers to the standardised AOSC OS build environments, which is generally run in Ciel's containers.

``` bash
# If this step takes too long, you can edit sources.list via "ciel config -g" to choose a faster mirror.
ciel update-os
```

# Building our very first package

Now that we have a build environment set-up, we can try to build a package that is already in the tree. Let's start with a relatively trivial one, `app-multimedia/flac`.

Simply execute the following command to build `flac`.

``` bash
# -i is used to select the instance used to build.
ciel build -i main flac
```

If the build completes without error, and a `BUILD SUCCESSFUL` is present, congratulations on your first successful build\! You should be able to find the generated deb inside `OUTPUT-stable/debs`.

# Adding a new package

This section covers how to construct a new package from scratch.

Dive into the `TREE` folder, you will find a lot of categories of folders, including some beginning with `core-`, `app-`, `desktop-`, and so on. For more information about these folders, please visit [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs). These folders are for organizing purposes, and inside them you will find the various packages (and their build specifications) organised in each of their own directory.

We will use `i3` as an example. This package can be found at `desktop-wm/i3`. Upon entering the directory, you should see a file structure as follows (This package has no patches, so there is no `patches` folder under the `autobuild` folder):

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

We will go through which each file is for. Unexpected details can be found in other articles such as [AOSC OS Package Styling Manual](@/developer/packaging/package-styling-manual.md).

## `spec`

This file is responsible for telling ACBS where and how to download the source file, and the package's version and revision. A basic `spec` file should look like this:

``` bash
VER=4.24  # Version of the software.
# REL=0 The package revision. If not specified, the variable is given a value of 0.

# If using a source tarball.
SRCS="tbl::https://i3wm.org/downloads/i3-$VER.tar.xz" # Download address for the source code.
CHKSUMS="sha256::5baefd0e5e78f1bafb7ac85deea42bcd3cbfe65f1279aa96f7e49661637ac981" # Checksum of the source tarball.

# If using Git.
SRCS="git::commit=$COMMIT_ID::https://some.git.hosting/somewhere"
CHKSUMS="SKIP"

# If using multiple sources.
SRCS="git::commit=$COMMIT_ID::https://some.git.hosting/somewhere \
      tbl::https://some.domain/source_tarball.tar.gz \
      file::https://some.domain/souce_code_file"
CHKSUMS="SKIP sha256::some_checksum sha256::sume_checksum"
```

One thing worth noting is the revision number. You can ignore this line if you are creating a new package or updating an existing package, but sometimes (like applying an emergency security patch), the version number is not changed, but we still need to inform the package manager on users computer that there is an update available. In these circumstances, just increase the `REL=` variable by 1.

## `autobuild/`

This is the directory where all the Autobuild4 scripts and definitions live. Autobuild4 is a sophisticated build system that can automatically determine a series of build-time processes, like which build system to use, which build parameter to use, and so on.

## `autobuild/defines`

This file contains the core configuration like:

  - `PKGNAME` : Package name.
  - `PKGDES` : Package description.
  - `PKGSEC` : Section (or category) where the package belongs to. It should be noted that the section (category) name is not necessarily the same as the subdirectory name of the package in the package tree. For example, `i3` is in the `desktop-wm` subdirectory of the package tree, but its section is `x11`. The section (category) of the packages accepted by AOSC OS can be found in [Autobuild4 related files](https://github.com/AOSC-Dev/autobuild4/blob/master/sets/section).
  - `PKGDEP` : Package dependencies.
  - `PKGCONFL` : Package conflicts.
  - `BUILDDEP` : Build dependencies (packages which are required during build-time, but not for run-time).
  - `PKGRECOM` : Recommended dependencies, installed automatically, but could be removed by user discretion.
  - `ABHOST`: Used to define whether the package belongs to `noarch`.

These are only the most common configuration entries. There are much more configurations, but if the software is fairly standard, these configuration should be enough. Other information like which compiler flags to use, which build system to use, can be filled automatically by Autobuild4.

Here is a basic example taken from `desktop-wm/i3`:

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

Notice here that you can actually write Bash logic inside `defines`. This is useful when adding platform-specific flags or dependencies, but this is **NO LONGER** recommended, and will be prohibited in the future. For adding platform specific info, use `$VAR__$ARCH` (for example, `AUTOTOOLS_AFTER__AMD64`).

For a complete list of available parameters, visit [Autobuild3 User and Developer Manual](@/developer/packaging/autobuild3-manual.md).

## `autobuild/prepare`

This file is the script that will be executed before the build process begins. Usually it is used to prepare files or set environment variables used in the build process.

## `autobuild/patches/`

This is a directory containing all the patches that will be applied to the source codes before the build. Simple as dropping it in. :)

If necessary, track the source code repository in AOSC-Tracking and synchronize patch changes.

# A complete example: GNU Hello

That's all the basic knowledge you need to build a simple package. Now, we will try to build a really simple program: [hello](https://www.gnu.org/software/hello/). This program is used to print a greeting on the screen. It is such a simple program that doesn`t have any dependencies.

Return to the `TREE` directory. First, make sure that you are on the `stable` branch and up to date with upstream by running `git pull`. Then, create a separate Git branch for the new package, and the branch name should be written following [AOSC OS Topic-Based Maintenance Guidelines](@/developer/packaging/topic-based-maintenance-guideline.md). Since we are introducing a new package, the new branch name should be `$PKGNAME-$PKGVER-new`, i.e. `hello-2.12.1-new`.

Switch to the new branch. Since this program is obviously a utility, we create a directory called `hello` under the directory `app-utils`.

``` bash
cd extra-utils
mkdir hello
cd hello
```

Then, we create the `spec` file. Look up the project website and find out the download URL for the latest version. Then, check the HASH checksum (for example, MD5 and SHA-256) of the latest tarball. In these case, we can check its SHA-256 checksum by command `sha256sum hello-2.12.1.tar.gz`.

``` bash
VER=2.12.1
SRCS="tbl::https://ftp.gnu.org/gnu/hello/hello-$VER.tar.gz"
CHKSUMS="sha256::8d99142afd92576f30b0cd7cb42a8dc6809998bc5d607d88761f512e26c7db20"
```

Notice here that we replaced the version number inside the tarball URL with an environment variable `$VER`. This eliminates the need to modify the URL when updating the package, and should be used when possible.

Then, we create the `autobuild` folder, and create the `defines` file. Since this programe is a dynamic executable with no other dependencies, `"glibc"` is enough for `PKGDEP`. After writing the package name, dependency, description, etc., you should leave a blank line and then write the compilation function and options. Since Autobuild4 will regenerate the configure script, it will cause version conflicts when compiling `hello`, so you need to use `RECONF=0` to disable this regeneration (but this does not mean that you need to turn off this function when compiling other packages). The complete `defines` file looks as follows:

``` bash
PKGNAME=hello
PKGSEC=utils
PKGDEP="glibc"
PKGDES="A hello world demo program"
ABTYPE=autotools

RECONF=0
```

And we are done! We can now run the following command to build `hello`:

``` bash
ciel build -i main hello
```

Although Autobuild4 can automatically figure out that this package should be built with `autotools` (i.e., the classic `./configure && make && make install` logic), the latest package styling manual requires an explicit `ABTYPE` declaration.

Then, in the Ciel workspace directory, you can see the built `.deb` package in the relevant OUTPUT folder. At this point, you can test whether this package works properly after installing by deb-installer / oma / dpkg. For example, to test whether `hello` works, we should run `hello` in the terminal, and when `LANG` is set to `en_US.UTF-8`, it will output "Hello, World!".

## Git commits

After following the steps above, you can start trying to package packages that you really want to add or update for AOSC OS. If you want to introduce a new package for AOSC OS, there are more elements to consider than when packaging GNU Hello, such as sorting out runtime dependencies and build dependencies; if you encounter problems during this period, you can ask in our community chat group or AOSC BBS.

When a user packages, it does not mean that they must upload it to the AOSC OS main tree. However, we recommend users to submit the software package information to the main tree and build the AOSC OS software repository together with us, as long as the software allows AOSC OS maintainers to package and redistribute, and the software package does not exist or is not up-to-date in the main tree. In contrast, some software does not allow AOSC OS maintainers to package and redistribute (such as proprietary software prohibiting redistribution and fonts that are "free for commercial use" but do not allow redistribution), or are not suitable for continued provision to users (such as when the project in question is no longer maintained but has a successor), or the vendor is not friendly to redistribution (such as deliberately restricting scripts from downloading the desired software package, requiring dynamic keys and timestamps to download), and at this time if you want to manage them in the form of a software package (which is a good habit), you can also package them for yourself only.

If the build completed and tested successfully, after confirming that the software can be packaged and redistributed, now it's time to commit your build scripts! Before commiting, you can use [pakfixer](https://github.com/AOSC-Dev/pfu) to check the build script you wrote and make appropriate modifications.

In order to effectively keep track of changes to the tree, the AOSC OS main tree puts forward strict requirements on Git commit messages. See the [Package Style Manual](@/developer/packaging/package-styling-manual.md) for details. The following excerpts some common formats.

```
$PKG_NAME: new, $VER  # introducing a new package
```

When introducing a new package, in principle, multiple commits should not appear (if any, you need to use `git rebase -i` to interactively rebase and merge multiple commits into one)

```
hello: new, 2.12.1  # take hello as example
```

```
$PKG_NAME: update to $NEW_VER # update existing packages
bash: update to 5.2 # take bash as an example, to upgrade its version to 5.2
```

And please mention all the specific changes made to the package (i.e., dependency changes, feature enablement, patch add or delele, etc.) in the long log, for instance:

```
bash: update to 5.2

- Make a symbolic link from /bin/bash to /bin/sh for program compatibility.
- Install HTML documentations.
- Build with -O3 optimisation.
```

## Pushing packages to the repository

After the package is built and tested and the commit is successfully performed with Git, you can fork the main tree to your own GitHub Account, push the local Git branch (such as `hello-2.12.1-new`) to your fork, and then create a Pull Request in the main tree and fill in the information.

Next, please wait for Pull Request review. Community contributors will review and request changes (if any), and after resolving these change requests and passing build and run tests, your Pull Request will be merged. Then, you will be able to use the automated tools to build and push packages to all users. Nowadays, the work of uploading and pushing is done by automated tools. For more information, please visit [Making Use of the Automated Maintenance Infrastructure](@/developer/packaging/buildit-bot.md).

After merging the first commit into AOSC OS repositories such as the AOSC OS main tree, you can become a contributor. After becoming a contributor, you can push the local Git branch directly to the main tree, then use the automated tools to create Pull Requests, build packages, install, test, generate audit reports (`/dickens`), wait for other contributors to review and approve the Pull Request, merge into the stable branch and **build the package again for stable**.

# Epilogue

That's it\! You have learned the basics about creating new packages for AOSC OS from scratch, as well as how to update, build, and upload them\!

However, as you may see, this article only covers the basics of what you need to know as you continue to prime for further involement in AOSC OS maintenance. When dealing with more complicated build systems, or updating a batch of packages, there's still many skills to learn. Please refer to the [Way to AOSC OS Maintainence: Advanced Techniques](@/developer/packaging/advanced-techniques.md).
