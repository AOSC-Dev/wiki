+++
title = "ACBS - Director's Cut"
+++

Director's Cut (DX) Version
===========================

Background
----------

As it was shown in the introduction, ACBS was meant to replace the
original ABBS utility with better reliability and functionalities.
However, later it was clear that ACBS itself was riddled with numerous
bugs and issues.

After years of disrepair, the original ACBS was apparently beyond
repair. Although the members of the AOSC community were getting used to
the workarounds and quirks of ACBS, a better solution was still much
desired.

The original author, liushuyu, decided to face on the challenge. It took
him what feels like three months to complete the rewrite, and the result
is then the DX version.

Version Number
--------------

The DX version still uses the same version schema as the original. The
first release of the DX version is version `20200615`.

Behavioral Changes
------------------

Since the DX version is a complete re-implementation, there are some
changes to its behaviors:

1.  **Dependency resolution:** The original version uses a dumb
    algorithm, which will spawn a new thread to build the dependent
    package before the package you requested. The new version will use
    the Tarjan search algorithm to determine what and in which order the
    dependencies should be built in advance.
2.  **Parser:** The original version uses bash itself to parse the build
    files. This is proven to be unreliable. The new version uses
    `bashvar.py` from `abbs-meta`.
3.  **Source fetching:** The new version now name the source files using
    their checksum hashes to avoid name collisions. The Git repository
    is now fetched using the "bare repository" mode, and during the
    checkout phase, the repository is checked out using "detached" mode.
    In this case, the `.git` folder will not exist in the build
    directory.
4.  **Overall reliability:** The new version now uses type checking to
    ensure basic stability. No type errors are allowed to pass through
    under the newly set up CI system.
