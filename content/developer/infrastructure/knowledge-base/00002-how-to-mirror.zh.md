+++
title = "INFRA-KB-00002：如何为我们的社区仓库建立镜像"
description = "简单介绍安同开源社区仓库的镜像方式"
date = 2020-05-04T03:36:21.001Z
[taxonomies]
tags = ["infra-kb"]
+++

首先，感谢您为我们建立镜像。

安同开源社区成立已有一段时间，如果没有众人的支持，安同开源社区将永远无法成形，在此我们感谢所有希望帮助我们的人和曾经帮助我们的人。

到目前为止，我们的软件仓库有着很多镜像（主要位于中国），我们确实需要在其它地区建立更多的镜像（尤其是美国）。如果您兴趣帮助我们，请阅读以下信息。

**注意**：安同开源社区于 2018 年 12 月 29 日迁移了软件仓库服务器。如果您在同步镜像时遇到问题，请阅读 [这篇文章](@/developer/infrastructure/knowledge-base/00003-repository-migration.md) 了解更多信息。 

# 仓库内容

仓库包括哪些内容？一般来说，关于安同开源社区的一切，大多数都和 AOSC OS 相关（例如软件包和系统映像）。一些文档，如《大陆简中自由软件本地化工作指南》，也保存在仓库中。

# 仓库大小

截止 2019 年三月，仓库占用了 800GB 的储存空间。随着时间推移，在未来可能需要占据 1TB 或更多的空间。

# 组成模块

社区仓库的 RSYNC 服务器有着下面的四个模块：

- anthon：完整的仓库，包含了软件包和系统映像。
- anthonos：和 anthon 完全一样。
- packages：排除了 AOSC OS 系统映像。
- releases: 只包含 AOSC OS 系统映像（和 [releases.aosc.io](https://releases.aosc.io/) 相同）。

我们推荐您从 `anthon` 或 `anthonos` 同步镜像。如果您没有足够的空间，也可同步 `packages`。

# 如何镜像

如果您有足够的储存空间，您可以直接从 rsync://repo.aosc.io/anthon/ 同步。

请不要从一个 IP 地址同步，如果您需要指定 IP 版本，您可以使用 v4.repo.aosc.io 或 v6.repo.aosc.io。

请注意上述仓库位于美国，如果您在中国大陆发起同步，同步速度可能会非常慢。

您可以选择从 [USTCLUG](https://mirrors.ustc.edu.cn/) 或者 [Tuna](https://mirrors.tuna.tsinghua.edu.cn/) 初始化您的镜像站点以节约时间。

当您完成了镜像站的初始化后，请发送邮件到 [mirrors@lists.aosc.io](mailto:mirrors@lists.aosc.io)，并提供您个人或机构的名字和镜像站的地址。我们将会将相关信息添加到赞助者名单中。

如果您提供公共 HTTP 服务，我们强烈建议您使用 HTTPS。

# 赞助者

主仓库由 [xTom](https://xtom.com) 提供托管支持，后备仓库由 [OSSPlanet](http://ossplanet.net/) 提供托管支持。

请移步到 [aosc.io/repo](https://aosc.io/repo) 和 [aosc.io/about](https://aosc.io/about) 查看完整的赞助者名单。

# 联系我们

如果您有任何疑问，欢迎您发送邮件到我们的邮件列表 [mirrors@lists.aosc.io](mailto:mirrors@lists.aosc.io)。
