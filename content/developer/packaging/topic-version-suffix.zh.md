+++
title = "测试源内软件包迭代版本规范"
description = "自动化标记测试用软件迭代更新"
+++

长期以来，在测试源 (topic) 内修订软件包及从测试源到稳定源 (stable) 推送更新的流程中存在修订历史不清的问题。这一问题也会为参与测试的用户和维护者带来困扰：由于未使用软件包版本标记修订且多次同版本覆盖软件包，用户及开发者往往无法正确接收软件更新推送（因为 APT 更新检查逻辑查验的软件包版本甚至大小都可能未发生变化）。

目前的工作流中出现此种同版本覆盖的场景主要有如下两种：

- 重复推送在测试过程中多次修订的软件包
- 测试源合并时推送稳定源更新

本规范通过设计一套针对预发布软件包修订版本标注的规范解决上述问题，让测试流程及稳定源推送前后各软件包修订都得到充分标注。

预发布软件包修订版本标注
===

本规范针对预发布软件包定义如下修订版本 (`REL`) 标注规范：

```
${VER}-${REL}~pre${ISO_8601-1_2019_TIMESTAMP}
```

实际软件包版本示例如下：

```
5.2.21-0~pre20240731T142407Z
```

修订版本号具体包含如下几个部分：

- `${REL}`：主修订版本号，每个测试源到稳定源的修订更新原则上只递增一位；更新版本时复位为 0（惯例为不指定）
- `~pre`：预发布标记，标记软件包为预发布版本（说明该软件包来自测试源）
- `${ISO_8601-1_2019_TIMESTAMP}`：软件包在 ABBS 树上对应的最新 Git 提交（注意是 commit 而非 author）时间戳，随着时间推移自然递增

基于未提交更改 (dirty) 打包
---

如果在发起打包时 ABBS 树中存在没有提交的修改（Git 仓库处于 “drity” 状态），则上述时间戳为发起构建的时间戳，并加上 `~dirty` 后缀：

```sh
vim core-libs/glibc/build
# 此时 ABBS 树处于 dirty 状态
ciel build -i main glibc # ACBS 于 2024-08-05 10:40:15 +0800 运行
# ACBS 注入的版本号应为 `2.40-0~pre20240805T024015Z~dirty`
```

原理说明
---

该规范的实现原理非常简单，具体为两点：

- 推送稳定源时，利用 dpkg 版本比较逻辑中 `~` 符号标记预发布的标注规范，使得测试过程中 `${REL}~pre${ISO_8601-1_2019_TIMESTAMP}` 一直小于稳定源推送的软件包的目标修订号 `REL`
- 修订测试源中的软件包时，利用 `${ISO_8601-1_2019_TIMESTAMP}` 时间戳会根据 Git 提交时间戳自然递增的原理，使得修订的软件包每次都被当作更新推送给用户

工具调整
===

落实该版本规范只需对 ACBS 进行修改。

在安同 OS 的维护流程中，ACBS 会通过 `generate_metadata()` 函数探测 Git 提交 ID 并记录到软件包中的 `X-AOSC-Commit` 元数据中。我们可以利用类似的方式记录 Git 提交时间戳，并以 `REL` 的形式补充到软件包的 `spec` 源码描述文件中，实现上述版本标记。