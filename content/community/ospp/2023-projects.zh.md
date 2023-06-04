+++
title = "开源软件供应链点亮计划暑期 2023 项目"
description = ""
date = 2023-06-04
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

# [自由及开源软件简中本地化工作](https://summer-ospp.ac.cn/org/prodetail/23f3e0032?lang=zh&list=pro)

当前我国国内有相当数量的 Linux 及各大开源或自由软件 (F/OSS) 使用者，但在使用过程中，用户们不难发现，各种软件的简中翻译及本地化质量参差不齐，错漏繁多。尤其主流桌面环境如 GNOME 及 KDE 简中翻译率并不理想，GIMP 和 Inkscape 这类常用应用的本地化质量相对较低；而我社的 Wiki 站点简中文档翻译也时常欠完整或更新。该项目的主要目的是改善当前开源或自由软件的本地化质量及覆盖率。

- 项目难度：基础
- 项目社区导师：白铭骢
- 导师联系方式：jeffbai@aosc.io
- 项目产出要求：
  - 完善（或改善）现有开源软件的简中翻译，包括但不限于：CUPS，KDE 桌面环境及 Strawberry 音乐播放器。
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

# [实现 DeployKit 图形界面](https://summer-ospp.ac.cn/org/prodetail/23f3e0031?lang=zh&list=pro)

社区项目 DeployKit 是 AOSC OS 的安装和恢复程序。该程序有两种模式：

- 作为安装向导指引用户正确地安装 AOSC OS
- 作为系统备份/恢复工具，提供预防性备份和灾难恢复功能

目前，DeployKit 使用 Cursive 和 Rust 编程语言基本实现了安装向导的命令行用户界面（TUI）和其后端的库，但尚未实现安装向导的图形界面部分。本项目的目标是使用 Vue.js 3 和 WRY 框架，以一个网页应用的形式实现 DeployKit 的图形界面。

- 项目难度：进阶
- 项目社区导师：liushuyu
- 导师联系方式：liushuyu@aosc.io
- 项目产出要求：
  - 实现 DeployKit 的图形用户界面
  - 完善安装器后端库的逻辑和错误处理
  - 实现安装过程在图形用户界面上的可视化（进度展示）
- 项目技术要求：
  - 了解基本的 Linux 命令
  - 熟悉 Rust 或类似的系统编程语言，如 C 或 C++
  - 熟悉 Rust 的外部函数调用机制（FFI）以及 unsafe 的处理
  - 了解 Vue.js 3, Vite, WRY 和 TAO 框架编程
- 相关的开源软件仓库列表：
  - https://github.com/AOSC-Dev/deploykit-ui/
  - https://github.com/AOSC-Dev/aoscdk-rs
- 开源协议：MIT

# [Autobuild 3 自动化打包测试框架](https://summer-ospp.ac.cn/org/prodetail/23f3e0033?lang=zh&list=pro)

Autobuild3 是 AOSC OS 的自动构建系统。尽管目前已经有了初步的质量保障方案，但是我们希望在打包流程中，通过单元测试或集成测试对可能存在的问题（包括质量问题和缺失的可选依赖等）进行主动的检测，并与 Github Actions 提供的 CI/CD 集成。

- 项目难度：进阶
- 项目社区导师：黄烜宁
- 导师联系方式：camber@aosc.io
- 项目产出要求：
  - 实现对同一软件包的多种可能的测试用例进行测试
    使用软件包源码树带有的测试套件等进行测试，如 Pytest, `cargo test`, `go test` 等

    该要求的重点在 *多测试用例* 上

    对软件包的主可执行文件（二进制、脚本等）进行冒烟测试

    进阶：实现对带有图形界面的应用程序的冒烟测试
  - 实现测试信息写入包的元数据：即在软件包中加入标记该软件包测试结果的Tag
  - 输出人和机器可读的测试报告
  - 允许通过软件包元数据的配置，忽略特定上游的已知问题
    即测试仍然需要运行，如出现不通过的情况视为通过
  - 对 AMD64 架构实现与 GitHub Actions 的集成
- 项目技术要求：
  - 熟悉基本的 Linux 命令，以及 Linux 系统的运作方式。
  - 熟悉基于 dpkg/apt 的软件包管理，或是有任意发行版的软件包打包经验
    在参与项目前，需要对 AOSC 所使用的打包基础框架，如 ACBS、Ciel-rs、和 Autobuild3 的工作原理和源代码有基础的了解

    了解其他发行版如何进行软件包集成测试，如 `PKGBUILD` 的 `check()`

    加分项：有为 AOSC OS 贡献过包的优先考虑
  - 熟悉 Bash、Python等脚本编程语言
    加分项：了解 Rust 语言（Ciel-rs 使用）
  - 了解软件测试方法
- 相关的开源软件仓库列表：
  - https://github.com/AOSC-Dev/autobuild3
- 开源协议：GPL-2.0
