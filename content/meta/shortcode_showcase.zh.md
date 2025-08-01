+++
title = "短代码展示页"
description = "所有可用的短代码一目了然"
+++

# 卡片
用于提供清晰的视觉突出显示，以表明有些内容需要关注。
## 警告
```markdown
{%/* card(type="warning") */%}
这是一条警告信息。
{%/* end */%}
```
{% card(type="warning") %}
这是一条警告信息。
{% end %}

## 成功
```markdown
{%/* card(type="success") */%}
这是一条成功信息。
{%/* end */%}
```
{% card(type="success") %}
这是一条成功信息。
{% end %}

## 信息
```markdown
{%/* card(type="info") */%}
这是一条信息。
{%/* end */%}
```
{% card(type="info") %}
这是一条信息。
{% end %}

## 危险
```markdown
{%/* card(type="danger") */%}
这是一条危险信息。
{%/* end */%}
```
{% card(type="danger") %}
这是一条危险信息。
{% end %}

# 区块
该短代码用于 Wiki 的首页索引中，用于展示重点链接。

```markdown
{%/* section(name="AOSC OS") */%}
[AOSC OS 适合我吗？](/zh/aosc-os/is-aosc-os-right-for-me)
找到最适合您的（或者反之）

[安装指南](/zh/aosc-os/installation/)
在您的机器上安装 AOSC OS

[AOSC OS/Retro](/zh/aosc-os/retro/intro)
照顾您的旧式设备和低性能设备
{%/* end */%}
```

渲染效果如下（在首页索引中不会显示区块编号）：
{% section(name="AOSC OS") %}
[AOSC OS 适合我吗？](/zh/aosc-os/is-aosc-os-right-for-me)
找到最适合您的（或者反之）

[安装指南](/zh/aosc-os/installation/)
在您的机器上安装 AOSC OS

[AOSC OS/Retro](/zh/aosc-os/retro/intro)
照顾您的旧式设备和低性能设备
{% end %}
