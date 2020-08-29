+++
title = "常见问题及其解决方案"
description = "打包过程中可能会遇到的一些问题"
+++

* 构建 Rust 应用程序时出现与 `ld` 相关的错误
Rust 使用 `LLVM` 作为后端。因此，在将其链接到使用 `gcc` 编译的对象时可能会遇到一些问题。请尝试在 `defines` 文件中加入：

```bash
USECLANG=1
```
