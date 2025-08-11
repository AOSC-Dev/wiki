+++
title = "安同 OS 软件源元数据及源配置模板规范"
+++

本规范定义安同 OS 所使用的软件源（镜像源）元数据及软件源配置模板的结构及内容规范。

功能结构
===

- `/usr/share/repository-data/`：系统配置目录，本目录中的配置文件由软件包提供
    - `mirror.toml`：镜像源配置
    - `comps.toml`：组件（软件集）配置
    - `template.toml`：软件源配置文件模板
- `/etc/repository-data/`：用户配置目录，本目录中的配置文件可供用户编写和修改
    - 同样地放置 `mirror.toml` 及 `comps.toml`，用于补充 `/usr/share/repository-data` 下的对应配置
    - 此处配置文件中定义的镜像源 ID 不得与 `/usr/share/repository-data` 中所定义的冲突

主配置格式
===

`/usr/share/repository-data/mirror.toml`:

```toml
[origin]
description.default = "AOSC main repository (auto-redirect)"
description.zh_CN = "安同开源社区官方源（自动重定向）"
url = "https://repo.aosc.io/anthon/"
```

`/usr/share/repository-data/comps.toml`:

```toml
[main]
description.default = "The main collection of packages"
description.zh_CN = "主软件集"

[bsp-loongarch64-nosimd]
description.default = "Packages for LoongArch64 BSP for no-SIMD platforms"
description.zh_CN = "用于无 SIMD 的龙架构（64 位）平台的软件包"
```

模板配置格式
===

`/usr/share/repository-data/template.toml` 用于定义包管理前端（如 oma）填入上述信息的方式，配置中段落顺序按从上到下顺序写入对应的源配置中：

```toml
[[config]]
# 对于有多个值的选项：
#
#   - sources.list 中使用 "," 分隔
#   - DEB-822 中使用空白分隔
#
# 对应的组件（软件集）列表
#
# 数组展开为字符串，sources.list 中使用空格分隔、DEB-822 中使用空白分隔
components = ["main"]
#
# 签名配置，APT 一般要求软件源具有 GPG 签名
#
signed-by = ["/usr/share/keyrings/aosc-archive-keyring.gpg"]
#
# 不检查签名，布尔值
#
# 对应 sources.list 下的 "[trusted=yes]" 或 DEB-822 下的 "Trusted: yes"
#
# 如未指定，默认为 false
always-trusted = <true|false>
#
# 架构配置：用于定义某个源对应的架构支持范围
#
# 如未指定，默认为 `dpkg --print-architecture` 输出 + all (noarch)
#
# 多个架构
architectures = ["amd64","arm64"]
# 所有架构无关包
architectures = ["all"]
# 所有架构相关包
architectures = ["any"]
# 不指定该项或根据下例编写则对应所有软件包
architectures = ["all","any"]
#
# 是否启用，布尔值
#
# sources.list 对应注释与否，DEB-822 对应 "Enabled: yes/no"
#
# 如未指定，默认为 true
enabled = <true|false>
```

样例：主线发行
---

```toml
[[config]]
components = ["main"]
signed-by = ["/usr/share/keyrings/aosc-archive-keyring.gpg"]
```

样例：loongarch64-nosimd 移植
---

```toml
[[config]]
components = ["bsp-loongarch64-nosimd"]
signed-by = ["/usr/share/keyrings/aosc-archive-keyring.gpg"]
architectures = ["loongarch64"]

[[config]]
components = ["main"]
signed-by = ["/usr/share/keyrings/aosc-archive-keyring.gpg"]
architectures = ["all"]
```