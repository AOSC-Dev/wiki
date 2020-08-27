+++
title = "AOSC OS 文件系统层次结构"
description = "AOSC OS 文件系统层次结构规范"
date = 2020-05-04T03:36:47.545Z
[taxonomies]
tags = ["sys-info"]
+++

AOSC OS 使用的文件系统层次结构大体上遵循 FHS（版本 2.3），仅针对 Systemd 和 AOSC OS 开发者的意见做了小量调整。以下我们会将重点放在我们调整过的地方。如希望阅读 HTML 版本的 FHS 2.3 标准，[请点击这里](http://www.pathname.com/fhs/pub/fhs-2.3.html)。

# 符号链接

在 AOSC OS 文件系统层次结构中，`/usr/lib` 和 `/usr/bin` 目录分别包含所有的库文件和可执行文件：

- 对于所有系统：`/lib → /usr/lib`。
  - 对于 64 位系统：`/lib64 → /usr/lib`，`/usr/lib64 → /usr/lib`。
- 对于所有系统：`/bin → /usr/bin`，`/sbin → /usr/bin`，`/usr/sbin → /usr/bin`。

`/var` 中的两个目录也用作符号链接。

- `/var/run → /run`，`/var/lock → /run/lock`。

对于 64 位系统，还有：

- `/usr/lib/64 → /usr/lib64`，`/lib/64 → /usr/lib64`。