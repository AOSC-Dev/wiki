+++
title = "AOSC Find Update Syntax"
description = "Your Guide to CHKUPDATE and Automatic Update Checking"
+++

AOSC Find Update has its syntax and configuration defined in the `spec` file.

The syntax is simailar to the `SRCS` format:

```bash
CHKUPDATE="<type>::<key1>=<value1>;<key2>=<value2>"
```

Where `<type>` is the type of the update checker, and the key-value pairs are the configurations for that update checker.

The following sections will show all available update checkers, ordered by their trustworthiness.

# Update Checkers

## Release Monitoring Project (Anitya)

- Type name: `anitya`
- URL: https://release-monitoring.org/

**Environment Variables:**
<!--
| Name | Required? | Description |
|------|-----------|-------------|
-->
N/A

**Options:**

| Key | Required? | Description |
|-----|-----------|-------------|
|`id`|**REQUIRED**|Project ID from Anitya's database. [Click here to look up project ID](https://release-monitoring.org/projects/search/).|

**Notes:**

- This checker uses an API that is used by many other distributions. Use this checker if possible.

**Example:**

```
# LMMS
CHKUPDATE="anitya::id=1832"
```

## GitHub API

- Type name: `github`
- URL: https://github.com/

**Environment Variables:**

| Name | Required? | Description |
|------|-----------|-------------|
|GITHUB_TOKEN|**REQUIRED**|Your GitHub access token. Use it to authenticate with GitHub API. [Click here to access them or create one](https://github.com/settings/tokens).|

**Options:**

| Key | Required? | Description |
|-----|-----------|-------------|
|`repo`|**REQUIRED**|Project slug (e.g. `AOSC-Dev/ciel-rs`).|
|`pattern`|Optional|A regular expression pattern that matches the version numbers. Use this option to filter out unwanted versions (e.g. nightlies). The capture group #1 _could be_ used to match the version number.|
|`sort_version`|Optional|Sort version numbers instead of using GitHub provided order (**alphabetical** order of the tag name).|

**Example:**

```
CHKUPDATE="github::repo=AOSC-Dev/ciel-rs"
CHKUPDATE="github::repo=AOSC-Dev/ciel-rs;pattern=\d+\.\d+\.\d+;sort_version=true"
```

## GitLab API

- Type name: `gitlab`
- URL: Various

**Environment Variables:**
<!--
| Name | Required? | Description |
|------|-----------|-------------|
-->
N/A

**Options:**

| Key | Required? | Description |
|-----|-----------|-------------|
|`repo`|**REQUIRED**|Project slug (e.g. `GNOME/fractal`) or Project ID (e.g. `132`).|
|`instance`|Optional|GitLab instance URL. Useful for when the project is hosted on a self-hosted GitLab server. If unspecified, this defaults to `https://gitlab.com`|
|`pattern`|Optional|A regular expression pattern that matches the version numbers. Use this option to filter out unwanted versions (e.g. nightlies). The capture group #1 _could be_ used to match the version number.|
|`sort_version`|Optional|Sort version numbers instead of using GitLab provided order (**creation dates** of the tags).|

**Example:**

```
CHKUPDATE="gitlab::repo=fcitx/fcitx5;pattern=\d+\.\d+\.\d+;sort_version=true"
# Fractal is on GNOME's own GitLab server
CHKUPDATE="gitlab::repo=GNOME/fractal;instance=https://gitlab.gnome.org"
```

## GitWeb Tags

- Type name: `gitweb`
- URL: Various

**Environment Variables:**
<!--
| Name | Required? | Description |
|------|-----------|-------------|
-->
N/A

**Options:**

| Key | Required? | Description |
|-----|-----------|-------------|
|`url`|**REQUIRED**|URL to the GitWeb repository page|
|`pattern`|Optional|A regular expression pattern that matches the version numbers. Use this option to filter out unwanted versions (e.g. nightlies). The capture group #1 _could be_ used to match the version number.|

**Notes:**

- This checker **does not** work with `cgit` instances.
- This checker will **sort the version numbers** anyways since the date information is not reliable.

**Example:**

```
CHKUPDATE="gitlab::url=https://repo.or.cz/0ad.git;pattern=^[^b]+$"
```

## Generic Git Tags

- Type name: `git`
- URL: Various

**Environment Variables:**
<!--
| Name | Required? | Description |
|------|-----------|-------------|
-->
N/A

**Options:**

| Key | Required? | Description |
|-----|-----------|-------------|
|`url`|**REQUIRED**|URL to the Git repository clone URL (http/https only, `git://` protocol unsupported)|
|`pattern`|Optional|A regular expression pattern that matches the version numbers. Use this option to filter out unwanted versions (e.g. nightlies). The capture group #1 _could be_ used to match the version number.|

**Notes:**

- You can use this checker to check `cgit` or other online Git repositories.
- This checker **does not actually clone** the repository, so no need to worry about disk space or repository size.
- This checker will **sort the version numbers** anyways since the date information is not available.

**Example:**

```
CHKUPDATE="git::url=https://git.tuxfamily.org/bluebird/cms.git"
```

## Generic Webpage Matching

- Type name: `html`
- URL: Various

**Environment Variables:**
<!--
| Name | Required? | Description |
|------|-----------|-------------|
-->
N/A

**Options:**

| Key | Required? | Description |
|-----|-----------|-------------|
|`url`|**REQUIRED**|URL to the webpage in interest.|
|`pattern`|**REQUIRED**|A regular expression pattern that matches the version numbers. The capture group #1 **must be** used to match the version number.|

**Notes:**

- Generally try to avoid using this checker as it is very unreliable.
- This checker will **sort the version numbers** anyways since the date information is not available.

**Example:**

```
CHKUPDATE="html::url=https://repo.aosc.io/misc/l10n/;pattern=zh_CN_l10n_(.+?)\\.pdf"
```
