+++
title = "Intro to Package Maintenance: Basics"
description = "Introductory Guide to AOSC OS Packaging"
date = 2020-08-03T12:01:46.691Z
+++

**NOTICE**: This guide assumes you have moderate knowledge about Linux and its CLI (command line interface). Also, you need to have access to a Linux computer with `root` access.

# Meet the tools

We will need these tools in order to build packages. 

  - [Ciel](https://github.com/AOSC-Dev/ciel-rs/)
      - Manages systemd-nspawn(1) containers.
  - [ACBS](https://github.com/AOSC-Dev/acbs/)
      - Manages a tree (like our main tree, *<https://github.com/AOSC-Dev/aosc-os-abbs>*) of package build specs.
      - Calls Autobuild4 to (actually) read and build the package(s) as specified.
  - [Autobuild4](https://github.com/AOSC-Dev/autobuild4/)
      - Reads package specifications and run the build scripts.
  - [pushpkg](https://github.com/AOSC-Dev/scriptlets/tree/master/pushpkg)
      - Pushes built packages to the community repository.

Don't worry about them for now, we will introduce them later.

# Release model

AOSC OS is maintained with a rolling release model. This means that there's no version number attached to a full AOSC OS release (similar to other rolling release Linux distros, like openSUSE Tumbleweed and Arch Linux). However, within the [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs) tree, there is a set of packages that constructs the [AOSC OS Core](https://github.com/AOSC-Dev/aosc-os-abbs/blob/stable/README.CORE.md), which consists of core runtime (the GNU C Library, etc.) and toolchains (GCC, etc.). This set of packages are updated in a versioned fashion (Core 7.0.1, 7.0.2, 7.1.1, etc.).

Thanks to the rolling model, there's only one update channel for the users - `stable`. When updating or introducing new packages, developers work on a separate branch in the tree (the aforementioned aosc-os-abbs), create a Pull Request about the modification, then upload the package built to a separate repository (parallel to the `stable` repository). Thus, the users may test the updated packages by using the [AOSC OS APT Topic Manager](https://github.com/AOSC-Dev/atm) (or ATM). Then, if the package is proven to be working, the pull request is merged and then the package is rebuilt against a clean `stable` environment, and pushed to the main repository.

This process is called topic-based iteration model. This model is employed in order to reduce stress for the developers and ensure the quality of the packages. If you want to learn more about this model, you may want to check [Topic-Based Maintenance Guidelines](@/developer/packaging/topic-based-maintenance-guideline.md).

# Setting up the environment

The first thing is to install Ciel on the computer. On AOSC OS, just execute the command `oma install ciel`.

Since Ciel manages standardised AOSC OS build environment (or the BuildKit), the build process does not have to happen on an AOSC OS machine. If you are using Arch Linux, you can install Ciel from AUR.

Next, we will initialise and configure a Ciel workspace. `~/ciel` is used as a sample path for demonstration. **Note: Ciel needs to be run as `root` (you may use `sudo -i` to gain elevated permission).**

Execute the following commands and follow the on-screen instructions, **making sure to enter appropriate maintainer information (the default will not work as it will trip a QA error while you attempt to package)**, when asked if you would like to create an instance, please create one - we will call it `main` here.

``` bash
mkdir ~/ciel
cd ~/ciel
ciel new
```

It is always a good idea to keep the BuildKit environment up-to-date (and this serves as a requirement for AOSC OS packagers).

``` bash
# If this step takes too long, you can edit sources.list via "ciel config" to choose a faster mirror.
ciel update-os
```

# Building our very first package

Now that we have a build environment set-up, we can try to build a package that is already in the tree. Let's start with a relatively trivial one, `app-multimedia/flac`.

Simply execute the following command to build `flac`.

``` bash
# -i is used to select the instance used to build.
ciel build -i main flac
```

If the build completes without error, and a `Build Summary` is present, congratulations on your first successful build\! You should be able to find the generated deb inside `OUTPUT-stable/debs`.

# Adding a new package

But surely you won't be satisfied by simply building existing packages, right? Here we will discover how to construct a new package from scratch.

Dive into the `TREE` folder, you will find a lot of categories of folders, including some beginning with `core-`, `app-`, `desktop-`, and so on. For more information about these folders, please visit [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs). These folders are for organizing purposes, and inside them you will find the various packages (and their build specifications) organised in each of their own directory.

We will use `i3` as an example. This package can be found at `desktop-wm/i3`. Upon entering the directory, you should see a file structure as follows:

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

We will go through which each file is for.

## `spec`

This file is responsible for telling ACBS where to download the source file, and the package's version and revision. A basic `spec` file should look like this:

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
  - `PKGSEC` : Section (or category) where the package belongs to.
  - `PKGDEP` : Package dependencies.
  - `PKGCONFL` : Package conflicts.
  - `BUILDDEP` : Build dependencies (packages which are required during build-time, but not for run-time).
  - `PKGRECOM` : Recommended dependencies, installed automatically, but could be removed by user discretion.

These are only the most common configuration entries. There are much more configurations, but if the software is fairly standard, these configuration should be enough. Other information like which compiler flags to use, which build system to use, can be filled automatically by Autobuild4.

Here is a basic example taken from `desktop-wm/i3`:

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

Notice here that you can actually write Bash logic inside `defines`. This is useful when adding platform-specific flags or dependencies, but this is **NO LONGER** recommended, and will be prohibited in the future. For adding platform specific info, use `$VAR__$ARCH` (for example, `AUTOTOOLS_AFTER__AMD64`).

For a complete list of available parameters, visit [Autobuild3 User and Developer Manual](@/developer/packaging/autobuild3-manual.md).

## `autobuild/prepare`

This file is the script that will be executed before the build process begins. Usually it is used to prepare files or set environment variables used in the build process.

## `autobuild/patches/`

This is a directory containing all the patches that will be applied to the source codes before the build. Simple as dropping it in. :)

# A complete example: GNU Hello

That's all the basic knowledge you need to build a simple package\! Now, we will try to build a really simple program: [hello](https://www.gnu.org/software/hello/). This program is used to print a greeting on the screen. It is such a simple program that doesn`t have any dependencies.

Return to the `TREE` directory. First, make sure that you are on the right branch. As mentioned above, you should use a separate Git branch for a topic. Here, since we are introducing a new package, according to [AOSC OS Topic-Based Maintenance Guidelines](@/developer/packaging/topic-based-maintenance-guideline.md), the new branch name should be `$PKGNAME-$PKGVER-new`. Thus, we create a branch called `hello-2.12.1-new` and switch to it.

Since this program is obviously a utility, we create a directory called `hello` under the directory `app-utils`.

``` bash
cd TREE/extra-utils
mkdir hello
cd hello
```

Then, we create the `spec` file. Look up the project website and find out the download URL for the latest version. Then, check the HASH checksum (for example, MD5 and SHA-256) of the latest tarball. In these case, we can check its SHA-256 checksum by command `sha256sum hello-2.12.1.tar.gz`.

``` bash
VER=2.12.1
SRCS="tbl::https://ftp.gnu.org/gnu/hello/hello-$VER.tar.gz"
CHKSUMS="sha256::8d99142afd92576f30b0cd7cb42a8dc6809998bc5d607d88761f512e26c7db20"
```

Notice here that we replaced the version number inside the tarball URL with an environment variable `$VER`. This is considered as a good practice (since it reduces the modification required when updating the package), and should be used when possible.

Then, we create the `autobuild` folder, and create the `defines` file. Since this programe has no dependency, `PKGDEP` is not needed. In this case, to avoid version conflicts during compiling, `RECONF=0` is needed. The complete `defines` file looks as follows:

``` bash
PKGNAME=lhello
PKGSEC=utils
PKGDES="A hello world demo program"
RECONF=0
```

And we are done\! We can now run the following command to build `light`:

``` bash
ciel build -i main light
```

Although we didn't write anything about how to build this program, Autobuild4 automatically figured out that this should be built with `autotools` (i.e., the classic `./configure && make && make install` logic), and should build the program successfully.

## Git conventions

If the build completed successfully, now it's time to commit your build scripts! AOSC OS has strict conventions about Git commit messages. We will only mention the most used ones here. For the full list of package styling and development guidelines, please refer to the [package styling manual](@/developer/packaging/package-styling-manual.md).

For example, we are adding a new package to the tree. Then the commit message should be something like this:

```
$PKG_NAME: new, $VER
```

Take the hello for example, the commit message should be like:

```
hello: new, 2.12.1
```

If you are updating the version of an exisiting package, it should be like this:

```
$PKG_NAME: update to $NEW_VER
```

Take bash for example, the commit message should be like:
```
bash: update to 5.2
```

And please mention all the specific changes made to the package (i.e., dependency changes, feature enablement, etc.) in the long log, for instance:

```
bash: update to 5.2

- Make a symbolic link from /bin/bash to /bin/sh for program compatibility.
- Install HTML documentations.
- Build with -O3 optimisation.
```

## Pushing packages to the repository

After a successful build, you can push your local branch (`hello-2.12.1-new` in this example) to your fork or directly to the main repository. Then, you can create a Pull Request and fill in the information. Finally, you should push your finished product to our main repository to be tested by other users.

Nowadays, the work of uploading and pushing is done by automated tools. For more information, please visit [Making Use of the Automated Maintenance Infrastructure](@/developer/packaging/buildit-bot.md).

Then you can patiently wait until someone reviews your Pull Request and tests your package. If everything looks good, your pull request will be merged and you should rebuild it and push the new package to the `stable` repository.

# Epilogue

That's it\! You have learned the basics about creating new packages for AOSC OS from scratch, as well as how to update, build, and uploading them\!

However, as you may see, this article only covers the basics of what you need to know as you continue to prime for further involement in AOSC OS maintenance. When dealing with more complicated build systems, or updating a batch of packages, there's still many skills to learn. Please refer to the [Way to AOSC OS Maintainence: Advanced Techniques](@/developer/packaging/advanced-techniques.md).
