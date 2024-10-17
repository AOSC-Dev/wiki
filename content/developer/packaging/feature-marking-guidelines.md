AOSC OS Feature Marking Guidelines
===

The Feature Marking Guidelines is designed to mark key system components that
are not considered `Essential` per dpkg, but could be used as referenced for
management frontends such as oma to inform users of the risks of removing
certain packages (those that might impeded system functions and features, more
below).

With this set of guidelines, users may be better informed about the differences
between system components and applications. This set of guidelines, by
principle, only applies to pre-installed software.

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

The `Functionality` field may be localised with the `-$LANG` suffix, those
without a suffix will be used as the fallback (C/en_US) for systems set with
languages without the necessary translations:

```
Feature: kde-graphical-environment
Functionality: KDE graphical environment
Functionality-zh_CN: KDE 图形界面

Feature: multimedia-playback
Functionality: Multimedia playback support
Functionality-zh_CN: 多媒体播放
```
