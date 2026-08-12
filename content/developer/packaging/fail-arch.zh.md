+++
title = "FAIL_ARCH 编写指南"
description = "使用 FAIL_ARCH 表达式限制软件包的构建架构"
date = 2026-07-21T03:08:19Z
[taxonomies]
tags = ["dev-sys"]
+++

`FAIL_ARCH`，顾名思义，就是不允许特定软件包在特定架构上编译。[BuildIt](https://github.com/AOSC-Dev/buildit) 和 [ACBS](https://github.com/AOSC-Dev/acbs) 会自动忽略在这个架构上无法构建的包。[Autobuild4](https://github.com/AOSC-Dev/autobuild4) 也会检查这个表达式，并且会在检测到无法构建的情况下报错。

# 格式

最近的安同 OS 维护工具链修改开始严格限制 `FAIL_ARCH` 表达式的格式，使其严格遵循 Bash extglob 表达式规范，并且严格限制为其中两种：

- 包含特定架构（组） `@(amd64|arm64)`，其语义为**不允许**表达式中列出的架构运行构建
- 不包含特定架构（组） `!(amd64|arm64)`，其语义为**只允许**表达式中列出的架构运行构建

# 架构组

架构组是 Autobuild 定义的能够涵盖多个架构的泛用名。例如：

- `mainline`: 六个主线架构
    - 附属的 `loongarch64_nosimd` 只有 BuildIt 在使用，其 dpkg 架构名称依旧是 `loongarch64`。
- `retro`: “星霞” 系统支持的架构
- `32bit`: “星霞” 系统支持的所有 32 位架构（包括 PA-RISC）

Autobuild 中定义的所有架构组可以在 [`sets/arch_groups.json`](https://github.com/AOSC-Dev/autobuild4/blob/master/sets/arch_groups.json) 中查阅。

# FAIL_ARCH 与架构组

最近的安同 OS 维护工具链修改已开始允许维护者在 `FAIL_ARCH` 中插入架构组。以下是一些例子：

- `FAIL_ARCH="!(mainline|i486)"`: 只允许主线架构及 i486 架构构建
- `FAIL_ARCH="@(retro|loongson3|riscv64)"`: 不允许所有星霞 OS 支持的架构，以及 `loongson3` 和 `riscv64` 构建
- `FAIL_ARCH="!(mainline)"`: 限定该包为只允许主线架构构建
- `FAIL_ARCH="!(retro)"`: 限定该包为只允许星霞 OS 支持的架构构建

请酌情选择包含表达式或排除表达式。如有必要，可能需要展开架构组：

- `FAIL_ARCH=!(amd64|arm64|i486)`: 软件包无法在非 “主流” 架构上构建
- `FAIL_ARCH=@(alpha|ia64|sparc64|hppa|ppc64|powerpc)`: 软件包无法在这些架构上构建
