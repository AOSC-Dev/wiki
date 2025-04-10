+++
title = "更新主题元数据"
description = "安同 OS 更新元数据规范"
+++

概述
===

本规范旨在为用户提供一个友好、可读性高的系统更新概要。元数据文件使用 TOML 格式存放于 [ABBS 树](https://github.com/AOSC-Dev/aosc-os-abbs)中，而后转换为 JSON 格式于服务端存放。

示例
===

更新主题元数据文件范例如下：

```toml
# 是否为安全更新 (true/false)？
security = true
# 是否要求下列软件包的特定版本均已安装，方才匹配该主题数据（true/false，如不指定则为 true）？
#
# 不允许在“累积更新”元数据中使用
must_match_all = true

[name]
default = "KDE Updates (Winter 2023)"
zh_CN = "KDE 更新（2023 年冬季）"

# 可选：用户公告
# 用户公告可以包含换行符，但我们目前不推荐使用对格式会产生有影响的字符。
[caution]
default = """
This topic may use significantly more memory after reboot. Our testing finds
that the new KDE version may use up to 16GiB of RAM.
"""
zh_CN = """
本次更新重启后可能会需要更多内存。据我社维护者测试，新版 KDE 可能需要接近 16GiB 内存。"""

[packages]
konsole = "23.04.1-1"
dolphin = "23.04.1"
# Package removed as part of the topic.
pykde = false
```

亦可按需编写“累积更新”元数据，如下：

```toml
[name]
default = "Winter 2023 Cumulative Update for amd64 AOSC OS systems"
zh_MS = "适用于 amd64 AOSC OS 版本的 23 冬季累计更新"

# 不能与 [packages] 字段共存
topics = [
    "kde-survey-20231201",
    "core-12.1.0"
]
```

文件存放
===

元数据文件存放在 ABBS 树中的 `topics/` 路径下：

```
TREE/topics/kde-survey-20231201.toml
TREE/topics/llvm-16.0.6.toml
TREE/topics/*.toml
```

软件源服务器定期拉取元数据，并将其处理为单个 JSON 文件：

```
*.toml =>（服务端拉取）=> /mirror/debs/manifest/updates.json
```

经处理的 JSON 文件样例如下：

```json
{
        "kde-survey-20231201": {
                "type": "conventional",
                "name": [
                        { "default": "KDE Updates (Winter 2023)" },
                        { "zh_CN": "KDE 更新（2023 年冬季）" }
                ],
                "security": true,
                "caution": [
                        { "default": "This topic may use significantly more memory after reboot. Our testing finds\nthat the new KDE version may use up to 16GiB of RAM." },
                        { "zh_CN": "本次更新重启后可能会需要更多内存。据我社维护者测试，新版 KDE 可能需要接近 16GiB 内存。" }
                ],
                "packages": [
                        { "name": "konsole", "version": "23.04.1-1" },
                        { "name": "dolphin", "version": "23.04.1" },
                        { "name": "pykde", "version": null }
                ]
        },
        "cumulative-2023H3": {
                "type": "cumulative",
                "name": [
                        { "default": "Winter 2023 Cumulative Update for amd64 AOSC OS systems" },
                        { "zh_MS": "适用于 amd64 AOSC OS 版本的 23 冬季累计更新" }
                ],
                "topics": [
                        "kde-survey-20231201",
                        "core-12.1.0"
                ]
        }
}
```
