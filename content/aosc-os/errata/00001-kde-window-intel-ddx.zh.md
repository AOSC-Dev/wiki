+++
title = "SYS-ERR-00001：在 Intel DDX 下使用 KDE 桌面环境发现窗口消失"
description = "Intel X11/XFree86 驱动问题及其解决方案"
date = 2020-05-04T03:36:36.970Z
[taxonomies]
tags = ["sys-errata"]
+++

# 概述

如果您的系统上装有 Intel X11/XFree86 驱动（`xf86-video-intel`），在使用 Plasma 5.11.5 和 KDE Frameworks 5.41.0 的时候，某些使用 GNOME/GTK+3 客户端装饰的窗口可能会无法在屏幕上显示。您可以在任务栏找到窗口的任务栏条目，窗口预览也能正确显示，但是窗口本身不显示，也不响应任何窗口管理事件（将光标移动到问题窗口的边缘时，不会有任何变动）。以下是该问题的两个实例：

- Tilix
- GNOME Terminal

我们还发现 Fcitx 的候选词列表可能也会无法显示。

# 成因

尚未查明。

# 解决方案

## 系统更新

20180126 或更高版本的 AOSC OS Tarball 将不再包含 Intel DDX（`xf86-video-intel`）。此外，我们已经从 `x11-base` 元包中删除 `xf86-video-intel`。如果您的系统安装了这个软件包，系统在更新时会提示您 `xf86-video-intel` 已不再被需要，按照屏幕上的指示删除这个软件包即可。

## 应对措施

这个问题应该只出现在使用 Intel 显卡（GMA、HD、UHD 等）的计算机上。要解决这个问题，您应该切换到 "Modesetting" X11/XFree86 驱动程序。要切换到此驱动程序，首先我们创建一个 X11 配置文件：

```
sudo nano /etc/X11/xorg.conf.d/20-modesettings.conf
```
```
Section "Device"
    Identifier  "Intel Graphics"
    Driver      "modesetting"
    Option      "AccelMethod"    "glamor"
    Option      "DRI"            "3"
EndSection
```

接下来我们重启 X11 会话：

```
sudo systemctl restart display-manager
```

现在您应该切换到了 "Modesetting" 驱动，窗口也应该可以正确地显示了。