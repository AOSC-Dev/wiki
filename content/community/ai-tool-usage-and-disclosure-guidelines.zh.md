+++
title = "安同开源社区 AI 辅助工具使用及披露约定"
description = "人类发起，人类开发，人类维护"
date = 2025-05-03
[taxonomies]
tags = ["community", "guidelines"]
+++

安同开源社区是由人类组成的，安同 OS 及周边项目是由人类发起、开发及维护的。因此，安同开源社区的所有代码或非代码贡献、拉取请求 (Pull Request) 及工单 (Issue) 的提交均由，也必须由人类完成。在安同开源社区范围内（包括 [AOSC-Dev](https://github.com/AOSC-Dev) GitHub 组织及 [AOSC-Tracking](https://github.com/AOSC-Tracking) GitHub 组织）贡献代码时，请务必遵循本约定内的要求。

本约定的条文旨在规范 LLM/大语言模型（亦有时称为“人工智能”、“AI”、“生成式 AI”或“代理型 AI”工具）使用情况的披露规则及明确责任划分。社区项目维护者们亦可在保障“贡献由人类发起、开发及维护”之约定原则的前提下，自行规定 LLM/大语言模型工具使用约定。

# 导言

安同开源社区的项目均以研究、教育和学习的目的而开发，我们希望贡献者在参与过程中专注于技能累积，而非追求绝对效率。但在 LLM/大语言模型工具辅助编程盛行的当下，不少人将其视为万能的工具，力求实现无人类参与监督的情况下完成工作，我们认为这是一种不负责任且与社区组织工作和目标直接冲突的行为。

有鉴于此，有必要对社区贡献活动中 LLM/大语言模型工具的使用和披露作出约定，核心思想如下：

1. 我们不欢迎任何不负责任的代码提交。
2. 您不能只负责撰写提示词，让 LLM/大语言模型工具代您完成思考、修改和测试过程。如果您没有参与其中任何过程，或不能理解修改的内容，您的贡献将被拒绝。
3. 您在提交时需要明确说明使用的 LLM 模型及提供商、Agent 平台，以及（部分情况下）使用的提示词。您同时需要保证您已自行审阅并理解 LLM 输出，且自身参与了决策、思考、撰写及验证过程。
4. 在 [ABBS 树](https://github.com/AOSC-Dev/aosc-os-abbs)中特定类型的提交里，您还需要保证您日后能够不借助 AI 工具独立完成同样的操作。

# AI 工具生成内容的许可

由于训练 AI 工具所使用模型的数据来源已超出当前版权及许可框架的边界，本约定暂不要求您保证 LLM 输出与社区项目的许可证相容。

但是，如果您的 LLM/大语言模型工具产生的代码或文档集成了其他项目的代码（包括直接复制粘贴及改写）或文档，请确保原项目的许可证与版权合规且与您贡献的项目兼容，并在必要时声明并引用相关版权及许可信息。

# 需要声明使用了 AI 工具的情况

向安同开源社区任一项目内提交贡献（不论是修改代码、提交资料或撰写提交信息、拉取请求标题和正文，以及工单标题和正文）时，如出现如下情况，需要声明 LLM/大语言模型工具使用情况：

- 提交的内容包含任何 LLM/大语言模型工具生成的内容或对 LLM/大语言模型工具生成内容的改写
- 在产生提交的过程中直接执行了由 LLM/大语言模型工具生成或建议的操作，如：
    - 执行了 LLM/大语言模型工具生成的命令或脚本
    - 由代理型 AI 工具自动化了工作流程

# 无需声明使用了 AI 工具的情况

如 LLM/大语言工具没有参与任何贡献撰写、修改或发布的过程，您无需声明 LLM/大语言工具的使用情况。

典型案例如下：

- 从 LLM/大语言工具的输出中获得任何项目的新功能灵感
- 从 LLM/大语言工具的输出中获得发起新项目的灵感
- 使用 LLM/大语言工具分析代码但未应用其建议的情况
- 使用 LLM/大语言工具总结但并未直接使用其输出的情况，如撰写提交消息、代码或正文时参考了 LLM/大语言工具搜集的资料

# 声明内容

您需要如实在拉取请求、提交及工单正文中声明如下内容：

- 使用的 LLM 模型及平台（或 LLM/大语言工具）
- 使用的代理型 AI 平台（如果有）
- 使用的提示词
- `Assisted-by:` 标签（撰写提交消息时，在正文中标记）；如果对应的 LLM 模型拥有自己公开的 Git 身份，需将其加入这一信息中

您在提交贡献、拉取请求和工单时还需承诺您已理解并验证相关内容，且修改有人工参与而非由 LLM/大语言模型工具无监督地完成。

针对 [ABBS 树](https://github.com/AOSC-Dev/aosc-os-abbs)内软件包更新、构建脚本修改等维护型提交，您还需要保证未来能够不借助 LLM/大语言工具的辅助独立完成同样的修改。您的贡献内容一旦发布，即代表您承诺如上内容。

## 提示词

- 提示词中无需说明实现细节，但必须有大致的实现目标或框架
- 如果您的提交由多轮对话完成，您只需说明您最初的提示词
- 您不需要声明对话过程中上传的任何附件，但不能将提示词嵌入到上传的附件中

## 模型和平台

- 如果您使用了由 LLM/大语言模型驱动的智能补全功能，请声明智能补全所属的提供商（如，GitHub Copilot）
- 如果您自行托管了 LLM/大语言模型工具使用的模型，请注明 `Self hosted`
- 如果您自行训练了 AI 辅助工具使用的模型，请注明 `Self trained, based on <model name>`
- 如果您没有使用代理型 AI 平台，可在对应的字段标注 `none`。

## `Assisted-by:` 标签

- 实践中，部分代理型 AI 平台会自动使用 `Co-authored-by:` 标签标注自己的身份；然而出于导言所述的原因，我们不认同其在您代码中的“作者”身份；您应当自行配置您的代理平台，或使用 `git commit --amend` 等方式将该标签替换为 `Assisted-by:`。
- 在 [AOSC-Tracking](https://github.com/AOSC-Tracking) 组织下，若一个仓库的上游对 `Assisted-by:`、`Co-authored-by:` 或其他类似标签使用有规定，则优先以上游规定为准，以方便更改的上游化。
  - 例如，[Linux Kernel](https://docs.kernel.org/process/coding-assistants.html) 同样采用了这一标签标注参与辅助的 AI 工具，但标注格式有所不同；因此，在 [AOSC-Tracking/linux](https://github.com/AOSC-Tracking/linux) 中，应当使用 Kernel 风格的标注格式。

# 特殊场合下的声明内容

## 通过 BuildIt! 发起的拉取请求

无需在拉取请求正文内声明，只需保证拉取请求中使用了 LLM/大语言模型工具辅助的提交所对应的提交消息正文中有相应声明即可。

## LLM/大语言模型工具辅助翻译

使用 LLM/大语言模型工具辅助翻译文档或文章时，您无需说明您使用的提示词。

## 由 LLM/大语言模型工具总结拉取请求或工单

使用 LLM/大语言模型工具总结拉取请求或工单正文时，您需要节选提示词重要的部分（如：您指定使用的 LLM/大语言模型工具所做的事）并删去示例文本（如其提供的代码、日志片段）。

## 明显的简单修改

内容明显的简单修改无需说明使用的提示词：

- 更新 [ABBS 树](https://github.com/AOSC-Dev/aosc-os-abbs)内的软件包，未修改任何构建脚本即编译通过
- 提交消息标题或正文内一句话可以概括的小规模修改

# 声明格式

## 提交正文

在提交正文后注明（请注意，提交正文一般限制在 72-75 字符，请根据项目要求调整行宽），格式如下：

```
This commit is authored with assistance from AI/LLM:

- Model: Model Name
- Platform: Platform Name (URL)
- Agent platform: Platform Name (URL)
- Prompt:
  multiline prompt here

# Uncomment and modify the following line accordingly if the model/agent
# used has a public Git identity:
# Assisted-by: Name <Email>
```

下面是可供参考的案例：

```
chore: add Vim mode

This patch adds Vim style operations to Nano. No more confusion when you
pressed ESC :wq!

Basic operations are supported:

- Normal, Insert and Visual mode (plus Visual+Insert mode)
- Basic commands (find, substitution, yank/paste, etc.)
- Action prefixes (count, ranges and registers)

[Rest of the text ...]

This commit is authored with assistance from AI/LLM:

- Model: Deepseek-v4
- Platform: Deepseek Web (chat.deepseek.com)
- Agent platform: none
- Prompt:
  I am so tired of distros that ship Nano only by default. So, you are
  given a task to implement basic Vim operations for GNU Nano.
  The resulting Nano must support the following features:
  - Modal interface (Insert, Visual and Normal and Insert+Visual mode)
  - Basic commands (find, substitution, yank/paste, navigation)
  - Action prefixes (count, ranges and registers)

Assisted-by: Claude <noreply@anthropic.com>
```

## 拉取请求及工单正文

您需要在相关正文后附加 AI 工具使用情况说明文本，格式如下：

````markdown
# AI Assistance Usage Declaration

- Model: Model Name
- Platform: Platform Name (URL)
- Agent platform: Platform Name (URL)
- Prompt:
```
multiline prompt here
```
````

下面是可供参考的案例：

````markdown
[...]

==================================

# AI Assistance Usage Declaration

This issue/PR is authored with assistance from AI/LLM:

- Model: `Deepseek-v4`
- Platform: Deepseek Web (chat.deepseek.com)
- Agent platform: none
- Prompt:
```
I've found a serious bug in AOSC OS, where `/etc/shadow` is globally
readable (mode 644). Please write/file a bug report according to the
following template:
[template not included]
```
````

# 责任

若出现对本约定的违反情况，社区成员可能会酌情：

- 要求您补全可能遗漏的信息；
- 要求您提供完整的代理日志，并能够解释 AI 所做的更改；
- 暂时拒绝您的贡献，并建议您对贡献做出大规模修改；等。

社区成员执行以上行为均需遵循 [AOSC 人际关系准则（长期征求意见稿）](@/community/guidelines.zh.md)。

# 后记

希望您在享受 AI 工具带来的便利的同时，也注意对 AI 工具的依赖程度，避免对自己的独立思考能力产生影响。

考虑到 AI 工具与范式仍然在不断变化，本约定也将不断修订。若您对本约定有意见或建议，欢迎通过我们的[群组](https://aosc.io/contact)联系我们，共同完善进步。
