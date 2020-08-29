+++
title = "Common Issues and Fixed"
description = "Some quirks you may use during packaging"
+++

* `ld` errors when building Rust software
Rust uses `LLVM` as its backend. So it may encounter some issue when linking to `gcc` compiled objects. Try adding this to the `defines` file:

```bash
USECLANG=1
```
