+++
title = "AOSC OS/Retro：面向用户与维护者的介绍（征求意见稿）"
description = "在古董设备上使用 AOSC OS"
date = 2020-08-10T13:11:31.085Z
[taxonomies]
tags = ["sys-retro"]
+++

这个页面的主要用途是介绍 AOSC/Retro 的设计规范和维护目标。想要了解这个分支的基本理念，请阅读 [这个页面](@/sys/retro/rationale.md)。

# 设计规范

无论是从用户体验的角度，还是从维护的角度出发，AOSC OS/Retro 都是标准的 AOSC OS 发行版。但是依赖关系、特性和维护计划会和主线版本有所不同。简而言之，AOSC OS/Retro 将：


- 只为有限的古董架构提供支持。
- 和主线版本共享同一 [软件包树](https://github.com/AOSC-Dev/AOSC-os-abbs/) 和 [系统核心组件](https://github.com/AOSC-Dev/AOSC-os-abbs/blob/stable/README.CORE.md)。
- 和主线版本共享同一维护工具集。
- 为了节省存储空间和内存，对软件包特性进行精简。
- 和主线版本相比，提供不同的变种版本。
- 在多数情况下，更新速度会慢于主线版本。

下面，我们将展开介绍 AOSC/Retro 和主线版本的共同点和不同点。

## 目标架构与设备

AOSC OS/Retro 目前为下面的架构与设备提供支持：

- 32 位的 Intel 80486 和与其兼容的（IBM）Personal Computers（不需要浮点运算单元）以及 Personal System/2（PS/2）。
- 32 位的基于 Big Endian PowerPC 的 Apple Macintosh 电脑（需要有 [New World ROM](https://en.wikipedia.org/wiki/New_World_ROM) 支持）。

## 维护工具集

AOSC OS/Retro 是 AOSC OS 的一个分支，而不是 AOSC OS 的派生版本，它将和主线版本共享软件包树、系统核心组件以及维护工具集：

- 软件包树：[aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs) 的 [`retro`](https://github.com/AOSC-Dev/aosc-os-abbs/tree/retro) 分支。
    - 这意味着 AOSC/Retro 会使用 systemd 作为初始化系统。事实上我们曾在一台搭载 Intel Pentium 75MHz 处理器，有着 16MiB RAM 和 810MiB HDD 的 Toshiba T4900CT 上做过测试，systemd 确实能良好地工作。
- AOSC OS Core 是被共享的，但只有适用于 AOSC OS/Retro 的更新会被同步到 `retro` 分支。详见 [维护计划](#维护计划).
- 打包工具和维护工具：
    - [Autobuild3](https://github.com/AOSC-Dev/autobuild3)，用于运行构建脚本。
    - [ACBS](https://github.com/AOSC-Dev/acbs)，用于软件包树管理和打包。
    - [Ciel](https://github.com/AOSC-Dev/ciel)，用于容器管理。
    - [一些实用脚本](https://github.com/AOSC-Dev/scriptlets)。

## 依赖项

考虑到 AOSC OS/Retro 通常被安装在储存空间较少且性能较差的设备上，所以和主线版本不同，我们只会为 AOSC OS/Retro 提供启用了最小功能集的软件包：

- 最小化系统需要的所有软件包（包括 `admin-base`、`boot-base`、`core-base`、`editor-base`、`kernel-base`、`network-base`、`systemd-base`、`util-base` 和 `web-base`）不得通过依赖关系引入 Python（`python-2`、`python-3`）和 Perl（`perl`）。
- 在非必要情况下，语言绑定（Java、Perl、Python 等等）默认不启用。 
- Glibc 仅启用 `C` 和 `C.UTF-8` 区域支持，其他区域支持需要用户在 `/etc/locale.gen` 反注释相关行以启用。
- 移除所有可选依赖项，除非该软件包是 [核心软件包](https://github.com/AOSC-Dev/AOSC-os-abbs/blob/groups/build-core) 或经维护人员讨论决定不作移除。
- 所有软件包均应在启用链路时间优化的情况下构建，除非此类优化会导致构建失败。
- 非性能关键型应用将使用 `-Os`优化级别来构建（即在 `autobuild/defines` 中使用 `AB_FLAGS_OS=1`），以节省储存空间。 
- 我们会提供 Manpage 和 Texinfo 文档，但不会提供所有其它形式的文档（例如 HTML、gtk-doc 等等）。
- 在没有 Dracut 的情况下也应当可以正常引导 Linux 内核（除非启用了 RAID），系统不预装 Dracut。 

## 发行版特性

AOSC OS/Retro 将提供两个版本，Base 和 Base/X11。

- Base 版本包含一个最小的可引导的命令行系统，包含系统管理、文本编辑、网络连接、电源管理、文档查看等所必需的工具。
- Base/X11 版本包含一个最小的可引导的图形化系统，除了 Base 版本提供的软件外，还提供一个基于 X11 的桌面环境和一些实用的图形化工具。
- 两个版本均提供本地化支持（只需启用了相应的 Locale）以及通用、原生的 Linux 内核，并使用 NetworkManager 作为网络管理工具。

具体而言，Base/X11 将额外提供以下的附加组件（仅供参考）：

- 桌面环境：带有面板的 IceWM。
    - 选择 IceWM 是因为它轻量、界面美观、对中日韩语言支持良好。
- 字体：标准 X11 字体（点阵）和 Unifont（点阵和矢量）。
    - Unifont 为 Unicode 文本显示提供了良好的支持。
- 音频和视频：MPV 和 Cmus；FFmpeg；PulseAudio。
    - 选择 MPV 是因为它采用基于 SDL2 的轻量级界面，且支持 FFmpeg。
    - 选择 Cmus 是因为它采用基于 curses 的 UI，将对图形硬件的需求最小化。
    - PulseAudio 则是跨设备和跨应用程序音频支持的标准。
- 图像查看器：Feh。
    - 选择 Feh 是因为它采用基于标准 X11 部件的轻量级界面。
- 网络浏览器：Dillo、w3m 和 Lynx。
    - 选择 Dillo 是因为它采用 FLTK 轻量级界面，并支持 HTML5。
    - w3m 和 Lynx 则是作为 `web-base` 元软件包的一部分提供的。

你还可以从 [软件仓库](https://packages.aosc.io/) 获取其它的软件包，如 Firefox 和其它可选的桌面环境。但是，在安装的时候我们可能需要对你的 AOSC OS/Retro 设备进行一些硬件环境的检测（举个例子，如果我们检测到你的电脑不支持 SSE2 SIMD 而你在试图安装 Firefox，我们将中止你的安装）。

## 维护计划

<!-- Note from bobby285271: If you want to edit the heading of this chapter, please update the links in the "维护工具集" chapter accordingly. -->

AOSC OS/Retro 将与主线版本共享一颗 [软件包树](https://github.com/AOSC-Dev/aosc-os-abbs/)，在 [`retro`](https://github.com/AOSC-Dev/aosc-os-abbs/tree/retro/) 分支上进行维护。然而，考虑到维护者的精力有限，以及目标设备的寿命长短和可用性，AOSC OS/Retro 会遵循长达一年的更新周期。

每个更新周期开始的时候，`retro` 分支将合并自来自主线发行版的 `stable` 分支的更新（`stable`=>`retro`）。在下一个更新周期开始前，不再进行合并。`retro` 分支中的软件包版本将维持不变，除非：

- [补丁级别更新](@/developer/system/known-patch-release-rules.md) 可用。
- 带有重大安全修复的版本更新可用。这种情况下可以从 `stable` 分支进行 [Cherry Pick](https://git-scm.com/docs/git-cherry-pick) 操作以选择性合并。

在每个年度周期结束时，我们会在 [下载页面](https://aosc.io/downloads/) 提供新的 Tarball，以及一份包含了所有系统更新的本地软件仓库 CD 镜像文件。完整的 AOSC OS/Retro 软件仓库也将以 Tarball 或 CD/DVD 镜像的形式提供。 

# 维护目标

我们基于一定的性能、储存和网络条件维护 AOSC OS/Retro，因此本章还将提及 AOSC OS/Retro 的系统需求。

## 通用指标

- AOSC OS/Retro 的 Base 版本应该可以安装在 540MB 硬盘上，Base/X11 版本应该可以安装在 1.2GB 的硬盘上。
    - 安装系统后，应该有足够的空间用于内存交换和系统更新。
- 假设用户已经取得了软件仓库的拷贝，正常使用 AOSC OS/Retro 的时候应该不需要任何形式的网络访问。
- AOSC OS/Retro 应支持常见的 ISA/EISA（PCMCIA）、PCI（CardBus）、PCI Express（ExpressCard）、SCSI 以及USB（1.1/2.0）、PS/2、串行和并行外围设备。
- AOSC OS/Retro 应支持拨号、10/100/1000Mbps 以太网以及 802.11a/b/g/n/ac 无线连接。
- AOSC OS/Retro 应可以从基于 IDE/EIDE/CE-ATA/SATA/SCSI 的硬盘启动（并支持 SCSI 配置）。AOSC OS/Retro 也应可以从 USB、光学媒体或其他形式的外部/可移动存储启动（但这将不会得到官方支持）。 

## 系统要求（x86）

在 32 位 x86 架构，AOSC OS/Retro 的 Base 版本有以下的系统要求：

- 处理器：Intel 80486（或与此兼容的处理器），不对浮点运算单元作要求。
- 系统总线：ISA、EISA、PCI 或者基于 PCI Express 的系统设备。我们不支持 MCA（Micro Channel Architecture）。
- RAM：16MiB（32MiB 交换空间）。
- 储存空间：540MB（~514MiB）。
    - PCI 总线主控 DMA 可以显著提高系统性能。
- 输入设备：PS/2 或 Serial Port 键鼠。不对鼠标作要求。
- 显示设备：VGA（或与其兼容的设备），或串行终端。

AOSC OS/Retro 的 Base/X11 版本有以下的额外的系统要求：

- 处理器：Intel 80486（或与此兼容的处理器），不对浮点运算单元作要求。
    - Intel Pentium II 233MHz、AMD K6、Cyrix MediaGX、Via C7 或以上将显著改善图形体验。
    - 如果你有使用 MPV 播放视频的需要，那么推荐 Intel Pentium III 500MHz, AMD K6-II/III 或以上。
- 系统总线：ISA、EISA、PCI 或者基于 PCI Express 的系统设备。我们不支持 MCA（Micro Channel Architecture）。
- RAM：32MiB（32MiB 交换空间）。
    - 如果你有浏览互联网的需要，那么推荐 128MiB 或以上。
- 储存空间：1.2GB（~1141MiB）。
    - 如果你有储存多媒体文件的需要，那么推荐 4.0GB（~3814MiB）或以上。
    - PCI 总线主控 DMA 可以显著提高系统性能。
- 输入设备：PS/2 或 Serial Port 键鼠。
    - I2C 和 Serial Port 可为触摸屏提供支持。
- 显示设备：VGA（或与其兼容的设备）。
    - 不推荐使用 ISA/EISA 显卡，VESA Local Bus 将显著改善图形体验。
    - 推荐使用 PCI 和 PCI Express 显卡，特别是带有 OpenGL 2.1 支持的显卡（通常在 2002 年后生产）。

## 系统要求（PowerPC 32-bit，Big Endian）

AOSC OS/Retro 的 Base 版本和 Base/X11 版本应该都能在使用这个架构的任一设备上使用，即支持所有基于 PowerPC 架构带有 New World ROM 支持的 Apple Macintosh 计算机。

- 便携式计算机：
   - PowerBook G3 "Lombard" 和 "Pismo" 系列。
   - iBook G3, iBook G4, PowerBook G4 系列。
- 台式计算机：
   - Power Macintosh G3 "Blue 和 White" 系列。
   - Power Macintosh G4 和 G5 系列。
   - iMac G3 和 G4 系列。
   - eMac 系列。
   - G4-based Mac Mini 系列。
   - G4- 和 G5-based Xserve 系列。
