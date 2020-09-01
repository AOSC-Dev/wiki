+++
title = "SYS-ERR-00005：X11 图形界面无法在 NVIDIA 单显卡系统上启动"
description = "Nouveau DRM/GL/X 与 NVIDIA's GL/X 不兼容"
date = 2020-05-04T03:37:34.043Z
[taxonomies]
tags = ["sys-errata"]
+++

# 概述

在 NVIDIA 单显卡的 AMD64 系统（而非双显卡系统）上使用 AOSC OS 时，您应该安装专有的 NVIDIA 驱动，而不是开源的 Nouveau 驱动。具体而言，您需要安装下面的两个软件包（如果您需要 32 位应用程序支持，还需要安装带有 `+32` 后缀的软件包，如果您使用旧式 NVIDIA 显卡，需要安装带有 `+340` 后缀的软件包，详见 [这个页面](http://www.nvidia.com/object/unix.html)）：

-`nvidia`，NVIDIA Kernel DRM 模块，OpenGL 和 X11 运行时。
-`nvidia-libgl`，用于替换默认的开源 OpenGL 和 X11 运行时的符号链接。

安装这两个软件包并重新启动 AOSC OS 后，X11 图形界面可能无法启动，您可能还会看到 `nouveau` 驱动程序输出的一些报错信息。

# 成因

即使安装了专有驱动程序，AOSC OS 也不会禁用默认的 `nouveau` 内核模块。但是，Linux 内核通常会偏好内置的模块 `nouveau` 而不是外置的 `nvidia`。而前者与被 `nvidia-libgl`、`nvidia-libgl+32` 或者 `nvidia-libgl+340`、`nvidia-libgl+340+32` 替换掉的运行时库不兼容。

这种不兼容导致了上述的问题。

# 解决方案

撰写本文时，尚未发布或计划任何的修复版本。下面我们将介绍在基于 AMD64 的系统上如何解决此问题，这涉及到了 GRUB 配置的更改。使用您喜欢的文本编辑器，编辑 GRUB 主配置文件：

```
$ sudo nano /etc/defaults/grub
```

找到以 `GRUB_CMDLINE_LINUX_DEFAULT=` 开头的一行，加上：

```
modprobe.blacklist=nouveau
```

现在这一行应该是这样子的：

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet rw ... modprobe.blacklist=nouveau"
```

接下来重新建立配置文件并重启系统：

```
$ sudo grub-mkconfig -o /boot/grub/grub.cfg
$ sudo reboot
```