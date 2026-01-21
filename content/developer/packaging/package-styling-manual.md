+++
title = "AOSC OS Package Styling Manual"
description = "Comprehensive (and updated) Styling Manual for AOSC OS Packagers"
date = 2020-05-04T03:35:56.606Z
[taxonomies]
tags = ["dev-sys"]
+++

# Introduction and Rationale

The [AOSC OS ABBS Tree](https://github.com/AOSC-Dev/aosc-os-abbs/) is now home to over 5000 (and counting) packages, which are maintained by over 20 (historical and current) packagers. With more than 5 years of history behind some packages, issues began to emerge in the following fashion:

- Packages lack dependencies.
- Insecure (unquoted) variables in build scripts.
- Hard-to-read build scripts, with little comments or indication of progression.
- Undescriptive package description(s) (`$PKGDES`).
- Non-standard package section(s) (`$PKGSEC`).
- ...

Without a comprehensive guildeline for packaging work in the future, these issues will not go away - rather, the list will grow longer and further degrade package qualities in our distribution. This Styling Manual seeks to provide sectioned and targetted sets of guidelines for fixing existing and new packages.

# Packager, Package Names, and Descriptions

This section contains the three most basic descriptors for an AOSC OS package.

## Packager Information

Packager, or "Maintainer", as referenced in Debian Packages (`.deb`), should have its value formatted as follows:

```
Executed Packager <suffering@pakreq.work>
```

## Package Names

Package names (`PKGNAME=`, or `$PKGNAME`) should be *lower-cased*, and otherwise comply with the choice of package manager.

## Descriptions

Package descriptions (`PKGDES=`, or `$PKGDES`) are to be composed with the following guidelines:

- Start with a upper-case letter.
- With no period point or any punctuation mark at the end.

However, it is worth noting that package descriptions found with AOSC OS packages should be descriptive, but not definitive. For example, an acceptable package description should look something like...

    "Library with common API for various MATE modules"

Not less descriptive, like...

    "MATE Desktop Library"

Nor excessively definitive and reproduce uncritically claims of the upstream projects, like...

    "Library with concise and convenient API for various MATE modules"

# Package Specs

In the current implementation of [ACBS](https://github.com/AOSC-Dev/acbs) (Autobuild CI Build Service), three categories of variables are defined in a file named `spec` - these variables will be discussed below.

## Versioning Variables

Versioning variable define the package's version and revision levels.

### VER=

The `VER=`, or `$VER` variable defines the main version of the resulting package. When packaging for AOSC OS, packagers should take note of the following requirements. These requirements are presented in the table below.

| Situations | Appropriate Actions | Examples |
|-------------------|-------------------------------------|-------------------|
| "Normal" versioning, with only "dot" separators | Retain version, as defined by the upstream. | GNOME Clocks 3.32.1 -> `VER=3.32.1` |
| Versions with letter notation(s) | Lower-case all letter(s), and remove symbols surrounding the letter(s). | Bind 9.12.3-P4 -> `VER=9.12.3p4` |
| Versions with dash(es) ("-") | Replace the dash(es) with plus ("+") sign(s). | ImageMagick 6.9.10-23 -> `VER=6.9.10+23` |
| Versions with underscore(s) ("\_") | Replace the underscore(s) with dot(s) ("."). |  Icarus Verilog 10_2 -> `VER=10.2` |
| Versions with release stage notation(s) ("alpha", "beta", "rc", etc.) | Lower-case all notations, "Beta" to "beta", etc. Prepend a tilde ("~"). | Golden Dict 1.5.0-RC2 -> `VER=1.5.0~rc2` |
| Versions with formatted date(s) | Replace dash(es) ("-") with dots ("."). | QuickJS 2020-09-06 -> `VER=2020.09.06` |
| Git or other VCS snapshots | Write last tagged version (e.g. "3.2.1") or "0" if never tagged, then append "+", VCS name (e.g. "git"), date of commit, and revision number (and optionally, where available, a short reference hash). Schema: `${VER}+${VCS_NAME}.r${REV_COUNT}[.${SHORT_HASH}]` [^1] | Nano 7f4c2c6a2556ecab6a8c2018a5f44b7fbdfc092d -> `VER=7.2+git20230602.r10185.7f4c2c6a` |

[^1] For Git, you may append the information after `+` automatically by running this command from within a local source repository (please take note to replace the `[commit_hash]` with your specified commit): `echo git$(date --date="@$(git show -s --format=%ct [commit_hash])" "+%Y%m%d").r$(git rev-list --count [commit_hash]).$(git rev-parse --short [commit_hash])`.

### REL=

The `REL=`, or `$REL` variable defines the revision level of the resulting package. This variable defaults to 0 and, when a revision is made to a package without any change to the main version (`VER=`), you should increment this value by 1. One exception is when handling Linux kernel packages in the RC (release candidate) stage, we customarily use 0.1, 0.2, 0.3, ..., etc. to indicate RC numbers (`REL=0.2` corresponds to `-rc2` in kernel version, for instance) and use a, b, c, ..., etc. to indicate revisions on the same RC version. Any further exception should be discussed before hand before they become rule.

ACBS may automatically append a `~pre${ISO_8601-1_2019_TIMESTAMP}` suffix to `REL=` when packaging from a non-stable branch, see [Revision Marking Guidelines for Topic Packages](@/developer/packaging/topic-version-suffix.md).

When a package is updated, the `REL=` line should be removed to indicate a revision level of 0 (we typicall remove the `REL=` declaration in `spec` when doing so).

### EPOCH=

The `EPOCH=`, or `$EPOCH` variable defines the most significant field of a package's version string. This variable defaults to 0 and, when a downgrade is made to the main version (e.g., downgrading `VER=` from `32.0` to `25.2`), you should increment this value by 1. This variable allows the downgraded package to have a greater version string in spite of having a smaller `VER=` value (e.g., `1:25.2` vs `32.0`).

## Source Variables

Source variables define the package's source(s), and in the case of a VCS (version control system) based source, define in addition a specific source snapshot.

### SRCS=

The `SRCS=`, or `$SRCS` variable is used to indicate a list of source file(s) used for a package. Requirements and recommendations are presented in the table below. For description on how to compose source entries, please refer to [ACBS - Specification Files](https://wiki.aosc.io/developer/packaging/acbs/spec-format/).

| Criteria | Required/Recommended/Disallowed | Appropriate Actions |
|-------------|----------------------------------------|---------------------------------|
| Version substitutions | Required | Source links must replace all versions with substitutions from the `$VER` variable (see above). `SRCS=` must not be defined with hard-coded version(s). |
| Tarball origins | Required | Use the upstream-supplied mirroring/automatic redirection URLs whenever possible and avoid using any one of the mirrors. |
| SourceForge releases | Required | Follow [official guidelines](https://sourceforge.net/p/forge/documentation/Downloading%20files%20via%20the%20command%20line/) and include the `/download` suffix in the URL, i.e. `tbl::https://sourceforge.net/projects/wqy/files/wqy-microhei/${UPSTREAM_VER}/wqy-microhei-${UPSTREAM_VER}.tar.gz/download"` |
| URI schemes | Recommended | Use Hypertext Transfer Protocol Secure (HTTPS, https://) where possible. Avoid non-secure connections (http://) and plain FTP (File Transfer Protocol, ftp://). |
| Source format | Recommended | Use XZ-compressed Tar-Archives (.tar.xz) where possible, other formats are considered appropriate. Avoid the inefficient BZip2-compressed Tar-Archives (.tar.bz2) where possible. |
| Platform-generated tarballs | Disallowed | You should not use generated tarballs from various platforms, especially those from GitHub and GitLab, which were known to be re-generated over time, altering checksums. Use `git::` sources with the `commit=tags/...` option instead. |

### CHKSUMS=

The `CHKSUMS=`, or `$CHKSUMS` variable is used in conjunction with `$SRCS` to define the proper checksum for specific source archive(s). The format is as follows.

```
CHKSUMS="$ALGORITHM::$CHECKSUM $ALGORITHM::$CHECKSUM $ALGORITHM::$CHECKSUM"
```

Where...

- `$ALGORITHM` is to be replaced with specific hashing algorithms, written in lower-case. For instance, `sha256`.
- `$CHECKSUM` is to be replaced with the corresponding hash checksum of the aforementioned algorithm.

For descriptions of different cryptographic hash algorithms, and for identification of insecure (and therefore unacceptable) algorithms, refer to this [Wikipedia chapter](https://en.wikipedia.org/wiki/Cryptographic_hash_function#Cryptographic_hash_algorithms) under "Cryptographic Hash Function".

This variable is usually automatically generated with `abbs-update-checksum $PKGNAME`.

### DUMMYSRC=

The `DUMMYSRC=`, or `$DUMMYSRC` variable is used when a package is empty (meta package), or uses custom-generated sources. This variable takes a bolean value.

### CHKUPDATE=

All packages, when possible or applicable, should be marked with the `CHKUPDATE=`, or `$CHKUPDATE` variable. Please refer to [AOSC Find Update Syntax](https://github.com/AOSC-Dev/aosc-findupdate/blob/master/docs/config.md) for syntax and available options.

Whenever possible, it is encouraged to use the `anitya::` checker for your package.

### Other Variables

Other variables may be used, so long as they are not any of the variables listed above. These variables are often used to aid with manipulating `$SRCDIR`, here's the `spec` file of `app-devel/netbeans`, for instance.

```
VER=8.2
REL=1
SUB=201609300101
SRCTBL="http://download.netbeans.org/netbeans/$VER/final/zip/netbeans-$VER-$SUB.zip"
SUBDIR=.
```

# Dependencies

In the context of AOSC OS packaging, dependencies are arranged in two categories: run-time depedencies, and build-time dependencies. These dependencies are defined by `PKGDEP=` (`$PKGDEP`), and `BUILDDEP=` (`$BUILDDEP`), respectively.

## Run-time Dependencies

Run-time dependencies should be written in such a way that, not only does the package function (programs run, libraries link, etc.), all linkages to the package should also be included. In the case of `app-multimedia/ario`, for instance, not only should `$PKGDEP` contain the following dependencies:

`avahi, curl, dbus-glib, gnutls, hicolor-icon-theme, libglade, libmpdclient, libnotify, libsoup, libunique, taglib, xdg-utils`

Which, through explicit and implicit dependencies, allows for a system environment that contains sufficient runtime for the program `/usr/bin/ario` to function. By the quality assurance standard, defined in code [E432](@/developer/packaging/qa-issue-codes.md#class-4-dependencies), all direct dependencies on the ELF level should also be included in `$PKGDEP`, and thus the addition of `dbus` to `$PKGDEP` is necessary.

### Additional Notes

- When a package has a sole dependency on the GCC Runtime (`gcc-runtime`) or the GNU C Library (`glibc`), these dependencies should be included in `$PKGDEP`.

## Build-time Dependencies

Build-time dependencies should written in such a way that the package will compile, install, and package successfully in the BuildKit build environment. Given this, any packages included in the BuildKit environment will not need to be included in `$BUILDDEP`. For example...

- CMake (`cmake`) is required for building `app-devel/extra-cmake-modules`, however, `cmake` is an integral part of BuildKit. Therefore, packagers are not required to include `cmake` in `$BUILDDEP`.
- Bazel (`bazel`) is required fo building `app-scientific/tensorflow`. In this case, `bazel` must be included in `$BUILDDEP`, as `bazel` is not installed in BuildKit as standard.

# Package Features

When packaging for AOSC OS, please work in accordance to our [distribution feature guide](@/aosc-os/is-aosc-os-right-for-me.md). The table below digests some of the common considerations when building packages for AOSC OS.

| Considerations | Appropriate Actions |
|-------------------------|---------------------------------|
| Features | Enable all features, unless a feature is unmaintained, or violates any of the other considerations in this table. |
| Language packs (dictionaries, locale data, etc.) | Language packs must be included in the same package as the main executables, etc. |
| Splitting packages | Packages are to be remained intact, unless package comes in multiple flavours, or otherwise agreed upon by the developer majority. |
| Telemetry | All telemetry functionalities must be stripped or disabled by default (opt-in), packages that do not function without such feature should only be accepted on a case-by-case basis (rejected by default). |
| Update checking | All update checking (notification, downloading, etc.) functionalities must be stripped, packages that do not function without such feature should only be accepted on a case-by-case basis (rejected by default). |
| API and development documentation | Unless needed by an application's integrated feature (e.g., Qt Creator), gtk-doc, API (HTML, PDF, etc.), and Doxygen documentation should not be installed. |

# Scripting

While most packages could be built with one of the pre-defined [Autobuild Types](https://github.com/AOSC-Dev/autobuild4/tree/master/templates) (`$ABTYPES`), and that patches could be applied automatically from the `autobuild/patches` directory (or via a pre-defined `series` file to specify patch order), some packages require manual preparation, patching, and build. This section is dedicated to `prepare`, `patch`, `build`, and `beyond` under the `autobuild/` directory.

A general rule of thumb is to write such scripts secure (quoted) variables, sufficient comments, error control, architectural considerations, progression report, ... Writing easy-to-read and reliable build scripts is not easy, and the table below aims to aid you with making good scripting decisions.

| Criteria | Required/Recommended | Explanations |
|-------------|----------------------------------------|----------------------|
| Autobuild Build Templates | Required | Packagers should utilise [Autobuild Types](https://github.com/AOSC-Dev/autobuild4/tree/master/templates) where possible, without using `autobuild/build` or `ABTYPE=self`. |
| Autobuild Build Template Definition | Required | Packagers should explicitly mark the `ABTYPE=`, or type of Autobuild build templates used by the package source. |
| Error Handling | Required | Build errors should be captured and handled appropriately. |
| Progression Reporting | Requried | Progress should be reported by appropriately employing `abinfo` and `abwarn` wrappers, this is required for packages utilising the `autobuild/build`, or `ABTYPE=self`. |
| Verbosity | Required | Build scripts should enable command verbosity where possible to help generate fuller logs for debugging. |
| Absolute Paths | Required | Build scripts should prefix all in-source files, paths, and executables referenced with the build root (`$SRCDIR`), packaging root (`$PKGDIR`), or the shadow build prefix (`$BLDDIR`) (i.e., using `"$SRCDIR"/configure` versus `./configure`); if you have cd'd into a directory, this rule does not apply for any files, paths, and executables referenced. |
| Symlinks | Required | Use relative paths when symlinking files in the system root to avoid file pollution when accessed from an external system. |
| Citations and References | Required | When adapting/copying build scripts from other distributions, packager must include a comment indicating the source(s) of the build script(s) |
| Secure Variables | Required | Variables should be quoted, for example, all `"$SRCDIR"` and `"$PKGDIR"`. |
| Architectural Considerations | Required | Unless marked to fail on specific architectures (`$FAIL_ARCH`), you should assume that all scripts are tested and will work on all supported architectures. |
| FIXME Comments | Required | All known issues and workarounds must be marked with a `# FIXME:` comment indicating the reasoning. When possible, append an abbreviated build log for where the error occurred. |
| Other Comments | Recommended | Good scripts tend to be well commented. However, comments can be replaced with progression report clauses, see "Progression report". |
| Macros | Recommended | Please make use of built-in macros, i.e., `ab_apply_patches`, `ab_match_arch`, etc. where possible to save on scripting complexity. |
| Line Widths | Recommended | Please limit script lines to no more than 80 characters wide to make it more readable for others. |

# Patch Naming

Patches should follow a uniform and ordered format, before they are included in `autobuild/patches/`. See below for specific rules.

## Git-based Sources

When dealing with Git-based sources, it is possible to create numbered patches from the following command:

```
git format-patch -n $HASH
```

Where `n` defines the amount of commits from the specific commit `$HASH`, including the specified commit. Alternatively, you can omit the `$HASH`...

```
git format-patch -n
```

To create a series of patches from `n` commits to the branch `HEAD`.

These commands generate a series patches like the following...

```
0001-contrib-autobuild-aoscarchive-one-more-syntax-fix.patch
0002-common_switches-add-sanitizer-support.patch
0003-contrib-autobuild-aoscarchive-fix-overlay-subdir-che.patch
0004-arch-_common_switches-fix-syntax.patch
0005-autobuild-aoscarchive-adapt-to-new-workflow.patch
```

## Other Sources

Without an automatic mean to generate patches, patches should be named in the following format.

```
NNNN-$CATEGORY-$CONTENT.patch
```

Where:

- `NNNN`, like the sample patch file names, is a "serial" number for sorting patches.
- `$CATEGORY` defines the category of a patch, for instance, `bugfix`, `feature`, etc.
- `$CONTENT` defines "what is to be done" when a patch is applied, for instance, `fix-build-with-openssl-1.1`.

Likewise, when including patch(es) from other distributions, they should also be renamed in accordance to the guidelines above.

# File Placements

AOSC OS, like many other Linux Distributions, expect packaged files to be located in appropriate directories. Please reference the *non-comprehensive* table below for our standard of file placements.

| Types of Files | Appropriate Placements |
|-----------------------|---------------------------------------|
| Binary or script executables | `/usr/bin` |
| Binaries run by other programs | `/usr/libexec`, unless hard-coded by other packages/components (GNOME, \*ahem\*) |
| Data files (no ELF, or architecturally-dependent scripts) | `/usr/share` |
| Daemon user home | `/var/lib/$COMPONENTNAME`, where an appropriate`$COMPONENTNAME` is decided in practice, for instance, `/var/lib/lightdm` |
| Go components and shared data | `/usr/share/gocode` |
| Headers (includes) | `/usr/include` |
| Java components (commons, etc.) | `/usr/share/java` |
| Libraries (shared and static) | `/usr/lib` |
| Licences | `/usr/share/doc/$PKGNAME` |
| Manpages | `/usr/share/man` |
| Non-manpage documentations | `/usr/share/doc/$PKGNAME` |
| Private libraries | `/usr/lib/$COMPONENTNAME`, where an appropriate`$COMPONENTNAME` is decided in practice, for instance, `/usr/lib/R` |

## Electron and Chromium-based Packages

Electron, Chromium, and other Chromium-based packages should be packaged with the following structure.

| Components | Appropriate Placements |
|---------------------|----------------------------------------|
| Binary executables | `/usr/bin`, where the executable is a symbolic link to its target in `/usr/lib/$PKGNAME` |
| Desktop, AppStream, and other data files | `/usr/share` |
| Main program data | `/usr/lib/$PKGNAME` |

## Binary Packaging (Binpack)

Binary packages should not be installed to `/opt`, unless the package's licence prohibits such file movement. With adjustments and other modifications, these packages should be installed to the `/usr` prefix - should the packager find it impossible, they should consider rejecting such packages.

Stripping must also be disabled for binary packages by appending `ABSTRIP=0` to `defines`.

# Git Commit Messages

When committing (or contributing, if you like) to the [AOSC OS ABBS Tree](https://github.com/AOSC-Dev/aosc-os-abbs/), please observe the commit message standards, shown in the table below.

| Action | Message Formatting | Sample Commit Message |
|-----------|-----------------------------------|-----------------------------------------|
| Introducing a new package | `$PKGNAME: new, $PKGVER` | `windowsnt-kernel: new, 5.1.2600` |
| Security fixes with version update | `$PKGNAME: security update to $PKGVER` | `firefox: security update to 142.0`, and link the original security report (GitHub issue) to the associated GitHub PR in the Development sidemenu |
| Security fixes without version update, utilising patch(es) | `$PKGNAME: fix $CVEID` | `samba: fix CVE-2025-0620`, and link the original security report (GitHub issue) to the associated GitHub PR in the Development sidemenu |
| Updating a package | `$PKGNAME: update to $PKGVER` | `mate-desktop: update to 1.22.0` |
| Work-in-progress with a fail-to-build package | `$PKGNAME: ... (FTBFS)` | `chromeos-desktop: update to 99.0.9999 (FTBFS)`, note that "FTBFS" stands for "Failed To Build From Source", this term is used loosely |
| Working with a package | `$PKGNAME: ...` | `kde-workspace: add qt-5 dependency`, just say what you did in present tense |
| Working with a package, utilising distribution patch(es) | `$PKGNAME: ($DISTNAME patch[es], $CHANNEL) ...` | `qt-4: (Arch Linux patches) rebuild for openssl` |
| Working with a package, utilising upstream patch(es) | `$PKGNAME: (upstream patch[es]) ...` | `kodi: (upstream patch) fix lock-up on start-up` |
| Working with a QA issue | `$PKGNAME: ... ($ISSUECODE)` | `psiconv: rebuild for imagemagick (E431)`, for a list of QA issue codes, refer to this [list](@/developer/packaging/qa-issue-codes.md) |
| Working with an architecturally-exclusive package | `$PKGNAME: ... ($ARCH)` | `google-chrome: new, 100.0.9999.999 (amd64)` |
| Working with an architecturally-independent package | `$PKGNAME: ... (noarch)` | `mate-common: update to 1.22.0 (noarch)` |
| Retiring an orphaned package | `$PKGNAME: drop, orphaned` | `nano: drop, orphaned`[^1] |

[^1]: It was mistakenly retired [here](https://github.com/AOSC-Dev/aosc-os-abbs/pull/4412), and was soon reverted in [f2060c05da3264c24f0b4e93f6eaa8d1b570d6dd](https://github.com/AOSC-Dev/aosc-os-abbs/commit/f2060c05da3264c24f0b4e93f6eaa8d1b570d6dd).

## Long Messages

When more than one of the actions were committed, or that the short message goes beyond 50 characters (including space and punctuation marks), you should utilise a "long Git commit message", for example:

```
syncthing: update to 2.0.3

- Use gomod template to build.
```
