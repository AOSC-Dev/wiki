+++
title = "Installation/AMD64/*Trails (简体中文)"
description = "在 Bay Trail 或 Cherry Trail 设备上安装 AOSC OS"
date = 2020-05-04T03:37:03.753Z
[taxonomies]
tags = ["sys-installation"]
+++

请注意 Linux 对 Bay Trail 和 Cherry Trail 设备的支持可以是残废的，也从未达到令人满意的状态）。因此，非必要情况下还是建议您放弃折腾。

在这些设备上安装 AOSC OS 的大体流程和在其它 AMD64/x86_64 设备上安装 AOSC OS [基本是一致的](@/aosc-os/installation/manual/amd64.zh.md) 的，但是请注意：

- 部分基于 eMMC 的设备将 `/dev/mmcblkNpN` 作为储存设备。
- 一些特定的设备需要执行额外的操作。
- 您要做好「AOSC OS 确实在您的设备上跑起来」的心理准备。

# 注意

- 所有以 `# ` 开头的命令都需要您使用 `root` 来运行。
- 本文提供的解决方法有一些只适用于特定的设备，请结合实际情况考虑是否采用。

# 使用 GRUB 引导后系统冻结

部分 Bay Trail 设备使用 GRUB 引导后会卡在 `loading initrd...` 不动。解决方法是在启动您的设备时进入启动项选单并选择 "AOSC-GRUB"。

# KMS 无法在 Dell Venue 8 Pro 工作

在 Dell Venue 8 Pro 上，启用 KMS 可能会导致启动过程中出现空白屏幕。虽然您可以在内核参数中指定 `nomodeset` 来解决此问题，但由于没有可用的 KMS，Plasma 和 GNOME 等桌面环境的性能将非常差，触摸屏也将无法正常工作。

一个解决方法是编辑 `/etc/default/grub`，找到这样的两行：

```
# Uncomment to disable graphical terminal
#GRUB_TERMINAL_OUTPUT=console
```

反注释上面提及的第二行，然后生成 GRUB 主配置文件 `grub.cfg`：

```
# grub-mkconfig -o /boot/grub/grub.cfg
```

# 慢动作现象

「慢动作」大概率是内核时钟源检测机制导致的，解决方法是编辑 `/etc/default/grub`，找到这样的一行：

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet rw"
```

将它修改为：

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet rw clocksource=tsc hpet=off"
```

最后生成 GRUB 主配置文件 `grub.cfg`：

```
# grub-mkconfig -o /boot/grub/grub.cfg
```
