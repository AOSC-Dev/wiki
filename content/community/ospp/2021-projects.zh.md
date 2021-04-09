+++
title = "开源软件供应链点亮计划暑期 2021 项目"
description = ""
date = 2021-03-21
[taxonomies]
tags = ["ospp"]
+++

欢迎！以下是 AOSC 提供的可供参与的项目主题。您可以从中挑选并联系项目导师，也可以在[社区 IRC][irc]、[Telegram 群组][tg]、[Discord][discord]，或[邮件列表][mlist]（随意）中和我们讨论您感兴趣的话题。

> 请先仔细阅读[学生指南][guide]。

# 安装程序 DeployKit 的实现

社区项目 [DeployKit][dk] 是未来 AOSC OS 的安装和恢复程序。该程序有两种模式：

1. 作为安装向导指引用户正确地安装 AOSC OS；
2. 作为系统备份/恢复工具，提供预防性备份和灾难恢复功能；

目前，DeployKit 使用 [Cursive][cursive] 和 [Rust 编程语言][rust]基本实现了安装向导的命令行用户界面（TUI）和其后端的库，但尚未实现安装向导的图形界面部分。本项目的目标是按照社区提供的 [AOSC OS 安装指引][inst-guide]，将这部分原本需要手动操作的安装流程实现到 DeployKit 上。

- 项目难度：中
- 项目社区导师：刘子兴
- 导师联系方式：liushuyu@aosc.io
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

[irc]: ###
[tg]: https://t.me/joinchat/BMnG9zvfjCgZUTIAoycKkg
[discord]: https://discord.gg/VYPHgt9
[mlist]: mailto:discussions@aosc.io
[guide]: https://summer.iscas.ac.cn/help/student/

# 自由及开源软件简中本地化工作

当前我国国内有相当数量的 Linux 及各大开源或自由软件 (F/OSS) 使用者，但在使用过程中，用户们不难发现，各种软件的简中翻译及本地化质量参差不齐，错漏繁多。尤其主流桌面环境如 GNOME 及 KDE 简中翻译率并不理想，GIMP 和 Inkscape 这类常用应用的本地化质量相对较低；而我社的 Wiki 站点简中文档翻译也时常欠完整或更新。该项目的主要目的是改善当前开源或自由软件的本地化质量及覆盖率。

- 项目难度：中
- 项目社区导师：白铭骢
- 导师联系方式：jeffbai@aosc.io
- 合作导师联系方式：N/A
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
