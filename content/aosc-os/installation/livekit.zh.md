+++
title = "LiveKit 用户指南"
description = "使用 LiveKit 安装及维护 AOSC OS"
date = 2020-05-04T03:37:11.499Z
[taxonomies]
tags = ["sys-installation"]
+++

{% card(type="warning") %}
本指南中展示的安装步骤仅适用于**最简系统配置**，该配置将系统安装至单个 ext4
分区。如果您希望在多分区、RAID 或加密分区上安装 AOSC OS，请参阅我们的[手动安装指南](@/aosc-os/installation/manual/)。
{% end %}

除介绍如何创建 LiveKit 介质外，本指南展示两种 LiveKit 的典型用例：安装及维护
AOSC OS。LiveKit 是一个针对可移动设备创建的 AOSC OS 变种（即 Live 环境），
提供一份独立及完整的，针对 U 盘及光盘的系统环境。

创建 LiveKit 介质
=================

创建 LiveKit 介质非常简单。本章节介绍如何在 Linux（或其他提供 `dd` 命令的 *nix
操作系统），Windows 及 macOS 上使用 U 盘创建 LiveKit 介质。如需创建 LiveKit
启动光盘，使用刻录工具烧录从[下载页面](https://aosc.io/zh-cn/downloads/)获取的
.iso 文件即可。

Linux，*nix 及 macOS
--------------------

在使用 `/dev/sdXY`（X 是用字母指代的设备编号，Y 是用数字指代的分区编号）设备名
的操作系统中，请先辨认 U 盘的设备名（使用 `lsblk`或 `ls /dev/sd*` 均可），然后
**使用 root 用户**运行如下命令：

```
# aosc-os_livekit_$DATE_$ARCH.iso，$DATE 为发布日期，$ARCH 为 LiveKit 架构。
# 请根据您下载的 LiveKit iso 文件填入文件名。
dd if=aosc-os_livekit_$DATE_$ARCH.iso of=/dev/sdXY status=progress
sync
```

在如 macOS 等不使用如上设备名格式的操作系统中，写入 LiveKit 的方式大致相同：先
辨认 U 盘设备名（macOS 可在终端应用中使用 `diskutil list` 命令列出存储设备），
然后使用**超级用户权限**运行如上两个命令。

Windows
-------

因为 Windows（尤其 Windows 10 以前的版本）下一般没有使用 `dd` 或辨认存储设备
名的简便方式，我们推荐使用 [Rufus](https://rufus.ie/zh/) 创建 LiveKit 介质。

请访问 Rufus 主页了解具体使用方式。

启动 LiveKit
============

在启动 LiveKit 前，我们建议检查及确定几个常见问题和情况：

LiveKit 支持哪些设备？
---------------------

LiveKit 支持在如下几种设备上启动：

- 基于 BIOS 或 (U)EFI 的 x86_64 及 i486 设备。
- 基于 (U)EFI 或经 SBSA 及 SystemReady ES 认证的 AArch64 设备。
- 基于 OpenFirmware 或 Petitboot 的 PowerPC Macintosh，POWER 及 OpenPOWER 设备。
- 基于 PMON 或昆仑固件的龙芯 2/3 设备。

内存是否够用？
-------------

启动 Live 环境需要**至少为介质大小一半**的内存，如内存不足，可能会导致启动或
系统安装失败。

当今的现代设备内存容量一般超过 1GiB，因此内存不足以启动 LiveKit 的情况非常
少见。但 AOSC OS/Retro 适配的设备，如 Pentium MMX 时期常见的搭载 32MiB 内存
的电脑上，内存便很显然不足了。

支持安全启动 (Secure Boot) 的设备
---------------------------------

LiveKit 不支持且不计划支持安全启动 (Secure Boot)。因此，在支持安全启动的 UEFI
上，您**必须**确保禁用了安全启动才能启动 LiveKit。

安装 AOSC OS
============

在启动 LiveKit 后，LiveKit 会展示简短使用指南及命令提示符。在安装 AOSC OS 前，
您需要先使用 NetworkManager 配置互联网连接。NetworkManager 提供一款名为 `nmtui`
的简易配置界面，请跟随屏上指示配置网络连接。

成功配置网络连接后，便可以使用预装的 [DeployKit](https://github.com/AOSC-Dev/aoscdk-rs)
程序安装 AOSC OS。运行如下命令即可启动安装程序：


```
deploykit
```

运行该命令后，DeployKit 会以向导形式指引您安装 AOSC OS，此时跟随屏上指示即可
完成系统安装和配置。根据设备性能的区别，安装过程可能需要五分钟到接近一小时。

维护或修复 AOSC OS
==================

如果您的系统发生严重故障或无法启动，您可以使用 LiveKit 作为系统维护和修复环境。
本章节展示几个常见用法。

修复受损的 ext4 系统分区
------------------------

如果您的 ext4 系统分区受损，您可能遇到文件访问错误或系统引导故障（因为内核或
系统初始化程序无法挂载系统分区）。在某些系统配置下，您可能需要使用外部修复环境
才能修复系统分区。

遇到这种故障时，您可以使用 LiveKit 命令提示符修复 ext4 系统分区。

### IDE/ATA/SCSI/SAS 设备上的分区

```
fsck.ext4 -F /dev/sdXY
# X 是用字母指代的设备编号，Y 是用数字指代的分区编号。
```

### NVMe 设备上的分区

```
fsck.ext4 -F /dev/nvmeXnYpZ
# X 是用数字指代的设备节点，Y 是用数字指代的设备编号，Z 是用数字指代的
# 分区编号。
```

### eMMC 或 SD 卡上的分区

```
fsck.ext4 -F /dev/mmcblkXpY
# X 是用数字指代的设备编号，Y 是用数字指代的分区编号。
```

完成意外中断的系统更新
----------------------

在系统更新过程中如发生停电、系统崩溃或其他意外情况，或因用户操作不当，如强制
关机或中断系统更新，系统可能会无法引导或启动。

如需完成被中断的系统更新，您需要先使用 `fdisk -l` 确定并挂载系统分区，挂载系统
分区的命令根据不同的存储配置略有差异。

### IDE/ATA/SCSI/SAS 设备上的分区

```
mount /dev/sdXY /mnt
# X 是用字母指代的设备编号，Y 是用数字指代的分区编号。
```

### NVMe 设备上的分区

```
mount /dev/nvmeXnYpZ /mnt
# X 是用数字指代的设备节点，Y 是用数字指代的设备编号，Z 是用数字指代的
# 分区编号。
```

### eMMC 或 SD 卡上的分区

```
mount /dev/mmcblkXpY /mnt
# X 是用数字指代的设备编号，Y 是用数字指代的分区编号。
```

接下来，为了保证修复过程中能够正确下载额外软件包，您可能需要连接到互联网。
NetworkManager 提供一款名为 `nmtui` 的简易配置界面，请跟随屏上指示配置
网络连接。

在成功建立互联网连接后，即可使用如下命令切换到需修复的 AOSC OS 系统中：

```
arch-chroot /mnt
```

成功切换并进入 AOSC OS 命令提示符后，请依次运行如下几个命令，
**请确保命令成功运行后再运行下一个命令**。如命令运行成功，您的命令提示符结尾
应显示 `#`（在发生错误时，提示符结尾会显示 `!`，而在命令或文件缺失的情况下，
提示符结尾会显示 `?`）：

```
dpkg --configure -a
apt -f install
apt full-upgrade
```

在如上三个命令均成功完成后，请使用如下命令退出 AOSC OS 环境：

```
exit
```

接下来，运行如下命令以确保数据完成写入：

```
sync
```

一切就绪后，即可运行 `reboot` 命令重启到您的 AOSC OS 环境中。

修复 GRUB 引导器故障
--------------------

如果 GRUB 引导器损坏，您的系统将无法引导（这可能是启动扇区被覆盖或意外删除
GRUB 启动配置等原因导致的）。此时，您需要挂载您的系统分区：

### IDE/ATA/SCSI/SAS 设备上的分区

```
mount /dev/sdXY /mnt
# X 是用字母指代的设备编号，Y 是用数字指代的分区编号。
```

### NVMe 设备上的分区

```
mount /dev/nvmeXnYpZ /mnt
# X 是用数字指代的设备节点，Y 是用数字指代的设备编号，Z 是用数字指代的
# 分区编号。
```

### eMMC 或 SD 卡上的分区

```
mount /dev/mmcblkXpY /mnt
# X 是用数字指代的设备编号，Y 是用数字指代的分区编号。
```

然后，使用如下命令切换到需修复的 AOSC OS 系统中：

```
arch-chroot /mnt
```

成功切换并进入 AOSC OS 系统提示符后，即可开始修复 GRUB 引导器。

### 基于 (U)EFI 或昆仑固件的设备

首先，挂载您的 EFI 系统分区 (EFI System Partition)，您可以通过 `fdisk -l` 并
查找类型为 "EFI System" 的分区来确定 EFI 系统分区的设备名。在确定 EFI 设备分区
后，请运行如下命令挂载该分区：

```
# $DEVICE 为位于 "EFI System" 分区对应行头的设备名。
mount $DEVICE /efi
```

依次运行如下命令以修复 GRUB 引导器。**请确保命令成功运行后再运行下一个命令**。
如命令运行成功，您的命令提示符结尾应显示 `#`（在发生错误时，提示符结尾会显示
`!`，而在命令或文件缺失的情况下，提示符结尾会显示 `?`）：

```
grub-install --efi-directory=/efi --bootloader-id="AOSC OS"
grub-mkconfig -o /boot/grub/grub.cfg
```

### 基于 BIOS 的设备

首先，使用 `fdisk -l` 辨认 AOSC OS 所在的硬盘。您可以通过观察 `Disk` 开头的
标题确定 AOSC OS 所在的硬盘设备名。

依次运行如下命令以修复 GRUB 引导器。**请确保命令成功运行后再运行下一个命令**。
如命令运行成功，您的命令提示符结尾应显示 `#`（在发生错误时，提示符结尾会显示
`!`，而在命令或文件缺失的情况下，提示符结尾会显示 `?`）：

```
# $DEVICE is the disk drive on which you installed AOSC OS.
grub-install $DEVICE
grub-mkconfig -o /boot/grub/grub.cfg
```

### 基于 OpenFirmware 的设备 (Macintosh)

依次运行如下命令以修复 GRUB 引导器。**请确保命令成功运行后再运行下一个命令**。
如命令运行成功，您的命令提示符结尾应显示 `#`（在发生错误时，提示符结尾会显示
`!`，而在命令或文件缺失的情况下，提示符结尾会显示 `?`）：

```
grub-install
grub-mkconfig -o /boot/grub/grub.cfg
```

仍需帮助？
=========

如果您在安装或修复 AOSC OS 时需要帮助，请通过 [Discord](https://discord.gg/VYPHgt9)，
[Telegram](https://t.me/joinchat/QVkNCQXYd_kAOMTX) 或 [Libera Chat IRC](https://libera.chat/)
上的 #aosc 频道与我们取得联系。我们的开发者们会尽力为您答疑解难。

报告问题
========

如果您在使用 LiveKit 或其预装的工具时发现问题，请[向我们报告](https://github.com/AOSC-Dev/aosc-os-abbs/issues/new?assignees=&labels=&template=bug-report.yml)。
