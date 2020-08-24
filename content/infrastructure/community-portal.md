+++
title = "Portal Website"
description = "Maintenance Notes for Portal Website"
date = 2020-05-04T03:36:13.354Z
[taxonomies]
tags = ["infra"]
+++

# Basic Directory Structures

- Basic files
    - `layouts/index.html` Landing page
    - `layouts/404.html` Not found placeholder
    - `build.sh` Build script
    - `config.yml` Configuration for Hugo

- Directories containing HTML pages
    - `contents/about`
    - `contents/downloads`
    - `contents/mail`
    - `contents/news`
    - `contents/people` People pages
    - `contents/repo`

- Utility directories for Hugo
    - `data` Datasets for different pages
    - `assets/css` SCSS stylesheets
    - `layouts` Page templates
    - `contents/news/post` News posts

- Utility directory

    - `tools` Contains tools for converting or migrating from old website
    - `daemon` Mirror information aggregator, provides API for querying mirror status(-es)

- Automatically generated directories
    - `public` The final result
    - `assets/img/de-preview` Generated (downscaled) thumbnails
    - `resources/_gen` Hugo Pipe generated content

# Build the Pages Locally

- Required software packages
    1. `hugo`

- Install Hugo (You can skip this step if you already got Hugo installed)

    - AOSC OS has Hugo in the repository, if you are using AOSC OS, just do `sudo apt install hugo`
    - You can also download their precompiled version from https://github.com/gohugoio/hugo/releases. Please download the **extended version** as the normal version **WILL NOT WORK**!

- Generate/Live Preview

To generate pages, run `build.sh`. If you want to design or modify the pages and see the modifications in realtime, you can run `hugo server` and follow the on-screen instructions.

- Mirror Information Aggregator

To use this, you need `Python 3` and after switching to the directory `daemon/` run `pip install -r requirements.txt` in a `venv`. Then execute it: `python3 watcher.py`.

# Adding New Posts

## Using `hugo new` (recommended)

Run this:

```hugo new -k posts content/news/posts/YYYY-mm-dd-title.md```

Open the file `content/news/posts/YYYY-mm-dd-title.md` in your favorite text editor and edit away.

## Manually add new posts

Simply add a new file with the file name `YYYY-mm-dd-title.md` in the `content/news/posts` directory.

For "front-matter" (the metadata at the top), here is an example which you may want to copy:

```
---
categories:
  - news
title: "title"
date: 2006-01-02
important: false
---
```

Note that the `categories` could be `news` and/or `community`.

# Add New Personal Pages

## Using `hugo new` (recommended)

Run this if writing in Markdown format (note, in this case, inline HTML code will be removed from your page):

```hugo new -k people content/people/<preferred_name>.md```

Run this if writing in HTML format:

```hugo new -k people content/people/<preferred_name>.html```

# Caveats for Hugo

1. The posts/personal pages cannot contain raw HTML code, the raw HTML code will be stripped away by Hugo's Markdown renderer as a security precaution. If you want to embed something, check out [Hugo's builtin shortcode explainer](https://gohugo.io/content-management/shortcodes/#use-hugos-built-in-shortcodes).
1. The posts/personal pages cannot contain templating syntax like `{{ $something }}`, they will be escaped automatically. If you want to use templating syntax, you probably need to use shortcodes, see the documentation above.

# Publishing Your Changes

Simply push your commits to `master` branch. The deployment of the website is automated, you can see [the process here](https://dev.azure.com/AOSC-Dev/aosc-portal-kiss.github.io/_build?definitionId=1&_a=summary). If you don't have the permission to do so, you may open a new PR instead.
