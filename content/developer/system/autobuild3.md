+++
title = "Autobuild3"
description = "A Multi-Backend Packaging Toolkit"
date = 2020-05-04T03:35:27.998Z
[taxonomies]
tags = ["dev-sys"]
+++

# What is Autobuild3?

Autobuild3 is a toolkit that automatically compiles and packages software from a *pre-processed* (i.e. extracted) source. Autobuild3 relies on a set of configurations and an `autobuild/` directory containing files and directories that are called "Autobuild3 Manifests". 

Autobuild3 manifests constitutes a powerful set of files that takes care of package metadata (package name, version, revision, dependencies, etc.) used for both the build-time and install-time, specifies the build sequence and behaviours, and the resulting package(s). There are a lot of files and switches contained in these manifests, and as such, there are a lot of information to be presented.

In the interest of readability, this guidebook will be divided into several sections:

- How Does Autobuild3 Work?
- The `autobuild/defines` File
- Pre-Defined Variables
- Build Scripts, Scriptlets, and Extra Files
- Running and Utilising Autobuild3

# How Does Autobuild3 Work?

# The `autobuild/defines` File

`autobuild/defines` *defines* most aspects of a package's build-time and install-time:

- Package Name
- Package Version/Revision
- Package (Build-Time and Install-Time) Dependencies
- Package Section/Category
- Package Description
- Build Parametres

[Detailed Description: `autobuild/defines` File](@/developer/system/defines.md)

# Pre-Defined Variables

A collection of variables are pre-defined by Autobuild3 and used as build-time defaults.

[Detailed Description: Autobuild3 Pre-defined Variables](@/developer/system/autobuild3-manual.md#general-structure)

# Build Scripts, Scriptlets, and Extra Files

[(Broken link) Detailed Description: Autobuild3 Build Scripts, Scriptlets, and Extra Files](/dev-sys-autobuild3-build-scripts-scriptlets-and-extra-files)

# Running and Utilising Autobuild3

To build a package using Autobuild3, simply go to a directory containing both the pre-processed (or extracted) source files, the `autobuild/` directory, and execute:

```
# autobuild
```

However, with the introduction of [(Broken link) ACBS](/dev-sys-acbs) (originally known as [(Broken link) ABBS](/dev-sys-abbs) and later [Ciel](@/developer/system/ciel.md), Autobuild3 is now rarely used as a standalone tool. In particular, with the requirements specified in the [AOSC OS Maintenance Guidelines](@/developer/system/maintenance-guidelines.md), Ciel is now *required* as a standard frontend for AOSC OS packaging.

Please refer to the following pages for details:

- [AOSC OS Cadet Training/Ciel](@/developer/system/ciel.md)
- [(Broken link) AOSC OS Cadet Training/ACBS](/dev-sys-acbs)
