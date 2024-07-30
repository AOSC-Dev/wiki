+++
title = "ACBS - Specification Files"
+++

Specification Files
===================

Defines files are expected to exist in `:/autobuild/`. `defines` files
are usually processed by `autobuild` script, however `acbs` also use
this file to determine the building order of a given set of packages.

`defines` file MUST contain the following variables:

-   `PKGNAME` The name of the package
-   `PKGSEC` The section/group/"genre" of the package
-   `PKGDES` The brief description of the package

This file may also include the following variables:

-   `PKGDEP` The mandatory runtime requirements/dependencies
-   `BUILDDEP` The mandatory compile-time requirements/dependencies
-   `PKGRECOM` The optional runtime requirements/dependencies (for
    enhancing UX or add new features)
-   `EPOCH` The epoch version number of the package

This file might also include `autobuild` specific controlling values.
Consult
[Autobuild3](@/developer/packaging/autobuild3-manual.md#the-defines-file)
for more information.

## spec

Specification (spec) files are expected to exist in `:/` (root of the
top project folder). `defines` files are solely processed by `acbs` to
fetch source files and control `acbs` how to transfer controls to
`autobuild`.

`spec` file MUST contain the following variables:

-   `VER` The version of the package, it might be not in semantic
    versioning scheme.

`spec` file SHOULD ONLY contain ONE of the following variables:

-   `SRCS` Expected format:
    `<VCS_NAME_1>::<OPTIONS_1>::<URI_1> <VCS_NAME_2>::<URI_2> ...` See
    footnote[1] for details about particular behavior.
-   `DUMMYSRC` (Bool) If set to 1, indicates this package does not
    require source files or source files processing cannot be handled
    well by current version of `acbs`.

`spec` file may also contain the following variables:

-   `CHKSUMS` Expected format:
    `<ALGO_NAME_1>::<HASH_VALUE_1> <ALGO_NAME_2>::<HASH_VALUE_2> ...` If
    set, `acbs` will check the checksum of the source files against this
    value not available if the source is from VCS.[2]
-   `SUBDIR` If set, `acbs` will change to specified directory after
    finishing preparing the source files. (For a list of supported
    hashing algorithms, see `appendix`)
-   `SRCTBL` (String) **\[Deprecated\]** If set, indicates this package
    requires "zipped" or archived source files.
-   `<VCS_NAME>SRC` **\[Deprecated\]** If set, indicates required source
    files for this package are in a version controlled repository. (For
    a list of supported VCS systems, see `appendix`)
-   `<VCS_NAME>BRCH` **\[Deprecated\]** If set, indicates required
    branch of the repository for the package.
-   `<VCS_NAME>COMMIT` **\[Deprecated\]** If set, indicates required
    commit/revision of the repository for the package.
-   `CHKSUM` **\[Deprecated\]** Expected format:
    `<ALGO_NAME>::<HASH_VALUE>` If set, `acbs` will check the checksum
    of the source file against this value can be omitted if the source
    is from VCS.

Details about the `SRCS` format:

-   Each source specification in the array accepts one, two or three parameters:  
    1.  One parameter only: `<URL>`
    2.  Two parameters: `<VCS_NAME>::<URL>`
    3.  Three parameters: `<VCS_NAME>::<OPTIONS>::<URL>`

-   Currently supported options:  
    -   `branch`: Name of the branch
    -   `commit`: Commit hash
    -   `rename`: Rename the source file (including extension name if
        any)
    -   `submodule`: Automatically fetch submodules in the repository.
        -   `true`: Fetch submodules but not recursively (submodules in
            the submodules are not fetched).
        -   `false`: Do not fetch submodules.
        -   `recursive`: \[Default\] Fetch submodules recursively.
    -   `copy-repo`: Automatically copy VCS metadata to the build
        directory.
        -   `true`: Copy VCS metadata prior to the building
            process, replaces `acbs_copy_git`.
        -   `false`: \[Default\] Do not copy VCS metadata. However
            you can still use `acbs_copy_git`.

To specify multiple options, you can join the options with semicolons
(`;`) like this:

``` bash
SRCS="git::rename=lmms-git;commit=94363be::https://github.com/LMMS/lmms"
```

The snippet above will make `acbs` rename the source directory to
`lmms-git` and checkout the commit `94363be`.

[1] Example:

``` bash
SRCS="git::git://github.com/AOSC-Dev/acbs git::https://github.com/AOSC-Dev/acbs"
```

This will make `acbs` to download two sets of source files

[2] Example:

``` bash
CHKSUMS="sha1::a9c55882c935300bec93e209f1ec8a21f75638b7 sha256::4ccdbbd95d4aef058502c8ee07b1abb490f5ef4a4d6ff711440facd0b8eded33"
```

This will make `acbs` to check two sets of source files
