+++
title = "SYS-ERR-00003：在 HP MicroServer Gen8 上使用 \"sensors\" 命令出错"
description = "查看系统传感器数值时触发 ACPI 相关的 Demesg 报错"
date = 2020-05-04T03:36:42.563Z
[taxonomies]
tags = ["sys-errata"]
+++

# 概述

在执行 `lm-sensors` 软件包提供的 `sensors` 命令以查看系统传感器数值时，`TTY` 或 `dmesg` 日志中可能会有下面的报错：

```
[...] ACPI Error: SMBus/IPMI/GenericSerialBus write requires Buffer of length 66, found length 32 (20170728/exfield-427)
[...] ACPI Error: Method parse/execution failed \_SB.PMI0._PMM, AE_AML_BUFFER_LIMIT (20170728/psparse-550)
[...] ACPI Exception: AE_AML_BUFFER_LIMIT, Evaluating _PMM (20170728/power_meter-338)
```

除了上述错误之外，您还可以看到 `power_meter-acpi-0` 设备有着不合理的数值：

```
power_meter-acpi-0
Adapter: ACPI interface
power1:        0.00 W  (interval = 300.00 s)
```

# 成因

尚未查明。上游已经收到问题反馈，详见 [Launchpad Bug #606999](https://bugs.launchpad.net/ubuntu/+source/acpi/+bug/606999)。

# 解决方案

要想在上游发布修复程序之前解决此问题，必须将 `sensors` 读数中有问题的 `power_meter-acpi-0` 设备列入黑名单。用您最喜欢的编辑器打开 `/etc/sensors3.conf`：

```
sudo nano /etc/sensors3.conf
```

在文件的末尾添加下面的内容：

```
chip "power_meter-acpi-0"
    ignore power1
```