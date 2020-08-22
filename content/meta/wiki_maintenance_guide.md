+++
title = "Maintaining this Wiki"
description = "All you need to know about how to create and maintain Wiki pages."
+++

# File structure
If you are writing some wiki, your work should happen mostly within the `content` folder. Let's see what a typical content folder for the wiki looks like.

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

As you can see, a wiki is all about sections and posts inside sections (top-level posts are inside the root section). Sections can also be inside another section. We can (in theory) have infinitely deep sections, but for readability sake there should be at most three levels of sections. (`/a/b/c.md`).

Within a section, there's a special page named `_index.md`. This is the index page for this section. This page should contain a brief introduction to the contents of this section and links to key pages. Except root section, an index of all available pages and subsections will be rendered to the HTML page by the template automatically, but don't rely on it, since it may not be the optimal reading order to the readers.

## Translations
Translated version of the page should be named as `filename.LANG.md`. Note that if you have a translated article in a particular section, its section and all parent sections must have a translated index page (`_index.LANG.md`), or the navigation will be broken.

## Styling on filename
Generally, the filename of a page should not contain any unnecessary prefix. For example, `/packaging/packaging-basics.md` is not recommended since it would lead to a URL like `https://wiki.aosc.io/packaging/packaing-basics/`, which is verbose and unnecessarily long. Instead, just use `/packaging/basics.md`.

# Article format
Let's see what's in a typical wiki article. Here's what a bare minimal article looks like:

```markdown
+++
title = "One Informative Wiki Article"
description = "An absolutely useful guide to nothing"
[taxonomies]
tags = ["some-tag"]
+++

Here's some content.
```

The lines between the two `+++` are called the *frontmatter* of an article. These lines record information about the article, including title, description and its tags.

After this section, you can write your article with normal Markdown syntax. Do note that this site uses CommonMark, which means some extened Markdown syntax may not work.

## Special note on internal links
Because internal links are so important, Zola (the back-end for this site) has a special syntax for them. When you want to reference another article, instead of doing this:

```markdown
Nope: [Some Hyperlink Title](/some_section/some_article/)
Yes: [Some Hyperlink Title](@/some_section/some_article.md)
```

Then `@` sign tells Zola to find the link for an internal page, and replace the link with the actual link for that page. By doing so, Zola is able to check if the link is valid. And if the link points to an non-exist file, the build would fail.

