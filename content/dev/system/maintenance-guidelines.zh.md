+++
title = "AOSC OS 维护指南（征求意见稿）"
description = "过好生活，打好包包"
date = 2020-08-06T12:50:03.911Z
[taxonomies]
tags = ["dev-sys"]
+++

# 概述

AOSC OS 是一个有着多分支的半滚动更新 Linux 发行版，具有 5000 个以上的软件包，支持多种电脑处理器架构，因此维护 AOSC OS 并不是一件容易的事。为了确保 AOSC OS 的发布质量，我们编写了下面的指南，希望所有维护者都能遵循。

# 分支、发行周期与架构

分支、发行周期与架构在 AOSC OS 维护过程中是三个非常重要的概念。在本节中，我们将在发行版的范围内提供这些概念的定义。

## 分支

AOSC OS 在同时维护下面的四个分支：

- **稳定分支**（`stable`）：一般用户应使用的分支，我们通常向这个分支推送安全更新、漏洞修复、[异常更新](@/dev/system/cycle-exceptions.md) 和 [补丁级更新](@/dev/system/known-patch-release-rules.md)。
  - 通常使用 `stable-proposed` 向 `stable` 输送上述更新（紧急情况除外，如稳定分支出现了严重的可用性问题）。
- **测试分支**（`testing`）：发烧友可以在这里获取经过**少量测试**的最新的功能性更新、安全性更新以及新软件包。在每个发行周期结束之前，此分支提供的更新会合并入稳定分支。
  - 通常使用 `testing-proposed` 向 `testing` 输送上述更新（前者也是多数软件包最初上传的地方）。
- **不稳定分支**（`explosive`）：在发行周期外接受**任何**新软件包和更新。所有人都不应该使用此分支。
  - 此分支还用于上传需要大规模重建的更新（例如 Python 3.7 ➙ 3.8）。这样做的目的是：由于 `explosive` 从未冻结，如果这些更新无法在当前发行周期发布或推送，则不会影响到其它更新。
- **RC 版内核测试分支**（`rckernel`）：作为 `stable-proposed` 的一个补充，用于测试候选版本的 Linux 内核及其工具链。

## 发行周期

AOSC OS 采用的是半滚动更新模型，通常每个发布周期都为时三个月。

- 前两个月为开发期：
  - 我们会在 GitHub 上发布迭代计划（例如 [2019 年夏季迭代计划](https://github.com/AOSC-Dev/aosc-os-abbs/issues/1896)），并由维护者实时更新迭代进展。
  - 维护者可随时为合适的分支和架构上传更新。
- 第三个月为冻结期：
  - `stable`、`stable-proposed`、`explosive` 和 `rckernel` 照常接收更新。
  - `testing` 将不再接受除了安全更新和漏洞修复之外的其它更新。
  - `testing` 将作充分的测试以准备合并入 `stable`。

## 架构

AOSC OS 支持多种电脑处理器架构，适配多种设备。然而，AOSC OS 对不同架构提供的支持不一定完全相同：

- AMD64（`amd64`，也被称为 x86_64)
  - 此架构是我们最为关心的架构。
  - 所有软件包在构建时都将针对此架构进行测试。
  - 当我们为 `explosive` 分支构建更新时只考虑此架构。
- AArch64（`arm64`）、ARMv7（`armel`）、Little Endian POWER（`ppc64el`）以及 RISC-V（`riscv64`）
	- 所有软件包在打包时都应该提供适用于这些架构的版本，除非确实无法构建。
  - `explosive` 分支不适用于上述架构。
- Big Endian PowerPC 32/64-bit（分别为 `powerpc` 和 `ppc64`）以及 i586（`i586`）
	- 这些架构属于 AOSC OS/Retro 项目的一部分，不适用到目前为止指定的所有规则。
  - 我们只为这些架构提供 `stable` 分支，并提供在旧硬件上可用的有限的软件包。

# 实践与行动

本节列出了 AOSC OS 维护者应遵循的事项。

## 工具集

所有软件包维护者都应该使用下面的标准工具集以保证软件包的可用性和构建流程的可重现性。

- [Autobuild3](https://github.com/AOSC-Dev/autobuild3)：软件包构建工具，它将复杂的构建过程和软件包元数据抽象成了 Autobuild3 清单。
- [ACBS](https://github.com/AOSC-Dev/acbs)：以树状方式组织和管理 Autobuild3 清单，详情请查看 [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs)。
- [Ciel](https://github.com/AOSC-Dev/ciel)：管理用于打包工作的 `systemd-nspawn` 容器。支持 Autobuild3/ACBS 配置以及容器系统升级、配置和回滚。
- [pushpkg](https://github.com/AOSC-Dev/scriptlets/tree/master/pushpkg)：一组用于将软件包上传到 [软件仓库](https://repo.aosc.io) 的脚本。

你可能需要一个 LDAP 凭证来上传软件包或访问我们的中继服务器（[Buildbots](@/infra/buildbots.md)）。

## Buildbots

尽管你可以使用上面提到的工具在自己的设备上打包，社区也提供了一些高性能机器供维护者使用。

要了解更多，请参阅社区维基 [Buildbots](@/infra/buildbots.md) 一文。

## 软件包接收

原则上，AOSC OS 允许任何类型的软件包进入其软件仓库，但以下情况除外：

- 供应商或上游不允许我们分发该软件或在 [软件包样式指南](@/dev/system/package-styling-manual.md) 要求的情形下不允许我们修改文件路径。
- 供应商或上游拒绝或没有提供安全漏洞修复。
- 该包已被供应商或上游弃用。
- 维护者投票反对引入（或维护）该软件包。

## 构建环境

在构建软件包时，构建环境**必须**是可控的、最新的且最小化的，只有待构建软件包的构建时依赖和运行时依赖应该被安装。

- 在为 `stable` 构建软件包时，请确保在你只启用了 `stable` 而没有启用其它分支；为 `explosive` 构建软件包时，则请确保你启用了 `explosive`、`testing-proposed`、`testing`、`stable-proposed` 和 `stable`；为其它分支构建软件包同理。
- 作为例外，为 `stable-proposed` 和 `rckernel` 构建软件包时只应该启用 `stable` 分支。

## 分支合并

在 AOSC OS 的维护中，分支合并是双向的。

### 正向合并

正如上面所述，正向分支合并是为各个分支引入更新的主要手段，具体的合并规则如下：

- 在发行周期的开发期，分支合并的方向是 `testing-proposed` → `testing`；`rckernel` → `stable-proposed` → `stable`。
- 在发行周期的冻结期：允许 `rckernel` → `stable-proposed` → `stable` 分支合并，而其它的合并都不允许。
- 在每个发行周期结束时，会进行一次完整的合并 `explosive` → `testing-proposed` → `testing` → `stable-proposed` → `stable`。

### 反向合并

反向合并，也就是 `stable` → `stable-proposed` → `testing` → `explosive` 这样的合并应当定期进行。反向合并无需考虑循环周期，但是在合并期间需要发布公告以避免合并过程出现问题。

`rckernel` 分支应该按照以下规则定期反向合并：`stable` → `stable-proposed` → `rckernel`。

## 稳定分支更新

`stable` 分支的更新都应该通过 `stable-proposed` 分支提交、构建和测试，除非 `stable` 中的软件包已经出现了严重的可用性问题或被发现有零日安全漏洞。

稳定分支更新按照以下的流程从 `stable-proposed` 合并入 `stable`：

- 协调世界时每周六凌晨，生成一个包含所有已经在 `stable-proposed` 提交并构建的软件包的清单，并利用 GitHub Issue 发布出来。
  - 软件包名称，版本增量（例如 1.0.2 → 1.0.3）和变更日志（一个指向至 [AOSC OS 软件包页](https://packages.aosc.io) 的链接）。
  - 每个条目均设置一个复选框。
- 对每一个软件包分别进行测试。
  - Autobuild3/ACBS 自动测试（TODO）。
  - 可用性检查（确认该软件可以运行，文件无缺失，文档完备）。
  - 根据  [软件包样式指南](@/dev/system/package-styling-manual.md) 检查样式。
- 对于通过测试的软件包，勾选相应条目复选框，然后将其移动到 `stable` 仓库（通过一个移动一个）。
- GitHub Issue 将保持打开状态以供维护者跟踪测试工作，直到所有软件包移动完成（所有复选框均被打勾）。