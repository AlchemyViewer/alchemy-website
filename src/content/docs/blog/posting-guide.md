---
title: How To Publish A Post
description: Simple process for creating and publishing a new Alchemy blog post.
---

## Quick Start

1. Create a new file in `src/content/docs/blog/` named `YYYY-MM-DD-your-title.md`.
2. Add frontmatter using the template below.
3. Write your content in Markdown.
4. Run `yarn dev` and verify your post appears in Blog overview, year pages, and tag pages automatically.
5. Commit and publish.

## Post Template

```md
---
title: Your Post Title
description: One sentence summary for previews and RSS.
date: 2026-04-02
tags: [release, alchemy]
---

Your post content starts here.
```

## Images

- Place image files in a folder matching the post slug:
  - Example: `src/content/docs/blog/2026-04-02-your-title/`
- Reference images with relative paths:
  - `![Screenshot](./2026-04-02-your-title/screenshot.webp)`

## Best Practices

- Keep titles clear and specific.
- Keep descriptions short and informative.
- Use consistent tags like `release`, `beta`, `linux`, `feature`.
- Add download links or source links near the bottom when relevant.
