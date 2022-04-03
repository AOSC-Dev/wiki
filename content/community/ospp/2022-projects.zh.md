+++
title = "开源软件供应链点亮计划暑期 2022 项目"
description = ""
date = 2022-04-02
[taxonomies]
tags = ["ospp"]
+++

欢迎！以下是 AOSC 提供的可供参与的项目主题。您可以从中挑选并联系项目导师，也可以在[社区 IRC][irc]、[Telegram 群组][tg]、[Discord][discord]，或[邮件列表][mlist]（随意）中和我们讨论您感兴趣的话题。

> 请先仔细阅读[学生指南][guide]。

[irc]: ircs://irc.libera.chat:6697/aosc
[tg]: https://t.me/joinchat/BMnG9zvfjCgZUTIAoycKkg
[discord]: https://discord.gg/VYPHgt9
[mlist]: mailto:discussions@aosc.io
[guide]: https://summer.iscas.ac.cn/help/student/

# 自由及开源软件简中本地化工作

当前我国国内有相当数量的 Linux 及各大开源或自由软件 (F/OSS) 使用者，但在使用过程中，用户们不难发现，各种软件的简中翻译及本地化质量参差不齐，错漏繁多。尤其主流桌面环境如 GNOME 及 KDE 简中翻译率并不理想，GIMP 和 Inkscape 这类常用应用的本地化质量相对较低；而我社的 Wiki 站点简中文档翻译也时常欠完整或更新。该项目的主要目的是改善当前开源或自由软件的本地化质量及覆盖率。

- 项目难度：进阶 [暂定]
- 项目社区导师：白铭骢
- 导师联系方式：jeffbai@aosc.io
- 项目产出要求：
  - 完善（或改善，如时间不足）现有开源软件的简中翻译，包括但不限于 CUPS、GNOME、Plasma、MATE Desktop 及 NetSurf（其余项目根据考察决定）。学生可自选 1 - 2 个项目，或由导师推荐。
    - 导师推荐如下目标项目（最终计划以学生及导师协商结果为准）：完善 KDE、GIMP 及 Inkscape 的简中本地化；若学生对文史创作类的本地化有兴趣，亦可考虑完善回合制对战游戏《韦诺之战》(Wesnoth) 的简中本地化。
  - （如有额外时间）更新或完善社区 Wiki 站简中文档翻译。
  - （如有额外时间）审阅并修改现行[大陆简中自由软件本地化工作指南（1.5.4 版）][l10n-guide]，修改后通知各大陆简中 (zh_CN) 翻译小组及社区。
- 项目技术要求：
  - 通读[大陆简中自由软件本地化工作指南（1.5.4 版）][l10n-guide]，熟知大陆简中标点、句式及选词规范及技巧。
  - 了解主要本地化软件框架（如 [GNU Gettext][gettext]）及工具（如 [Poedit][poedit] 及 [Lokalize][lokalize]。
  - 其余工作流程及技巧将于项目期间沟通及培训。
- 相关的仓库：
  - https://github.com/AOSC-Dev/translations
- 开源协议：视上游项目而定

[l10n-guide]: https://repo.aosc.io/aosc-l10n/zh_CN_l10n_1.5.4.pdf
[gettext]: http://www.gnu.org/software/gettext/
[poedit]: https://poedit.net/
[lokalize]: https://kde.org/applications/office/org.kde.lokalize/


# 全志 RISC-V 芯片主线化开发工作

全志 D1 是一款基于 XuanTie C906 RISC-V 核心的 SoC。本项目将对该芯片进行 U-Boot 的主线化开发工作。

- 项目难度：进阶
- 项目社区导师：郑兴达
- 导师联系方式：icenowy@aosc.io
- 项目产出要求：
  - 完成该芯片的基本 U-Boot 功能，能够启动 Linux ，并将相关上游代码进行整理以提交。
  - 如 U-Boot 本体成功完成，尝试基于其实现 SPL，及实现显示支持。
- 项目技术要求：
  - 编译交叉工具链（可使用现成工具）和内核。
  - 使用 Git 代码管理（使用 commit, rebase 等操作）。
  - 编写 C 语言代码（能参照现有内核代码编写新设备的驱动代码）。
  - 使用英语与上游项目或社区交流（编写提交信息 \[commit message\]，在邮件列表上接受补丁审阅 \[patch review\]）。
  - 了解 RISC-V 指令集（能看懂 GCC 输出的汇编代码）。
- 相关的开源软件仓库列表：
  - https://source.denx.de/u-boot/u-boot
- 开源协议：跟随相应上游项目部分的代码，主要是 GPL；存在 GPL + 其他授权双授权 (dual licensing) 的情况（如 device tree source 或 binding）。

# AOSC OS 的 LoongArch 移植

龙芯在去年六月推出基于 LoongArch 架构的龙芯 3A5000 处理器，本项目的目标是为 AOSC OS 制作针对 LoongArch 的新移植。

- 项目难度：进阶
- 项目社区导师：傅孝元
- 导师联系方式：sakiiily@aosc.io
- 项目产出要求：
  - 为 [Autobuild](https://github.com/AOSC-Dev/autobuild3/) 设定 LoongArch 架构的标准编译优化、系统类型 (tuplet) 及包管理配置。
  - 结合 [Linux From Scratch](https://www.linuxfromscratch.org/) 及 AOSC OS 的[维护指南](https://wiki.aosc.io/developer/packaging/package-styling-manual/) 构建基本系统。
  - 如时间允许，构建可启动系统并制作标准发行供其他用户使用。
- 项目技术要求：
  - 熟悉 AOSC OS 的基本构建和维护工具，包括 [Autobuild3](https://github.com/AOSC-Dev/autobuild3/)，[ACBS](https://github.com/AOSC-Dev/acbs/) 及 [Ciel](https://github.com/AOSC-Dev/ciel/)。
  - 基本理解 [Linux From Scratch](https://www.linuxfromscratch.org/) 的流程及原理。
  - 熟悉 AOSC OS 的[维护指南](https://wiki.aosc.io/developer/packaging/package-styling-manual/) 。
  - 熟悉 Bash 语法。
  - 制作或改写补丁。
  - 使用英语与上游项目或社区交流（编写提交信息 \[commit message\]，在邮件列表上接受补丁审阅 \[patch review\]。
- 相关的开源软件仓库列表：
  - https://github.com/AOSC-Dev/aosc-os-abbs
- 开源协议：跟随相应上游项目部分的代码。

# AOSC 的软件包信息站重实现

AOSC 的软件包信息站现已与目前 AOSC OS 的构建系统和元数据格式严重脱节。需要一个新的网站后端与数据同步系统的实现。

- 项目难度：进阶
- 项目社区导师：刘子兴
- 导师联系方式：liushuyu@aosc.io
- 项目产出要求：
  - 实现一个全新的网站后端，可以正确地解析所有 AOSC OS 软件包的元数据。
  - 实现一个新的数据同步后端，需要能正确地解析所有 AOSC OS 软件包元数据以及 abbs 树中的所有软件包信息。
  - 新实现的后端需要能承受较大的请求吞吐量。
- 项目技术要求：
  - 后端和同步系统需要使用 Rust 和/或 Python 实现。
  - 需要对 AOSC OS 的基本构建和维护工具有基础了解。
  - 熟悉 PostgreSQL 和 SQLite 数据库系统。
  - 较为熟悉 Bash 语法。
- 相关的开源软件仓库列表：
  - https://github.com/AOSC-Dev/aosc-os-abbs
  - https://github.com/AOSC-Dev/packages-site
- 开源协议：GPLv2

# AOSC Wiki 缺失文档条目补全和现有文档更新

AOSC Wiki 目前尚缺失大量社区项目的文档，以及存在大量过期信息和条目。需要更新已有条目及增改未记录项目的文档条目。

- 项目难度：进阶 [暂定]
- 项目社区导师：吴楷阳
- 导师联系方式：origincode@aosc.io
- 项目产出要求：
  - 为工作单内的项目或功能更新或新增内容，尽可能保证英文版本的 Wiki 内容为最新。
- 项目技术要求：
  - 有足够英语写作能力，熟悉计算机、Linux 相关术语。
  - 熟悉 Markdown 的编写和格式规范。
  - 熟悉各类开源项目文档的查找（如 manpage、README 等）。
  - 尽可能熟悉 Rust、Python 等语言的代码。
  - 对 AOSC 当前维护和 AOSC OS 当前使用的项目有基础了解。
- 相关的开源软件仓库列表：
  - https://github.com/AOSC-Dev/wiki
- 开源协议：MIT
