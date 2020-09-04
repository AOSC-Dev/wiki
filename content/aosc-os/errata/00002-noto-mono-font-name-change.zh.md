+++
title = "SYS-ERR-00002：新版 Noto Mono 字体没有被正确地显示"
description = "Noto Mono 字体名称更改及其可能带来的影响"
date = 2020-05-04T03:36:40.111Z
[taxonomies]
tags = ["sys-errata"]
+++

# 概述

如果您最近将 `noto-font` 升级到了 `1:20180324` 或更高版本的且将 Noto Mono 指定为默认的等宽字体，您可能会遇到终端模拟器（或文本编辑器）字体重叠且光标错位、Telegram 的代码块消息和正常消息无法区分等问题。

# 成因

`noto-font` 从版本 `1:20180324` 开始，其提供的所有 Noto Mono（monospace）字体都被重命名为了 Noto Sans Mono：

| 原字体名称 | 现字体名称 |
|-------------------------|--------------------------|
| Noto Mono Bold | Noto Sans Mono Bold |
| Noto Mono CJK JP Bold | Noto Sans Mono CJK JP Bold |
| Noto Mono CJK JP Regular | Noto Sans Mono CJK JP Regular |
| Noto Mono ... |Noto Sans Mono ... |

但是，如果您在应用程序的配置文件或者其它一些 Fontconfig 文件中指定了以前的 Noto Mono 系列中的一种字体，例如：

```ini
[General]
ColorScheme=Breeze
...
fixed=Noto Mono,9,-1,5,50,0,0,0,0,0,Regular
...
```

在更新 `noto-fonts` 之后，依赖这些配置文件的应用程序将无法找到新的 Noto Sans Mono 字体，从而导致本应显示等宽字体的地方显示的是非等宽字体（例如 Noto Sans Regular），这也就导致了上述问题。 

# 解决方案

不幸的是，这个问题无法通过软件包升级来解决，因为软件包升级并不会改写用户自定义过的配置文件。要解决此问题，您需要为受影响的应用程序重新指定字体。