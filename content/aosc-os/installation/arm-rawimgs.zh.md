+++
title = "Installation/ARM* (简体中文)"
description = "在 ARMv7/AArch64 设备上安装 AOSC OS"
date = 2020-05-04T03:37:11.499Z
[taxonomies]
tags = ["sys-installation"]
+++

在不同的 ARM 设备上安装 AOSC OS 要做的事情是不一样的，请访问我们的 [ARM 设备支持页面](https://github.com/AOSC-Dev/AOSC-os-arm-bsps/wiki) 了解 AOSC OS 当前支持的设备并获取相应的安装指南。

# Tarball

[下载页面](https://aosc.io/downloads/) 中提供的所有 Tarball 均附带了未经配置的主线 Linux 内核，如果不对其进行额外的配置，它将无法在大多数设备上运行。我们常用 [aosc-mkrawimg](https://github.com/AOSC-Dev/aosc-mkrawimg) 为特定的设备制作镜像文件。

为 MicroSD 卡和 eMMC 存储设备准备的镜像文件可以在同一位置找到。

# 变种版本及系统要求

我们为 ARMv7/AArch64 设备提供了以下的变种版本。每个变种版本都有各自的特性和系统要求，请阅读 [系统要求](@/aosc-os/installation/sysreq/arm-notes-sysreq.zh.md) 了解更多信息。

## 可引导

- Base
- Cinnamon
- GNOME
- KDE Plasma
- LXDE
- MATE
- XFCE

## 不可引导

- Container
- BuildKit
