+++
title = "AOSC OS 系统特性标记规范"
description = "关键系统组件及特性的标记规范"
date = 2024-10-17T12:12:56.606Z
[taxonomies]
tags = ["dev-sys"]
+++

本规范用于标记 Essential 级别以下的关键系统组件，并允许 oma 等前端程序充分告知用户移除相关软件包的风险（即可能影响到的系统功能及特性，详见下文）。实现该功能是为了更直观地让用户了解系统组件及额外应用程序之间的差异，本规范原则上只涉及安同 OS 预装的软件。

打包指引
---

如需在打包时标记系统特性，请在 `defines` 文件中添加 `PKGFTR=` 配置：

```
PKGFTR=kde core ...
```

元数据
---

- 工具链及软件源侧：在 `Packages` 加入 `X-AOSC-Features`，列出相关的系统功能
- 引入 `aosc-os-feature-data` 数据，用于记录系统功能名称及简介

### 样例：control 及 Packages 元数据

`X-AOSC-Features` 可包含多个子项（使用空格分割），名称只允许 a-z、数字及 -：

```
Package: plasma-workspace
...
X-AOSC-Features: kde-graphical-environment multimedia-playback
```

### 样例：aosc-os-feature-data

该数据使用 TOML 格式编写且支持本地化：

```
[kde-graphical-environment]
zh_CN = "KDE 图形界面"
en_US = "KDE graphical environment"

[multimedia-playback]
zh_CN = "多媒体播放"
en_US = "Multimedia playback"
```
