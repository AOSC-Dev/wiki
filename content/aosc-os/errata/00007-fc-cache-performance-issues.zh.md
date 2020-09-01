+++
title = "SYS-ERR-00007：Fontconfig < 2.12.91 出现性能问题"
description = "Fc-Cache 算法问题导致字体安装耗时长及桌面无响应"
date = 2020-05-04T03:37:39.136Z
[taxonomies]
tags = ["sys-errata"]
+++

# 概述

在版本低于 2.12.91 的 Fontconfig 中，字体信息缓存生成器 `fc-cache` 使用了效率低下的算法。在安装的字体数量较多，或者安装了字库庞大的中日韩字体（如 `noto-cjk-fonts`）的情况下，该生成器在速度较慢的设备（ARM 设备或部分基于 PowerPC 的旧式 Macintoshes）上需要花费较长的时间为字体生成缓存，这就导致了：

- 图形化应用程序无法启动、使用卡顿。
- GNOME Shell 被冻结。这种情况下您可能要被迫重启系统，从而中断了软件包的升级与安装，某些情况下直接导致系统无法使用。

# 成因

很难在这里描述清楚，我们建议您查看上游的 [漏洞报告](https://bugs.freedesktop.org/show_bug.cgi?id=64766)。在该报告中，开发者认为当前的算法不够优秀，并在后续版本中采用了更优的算法。

# 解决方案

2.12.91 [修复](https://www.freedesktop.org/software/fontconfig/release/ChangeLog-2.12.91) 这个问题，将 Fontconfig 升级到 2.12.91 或更高版本即可。