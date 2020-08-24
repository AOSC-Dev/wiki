+++
title = "软件包站点"
description = "关于软件包站点的一切"
date = 2020-08-22T13:33:04.733Z
[taxonomies]
tags = ["infra"]
+++

# 软件包站点

基于 [paklist](https://github.com/AOSC-Dev/paklist) 的 AOSC OS [软件包站点](https://packages.aosc.io/) 在 2017 首次推出，旨在展示软件仓库及软件包信息。

## 用法

### 面向用户

- "Latest Source Updates" 板块：展示了 Git 仓库中最新的提交。
- "Repositories and Trees" 板块："repositories" 指代的是 DPKG 仓库而 "trees" 指代的是 ABBS 仓库。"Ghost" 指代一个软件在 DPKG 仓库而不在 ABBS 仓库中。"Lagging" 指代的是 ABBS 仓库中某个软件的最新版本缺失对应的二进制包。"Missing" 指代的是一个软件在 ABBS 仓库而不在 DPKG 仓库中。"Source Tree" 中的链接指向相应的 GitHub 页面。"Outdated" 指代的是一个软件在上游有新版本可用。点击表格上的数字，你会得到相应的软件清单。
- 软件包详情页中的 Changelog 由 Git 提交记录自动生成。
- 可以在 https://packages.aosc.io/query/ 使用受限的 SQL 语句进行查询。如果你有生成自定义报告的需要，这个页面将会在很大程度上帮到你。

### 面向机器

- 将请求参数设置为 `?type=json`或者使用 `X-Requested-With: XMLHttpRequest` 请求头即可得到一个 JSON 响应。你可以使用 `page=?` 来分页，或者使用 `page=all` 来禁用分页。
- 获取 API 版本：https://packages.aosc.io/api_version
- 获取软件包列表：https://packages.aosc.io/list.json
- 获取 SQLite3 数据库拷贝：https://packages.aosc.io/data/abbs.db 以及 `piss.db`。
- 获取可以被清理的 DEB 包列表：https://packages.aosc.io/cleanmirror/(repo)，其中 `(repo)` 可以被替换为 `amd64` 或 `amd64/testing` 等仓库。

## 项目框架

这个网站由数个子项目组成，大部分项目使用 Python 实现。部分子项目可被单独使用。

### abbs-meta

[abbs-meta](https://github.com/AOSC-Dev/abbs-meta) 通常用于从 ABBS 树及其 Git 仓库中提取信息。首先，它使用 `reposync.py` 把 Git 仓库转换成 Fossil 仓库。我们使用 Fossil 是因为 Git API 难以使用且外部调用和文件写入效果都不尽人意，而且 Fossil 的数据库也很容易直接使用。然后，我们根据各个提交更新 `abbs.db`，以保存历史记录。这个操作将修改 `package_*` 数据表。从头开始同步可能需要十个小时。`bashvar.py` 可以解析大多数配置文件。当有复杂的字符串操作时，它会自动调用 BASH。还有一些工具可以添加校验和（`addchksum.{py，sh}`）和修改修订号信息（`increaserel.py`）。

### packages-site

[packages-site](https://github.com/AOSC-Dev/packages-site) 是站点的后端部分。`dpkgrepo.py` 用于记录 DPKG 软件包信息。这个操作将修改 `dpkg_*` 数据表。软件包来源定义位于 `dpkgrepo.py`。`update.sh` 用于数据更新。网站每小时更新一次。因为代理、CDN、浏览器缓存的原因，因此延迟可能长达两小时。`main.py` 是站点的入口文件，我们用 [Bottle](https://bottlepy.org/) 框架和 Jinja2 模板系统。我们使用大量 SQL 语句生成各种报告，并使用 SQLite 的拓展实现版本比较，你可能需要首先使用 `make` 来构建这些拓展。

### piss

[PISS](https://github.com/AOSC-Dev/piss)（全称 "Projects Information Storage System"）是一个软件版本检查器。对于 `abbs.db` 中列出的每一个软件包，它首先根据 URL 猜测上游类型，然后最多执行两个请求来获得版本列表、标签列表或文件列表。为了从列表中获得最新版本，PISS 使用了大量的启发式搜索。接下来 PISS 会将信息存储在 `piss.db`。如果所有的猜测都是错误的，它就会转而使用 [release-monitoring.org](https://release-monitoring.org/)。数据库每四小时更新一次。 

### 相关项目

- [gumblex/bottle-sqlite](https://github.com/gumblex/bottle-sqlite)：带有自定义函数、排序、聚合、拓展支持的 Bottle SQLite 插件。
- [gumblex/htmllisting-parser](https://github.com/gumblex/htmllisting-parser)：解析 NGINX、APACHE 和其它 WEB 服务器生成的目录列表。
- [gumblex/fossilpy](https://github.com/gumblex/fossilpy)：为 Python 提供 Fossil 仓库的只读支持。 

## 部署

我们建议你预留至少 1GiB 的可用空间（当前使用量是 450 MiB）及至少 512MiB 的 RAM（实际使用不会超过 100M）。另外你需要安装 Python 3.5+ 或 PyPy3.5、带有 FTS5 支持的 SQLite3、Fossil 2.6+、bash 和 Git。

我们目前使用 uWSGI 和 NGINX 来托管网站，请前往 https://github.com/AOSC-Dev/packages-site#deploy 了解部署流程。接下来你还要为 `update.sh` 和 PISS 设置 Systemd Timers。

## 计划

> 请查看 [英文页面对应部分](@/infrastructure/packages-site.md#plans) 查看实时内容。
{.is-info}


# 常见问题

## 站点无法访问

请尝试访问镜像站点 https://aoscpkgs.gumble.pw/ ，接下来烦请在 Telegram 群中联系站点管理员 @gumblex 反映问题。 

## 站点数据过期

请先访问 https://packages.aosc.io/aosc-os-abbs/timeline 看看是否为 git-to-fossil 同步问题，然后访问 https://packages.aosc.io/updates 看看同步是不是真的出了问题。如果是 git-to-fossil 同步不工作，那么问题通常由强制推送或变基操作导致的。如果不是这样的话，烦请联系站点管理员反馈问题。

## 某个软件包不是最新的

如果你确认软件包站点同步功能工作正常（见上文），你的更新包可能在 `bugfix` 分支中。虽然目前软件包站点不显示任何关于 `bugfix` 分支的信息，但这些信息在我们的数据库中会有很好的记录。我们也欢迎你在 Telegram 群或邮件列表中向我们提供有关「如何重新设计软件包站点以支持此类分支的展示」的建议。

## 上游版本是错的

PISS 大量使用到了启发式搜索，主要依赖 Anitya 库，因为问题不一定是我们造成的。我们已经在尽可能地改进搜索模型并为该模型提供尽可能多的信息（目前我们提供软件包名称、当前版本、URL、源码包类型等）。

## 为什么没有依赖关系图

因为依赖关系实在过于庞杂。
