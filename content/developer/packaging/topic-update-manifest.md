+++
title = "Topic Update Manifest"
description = "Metadata for AOSC OS Updates"
+++

Overview
===

The topic update manifest aims to provide a user-readable overview of changes
during system updates. The files are stored in the TOML format in the
[ABBS tree](https://github.com/AOSC-Dev/aosc-os-abbs) and converted into the
JSON format on the server-side.

Examples
===

Below is an example for a conventional topic update manifest file:

```toml
name.default = "KDE Updates (Winter 2023)"
name.zh_CN = "KDE 更新（2023 年冬季）"
# Security update (true/false)?
security = true
# OPTIONAL: PSA message for users.
caution.default = """
This topic may use significantly more memory after reboot. Our testing finds
that the new KDE version may use up to 16GiB of RAM.
"""
caution.zh_CN = """
本次更新重启后可能会需要更多内存。据我社维护者测试，新版 KDE 可能需要接近 16GiB 内存。"""

[packages]
konsole = "23.04.1-1"
dolphin = "23.04.1"
# Package removed as part of the topic.
pykde = false
```

Below is a "cumulative" topic update manifest file:

```toml
name.default = "Winter 2023 Cumulative Update for amd64 AOSC OS systems"
name.zh_MS = "适用于 amd64 AOSC OS 版本的 23 冬季累计更新"

# Must not exist alongside [packages].
topics = [
    "kde-survey-20231201",
    "core-12.1.0"
]
```

Files
===

Topic update manifest files will be stored in a special `topics/` folder in the
ABBS tree:

```
TREE/topics/kde-survey-20231201.toml
TREE/topics/llvm-16.0.6.toml
TREE/topics/*.toml
```

The repository server will pull the manifests from the ABBS tree, processing
the them into a single JSON:

```
*.toml => (server pulls the manifests) => /mirror/debs/manifest/updates.json
```

A sample post-processed JSON file should look like this:

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
