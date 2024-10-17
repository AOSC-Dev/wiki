+++
title = "AOSC OS Feature Marking Guidelines"
description = "Guidelines for Marking Key AOSC OS Features and Components"
date = 2024-10-17T12:12:56.606Z
[taxonomies]
tags = ["dev-sys"]
+++

The Feature Marking Guidelines is designed to mark key system components that
are not considered `Essential` per dpkg, but could be used as referenced for
management frontends such as oma to inform users of the risks of removing
certain packages (those that might impeded system functions and features, more
below).

With this set of guidelines, users may be better informed about the differences
between system components and applications. This set of guidelines, by
principle, only applies to pre-installed software.

Packaging
---

To mark a package as AOSC OS feature components, use `PKGFTR=` in `defines`:

```
PKGFTR=kde core ...
```

Metadata
---

- Repository- and toolchain-side: Add `X-AOSC-Features` markers to select
  packages to indicate the relevant system features (recorded in `control` in
  the package and `Packages` in the APT repository).
- Introduce `aosc-os-feature-data` to record names and descriptions of the
  system features.

### Example: control and Packages

`X-AOSC-Features` may contain multiple items, separated with space; the name
of the feature items shall only contain letters a-z, numbers and dashes (-):

```
Package: plasma-workspace
...
X-AOSC-Features: kde-graphical-environment multimedia-playback
```

### Example: aosc-os-feature-data

The feature metadata is written in TOML, with support for localisation:

```
[kde-graphical-environment]
zh_CN = "KDE 图形界面"
en_US = "KDE graphical environment"

[multimedia-playback]
zh_CN = "多媒体播放"
en_US = "Multimedia playback"
```
