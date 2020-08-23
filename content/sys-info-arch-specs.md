+++
title = "AOSC OS Architecture Specifications"
description = "AOSC OS Architecture Naming Schemes and Specifications"
date = 2020-05-04T03:36:44.991Z
[taxonomies]
tags = ["sys-info"]
+++

This page contains information of all architectures supported by AOSC OS, and their architecture-specific requirements, notes, and toolchain triplets. The architectures listed below are in AOSC-style short names.

# Mainline

Here below lists architectures supported by the mainline AOSC OS distributions.

## x86_64 (amd64)

For systems with 64-bit x86 processors.

- Triplet: `x86_64-aosc-linux-gnu`
- Note: Requires SSE3 SIMD.

### x86

For systems with 32-bit x86 processors. 32-Bit x86 architecture support is implemented as **32Subsystem**. 

- Triplet: `i686-aosc-linux-gnu`
- Note: Note SIMD requirements listed above.

## AArch64 (arm64)

For systems with 64-bit little endian ARMv8-A+ processors (AArch64).

- Triplet: `aarch64-aosc-linux-gnu`

## POWER, Little Endian (ppc64el)

- Triplet: `powerpc64el-aosc-linux-gnu`

# Retro

Here below lists architectures supported by the AOSC OS/Retro distributions.

## armel

For systems with 32-bit little endian ARMv5te and above processors.

- Triplet: `arm-aosc-linux-gnueabi`
- Note: Hard float support provided by overlay.

## armhf

For systems with 32-bit little endian ARMv7-A+ processors.

- Triplet: `armv7a-aosc-linux-gnueabihf`
- Note: Requires Neon SIMD support and hardware floating-point unit; Hard Float ABI.

## i486

For systems with i486 or newer/compatible processors.

- Triplet: `i486-aosc-linux-gnu`

## mips64el

For systems with 64-bit little endian MIPS processors, N64 ABI.

- Triplet: `mipsel-aosc-linux-gnu`
- Note: Requires MIPS-II ISA or higher.

## powerpc

For systems with 32-bit big endian PowerPC processors.

- Triplet: `powerpc-aosc-linux-gnu`

## ppc64

For systems with 64-bit big endian PowerPC processors.

- Triplet: `powerpc64-aosc-linux-gnu`
- Note: Requires AltiVec support.