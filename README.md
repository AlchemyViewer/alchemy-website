# Alchemy Website

Documentation and content site for Alchemy Viewer, built with Astro + Starlight.

## What This Repo Contains

- Public docs and pages under `src/content/docs`
- Blog posts and generated blog archive navigation under `src/content/docs/blog`
- FAQ and Knowledge Base content with helper scripts for new entries
- Site styling and assets for the Alchemy website

## Requirements

- Node.js 20+
- Yarn 1.x (classic)

## Local Development

Install dependencies:

```bash
yarn install
```

Start the dev server:

```bash
yarn dev
```

Notes:

- `yarn dev` runs blog index generation first, then starts Astro on `http://localhost:4321`.
- `yarn start` is the same as `yarn dev`.

## Build And Preview

Create a production build:

```bash
yarn build
```

Preview the build locally:

```bash
yarn preview
```

## Scripts

| Command | Purpose |
| :-- | :-- |
| `yarn dev` | Generate blog indexes, then run local dev server |
| `yarn build` | Generate blog indexes, then build the site |
| `yarn preview` | Preview the built site |
| `yarn blog:generate` | Regenerate blog overview, year, and tag pages |
| `yarn new:faq "Question"` | Create a dated FAQ draft in `src/content/docs/faq/` |
| `yarn new:kb "Title"` | Create a dated KB draft in `src/content/docs/knowledge-base/` |

## Content Workflow

## FAQ entries

Create a new FAQ draft:

```bash
yarn new:faq "Why does X happen?"
```

Then edit the generated file in `src/content/docs/faq/`.

## Knowledge Base articles

Create a new KB draft:

```bash
yarn new:kb "How to fix Y"
```

Then edit the generated file in `src/content/docs/knowledge-base/`.

## Blog posts

Create a blog markdown file in `src/content/docs/blog/` named:

```text
YYYY-MM-DD-your-title.md
```

Recommended frontmatter:

```md
---
title: Your Post Title
description: One sentence summary for previews and RSS.
date: 2026-05-30
tags: [release, alchemy]
---
```

After adding or editing posts, regenerate archive pages:

```bash
yarn blog:generate
```

`yarn dev` and `yarn build` already do this automatically.

## Blog generation behavior

`yarn blog:generate` does the following:

- Scans `src/content/docs/blog/` for post files
- Excludes reserved files (`index.md`, `posting-guide.md`, `authors.yml`) and generated folders (`years/`, `tags/`)
- Rebuilds:
  - `src/content/docs/blog/index.md`
  - `src/content/docs/blog/years/index.md` and yearly pages
  - `src/content/docs/blog/tags/index.md` and per-tag pages

Because these files are generated, do not hand-edit `blog/index.md`, `blog/years/*`, or `blog/tags/*` directly.

## Project Structure (high level)

```text
.
├── public/
├── scripts/
│   ├── generate-blog-index.mjs
│   └── new-entry.mjs
├── src/
│   ├── content/
│   │   └── docs/
│   │       ├── blog/
│   │       ├── faq/
│   │       ├── knowledge-base/
│   │       └── ...
│   └── styles/
├── astro.config.mjs
└── package.json
```

## Related Internal Docs

- Contributor content workflow: `src/content/docs/contributing/content-contributions.md`
- Blog posting guide: `src/content/docs/blog/posting-guide.md`
- Build docs for Alchemy viewer source: `src/content/docs/manual/build/index.md`
