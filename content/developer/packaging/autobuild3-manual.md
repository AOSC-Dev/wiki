+++
title = "Autobuild3 User and Developer Manual"
description = "Everything you need to know about Autobuild3"
date = 2020-05-04T03:35:25.287Z
[taxonomies]
tags = ["dev-sys"]
+++

Autobuild is a distribution packaging toolkit meant to carry out the following functions:

- Definition, therefore identification of source code
- Preparing and patching of source code
- Building of source code
- Quality control of built binaries
- Packaging of built binaries

Autobuild3 is essentially a set of scripts (`autobuild` is the only command script useful for invoking a build process) that works to automatically carry out the function listed above, and to simplify build configuration (build scripts in another word) using various pre-designed build routines, named `ABTYPE` or Autobuild Build Types. More will be discussed below (extensively).

Autobuild3 is a successor to the original [Autobuild](https://github.com/AOSC-Dev/autobuild) used back in 2013 when AOSC OS was initially rebooted as an independent Linux distribution. Unlike Autobuild being a distribution specific and single backend toolkit, Autobuild3 is distribution neutral and supports various backends:

- DPKG, the most “native” backend of all, using `dpkg-deb` and Autobuild variables to control the generation of DPKG control files, and henceforth building the packages.
- RPM, using Autobuild variables to generate .spec files, and invoking `rpmbuild` to build RPM packages.
- PKGBUILD (coming soon), using Autobuild variables to generate `PKGBUILD` files, using a temporary install root, to provide `makepkg` with a fake binary packaging process.

# Installing and deploying

Autobuild3 is provided in the `autobuild3` package (AOSC OS), and is provided with BuildKit. However it can be obtained as a Git checkout/snapshot or as a release at the [GitHub repository](https://github.com/AOSC-Dev/autobuild3).

## Deploying

As a Git checkout or downloaded source, Autobuild3 can be deployed with executing the following command at the source root, as superuser or root.

`./ab3.sh`

Autobuild3 is installed at `/usr/lib/autobuild3`, and this directory is known to Autobuild3 (and possibly to you) as `"$AB"`.

## Initial Configurations

It is necessary to create an initial configuration profile for Autobuild3. Stored as a file at `/etc/autobuild/ab3cfg.sh`. A minimal configuration example is shown below.

``` sh
ABMPM=dpkg # Main package manager backend.
ABAPMS= # Additional package manager backend(s), e.g. rpm.
MTER="Jeff Bai <jeffbai@aosc.xyz>" # Maintainer info.
ABINSTALL="dpkg" # Package to be installed after build.
```

Remove extra or duplicate lines of configuration where appropriate.

# General structure

Autobuild3 needs a `autobuild/` directory placed in the source root, which in most cases, is its working directory. For example, when building wget-1.17, one will unpack its source code, get into the `wget-1.17/` directory, and `autobuild/` should be put in the source root.

## The “defines” file

`autobuild/defines` is the core configurations file used by Autobuild3 to read building definitions (obviously) such as package name, version, category/section, dependencies, descriptions, etc. `defines` is meant to be a powerful configuration file, and hence supports an extensive amount of control variables. And they will be described below (essential variables are marked with an asterisk, “\*” at the end of their descriptions).

### Package information

Here lists the variables that describes general information of the package.

**PKGNAME=** expects a string value that defines the name of the package to be built (an underscore must not be used as part of the name string). \*

**PKGVER=** expects a string value that defines the version of the package to be built (an underscore must not be used as part of the version string). \*

**PKGREL=** expects an integer value that defines the revisionn of the package to be built. \*

**PKGSEC=** expects a string value that defines the category/section that the package belongs in, all canonical section names are defined in `"$AB"/sets/section`. A QA (quality assurance) warning will be emitted by Autobuild3 when a non-canonical section is used as the value provided here. \*

**PKGDES=** expects a string value containing the description of the package, basic writing convention is advised (capitalize the first letter, for example). \*

### Package dependencies

Here lists the variables that defines several different dependency relationships that will be carried out by the package. It is recommended that you have a good read of the [Debian Policy Manual](https://www.debian.org/doc/debian-policy/index.html) before you start.

**PKGDEP=** expects a string value that defines a list of dependencies of the package, separated with spaces.

**PKGRECOM=** expects a string value that defines a list of recommended (soft dependencies) packages that enhances the functionality of the package, separated with spaces, just like `$PKGDEP`.

**PKGBREAK=** expects a string value that defines a list of packages that will be broken (ABI breakage, dependency breakage) by the package or one of its updates, separated with spaces.

**PKGCONFL=** expects a string value that defines a list of packages that conflicts with the package (file conflict is the main usage of this variable), separated with spaces.

**PKGREP=** expects a string value that defines a list of packages that are replaced/obsoleted by the package, separated with spaces.

**BUILDDEP=** expects a string value that defines a list of packages that are needed to build the package, separated with spaces.

**VER\_NONE** expects a binary value (0/1) that switches an option to enable or disable versioned dependencies.

### Build-time environment

Here lists variables that serves as options during build-time that may alter build results. Some times they are used to workaround FTBFS (fail to build from source, essential vocabulary, Cadet) situations. Workaround-oriented usage of some of the variables listed below will the discussed in the [Tips and Tricks](https://github.com/AOSC-Dev/aosc-os-abbs/wiki/Autobuild3-Tips-and-Tricks) section.

#### Common/GCC configurations

**AB\_FLAGS\_O3** expects a binary value (0/1) that switches the default compiler optimization level between `-O2` and `-O3`. This is mainly used for building AOSC OS Core, as most core libraries are performance sensitive (Defaults to 0 or “off”).

**AB\_FLAGS\_SPECS=** expects a binary value (0/1) that switches the use of compiler and linker specs on/off for use of hardening (Position Independent Code and Executables). This flag replaces the original `AB_FLAGS_PIE` and `AB_FLAGS_PIC` flags found in Core \~4 (Defaults to 1 or “on”).

**AB\_FLAGS\_SSP=** expects a binary value (0/1) that switches compiler flags needed to enable/disable stack smash protection for shared objects and executables, contributing to a hardened binary build (Defaults to 1 or “on”).

**AB\_FLAGS\_FTF=** expects a binary value (0/1) that switches code preprocessor (cpp) to fortify source code before compilation, contributing to a hardened binary build (Defaults to 1 or “on”).

**AB\_FLAGS\_RRO=** expects a binary value (0/1) that switches linker flags needed to link executables and shared objects with read-only relocations, contributing to a hardened binary build (Defaults to 1 or “on”).

**AB\_FLAGS\_RRO=** expects a binary value (0/1) that switches linker flags needed to link executables and shared objects with **full** read-only relocations, contributing to a hardened binary build (Defaults to 1 or “on”).

**NOLTO=** expects a binary value (0/1) that switches compiler and linker flags needed to disable/prevent LTO (Link Time Optimization) during build time (Defaults to 0 or “off” on amd64 - enabling LTO by default, and 1 or “off” on all other architectures).

#### Clang specific configurations

**USECLANG=** expects a binary value (0/1) that decides whether to use Clang (part of LLVM) for the build (Defaults to 0 or “off”).

*Note: `AB_FLAGS_PIC` and `AB_FLAGS_PIE` are moved as Clang-specific configurations in the Core 4 compatibility update, as Clang does not support compiler specs for toggling PIE and PIC automatically.*

**AB\_FLAGS\_PIE=** expects a binary value (0/1) that switches compiler and linker flags needed to build PIE (Position Independent Executables), contributing to a hardened binary build (Defaults to 1 or “on”).

**AB\_FLAGS\_PIC=** expects a binary value (0/1) that switches compiler and linker flags needed to build PIC (Position Independent Code) for both executables and shared objects, contributing to a hardened binary build (Defaults to 1 or “on”).

**ABSHADOW=** expects a binary value (0/1) that decides whether to perform a “shadow build”, or building the source from a separate directory (outside the source root), some sources likes it, some not so much (Defaults to 1 or “on”). Note: when “shadow build” is specified, Autobuild3 will create a `build` directory at source root, change directory into the directory, and invoke build commands in relation to the location of the source root (for example, `../configure` opposed to `./configure` when not doing a “shadow build”).

**ABCONFIGHACK=** expects a binary value (0/1) that decides whether to copy/update config.guess and config.sub, allowing some older programs to build on newer architectures like AArch64/ARMv8 (arm64).

**ABCLEAN=** expects a binary value (0/1) that decides whether to perform cleaning before a repeated build (removing packaging root, build directory, source root; defaults to 1 or “on”).

**ABTHREADS=** expects a positive integer that defines the threads to be used when building (used by make; defaults to `$(nproc) + 1`, or number of processor cores plus one).

**NOPARALLEL=** expects a binary value (0/1) that decides whether to disable parallel build (equivalent to `ABTHREADS=1`; defaults to 0 or “off”).

**ABSTRIP** expects a binary value (0/1) and controls whether Autobuild should strip off `.debug`, `.comment` and other unneeded sections from the ELF files prior to packing files into redistributable packages (Defaults to 1 or “on”).

**ABSPLITDBG** expects a binary value (0/1) which controls whether Autobuild should detach debug symbols and related sections from ELF files into separate debug symbol files packed together as a package `${PKGNAME}-dbg`. This option defaults to 0 for packages marked with `noarch` and 1 for all others. A rule of thumb on whether you should override the default behavior:

* For `optenv32` packages, you may want to turn ON `ABSPLITDBG` even the packages themselves are marked as `noarch`.
* For packages solely consisting of rust or go programs, you may want to turn OFF `ABSPLITDBG` as these two languages are _next fscking level_ (sic.) in terms of debugging or building. Regular symbol files are not sufficient to reasonably debug these programs as they require their own specific procedures.
* For other packages, it is usually safe for Autobuild to decide for itself.

For technical details: Autobuild will only produce a separate symbol package when all of the following are met:

* The original ELF file must contain a valid build-id in SHA1. The three linkers used by AOSC OS (`bfd`, `gold` and LLVM `lld`) all support embedding build-id within ELF files. The most notable exception is programs produced by `golang`: `golang` uses its dedicated linker for linking Go programs, and its linker does not support build-id.
* A symbol file must contain `.debug_*` sections. Otherwise, Autobuild will warn about this and exclude the symbol from the symbol package. This condition is almost always satisfied as Autobuild appends `-g` to `$CFLAGS`, but whether projects honor the `CFLAGS` varies.
* At least one symbol file is produced. This means the project must produce ELF files.

**MAKE\_AFTER=** expects a string value that defines extra arguments to be passed to `make`.

### Data packages

When building data/architecturally neutral packages, you may (should) specify:

**ABHOST=noarch** declaring that the package to be built is for “any” architecture (“noarch” in RPM language), therefore can be installed in any given architecture.

### Additional variables

Additional variables can be included inside `autobuild/defines` as well, as this file is basically “sourced” by the Unix Shell (Bash in this case).

# Build Types

Autobuild has a set of pre-defined build routine called Build Types, or `$ABTYPE` when expressed in the “autobuild/defines” file.

**ABTYPE=** expects a string value that defines which build type to use. Autobuild3 in most cases can detect the right build type to use. Here below is a list of available build types, in detection fallback order:

- **self:** when a `autobuild/build` file is provided, uses user created `autobuild/build` as build script.
- **autotools:** generally used for GNU autotools-based source trees, with an available `configure` script in source root, or defined `$configure` script.
- **cmake:** used for CMake-based source tree, Autobuild3 detects for `CMakeList.txt` in the source trees.
- **waf**: used for waf-based source tree, Autobuild3 detects for `waf` file/script in the source trees.
- **plainmake:** used for source trees with a written `Makefile`, and therefore is able to be built with `make` command.
- **haskell:** used for standard Haskell Cabal/Hackage source trees, comes with a set of scripts that provides Haskell package management functions like registering and unregistering.
- **perl:** used for standard CPAN source trees.
- **python:** used for standard PyPI source trees.
- **qtproj:** used for Qt projects with `.pro` files in the source trees.
- **ruby:** used for RubyGems source trees.
- **gomod:** used for Golang projects using `go mod` as the only module management system. Autobuild3 detects for `go.mod` in the source trees.
- **rust:** used for Rust projects using Cargo build system. Autobuild3 detects for `Cargo.toml` in the source trees.
- **npm:** used for Node.js source trees with dependencies from [NPM](https://www.npmjs.com/). Autobuild3 detects for `package.json` in the source trees.
- **dune:** used for OCaml projects using dune build system. Autobuild3 detects for `dune-project` file in the source trees.

Pre-defined scripts of these build types may be found [here](https://github.com/AOSC-Dev/autobuild3/tree/master/build). You may find that they are all prefixed with numbers - prefixes with smaller numbers are of higher priority when detecting for build types. More explained in the example below.

Usually it is not necessary to define `$ABTYPE`, as Autobuild can detect this variable automatically. However, this may not always work on source trees that support more than one build systems. For example, `kdelibs` comes with both a `configure` script and a `CMakeList.txt` file in its source tree. In this case, `autotools` takes precedence over `cmake` even when `cmake` is also valid for this source tree.

In such cases, you may want to explicitly define `$ABTYPE` in `autobuild/defines`.

## ABTYPE-specific variables

Here below is a list of variables available for different `$ABTYPE`.

### autotools

Here below is a list of variables available when using the `autotools` build type.

**RECONF=** expects a binary value (0/1) that decides whether to re-generate the `configure` script, this is useful when changes are made to GNU autotools configuration files, like `configure.ac`.

**AUTOTOOLS\_DEF=** expects a string value containing default arguments to be passed to `configure`, default is defined in `"$AB"/etc/autobuild/ab3_defcfg.sh`.

**AUTOTOOLS\_AFTER=** expects a string value containing all extra arguments to be passed to `configure`, you may override any arguments defined in `$AUTOTOOLS_DEF` using this variable.

### cmake

Here below is a list of variables available when using the `cmake` build type.

**CMAKE\_DEF=** expects a string value containing default arguments to be passed to `cmake`, default is defined in `"$AB"/etc/autobuild/ab3_defcfg.sh`.

**CMAKE\_AFTER=** expects a string value containing all extra arguments to be passed to `cmake`, you may override any arguments defined in `$CMAKE_DEF` using this variable.

### waf

Here below is a list of variables available when using the `waf` build type.

**WAF\_DEF=** expects a string value containing default arguments to be passed to `waf`, default is defined in `"$AB"/etc/autobuild/ab3_defcfg.sh`.

**WAF\_AFTER=** expects a string value containing all extra arguments to be passed to `waf`, you may override any arguments defined in `$wAF_DEF` using this variable.

### python

Here below is a list of variables available when using the `python` build type.

**NOPYTHON2=** expects a binary value (0/1) deciding on whether not to build modules for Python 2.

**NOPYTHON3=** expects a binary value (0/1) deciding on whether not to build modules for Python 3.

Both variables default to 0 or “no”, meaning modules will be built for both Python 2 and Python 3.

### qtproj

Here below is a list of variables available when using the `qtproj` build type.

**QT\_SELECT=** is used by `qtchooser` to decide which Qt version to use. (4/5/default) defines to use Qt 4, Qt 5, or default (defined in /etc/xdg/qtchooser/default.conf), respectively.

**QTPROJ\_DEF=** expects a string value containing default arguments to be passed to `qmake`, default is defined in `"$AB"/etc/autobuild/ab3_defcfg.sh`.

**QTPROJ\_AFTER=** expects a string value containing all extra arguments to be passed to `qmake`, you may override any arguments defined in `$QTPROJ_DEF` using this variable.

### gomod

Here below is a list of variables available when using the `gomod` build type.

**GO_BUILD_AFTER=** expects a string value containing all extra arguments to be passed to `go build`, you can specify extra flags for the go compiler using this variable.
>**Hint:** you might want to use this variable to define version numbers or other constants through linker flags.

### rust

Here below is a list of variables available when using the `rust` build type.

**CARGO_AFTER=** expects a string value containing all extra arguments to be passed to `cargo build`, you can enable extra features for the project using this variable.

### dune

Here below is a list of variables available when using the `dune` build type.

**DUNE_BUILD_AFTER** expects a string value containing all extra arguments to be passed after `dune build`.

**DUNE_INSTALL_AFTER** expects a string value containing all extra arguments to be passed after `dune install`.

**DUNE_PACKAGES** is a space-split string value containing opam packages to be build and installed. When specified, autobuild3 will replace its space with comma and pass it with `-p ` prefix to `dune build`, and installing packages one by one when calling `dune install`. Useful when you come into a source tree containing multiple `.opam` files, or when you don't want to build all components.

## Path-related variables

When writing build scripts, to refer to specific locations in the source tree, Autobuild3 designates the following variables.

**$SRCDIR** Refers to the source root, where packager would invoke `autobuild` to initiate build.

**$BLDDIR** Refers to the shadow build root when `ABSHADOW` is set to true.

**$PKGDIR** Refers to the packaging root, storing installed binaries and data as they would in a system root.

**$SYMDIR** Refers to the debug packaging root, storing debug symbols.

## The “prepare” file

The `autobuild/prepare` file is sourced as a Bash script, containing packager-defined general preparations before the source will be built. An example is shown below:

``` bash
cp "$SRCDIR"/autobuild/config "$SRCDIR"/.config
```

The `autobuild/prepare` file may be sourced repeatedly when re-using a source tree.

## The “patches” directory

The `autobuild/patches/` directory contains all patches to be applied to the source code, with suffixes of `.patch`, or `.diff`. All patches are assumed to be patched with a strip level of 1, or `-p1`. Patches are patched according to the order of filenames.

As a part of the Core 4 compatibility update, a new syntactic sugar is added that:

Any patch files ending with `.patch.$ARCH` or `.diff.$ARCH` will only be applied to the specified `$ARCH`, saving some time writing `autobuild/patch` files with “if-else” statements.

A `autobuild/patches/series` file may be used to define a custom order to use the patches. This file should only contain filenames of the patches. When this file is found, Autobuild will patch the source code according to the order defined in this file.

## The “patch” file

The `autobuild/patch` file is sourced as a Bash script. This file is useful when patches are not formatted to use a strip level of 1, say `-p2`; or changes to the source code is not presented as a `.patch` or `.diff` file.

When the `autobuild/patch` file is found, Autobuild will **not** use the routine described in the section above, and you will have to put in all `patch` commands necessary.

The `autobuild/patch` file will only be sourced once, a `.patch` file is created in the source root inhibiting repeated source of this file.

Use `autobuild/prepare` if you intend to repeat actions when reusing source trees.

## The “build” file

The `autobuild/build` file is sourced as a Bash script. This file is basically used as a build script. When this file is present, `$ABTYPE` will be locked to `self`, unless otherwise specified.

## The “beyond” file

The `autobuild/beyond` file is sourced as a Bash script, and is only useful when using a pre-defined `$ABTYPE` other than `self`. This file contains all post-build actions needed before the final packaging.

## The “overrides” directory

The `autobuild/overrides` directory contains extra files to be shipped with the package, such as `.desktop` files. Files need to be put in their respective directory, like the example below:

``` sh
autobuild/overrides/usr/share/foo.desktop
```

## The “pax” file

The `autobuild/pax` file specifies post-installation operations to enable certain flags on libraries and executables for compatibility with PaX/Grsecurity kernels.

Syntax is shown as follows:

``` sh
abpaxctl <flags> <executable, library, or directory>
abpaxctl <flags> <executable, library, or directory>
...
```

For more information regarding this configuration file, you might want to read about `paxctl-ng` from the [Gentoo Wiki](https://wiki.gentoo.org/wiki/Hardened/PaX_Quickstart#paxctl-ng).

# Invoking Autobuild3

To start building a package using Autobuild3, put the `autobuild/` directory containing all the necessary configurations to the source root of the package you would like to build - and simply type in the `autobuild` command at the source root to start building.
