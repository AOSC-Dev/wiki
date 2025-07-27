+++
title = "常见问题及其解决方案"
description = "打包过程中可能会遇到的一些问题"
+++

# 构建在链接阶段失败（LTO）

有时，构建过程会在链接阶段失败。这种错误可能是由 LTO（链接时优化）引起的。

LTO 可以有效减少二进制包大小并提升性能，因此 AOSC OS 在默认情况下启用了它。但有些时候 LTO 会导致某些程序构建失败。因此，如果您在链接阶段遇到构建失败，可以尝试在 `defines` 文件中添加以下内容禁用 LTO：

```bash
NOLTO=1
```

# 构建 Rust 应用程序时出现与 `ld` 相关的错误

Rust 使用 `LLVM` 作为后端。因此，在将其链接到使用 `gcc` 编译的对象时可能会遇到一些问题。请尝试在 `defines` 文件中添加：

```bash
USECLANG=1
```

# `ld.lld` 汇报有关 `R_MIPS_64` 的错误

虽然 `USECLANG=1` 可以修复 Rust 程序的 `ld` 错误，但是在 `loongson3` 上它会带来另一种报错：`ld.lld: error: relocation R_MIPS_64 cannot be used against local symbol`。此时需要单独为此架构禁用 `USECLANG` 和 LTO。

```bash
# FIXME: ld.lld: error: relocation R_MIPS_64 cannot be used against local symbol
USECLANG__LOONGSON3=0
NOLTO__LOONGSON3=1
```

# 在 LoongArch 上无法使用 Ciel 进行跨架构打包

虽然 Ciel 支持使用 QEMU 为其他架构打包。但由于内核页大小的问题，在默认配置的 LoongArch 上
无法实现这种操作。 通常是类似于这样的报错：

```bash
> ciel update-os
...
info: update-bf9c05ca-c080f2a: waiting for container to start...
error: nspawn exited too early! (Status: exit status: 127)
...
```

此问题不局限于 LoongArch， 具体来说，只要是 `宿主页大小` 大于 `目标页大小`。都会出现这种问题。

这问题目前没有好的解决方案，建议更换宿主架构进行打包。