---
title: Post title
date: 2026-10-12
description: One sentence that shows on the blog list and in the RSS feed.
tags: [open data, standards]
draft: true
---

Files starting with an underscore are ignored, so this template never appears on the site.
To write a post, copy this file to `src/posts/your-post-slug.md` (the file name becomes the
URL: `/blog/your-post-slug`), edit the frontmatter above and write below it in Markdown.

`draft: true` shows the post when running `pnpm dev` but leaves it out of the built site.
Delete the line (or set it to `false`) to publish.

## A heading

Paragraphs, **bold**, _italic_, [links](https://example.org), `inline code`, and:

- lists
- of things

> Block quotes.

```r
# fenced code blocks
library(sf)
```

Images go in `static/blog/` and are referenced as `![alt text](/blog/image.png)`.
