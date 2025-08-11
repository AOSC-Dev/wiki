+++
title = "Repository Metadata and Configuration Templates"
+++

This specification defines the structure and content of repository (and mirror) metadata and configuration templates used by AOSC OS installations.

Structure and Functions
===

- `/usr/share/repository-data/` - system configuration prefix, configuration files found in this directory should be shipped with packages
    - `mirror.toml` - repository metadata
    - `comps.toml` - component (package collection) metadata
- `/etc/repository-data/ - user configuration prefix, configuration files found in this directory are user-defined
    - A copy of `mirror.toml` and `comps.toml` may be placed here and is used to supplement their counterparts in `/usr/share/repository-data/`
    - IDs found in these configurations must be unique to those in `/usr/share/repository-data/`

Main Configuration Files
===

`/usr/share/repository-data/mirror.toml`:

```toml
[origin]
description.default = "AOSC main repository (auto-redirect)"
description.zh_CN = "安同开源社区官方源（自动重定向）"
url = "https://repo.aosc.io/anthon/"
```

`/usr/share/repository-data/comps.toml`:

```toml
[main]
description.default = "The main collection of packages"
description.zh_CN = "主软件集"

[bsp-loongarch64-nosimd]
description.default = "Packages for LoongArch64 BSP for no-SIMD platforms"
description.zh_CN = "用于无 SIMD 的龙架构（64 位）平台的软件包"
```

Repository Configuration Template
===

`/usr/share/repository-data/template.toml` instructs package management frontends (such as oma) on how to make use of the above information to generate repository configurations, sections defined in this template should be written in-order to the target configuration file:

```toml
[[config]]
# For options with multiple values.
#
#   - sources.list: comma-separated (",") 
#   - DEB-822: whitespace-separated
#
# List of components (package collections)
#
# Written as an array and converted to string, space in sources.list or
# whitespace-separated in DEB-822 configurations
components = ["main"]
#
# Signature configuration, APT generally requires repository to be GPG-signed
#
signed-by = ["/usr/share/keyrings/aosc-archive-keyring.gpg"]
#
# Whether to check for repository signature
#
# Corresponds to "[trusted=yes]" in sources.list or "Trusted: yes" in DEB-822
#
# Defaults to false if not specified
always-trusted = <true|false>
#
# Architecture configuration - to define the range of architectures supported
# by a specific repository
#
# Defaults to `dpkg --print-architecture` + all (noarch) if not specified
#
# For packages of multiple architectures
architectures = ["amd64","arm64"]
# For all architecture-agnostic packages
architectures = ["all"]
# For all architecture-specific packages
architectures = ["any"]
# Equivalent of default
architectures = ["all","any"]
#
# Whether to enable the repository
#
# Corresponds to commented/not-commented in sources.list or "Enabled: yes/no" in DEB-822
#
# Defaults to true if not specified
enabled = <true|false>
```

Example: Mainline Distribution
---

```toml
[[config]]
components = ["main"]
signed-by = ["/usr/share/keyrings/aosc-archive-keyring.gpg"]
```

Example: loongarch64-nosimd
---

```toml
[[config]]
components = ["bsp-loongarch64-nosimd"]
signed-by = ["/usr/share/keyrings/aosc-archive-keyring.gpg"]
architectures = ["loongarch64"]

[[config]]
components = ["main"]
signed-by = ["/usr/share/keyrings/aosc-archive-keyring.gpg"]
architectures = ["all"]
```