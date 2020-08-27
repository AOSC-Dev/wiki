+++
title = "AOSC OS 架构规范"
description = "AOSC OS 架构命名方案和规范"
date = 2020-05-04T03:36:44.991Z
[taxonomies]
tags = ["sys-info"]
+++

此页面包含 AOSC OS 支持的各个架构的信息。

# 主线版本

以下架构由 AOSC OS 主线版本提供支持。

## x86_64（amd64）

适用于 64 位 x86 处理器。

- 工具链：`x86_64-aosc-linux-gnu`
- 备注：需要 SSE3 SIMD 支持。

### x86

适用于 32 位 x86 处理器，本架构的支持由 32Subsystem 实现。

- 工具链：`i686-aosc-linux-gnu`
- 备注：前面提到的对 SIMD 的要求对本架构同样适用。

## AArch64（arm64）

适用于 64 位小端序 ARMv8-A+ 处理器（AArch64）。

- 工具链：`aarch64-aosc-linux-gnu`

## POWER, Little Endian（ppc64el）

- 工具链：`powerpc64el-aosc-linux-gnu`

# Retro

以下架构由 AOSC OS/Retro 提供支持。

## armel

适用于 32 位小端序 ARMv5te（或更高级别）处理器（AArch64）。

- 工具链：`arm-aosc-linux-gnueabi`
- 备注：硬件浮点运算由 Overlay 提供。

## armhf

适用于 32 位小端序 ARMv7-A+ 处理器（AArch64）。

- 工具链：`armv7a-aosc-linux-gnueabihf`
- 备注：需要 Neon SIMD 支持和硬件浮点运算单元。

## i486

适用于兼容 i486 的处理器。

- 工具链：`i486-aosc-linux-gnu`

## mips64el

适用于 64 位小端序 MIPS 处理器。

- 工具链：`mipsel-aosc-linux-gnu`
- 备注：需要 MIPS-II ISA（或更高）。

## powerpc

适用于 32 位大端序 PowerPC 处理器。

- 工具链：`powerpc-aosc-linux-gnu`

## ppc64

适用于 64 位大端序 PowerPC 处理器。

- 工具链：`powerpc64-aosc-linux-gnu`
- 备注：需要 AltiVec 支持。