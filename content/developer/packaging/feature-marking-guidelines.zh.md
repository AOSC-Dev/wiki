+++
title = "安同 OS 系统特性标记规范"
description = "关键系统组件及特性的标记规范"
date = 2024-10-17T12:12:56.606Z
[taxonomies]
tags = ["dev-sys"]
+++

本规范用于标记 Essential 级别以下的关键系统组件，并允许 oma 等前端程序充分告知用户移除相关软件包的风险（即可能影响到的系统功能及特性，详见下文）。实现该功能是为了更直观地让用户了解系统组件及额外应用程序之间的差异，本规范原则上只涉及安同 OS 预装的软件。

元数据更改
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

`Functionality` 条目可本地化，无后缀则匹配 C/en_US（或匹配无对应翻译的系统）；后缀以 locale 语言格式（不带编码后缀）为准：

```
Feature: kde-graphical-environment
Functionality: KDE graphical environment
Functionality-zh_CN: KDE 图形界面

Feature: multimedia-playback
Functionality: Multimedia playback support
Functionality-zh_CN: 多媒体播放
```
