+++
title = "AOSC Find Update 语法"
description = "CHKUPDATE 及自动化更新检查指南"
+++

AOSC Find Update 所有的设置都应该写在 `spec` 文件中。

此语法和 `SRCS` 格式很类似：

```bash
CHKUPDATE="<类型>::<key1>=<value1>;<key2>=<value2>"
```

上述格式中的 `<类型>` 指的是更新检查器的类型，后面的键值对是更新检查器的配置。

下文将介绍本程序支持的所有更新检查器，并以靠谱程度排序（越不靠谱的越靠后）。

# 更新检查器

## Release Monitoring Project (Anitya)

- 类型：`anitya`
- URL: https://release-monitoring.org/

**环境变量：**
<!--
| 名称 | 必填？ | 描述 |
|------|-----------|-------------|
-->
N/A

**配置项：**

| 键 | 必填？ | 描述 |
|-----|-----------|-------------|
|`id`|**必填**|Anitya 数据库中的项目 ID [点击这里查询项目 ID](https://release-monitoring.org/projects/search/)。|

**注释：**

- 此检查器使用的 API 也同时被许多其他发行版使用。所以请尽量使用这个检查器。

**举例：**

```
# LMMS
CHKUPDATE="anitya::id=1832"
```

## GitHub API

- 类型：`github`
- URL: https://github.com/

**环境变量：**

| 名称 | 必填？ | 描述 |
|------|-----------|-------------|
|GITHUB_TOKEN|**必填**|你的 GitHub 访问令牌。设置此环境变量才能访问 GitHub API。 [点击此处访问令牌管理页面](https://github.com/settings/tokens)。|

**配置项：**

| 键 | 必填？ | 描述 |
|-----|-----------|-------------|
|`repo`|**必填**|项目名称 (比如 `AOSC-Dev/ciel-rs`).|
|`pattern`|可选|用于匹配版本号字符串的正则表达式。你可以使用此配置项来过滤掉不符合条件的版本号（比如每日版本）。#1 号捕获组 _可以_ 用于捕获版本号字符串。|
|`sort_version`|可选|对版本号进行排序，而不是使用 GitHub 提供的顺序（GitHub 使用的是**字母表顺序**）。|

**举例：**

```
CHKUPDATE="github::repo=AOSC-Dev/ciel-rs"
CHKUPDATE="github::repo=AOSC-Dev/ciel-rs;pattern=\d+\.\d+\.\d+;sort_version=true"
```

## GitLab API

- 类型：`gitlab`
- URL: 没有单一网址

**环境变量：**
<!--
| 名称 | 必填？ | 描述 |
|------|-----------|-------------|
-->
N/A

**配置项：**

| 键 |必填？| 描述 |
|-----|-----------|-------------|
|`repo`|**必填**|项目名称 (比如 `GNOME/fractal`) 或项目 ID (比如 `132`).|
|`instance`|可选|GitLab 实例地址。如果某个项目托管在自建 GitLab 实例上的话，你需要使用这个配置项设置实例的地址。默认值：`https://gitlab.com`|
|`pattern`|可选|用于匹配版本号字符串的正则表达式。你可以使用此配置项来过滤掉不符合条件的版本号（比如每日版本）。#1 号捕获组 _可以_ 用于捕获版本号字符串。|
|`sort_version`|可选|对版本号进行排序，而不是使用 GitLab 提供的顺序（GitLab 使用的是 tag 的**日期顺序**）。|

**举例：**

```
CHKUPDATE="gitlab::repo=fcitx/fcitx5;pattern=\d+\.\d+\.\d+;sort_version=true"
# Fractal 托管在 GNOME 自己的 GitLab 服务器上面
CHKUPDATE="gitlab::repo=GNOME/fractal;instance=https://gitlab.gnome.org"
```

## GitWeb Tags

- 类型：`gitweb`
- URL: 没有单一网址

**环境变量：**
<!--
| 名称 | 必填？ | 描述 |
|------|-----------|-------------|
-->
N/A

**配置项：**

| 键 | 必填？ | 描述 |
|-----|-----------|-------------|
|`url`|**必填**|GitWeb 仓库的网页版 URL|
|`pattern`|可选|用于匹配版本号字符串的正则表达式。你可以使用此配置项来过滤掉不符合条件的版本号（比如每日版本）。#1 号捕获组 _可以_ 用于捕获版本号字符串。|

**备注：**

- 此检查器**不支持** `cgit` 实例。
- 由于无法获知准确的发布日期，此检查器会强制**对版本号进行排序**。

**举例：**

```
CHKUPDATE="gitlab::url=https://repo.or.cz/0ad.git;pattern=^[^b]+$"
```

## 通用 Git Tags

- 类型：`git`
- URL: 没有单一网址

**环境变量：**
<!--
| 名称 | 必填？ | 描述 |
|------|-----------|-------------|
-->
N/A

**配置项：**

| 键 | 必填？ | 描述 |
|-----|-----------|-------------|
|`url`|**必填**|Git 的克隆地址 (仅支持 http/https，不支持 `git://` 协议)|
|`pattern`|可选|用于匹配版本号字符串的正则表达式。你可以使用此配置项来过滤掉不符合条件的版本号（比如每日版本）。#1 号捕获组 _可以_ 用于捕获版本号字符串。|

**备注：**

- 你可以使用此检查器检查 `cgit` 或其他 Git 在线仓库。
- 此检查器**并不会完整克隆**整个仓库，因此无需担心仓库大小。
- 由于无法获知准确的发布日期，此检查器会强制**对版本号进行排序**。

**举例：**

```
CHKUPDATE="git::url=https://git.tuxfamily.org/bluebird/cms.git"
```

## 通用网页字符串提取

- 类型：`html`
- URL: 没有单一网址

**环境变量：**
<!--
| 名称 | 必填？ | 描述 |
|------|-----------|-------------|
-->
N/A

**配置项：**

| 键 | 必填？ | 描述 |
|-----|-----------|-------------|
|`url`|**必填**|需要进行匹配的网站地址|
|`pattern`|**必填**|用于匹配版本号字符串的正则表达式。#1 号捕获组**必须**用于捕获版本号字符串。|

**备注：**

- 由于字符串提取很不可靠，因此请尽量避免使用这个检查器。
- 由于无法获知其他信息，此检查器会强制**对版本号进行排序**。

**举例：**

```
CHKUPDATE="html::url=https://repo.aosc.io/misc/l10n/;pattern=zh_CN_l10n_(.+?)\\.pdf"
```
