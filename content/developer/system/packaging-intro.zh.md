+++
title = "软件包维护入门"
description = "AOSC OS 维护者培训"
date = 2020-08-06T10:14:05.246Z
[taxonomies]
tags = ["dev-sys"]
+++

您好呀！如果您正在阅读这篇文章，您可能希望参与到 AOSC OS 开发当中。本系列指南将指导您如何创建、更新和维护 AOSC OS 软件包。 

# 目录
## 基础
- [需要用到的工具](@/developer/system/basics.zh.md#xu-yao-yong-dao-de-gong-ju)
- [发行周期](@/developer/system/basics.zh.md#fa-xing-zhou-qi)
- [配置打包环境](@/developer/system/basics.zh.md#pei-zhi-da-bao-huan-jing)
- [构建我们的第一个软件包！](@/developer/system/basics.zh.md#gou-jian-wo-men-de-di-yi-ge-ruan-jian-bao)
- [添加一个新的软件包](@/developer/system/basics.zh.md#tian-jia-yi-ge-xin-de-ruan-jian-bao)
- [一个完整的例子：light](@/developer/system/basics.zh.md#yi-ge-wan-zheng-de-li-zi-light)

## 进阶
- [进一步了解 Autobuild3 用法](@/developer/system/advanced-techniques.md#advanced-operations-in-autobuild3)
	- [手动指定构建系统](@/developer/system/advanced-techniques.md#manually-select-different-build-systems)
	- [自定义构建系统参数及编译器参数](@/developer/system/advanced-techniques.md#custom-build-system-compiler-parameters)
	- [自定义构建脚本](@/developer/system/advanced-techniques.md#custom-build-scripts)
	- [构建后的收尾工作](@/developer/system/advanced-techniques.md#post-build-tweaks)
	- [autobuild/override 目录](@/developer/system/advanced-techniques.md#the-autobuild-override-directory)
	- [补丁管理进阶](@/developer/system/advanced-techniques.md#advanced-patch-management)
- [软件包组](@/developer/system/advanced-techniques.md#dealing-with-package-groups)

## 实用链接

下面的链接指向的是一些常用工具的使用文档。

- [Autobuild3 使用文档](@/developer/system/autobuild3-manual.md)
- [Ciel 使用文档](@/developer/system/ciel-manual.md)