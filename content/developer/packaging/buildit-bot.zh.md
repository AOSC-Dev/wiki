+++
title = "使用自动化设施构建软件包"
description = "BuildIt! 机器人为您代劳～"
+++

# 前言

本文按 [AOSC OS 主题制维护指南 (English)](@/developer/packaging/topic-based-maintenance-guideline.md) 中的流程简要介绍 [BuildIt!](https://github.com/AOSC-Dev/buildit) 自动打包机器人的使用方法。BuildIt! 机器人可以代理如下工作：

- 开启合并请求（即 Topic）
- 自动构建 Topic 软件包
- 自动上传 Topic 软件包
- 汇报构建情况

您依然需要自行完成如下工作：

- 开启分支、修改软件包和推送相关更改
- 修改合并请求 (Pull Request) 中的详细修改内容说明，以便其他维护者和用户了解 Topic 内容
- 联系其他维护者审阅修改并作出必要修改
- 测试相关软件包并汇报测试结果

# 工作流程

如下为 BuildIt! 工作流的简要讲解。

## 启动 Topic 工作

按照 [AOSC OS 主题制维护指南 (English)](@/developer/packaging/topic-based-maintenance-guideline.md) 和 [AOSC OS 软件包样式指南](@/developer/packaging/package-styling-manual.zh.md) 中的要求，开启分支、进行必要修改，而后提交修改。

接下来，在 Telegram 上打开 @aosc_buildit_bot 的聊天窗口即可开始使用自动化向导。

## 登记维护者身份

输入如下命令：

```
/login
```

而后按照屏幕上的指示进行 GitHub 鉴权。在给 AOSC [“民政部”](https://github.com/AOSC-Dev/minzhengbu)应用提供权限后，请根据网页指示点击相关链接打开 @aosc_buildit_bot 聊天，**并重新点击 Bot 界面中的 Start 按钮。**

此时，您应该会收到如下消息：

```
Login successful!
```

至此，维护者身份已登记成功。

## 提交合并请求

以包含 `nano` 和 `ed` 包更新的 `editors-survey-20231231` 分支为例，输入如下命令即可提交合并请求：

```
/openpr Editors Survey December 2023;editors-survey-20231231;nano,ed
```

**注意：软件包的构建顺序为必要信息且需手动指定，用半角逗号 (,) 分隔！**

BuildIt! 会根据分支更改内容标记合并请求的标签 (label) 和需要构建二进制的架构列表。

如果您希望手动指定这些信息，如指定 `enhancement` 标签：

```
/openpr Editors Survey December 2023;editors-survey-20231231;nano,ed;enhancement
```

指定该包只在 `amd64` 架构构建：

```
/openpr Editors Survey December 2023;editors-survey-20231231;nano,ed;;amd64
```

同时手动指定这两个信息：

```
/openpr nano: update to 7.2;editors-survey-20231231;nano,ed;enhancement;amd64
```

**注意：在提交合并请求前，请注意使用 `git rebase stable` 命令与 `stable` 分支同步更改！**

## 测试构建

输入如下命令即可构建 Topic 分支中的软件包，以 `editors-survey-20231231` 分支对应的 #9999 号提交请求为例：

```
/pr 9999
```

如需为 `amd64` 架构构建该分支的 `nano` 包：

```
/build editors-survey-20231231 nano amd64
```

此时，BuildIt! 会在相应合并请求后跟帖汇报构建进度、结果和日志等信息；在构建完成后，也会自动将软件包推送至相应的测试源中。

## 将更新推送至稳定源

承接上述例子，在完成审阅、测试和合并流程后，重复上述命令：

```
/pr 9999
```

即可为稳定源构建和推送相关软件包。至此，自动化主题制维护流程结束。

# 其他命令

BuildIt! 还提供如下命令：

- `/status` 查看服务器和任务队列状态
- `/help` 查看帮助信息
