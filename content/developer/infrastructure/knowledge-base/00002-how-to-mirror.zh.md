+++
title = "INFRA-KB-00002：如何为我们的社区仓库建立镜像"
description = "简单介绍安同开源社区仓库的镜像方式"
date = 2020-05-04T03:36:21.001Z
[taxonomies]
tags = ["infra-kb"]
+++

首先，感谢您为我们建立镜像。

安同开源社区成立已有一段时间，如果没有众人的支持，安同开源社区将永远无法成形，在此我们感谢所有希望帮助我们的人和曾经帮助我们的人。

到目前为止，我们的软件仓库已拥有数十个下游镜像（主要位于中国以及东亚地区），我们正寻求在其他的区域新增下游镜像覆盖（尤其是美国和 EMEA 区域）。如果您有兴趣帮助我们，请阅读以下信息。

# 仓库内容

仓库包括哪些内容？一般来说，关于安同开源社区的一切都包含在内，大多数都和安同 OS 相关（例如软件包、系统映像、提供给其他发行版的oma仓库等）。

# 仓库大小

截至 2026 年三月，整个 `/anthon` 的内容约占用 2.1 TiB：软件包仓库占用约 1.9 TiB，系统镜像约 167GiB，其他占用均为临时编译或打包后的零散文件、文档和其他未分类文件。

我们每月会定期清理过时的软件包，清理后软件包仓库的大小约为 2TiB 左右。请您确保您用于镜像的文件系统拥有至少 2TiB 的空闲存储空间。

# 组成模块

社区仓库的 Rsync 服务器有着下面的四个模块：

- `/anthon`：完整仓库，包含软件包和系统镜像
- `/packages`：所有安同 OS 软件包，不包含系统镜像
- `/releases`: 只包含安同 OS 系统映像（内容和 [releases.aosc.io](https://releases.aosc.io/) 相同）
- `/anthonos`：同 `/anthon`
- `/anthon-nodbg`: 同 `/anthon`，不包含调试符号包
- `/packages-nodbg`: 同 `/packages`，不包含调试符号包

我们推荐您从 `/anthon` 或 `/anthonos` 同步镜像。如果您没有足够的空间，也可视情况只从 `/packages`、`/anthon-nodbg`、`/packages-nodbg` 同步。

# 如何镜像

我们的主仓库服务器域名为 `repo.aosc.io` 。但由于主服务器带宽限制，推荐从我们的 sync-proxy 服务器同步： `rsync://repo-us.aosc.io`

{% card(type="warning") %}
我们目前使用的主仓库服务器位于中国香港，sync-proxy 服务器则位于美国洛杉矶。因此，您可能会在同步时遇到速度较慢的情况。如您有 IPv6 的因特网访问条件，您可以使用 IPv6 连接同步您的镜像。
{% end %}

您可以选择从 [USTCLUG](https://mirrors.ustc.edu.cn/) 或者 [TUNA](https://mirrors.tuna.tsinghua.edu.cn/) 初始化您的镜像站点以节约时间。

当您完成了镜像站的初始化后，请发送邮件到 [maintainers@aosc.io](mailto:maintainers@aosc.io)，并提供您个人或机构的名字、Logo 和镜像站的地址。我们将会将相关信息添加到赞助者名单中。

如果您提供公共 HTTP 服务，我们强烈建议您使用 HTTPS。

# 赞助者

目前安同 OS 的主仓库由 [Nearoute Limited](https://nearoute.io/) 提供托管支持，sync-proxy服务器由 [爱范儿](https://www.ifanr.com) 赞助。

[光圈网络 (Apernet)](https://apernet.io/)，[xTom](https://xtom.com/) 和 [OSSPlanet](https://ossplanet.net/) 为软件源仓库设施的历史赞助方。

请移步到[社区赞助方一览](https://aosc.io/sponsors) 查看完整的赞助者名单。

# 联系我们

如果您有任何疑问，欢迎您发送邮件到我们的邮件列表 [maintainers@aosc.io](mailto:maintainers@aosc.io)。
