+++
title = "Intro to Package Maintenance: Basics"
description = "Introductory Guide to AOSC OS Packaging"
date = 2020-08-03T12:01:46.691Z
+++

**NOTICE**: This guide assumes you have moderate knowledge about Linux and its CLI (command line interface). Also, you need to have access to a Linux computer with `root` access.

# Meet the tools

We will need these tools in order to build packages. Don't worry about them for now, we will investigate them later.

  - [Ciel](https://github.com/AOSC-Dev/ciel/)
      - Manages systemd-nspawn(1) containers.
  - [ACBS](https://github.com/AOSC-Dev/acbs/)
      - Manages a tree (like our main tree, *<https://github.com/AOSC-Dev/aosc-os-abbs>*) of package build specs.
      - Calls Autobuild3 to (actually) read and build the package(s) as specified.
  - [Autobuild3](https://github.com/AOSC-Dev/autobuild3/)
      - Reads package specifications and run the build scripts.
  - [pushpkg](https://github.com/AOSC-Dev/scriptlets/tree/master/pushpkg)
      - Pushes built packages to the official repository.

# Release model

AOSC OS is maintained with a rolling release model. This means that there's no version number attached to a full AOSC OS release (similar to other rolling release Linux distros, like openSUSE Tumbleweed and Arch Linux). However, within the [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs) tree, there is a set of packages that constructs the [AOSC OS Core](https://github.com/AOSC-Dev/aosc-os-abbs/blob/stable/README.CORE.md), which consists of core runtime (the GNU C Library, etc.) and toolchains (GCC, etc.). This set of packages are updated in a versioned fashion (Core 7.0.1, 7.0.2, 7.1.1, etc.).

Thanks to the rolling model, there's only one update channel for the users - `stable`. When updating or introducing new packages, developers work on a separate branch in the tree (the aforementioned `aosc-os-abbs`), create a Pull Request about the modification, then upload the package built to a separate repository (parallel to the `stable` repository). Thus, the users may test the updated packages by using the [AOSC OS APT Topic Manager](https://github.com/AOSC-Dev/atm), or by manually appending the repository to their APT sources list. Then, if the package is proven to be working, the pull request is merged and then the package is rebuilt against a clean `stable` environment, and pushed to the main repository.

This process is called topic-based iteration model. This model is employed in order to reduce stress for the developers and ensure the quality of the packages. If you want to learn more about this model, you may want to check [Topic-Based Maintenance Guidelines](@/developer/packaging/topic-based-maintenance-guideline.md).

# Setting up the environment

The first thing is to install `ciel` on the computer. On AOSC OS, just install ciel from the official repository.

Since Ciel manages standardised AOSC OS build environment (or the [BuildKit](https://aosc.io/downloads/#buildkit)), the build process does not have to happen on an AOSC OS machine. If you are using Arch Linux, you can install Ciel from AUR.

Next, we will initialise a Ciel workspace. `~/ciel` is used as a sample path for demonstration. Notice that Ciel will need to be run as `root` and Ciel cannot be used in a Docker instance.

``` bash
mkdir ~/ciel
cd ~/ciel
ciel new
```

Now, Ciel needs some information like developer's email, whether to enable local cache, DNSSEC and etc. Then Ciel can automatically deploy the BuildKit. BuildKit is a minimal AOSC OS variant used specifically for packaging or containerised development. It contains ACBS and Autobuild3, so no additional configuration is required. If you have already downloaded BuildKit, or if you are not on AMD64, you can manually load it.

``` bash
ciel load-os PATH_TO_BUILDKIT
```

It is always a good idea to keep the BuildKit environment up-to-date (and this serves as a requirement for AOSC OS packagers).

``` bash
ciel update-os
# If this step takes too long, you can edit sources.list via "ciel config -g" to use a faster mirror
```

The next step is to load an ACBS tree. For this instance, we will work on the official `aosc-os-acbs` tree.

``` bash
ciel load-tree # By default, ciel will load the official tree.
# Or, you can just clone the desired repository to ciel/TREE
```

# Building our very first package\!

Now that we have a build environment set-up, we can try to build a package that is already in the tree. Let's start with a relatively trivial one, `extra-multimedia/flac`.

Before that, we need to create a Ciel instance. It is recommended to use separate instances for different branches. Run:

``` bash
ciel add main 
```

And make sure we are actually on the stable branch.

``` bash
cd TREE
git checkout main
cd ..
```

Then, we need to configure maintainer information and other settings for your Ciel instance. 

``` bash
ciel config -i main
```

First enter your info, whether to enable DNSSEC. And when ciel ask if you want to edit `source.list`, say yes, and modify.

``` INI
# You can use a mirror to speed things up
deb https://repo.aosc.io/debs stable main
```

Now we can actually build the package\! Simply type:

``` bash
ciel build -i main flac
# -i is used to select the instance used to build
```

If the build completes without error, and a `Build Summary` is present, congratulations on your first successful build\! You should be able to find the generated deb inside `OUTPUT/debs`.

# Adding a new package

But surely you won't be satisfied by simply building existing packages, right? Here we will discover how to construct a new package from scratch.

Dive into the `TREE` folder, you will find a lot of categories of folders, including some beginning with `base-` and `core-` prefixes, as well as some with `extra-`. These folders are for organizing purposes, and inside them you will find the various packages (and their build specifications) organised in each of their own directory.

We will use `i3` as an example. This package can be found at `TREE/extra-wm/i3` for obvious reasons. Upon entering the directory, you should see a file structure as follows:
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

This file is responsible for telling `acbs` where to download the source file, and the package's version and revision. A basic `spec` file should look like this:

``` bash
VER=4.17.1  # Version of the software.
# REL=0 The package revision. If not specified, it's 0.

# If using a source tarball
SRCS="tbl::https://i3wm.org/downloads/i3-$VER.tar.bz2" # Download address for the source code.
CHKSUMS="sha256::1e8fe133a195c29a8e2aa3b1c56e5bc77e7f5534f2dd92e09faabe2ca2d85f45" # Checksum of the source tarball.

# If using Git
SRCS="git::commit=$COMMIT_ID::https://some.git.hosting/somewhere"
CHKSUMS="SKIP"

# If using multiple sources
SRCS="git::commit=$COMMIT_ID::https://some.git.hosting/somewhere \
      tbl::https://some.domain/source_tarball.tar.gz \
      file::https://some.domain/souce_code_file"
CHKSUMS="SKIP sha256::some_checksum sha256::sume_checksum"
```

One thing worth noting is the revision number. You can ignore this line if you are creating a new package, but sometimes (like applying an emergency security patch), the version number is not changed, but we still need to inform the package manager on users computer that there is an update available. In these circumstances, just increase the `$REL` variable by 1.

## `autobuild/`

This is the directory where all the `Autobuild3` scripts and definitions live. `Autobuild3` is a sophisticated build system that can automatically determine a series of build-time processes, like which build system to use, which build parameter to use, and so on.

## `autobuild/defines`

This file contains the core configuration like:

  - `PKGNAME` : Package name.
  - `PKGDES` : Package description.
  - `PKGSEC` : Section (or category) where the package belongs to.
  - `PKGDEP` : Package dependencies.
  - `PKGCONFL` : Package conflicts.
  - `BUILDDEP` : Build dependencies (packages which are required during build-time, but not for run-time).
  - `PKGRECOM` : Recommended dependencies, installed automatically, but could be removed by user discretion.

These are only the most common configuration entries. There are much more configurations, but if the software is fairly standard, these configuration should be enough. Other information like which C compiler flags to use, which build system to use, can be filled automatically by `Autobuild3`.

Here is a basic example taken from `TREE/extra-multimedia/i3`:

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

Notice here that you can actually write bash logic inside `defines`. This is useful when adding platform-specific flags or dependencies, but this is **NO LONGER** recommended, and will be prohibited in the future. For adding platform specific info, use `$VAR__$ARCH`.

For a complete list of available parameters, visit [Wiki for Autobuild3](https://github.com/AOSC-Dev/aosc-os-abbs/wiki/Autobuild3).

## `autobuild/prepare`

This file is the script that will be executed before the build process begins. Usually it is used to prepare files or set environment variables used in the build process.

## `autobuild/patches/`

This is a directory containing all the patches that will be applied to the source codes before the build.

Simple as dropping it in. :)

# A complete example: `light`

That's all the basic knowledge you need to build a simple package\! Now, we will try to build a really simple program: [light](https://github.com/haikarainen/light).

This program is used to provide a easy command to control the backlight of laptop. Since it only uses file API to interact with the backlight subsystem, this program is very simple and does not require and dependency other than `glibc`.

Return to the `TREE` directory (assuming you have Ciel set up). First, make sure that you are on the right branch. As mentioned above, you should use a separate Git branch for a topic. Here, since we are introducing a new package. According to [AOSC OS Topic-Based Maintenance Guidelines](@/developer/packaging/topic-based-maintenance-guideline.md), the new branch name should be `$PKGNAME-$PKGVER`. Thus, we create a branch called `light-1.2.1` and switch to it.

Since this program is obviously a utility, we create a directory called `light` under the directory `TREE/extra-utils`.

``` bash
cd TREE/extra-utils
mkdir light
cd light
```

Then, we create the `spec` file. Look up the project website and find out the download URL for the latest version. After manually checking the `sha256` checksum of the latest tarball, we can fill in the file.

``` bash
VER=1.2.1
SRCTBL="https://github.com/haikarainen/light/archive/v$VER.tar.gz"
CHKSUM="sha256::53d1e74f38813de2068e26a28dc7054aab66d1adfedb8d9200f73a57c73e7293"
```

Notice here that we replaced the version number inside the tarball URL with an environment variable `$VER`. This is considered as a good practice (since it reduces the modification required when updating the package), and should be used when possible.

Then, we create the `autobuild` folder, and create the `defines` file.

Since this is an application used in the GUI environment, we give it the section of `x11`. The complete `defines` file looks like the following:

``` bash
PKGNAME=light
PKGSEC=x11
PKGDES="Program to easily change brightness on backlight-controllers."
```

And we are done\! We can now head back to the base directory of the Ciel environment (`~/ciel`), and run the following command:

``` bash
ciel build -i stable light
```

Although we didn't write anything about how to build this program, `Autobuild3` automatically figured out that this should be built with `autotools` (i.e., the classic `./configure && make && make install` logic), and should build the program successfully. If you want to double check, use `dpkg-deb -c DEB_FILE` to check the files inside the deb file.

## Git conventions

If the build completed successfully, now it's time to commit your build scripts! AOSC OS has strict conventions about git logs. We will only mention the most used ones here. For the full list of package styling and development guidelines, please refer to the [package styling manual](@/developer/packaging/package-styling-manual.md).

For example, we are adding a new package to the tree. Then the log should be something like this:

    light: new, 1.2.1
    $PKG_NAME: new, $VER

If you are updating the version of an exisiting package, it should be like this:

    bash: update to 5.2
    $PKG_NAME: update to $NEW_VER

And please mention all the specific changes made to the package (i.e., dependency changes, feature enablement, etc.) in the long log, for instance:

    bash: update to 5.2

    - Make a symbolic link from /bin/bash to /bin/sh for program compatibility.
    - Install HTML documentations.
    - Build with -O3 optimisation.

## Pushing packages to the repository

After a successful build, you can push your local branch (`light-1.2.1` in this example) to your fork or directly to the main repository. Then, you can create a Pull Request and fill in the information. Finally, you should push your finished product to our main repository to be tested by other users.

The second task can be done using [pushpkg](https://github.com/AOSC-Dev/scriptlets/tree/master/pushpkg). Grab the script, add the script to PATH, make sure it is executable (0755). Then, invoke `pushpkg` inside the `OUTPUT` directory. You will need to provide your LDAP credentials and the destination repository (for this example, `light-1.2.1`).

Then you can patiently wait until someone reviews your Pull Request and tests your package. If everything looks good, your pull request will be merged and you should rebuild it and push the new package to the `stable` repository.

# Epilogue

That's it\! You have learned the basics about creating new packages for AOSC OS from scratch, as well as how to update, build, and uploading them\!

However, as you may see, this article only covers the basics of what you need to know as you continue to prime for further involement in AOSC OS maintenance. When dealing with more complicated build systems, or updating a batch of packages, there's still many skills to learn. Please refer to the [Way to AOSC OS Maintainence: Advanced Techniques](@/developer/packaging/advanced-techniques.md)
