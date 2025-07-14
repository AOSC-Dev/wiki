+++
title = "Common Issues and Fixed"
description = "Some quirks you may use during packaging"
+++

# Build fails during linking stage (LTO)
Sometimes the build process fails during the linking stage. It is possible that such errors are caused by LTO (Link-time Optimization).

LTO can help reduce binary size and increase performance (so AOSC OS has it enabled by default), but it somethimes causes build failures on certain programs. So if you enounter build failures during link stage, you can try to disable LTO via adding this line to `defines` file:

```bash
NOLTO=1
```

# `autotools` complains about lacking `install-sh`, source code file not found, source already configured, and etc.
By default, `autobuild4` creates a `build` directory and build inside it (this is called *Shadow build*). However, some source codes doesn't work in such configuration.

To disable this behavior, add this to the `defines` file:

```bash
ABSHADOW=0
```

# `ld` errors when building Rust software
Rust uses `LLVM` as its backend. So it may encounter some issue when linking to `gcc` compiled objects. Try adding this to the `defines` file:

```bash
USECLANG=1
```

# `ld.lld` errors mentioning `R_MIPS_64`

While `USECLANG=1` can fix ld errors when building Rust software, the fix doesn't work on `loongson3`, and will cause `ld.lld: error: relocation R_MIPS_64 cannot be used against local symbol` instead. To solve this, disable `USECLANG` and enable `NOLTO` for this architecture only.

```bash
# FIXME: ld.lld: error: relocation R_MIPS_64 cannot be used against local symbol
USECLANG__LOONGSON3=0
NOLTO__LOONGSON3=1
```
