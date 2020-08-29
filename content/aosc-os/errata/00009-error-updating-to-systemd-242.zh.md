+++
title = "SYS-ERR-00009: 升级到 Systemd 242 时报错"
description = "驻留在内存中的已被淘汰的 systemd 服务导致出错"
date = 2020-05-04T03:37:44.030Z
[taxonomies]
tags = ["sys-errata"]
+++

# 概述

当您将 `systemd` 升级到 `1:242` 或更高版本，会得到下面的报错信息：

```shell
(Reading database ... 89562 files and directories currently installed.)
Preparing to unpack .../apt_1%3a1.7.0-3_amd64.deb ...
Unpacking apt (1:1.7.0-3) over (1:1.7.0-2) ...
Setting up apt (1:1.7.0-3) ...
Failed to enable unit: Access denied
dpkg: error processing package apt (--configure):
 installed apt package post-installation script subprocess returned error exit status 1
Errors were encountered while processing:
 apt
E: Sub-process /usr/bin/dpkg returned an error code (1)
```

# 成因

在将 `systemd` 升级到 `1:242` 或更新版本时，部分尚未更新的软件包仍在调用驻留在内存中的已被淘汰的 systemd 协议功能，导致上述的问题。

- 上述问题由 [这个提交](https://github.com/systemd/systemd/commit/3f10c66270b74530339b3f466c43874bb40c210f) 引入。

# 解决方法

如果您遇到了这个问题，在继续更新系统之前请重新启动计算机，或者执行：

```shell
kill 1
```

# 当前进展

我们正在寻找一个更可靠的解决方案，并将在后续的更新中提供。
