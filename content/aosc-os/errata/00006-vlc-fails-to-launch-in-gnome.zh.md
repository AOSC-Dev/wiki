+++
title = "SYS-ERR-00006：VLC 3.0 或更高版本无法在 GNOME 启动"
description = "在 GNOME 桌面环境启动新版 VLC 报错"
date = 2020-05-04T03:37:36.716Z
[taxonomies]
tags = ["sys-errata"]
+++

# 概述

在带有 GNOME 桌面环境的 AOSC OS 系统上尝试启动 3.0 或更高版本的 VLC 可能会失败，报错如下：

```
Gdk-Message: vlc: Fatal IO error 2 (No such file or directory) on X server :0.
```

# 成因

尚未确认。然而，VLC 上游 [已经澄清](https://trac.videolan.org/vlc/ticket/18910#no1) 相关问题与 VLC 无关。

# 解决方案

很遗憾，我们尚未找到合适的解决方案。