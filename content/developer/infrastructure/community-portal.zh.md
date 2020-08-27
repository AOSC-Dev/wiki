+++
title = "门户网站"
description = "门户网站维护指南"
date = 2020-08-20T10:16:19.775Z
[taxonomies]
tags = ["infra"]
+++

# 目录结构

- 基本文件
    - `layouts/index.html` 站点首页
    - `layouts/404.html` 404 页面
    - `build.sh` 构建脚本
    - `config.yml` Hugo 配置文件

- 放置有 HTML 的目录
    - `contents/about`
    - `contents/downloads`
    - `contents/mail`
    - `contents/news`
    - `contents/people` 贡献者页面
    - `contents/repo`

- Hugo 数据文件目录
    - `data` 数据集
    - `assets/css` SCSS 样式文件
    - `layouts` 页面模板
    - `contents/news/post` 新闻文章

- 实用工具目录
    - `tools` 放置站点迁移使用的工具
    - `daemon` 镜像站信息生成器，提供了查询镜像站信息的 API

- 自动生成的目录
    - `public` 最终生成的目录
    - `assets/img/de-preview` 最终生成的略缩图
    - `resources/_gen` Hugo Pipe 生成的文件

# 在本地构建页面

安装 Hugo（如已安装可跳过此步）：

  - 如果您在使用 AOSC OS，您可以直接从软件仓库安装 Hugo：`sudo apt install hugo`。
  - 您也可以从 https://github.com/gohugoio/hugo/releases 获取编译好的版本。请务必下载增强版 `hugo_extended`。

站点构建与预览：

  - 执行 `build.sh` 生成站点。如果您对一些页面做了修改并希望预览效果，您可以执行 `hugo server` 并根据屏幕指示操作。
  
镜像站信息生成：

  - 首先确保您已经安装了 Python 3，接下来进入 `daemon/` 并在 `venv` 执行 `pip install -r requirements.txt`，然后执行 `python3 watcher.py`。

# 新建文章

## 使用 `hugo new`（推荐）

执行：

```
hugo new -k posts content/news/posts/YYYY-mm-dd-title.md
```

接下来使用您偏好的编辑器打开 `content/news/posts/YYYY-mm-dd-title.md` 并填入文章内容。

## 手动添加

只需在 `content/news/posts` 目录下创建 `YYYY-mm-dd-title.md` 文件。

在填入文章内容前，您需要参照下面的示例添加一个文件头：

```
---
categories:
  - news
title: "title"
date: 2006-01-02
important: false
---
```

请注意 `categories` 应该填写 `news` 和（或） `community`。

# 新建个人页面

## 使用 `hugo new`（推荐）

如果您希望使用 Markdown 写作（请注意这种情况下在文件中添加的 HTML 行将不会生效）：

```
hugo new -k people content/people/<preferred_name>.md
```

如果您希望使用 HTML 写作：

```
hugo new -k people content/people/<preferred_name>.html
```

# 注意事项


1. 无论是文章还是个人页面都不应该包含原始的 HTML 代码。即使您这样做，Hugo 在渲染 Markdown 的时候也会自动删除相应的代码。如果您确实想嵌入一些东西，可以考虑使用 [Hugo 内置的短代码解释器](https://gohugo.io/content-management/shortcodes/#use-hugos-built-in-shortcodes)。

1. 无论是文章还是个人页面都不应该包含类似 `{{ $something }}` 这样的模板语法，否着它们将被自动转义。如果您想使用模板化语法，您可能需要使用短代码，请参阅上面的文档。 


# 应用变更

直接将您的变更提交到 `master` 分支即可。站点的部署流程是自动的，详情可以看 [这里](https://dev.azure.com/AOSC-Dev/aosc-portal-kiss.github.io/_build?definitionId=1&_a=summary)。如果您没有相应的权限，您可以转而新建一个合并请求。
