+++
title = "AOSC OS 安全公告系统 (AOSA)"
description = "跟踪 AOSC OS 中发现的安全漏洞 "
date = 2020-08-02T14:17:30.417Z
insert_anchor_links = "right"
[taxonomies]
tags = ["aosa"]
+++

# AOSA？

AOSC OS 安全公告系统（AOSC OS Security Advisories，简称 AOSA）于 2017 年推出，旨在协助跟踪 AOSC OS 中发现的安全漏洞，并帮助用户了解可用的安全更新，这些更新通常与功能更新和其他错误修复更新混合在一起。

# 格式和编号

AOSA 使用一种非常简单的格式，旨在为用户提供清晰明了的通知和指引，如以下示例所示： 

```
 AOSA-2018-0008: Update WildMIDI to 0.4.2
|----|----|----|-------------------------|
```

- `AOSA-` 仅仅是为了表明这是我们发布的公告，和 Debian 使用的 `DSA-` 和 Arch Linux 使用的 `ASA-` 是类似的。
- `2018-` 用于表明这则公告是哪一年发布的。
- `0008` 用于表明这是这一年发布的第几则公告。
- `Update WildMIDI to 0.4.2` 是开发者为用户提供的建议。

# 安全公告的发布流程

安全公告的发布通常意味着一个安全更新周期的结束。通常，这个周期可以概括为以下的这些流程：

- 贡献者订阅上游项目和其他 \*nix 发行版的邮件列表（如 `oss-security`），并定期收集安全漏洞信息。
- 然后根据我们自己的软件包树排查安全漏洞（如 [AOSC OS Core](https://github.com/AOSC-Dev/AOSC-os-core) 以及 [AOSC OS ABBS](https://github.com/AOSC-Dev/AOSC-os-abbs) 等等）并判断 AOSC OS 的安全性是否不足（由于缺乏人力，没有对优先级进行分类），随后提交打有 `security` 标签（有时候还会有 `upgrade` 标签）的漏洞报告给这些软件包树的负责人。
- AOSC OS 维护者会检查这些问题，并考虑这个问题影响了哪个更新频道，并用相应的 `to-*` 标记进行标记。
  - 如果还没有可用的修复，则会添加一个 `no fix yet` 标记。
  - 在其他情况下，它们也可能被标记为 `invalid`、`questions`、`stalled` 等。
- AOSC OS 维护者随后将进行必要的更改以解决安全问题，并测试新软件包的可用性。
- 更新后的软件包将被上传到软件仓库以供用户进行更新。
- AOSC OS 维护者在漏洞报告下附上解决方案并将报告标记为关闭状态（具体可以看 [这个例子](https://github.com/AOSC-Dev/AOSC-os-abbs/issues/1299)）。
- 贡献者现在可以使用一个新的 AOSA 编号并发布上面所述的安全公告。
- 通常来说，这些安全公告会被发布在我们的 [邮件列表](mailto:security@lists.aosc.io)，并在维基网站上存档（参见 [2019 年的存档](@/aosc-os/aosa/archive-2019.md)）。
