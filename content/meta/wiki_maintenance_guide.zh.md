+++
title = "AOSC Wiki 维护指南"
description = "了解如何在 AOSC Wiki 上创建或编辑一个页面"
+++

# 目录结构

AOSC Wiki 采用 Zola（一个静态站点生成器）驱动，所以 AOSC Wiki 总体的目录结构和其它 Zola 站点的目录结构没有太大的差异，详见 [Zola 官方文档](https://www.getzola.org/documentation/getting-started/directory-structure/)。下面我们将着重介绍我们 `content` 目录的结构设计。我们使用 `content` 目录存放维基页面，几乎所有的维护工作都在这个目录进行。`content` 目录内部大体上是这样子的：

```bash
# Inside a mystical content folder...
/_index.md
/_index.zh.md
/top_level_post_a.md
/section_a/_index.md
/section_a/post_a.md
/section_a/post_b.md
/section_b/_index.md
/section_b/_index.zh.md
/section_b/post_c.md
/section_b/post_c.zh.md
/section_b/section_b_a/_index.md
```

我们使用目录来分隔不同类别的文章，例如使用 `developer/` 存放发行版开发相关的文章，同时我们通过目录的嵌套来显示类别和类别的层级关系，例如 `aosc-os/installation` 存放的是 AOSC OS 发行版安装的文章。为了避免让整个目录结构变得过于复杂，我们规定目录层级数不能超过三。`content` 目录下的每一个子目录以及 `content` 目录本身都有着多个有着 `.md` 后缀的文件，这些就是我们的文章，我们会在后面介绍如何创建或编辑这样的文件。

## 导览页

在每一个类别对应的目录下，我们都会建立一个特殊的页面 `_index.md`。这个页面起到的是导览的作用，我们使用这个页面告诉读者这个类别下有哪些文章，它们讲述的大概会是什么内容。

## 文件名

请不要为文件名添加不必要的前缀。例如 `packaging/packaging-basics.md` 就是不合适的，这是因为这个文件在渲染后会被映射到 `https://wiki.aosc.io/packaging/packaing-basics/`，整个网址会显得很冗长。对于这个例子，我们建议的命名是 `packaging/basics.md`。

## 翻译

AOSC Wiki 的默认语言为英语，所有文章（和导览页）的英文版本都按照 `filename.md` 的格式命名。这些文章（和导览页）的本地化译文则按照 `filename.LANG.md` 的格式命名，例如 `_index.zh.md`。目前站点支持的语言仅包括英文和简体中文，如果您希望为本站点添加其它语言的支持，可能另需要对 Zola 配置文件和模板文件做修改，详情请见 [Zola 官方文档](https://www.getzola.org/documentation/content/multilingual/)。请优先翻译导览页，避免导航功能无法正常工作。


# 文章内容与格式

前面提到，`.md` 后缀的文件就是我们的文章了。这些文件最终会被 Zola 渲染为 HTML 文件供读者在浏览器查看，渲染流程是全自动的。现在我们来研究一下这些文件：

```markdown
+++
title = "One Informative Wiki Article"
description = "An absolutely useful guide to nothing"
[taxonomies]
tags = ["some-tag"]
+++

Here's some content.
```

两个 `+++` 之间的内容是文章的文章头，它们记录了一篇文章的信息，例如标题、描述和标签等等。在文章头后面，则是文章正文，这里我们使用 Markdown 撰写文章，您可以在互联网找到大量的 Markdown 教程以助您开始写作，您也可以参考 AOSC Wiki [已有的文章](https://github.com/AOSC-Dev/wiki/tree/master/content)。请注意部分拓展 Markdown 语法在这里不一定生效。

## 站内链接

虽然您可以不对站内链接和站外链接做区分，直接使用 `[Some Hyperlink Title](/some_section/some_article/)` 这一写法。但是 Zola 为站内链接提供了正确性检查的功能，只需对上面的写法稍作修改 `[Some Hyperlink Title](@/some_section/some_article.md)`，即可使用到这一功能。我们希望您始终对站内链接使用后面的写法。

下面是一些正确的例子：

```markdown
[AOSC OS 适合我吗](@/aosc-os/is-aosc-os-right-for-me.zh.md)
[Packaging](@/developer/packaging/_index.md)
[AOSC: Our History](@/community/history.md)
```

下面是一些错误的例子：

```markdown
[AOSC OS 适合我吗](/zh/aosc-os/is-aosc-os-right-for-me)
[Packaging](/developer/packaging/)
[AOSC: Our History](https://wiki.aosc.io/community/history/)
```

Zola 在渲染各个文件时会将所有带有 `@` 标记的链接视为站内链接，在该标记后面紧跟的应该是 `.md` 文件及其在 `content` 中的路径。对于站内链接，Zola 将检查对应的 `.md` 文件是否存在。如果检查到文件不存在，也就意味着这是一个死链，此时 Zola 将终止渲染流程并报错。

# 站点调试与更改提交

目前，AOSC Wiki 的存储仓库位于 [GitHub](https://github.com/AOSC-Dev/wiki)。如果您仅仅是希望修改少量内容，您可以直接克隆该仓库，提交您的修改并推送回原仓库（或创建合并请求）。如果您修改了大量内容或是对站点做关键性的改动，您可能希望对站点进行调试。首先我们在本地安装 Zola，您可以在 AOSC OS 软件仓库中找到 `zola` 这个软件包：

```
# apt install zola
```

接下来我们克隆维基仓库并做出我们的修改，修改完成后，在维基仓库的根目录下执行：

```
$ zola serve
```

如果没有意外出现，接下来即可在 Zola 给出的网址预览您的站点。在预览期间您可以随时修改文章内容，预览站点将自动应用您的更改。如果您遇到构建失败的情况，请根据报错提示修复损坏的站内链接或执行相应的操作。