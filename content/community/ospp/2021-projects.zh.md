+++
title = "开源软件供应链点亮计划暑期 2021 项目"
description = ""
date = 2021-03-21
[taxonomies]
tags = ["ospp"]
+++

欢迎！以下是 AOSC 提供的可供参与的项目主题。您可以从中挑选并联系项目导师，也可以在[社区 IRC][irc]、[Telegram 群组][tg]、[Discord][discord]，或[邮件列表][mlist]（随意）中和我们讨论您感兴趣的话题。

> 请先仔细阅读[学生指南][guide]。

[irc]: ###
[tg]: https://t.me/joinchat/BMnG9zvfjCgZUTIAoycKkg
[discord]: https://discord.gg/VYPHgt9
[mlist]: mailto:discussions@aosc.io
[guide]: https://summer.iscas.ac.cn/help/student/

# 安装程序 DeployKit 的实现

社区项目 [DeployKit][dk] 是未来 AOSC OS 的安装和恢复程序。该程序有两种模式：

1. 作为安装向导指引用户正确地安装 AOSC OS；
2. 作为系统备份/恢复工具，提供预防性备份和灾难恢复功能；

目前，DeployKit 使用 [Cursive][cursive] 和 [Rust 编程语言][rust]基本实现了安装向导的命令行用户界面（TUI）和其后端的库，但尚未实现安装向导的图形界面部分。本项目的目标是按照社区提供的 [AOSC OS 安装指引][inst-guide]，将这部分原本需要手动操作的安装流程实现到 DeployKit 上。

- 项目难度：中
- 项目社区导师：刘子兴
- 导师联系方式：liushuyu@aosc.io
- 合作导师联系方式：N/A
- 项目产出要求：
  - 实现 DeployKit 的图形用户界面
  - 完善安装器后端库的逻辑和错误处理
  - 实现安装过程在图形用户界面上的可视化（进度展示）
- 项目技术要求：
  - 了解基本的 Linux 命令
  - 熟悉 Rust 或类似的系统编程语言，如 C 或 C++
  - 熟悉 Rust 的外部函数调用机制（FFI）以及 `unsafe` 的处理
  - 了解 GObject、GLib 和 GTK 编程（注：GTK/GLib API 文档可能不详细，已经熟悉 GTK 3 API 的学生优先）
  - 注：项目假设参与学生在报名时已对“项目技术要求”部分前三个技术较为熟悉
- 相关仓库：
  - 后端库及 TUI：https://github.com/AOSC-Dev/aoscdk-rs
  - DeployKit 参考 GUI 设计：https://github.com/AOSC-Dev/DeployKit
- 相关资源：
  - GTK 3 的 Rust 绑定：https://lib.rs/crates/gtk/ ；官方网站及新手教程：https://gtk-rs.org/
  - GTK 3 的 C API 文档：https://developer.gnome.org/gtk3/stable/
  - Gettext 的 Rust 绑定：https://lib.rs/crates/gettext-rs/
  - Gettext 的 C API 文档：https://www.gnu.org/software/gettext/
  - _The Rustonomicon_（介绍 `unsafe` 的处理）：https://doc.rust-lang.org/nomicon/
- 开源协议：[MIT](https://github.com/AOSC-Dev/DeployKit/blob/master/COPYING)

[dk]: https://github.com/AOSC-Dev/aoscdk-rs
[cursive]: https://lib.rs/crates/cursive
[gtk]: https://www.gtk.org/
[rust]: https://rust-lang.org
[inst-guide]: @/aosc-os/installation/amd64.md

# 自由及开源软件简中本地化工作

当前我国国内有相当数量的 Linux 及各大开源或自由软件 (F/OSS) 使用者，但在使用过程中，用户们不难发现，各种软件的简中翻译及本地化质量参差不齐，错漏繁多。尤其主流桌面环境如 GNOME 及 KDE 简中翻译率并不理想，GIMP 和 Inkscape 这类常用应用的本地化质量相对较低；而我社的 Wiki 站点简中文档翻译也时常欠完整或更新。该项目的主要目的是改善当前开源或自由软件的本地化质量及覆盖率。

- 项目难度：中
- 项目社区导师：白铭骢
- 导师联系方式：jeffbai@aosc.io
- 合作导师联系方式：傅孝元 <sakiiily@aosc.io>
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

# 半自动软件包退休、封存与整理系统

软件包更新在现代社会已经不再是什么稀奇事。每天，无数软件包获得更新，有些是修复漏洞，有些是增加功能，还有些是性能优化等等。
由于系统的软件包仓库由业余爱好者维护，这些被更新的包渐渐积累，成为了维护负担。
然而这些老包亦有分析价值。如果将过去的软件包收集起来，线下储存，可以用于未来的分析等活动。
因此我们设立了该项目，用于退休、封存与整理老软件包。

- 项目难度：低
- 项目社区导师：张顺然 _Staph. aureus_
- 导师联系方式：staph@aosc.io
- 合作导师联系方式：N/A
- 项目产出要求：
	- 提供一个程序用于查询哪些软件源中的包可以被封存，哪些由于已封存，可以直接丢弃，哪些应当留在仓库中。
	- 提供一个程序用于封存软件包：移除以及分类归纳为指定大小（目前为 < 25GiB）的档案夹，可能的话，最终生成 Blu-ray ISO。
	- 提供一个较高效率的方式，可以方便的使用程式查询所有已封存软件包资讯。
	- （如有额外时间）提供一个方式生成“最小软件仓库”，仅包含最新版本的软件包，占用最少的空间。
- 项目技术要求：
	- 能够阅读英文文档（语言官方文档 / API 等）。
	- 熟练使用一种语言（建议 Python）的字符串处理功能。
	- 熟练使用一种语言（建议 Python / Bash）的文件系统处理功能。
	- 了解使用该语言访问网路 API 以取得文字的功能。
	- 了解并可简单使用一种数据库（建议 SQLite）。
	- 使用较少的依赖，便于在源服务器上（无 root 的 CLI）快速部署与执行。
	- 尽量做到无人工介入完成包退休封存与整理工作。
	- 软件包查询可以使用很少系统资源与响应时间完成。
- 相关的开源软件仓库列表：
	- https://github.com/AOSC-Dev/aosc-archive
	- https://github.com/AOSC-Dev/p-vector
	- https://packages.aosc.io/qa/
- 开源协议：GPLv3 或更新版本

# 全志 RISC-V 芯片主线化开发工作

全志即将推出一款基于 XuanTie C906 RISC-V 核心的 SoC 。本项目将对该芯片进行启动固件（暂定为 U-Boot ，可根据学生兴趣换用其他方案）和 Linux 内核的主线化开发工作。
该芯片将于 4 月下旬发布，随后将发布官方开发板、SDK 及文档；本项目的开发过程中需要大量参考 SDK 代码。

- 项目难度：高
- 项目社区导师：郑兴达
- 导师联系方式：icenowy@aosc.io
- 合作导师联系方式：N/A
- 项目产出要求：
  - 完成该芯片的基本 bootloader 功能，能够启动 Linux 内核，并将相关代码提交给上游。
  - 完成该芯片的基本 Linux 移植，可以从 MMC 启动现成 Linux 发行版并在串口进行输入 / 输出。
  - 视完成情况实现各种外设的驱动。
- 项目技术要求：
  - 编译交叉工具链（可使用现成工具）和内核。
  - 使用 Git 代码管理（使用 commit, rebase 等操作）。
  - 编写 C 语言代码（能参照现有内核代码编写新设备的驱动代码）。
  - 使用英语与上游项目或社区交流（编写提交信息 \[commit message\]，在邮件列表上接受补丁审阅 \[patch review\]，如果有必要的时候面对 Linus Torvalds 或其他上游维护者的愤怒）。
  - 了解 RISC-V 指令集（能看懂 GCC 输出的汇编代码）。
- 相关的开源软件仓库列表：
  - https://source.denx.de/u-boot/u-boot
  - https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git
- 开源协议：跟随相应上游项目部分的代码，主要是 GPL；存在 GPL + 其他授权双授权 (dual licensing) 的情况（如 device tree source 或 binding）。

# AOSC OS 的 LoongArch 移植

龙芯即将在六月推出基于 LoongArch 架构的龙芯 3A5000 处理器，本项目的目标是为 AOSC OS 制作针对 LoongArch 的新移植。

- 项目难度：高
- 项目社区导师：白铭骢
- 导师联系方式：jeffbai@aosc.io
- 合作导师联系方式：N/A
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
