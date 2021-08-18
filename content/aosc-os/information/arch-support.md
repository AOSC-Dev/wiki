+++
title = "AOSC OS and AOSC OS/Retro Architecture Support Matrix"
description = "See What Runs AOSC OS and AOSC OS/Retro"
date = 2020-05-04T03:36:47.545Z
[taxonomies]
tags = ["sys-info"]
+++

# Introduction

Combined, AOSC OS and AOSC OS/Retro supports over 10 architectures, and this
number is likely to grow in the future. This page aims to provide an overview
of AOSC OS and AOSC OS/Retro port specifications and key feature support.

# AOSC OS

AOSC OS, with its numerous ports, aims to provide near-identical desktop
experience across the range architectures it supports. Unfortunately, due to
differing upstream support, device availability, and maintainer commitment, not
all AOSC OS ports are created equal.

For this reason, we classify our ports into three classes. We will take a look
at each class and the architectures listed within in detail.

## Primary Architectures

AOSC OS currently lists two architectural port as "Primary Architectures," which
comes with a full-featured repository in which ships all packages, unless a
certain piece of software is explicitly incompatible (for instance, VirtualBox
only supports x86_64).

Here's a brief table describing the AOSC OS Primary Architectures, as well as
key feature support.

| Architecture | DPKG Architecture | Compiler Tuplet        | Bits |Instruction Set Extension Requirements | Rust Language Support | Go Language Support | Java Support | Mozilla (Firefox, Thunderbird)  |
|--------------|-------------------|------------------------|------|---------------------------------------|-----------------------|---------------------|--------------|---------------------------------|
| AArch64      | `arm64`           | aarch64-aosc-linux-gnu | 64   | NEON                                  | Yes                   | Yes                 | Yes          | Yes                             |
| x86-64       | `amd64`           | x86_64-aosc-linux-gnu  | 64   | SSE, SSE2                             | Yes                   | Yes                 | Yes          | Yes                             |

## Secondary Architectures

The "Secondary Architectures" comprises ports which targets devices with
limited performance, software support, and availability. These ports are
updated synchronously with the Primary Architectures with a "best effort"
commitment - that is, if it takes too long or developers decide that it would
take too long to resolve a certain build-time or run-time issue, they might
defer certain updates for one of these architectures.

| Architecture            | DPKG Architecture | Compiler Tuplet              | Bits | Instruction Set Extension Requirements  | Rust Language Support | Go Language Support | Java Support                                   | Mozilla (Firefox, Thunderbird) |
|-------------------------|-------------------|------------------------------|------|-----------------------------------------|-----------------------|---------------------|------------------------------------------------|--------------------------------|
| Loongson 3A/B 1000-4000 | `loongson3`       | mips64el-aosc-linux-gnuabi64 | 64   | LoongEXT, LoongEXT2, LoongMMI           | Yes, Buggy            | Yes                 | Yes (HotSpot JIT for JDK 8 only), Non-Mainline | Yes                            |
| POWER8+ (Little Endian) | `ppc64el`         | powerpc64le-aosc-linux-gnu   | 64   | AltiVec/VMX, VSX-2                      | Yes                   | Yes                 | Yes                                            | Yes (No IonMonkey JIT)         |

## Experimental Architectures

The "Experimental Architectures" comprises ports which are initiated as
experiments, meaning that system releases may not be generated, features may
be disabled, and security updates may not be released in a timely fashion.
More importantly, these ports *may terminate* at the maintainers discretion.

| Architecture    | DPKG Architecture | Compiler Tuplet            | Bits | Instruction Set Extension Requirements | Rust Language Support | Go Language Support | Java Support         | Mozilla (Firefox, Thunderbird)  |
|-----------------|-------------------|----------------------------|------|----------------------------------------|-----------------------|---------------------|----------------------|---------------------------------|
| LoongArch64     | `loongarch64`     | loongarch64-aosc-linux-gnu | 64   | ???                                    | No                    | No                  | No                   | No (?)                          |
| RISC-V (rv64gc) | `riscv64`         | riscv64-aosc-linux-gnu     | 64   | RV64GC                                 | Yes                   | Yes                 | Yes (No HotSpot JIT) | Yes (No IonMonkey JIT)          |

# AOSC OS/Retro

Unlike the AOSC OS mainline ports, AOSC OS/Retro ports are considered equal,
with the same target feature set. The table below describes the specifications
and key feature support for each AOSC OS/Retro port.

| Architecture       | DPKG Architecture | Compiler Tuplet              | Bits | Instruction Set Extension Requirements | Rust Language Support | Mozilla (Pale Moon) | Trinity Desktop Environment |
|--------------------|-------------------|------------------------------|------|----------------------------------------|-----------------------|---------------------|-----------------------------|
| ARMv4              | `armv4`           | arm-aosc-linux-gnueabi       | 32   | N/A                                    | No                    | No                  | No                          |
| ARMv6 (Hard Float) | `armv6hf`         | arm-aosc-linux-gnueabihf     | 32   | Thumb, Thumb-2                         | Yes                   | Yes                 | Yes                         |
| ARMv7 (Hard Float) | `armv7hf`         | arm-aosc-linux-gnueabihf     | 32   | NEON, Thumb, Thumb-2                   | Yes                   | Yes                 | Yes                         |
| i486 (80486)       | `i486`            | i486-aosc-linux-gnu          | 32   | N/A                                    | Yes (i686 Required)   | Yes (SSE Required)  | Yes                         |
| Loongson 2F        | `loongson2f`      | mips64el-aosc-linux-gnuabi64 | 64   | Loongson-MMI                           | Yes, Buggy            | Yes                 | Yes                         |
| PowerPC G3/G4      | `powerpc`         | powerpc-aosc-linux-gnu       | 32   | N/A                                    | Yes                   | Yes                 | Yes                         |
| PowerPC G5+        | `ppc64`           | powerpc64-aosc-linux-gnu     | 64   | AltiVec/VMX                            | Yes                   | Yes                 | Yes                         |
