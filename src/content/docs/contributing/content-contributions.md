---
title: Content Contributions
description: How to add and maintain FAQ and Knowledge Base content.
---

## Add A FAQ Entry

1. Run `yarn new:faq <category> "Your question"` (e.g. `yarn new:faq Settings "How do I...?"`)
2. Edit the generated file in `src/content/docs/faq/<category>/`
3. Keep answers short and direct
4. Add links to docs or downloads when useful

## Add A Knowledge Base Article

1. Run `yarn new:kb <category> "Article title"` (e.g. `yarn new:kb Avatar "Broken avatar"`)
2. Edit the generated file in `src/content/docs/knowledge-base/<category>/`
3. Include symptoms, cause, and resolution steps
4. Include verification steps at the end

## Adding Images

Place images in `images/<entry-slug>/` inside the category directory and reference with a relative path:

```markdown
![alt text](./images/<entry-slug>/file.webp)
```

Example for an entry `hide-everyone-except-friends.md` in `Settings/`:

```txt
faq/Settings/
  hide-everyone-except-friends.md
  images/
    hide-everyone-except-friends/
      screenshot1.webp
      screenshot2.webp
```

Use `.webp` format where possible for smaller file sizes.
Keep alt text descriptive for accessibility.

## Organizing Many Entries

Group related pages into **category subdirectories**. Each category has an `index.md` with `sidebar.label` set to control the sidebar group name.

```txt
src/content/docs/faq/
  index.md
  Settings/
    index.md                              ← sidebar.label: Settings
    hide-everyone-except-friends.md       ← entry (flat file)
    images/
      hide-everyone-except-friends/       ← entry images
        screenshot.webp
      another-entry/
        diagram.webp
  Avatar/
    index.md
    broken-avatar.md
    images/
      broken-avatar/
        example.webp
```

Create a new category by adding a subdirectory with an `index.md`:

```markdown
---
title: "Category Name FAQ"
sidebar:
  label: Category Name
---
```

The `sidebar.label` controls how it appears in the navigation — it does not need to match the directory name.

## Writing Standards

- One clear topic per page
- Use short headings and bullet points
- Prefer actionable steps over long prose
- Include platform notes for Linux, macOS, and Windows when behavior differs

## Review Checklist

- Title is clear and searchable
- Description explains scope in one sentence
- Steps are tested and reproducible
- Links are valid and up to date
