+++
title = "SYS-ERR-00008：CUPS 在和使用 HPLIP 驱动程序的打印机配合使用时报错 \"Filter Failed\""
description = "HPLIP 专有插件版本不匹配导致的问题"
date = 2020-05-04T03:37:41.607Z
[taxonomies]
tags = ["sys-errata"]
+++

# 概述

某些惠普（HP）打印机可能依赖 `hplip` 软件包附带的驱动程序，某些打印机缺少专有插件就无法运行（例如 HP LaserJet P1102w）。当更新 `hplip` 软件包时，这些需要专有插件的打印机可能无法运行，与此同时 CUPS 守护程序返回 "filter failed" 错误。

# 成因

专有插件在 `hplip` 更新的时候并没有被自动更新，版本的不匹配导致了上面的问题。

# 解决方案

要解决上面的问题，只需要在终端执行：

```
$ sudo hp-plugin
```

接下来根据屏幕指引操作即可。