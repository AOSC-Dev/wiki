+++
title = "SYS-KB-00001：APT 软件源配置"
description = "在 AOSC OS 启用或禁用一个软件源"
date = 2020-08-07T12:35:35.984Z
[taxonomies]
tags = ["sys-kb"]
+++

# APT 配置

本页面将介绍 AOSC OS 预装的 `apt-gen-list` 工具。这一工具允许你启用和禁用 APT 软件源，并帮助你修改 `/etc/apt/sources.list` 以使改动生效。如果你知道在你所在的位置哪个软件源速度最快，那么这个工具使用起来将会是非常方便的。

下面是这个工具自带的中文帮助信息：

``` plain
用法：apt-gen-list [stdout] [m [-|+]镜像1 ...] [c [-|+]组件1 ...] [b 分支]
       apt-gen-list now
       apt-gen-list avail
       apt-gen-list help

关键字：
    “mirror”与“m”等价；
    “branch”与“b”等价；
    “component”与“c”等价。

示例：
    1. 将镜像源设置为 origin 和 baz：
        # apt-gen-list mirror origin baz

    2. 禁用镜像源 origin：
        # apt-gen-list mirror -origin

    3. 启用 opt-avx2 组件并禁用 bsp-sunxi 组件：
        # apt-gen-list c +opt-avx2 -bsp-sunxi

    4. 设置分支为 testing：
        # apt-gen-list b testing

    5. 设置分支为 testing 并启用 bsp-sunxi 组件：
        # apt-gen-list branch testing component +bsp-sunxi

    6. 禁用 main 组件：
        # apt-gen-list c -main
        => 这个操作没有任何效果，main 是必选组件。

    7. 全部重置为默认值：
        # apt-gen-list m b c
        => 它等价于：
        # apt-gen-list mirror origin branch stable component main

    8. 重新生成一遍 sources.list
        # apt-gen-list

```
