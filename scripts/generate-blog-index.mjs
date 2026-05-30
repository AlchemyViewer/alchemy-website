import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const blogDir = path.join(root, 'src/content/docs/blog');
const yearsDir = path.join(blogDir, 'years');
const tagsDir = path.join(blogDir, 'tags');

const RESERVED_PREFIXES = ['years/', 'tags/'];
const RESERVED_FILES = new Set(['index.md', 'posting-guide.md', 'authors.yml']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function routeFromRel(relPath) {
  const noExt = relPath.replace(/\.mdx?$/i, '');
  return noExt.endsWith('/index') ? noExt.slice(0, -'/index'.length) : noExt;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { fmRaw: '', body: content };
  return { fmRaw: match[1], body: content.slice(match[0].length) };
}

function getScalar(fmRaw, key) {
  const m = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(fmRaw);
  if (!m) return undefined;
  return m[1].trim().replace(/^['\"]|['\"]$/g, '');
}

function getTags(fmRaw, body) {
  const tags = [];
  const inline = /^tags:\s*\[(.*)\]\s*$/m.exec(fmRaw);
  if (inline && inline[1].trim()) {
    tags.push(
      ...inline[1]
        .split(',')
        .map((s) => s.trim().replace(/^['\"]|['\"]$/g, ''))
        .filter(Boolean)
    );
  }

  const block = /tags:\s*\n((?:\s*-\s*.+\n?)+)/m.exec(fmRaw);
  if (block) {
    tags.push(
      ...block[1]
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('- '))
        .map((l) => l.slice(2).trim().replace(/^['\"]|['\"]$/g, ''))
        .filter(Boolean)
    );
  }

  if (tags.length === 0) {
    const quotedMeta = /^>\s*Tags:\s*(.+)$/m.exec(body);
    if (quotedMeta) {
      tags.push(
        ...quotedMeta[1]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
  }

  return [...new Set(tags.map((t) => t.trim()).filter(Boolean))];
}

function inferDate(relPath, fmRaw, body) {
  const explicit = getScalar(fmRaw, 'date');
  if (explicit) return explicit.slice(0, 10);

  const fromMeta = /^>\s*Originally published:\s*(\d{4}-\d{2}-\d{2})$/m.exec(body);
  if (fromMeta) return fromMeta[1];

  const byName = relPath.match(/(\d{4}-\d{2}-\d{2})/);
  return byName ? byName[1] : '1970-01-01';
}

function inferDescription(fmRaw, body) {
  const explicit = getScalar(fmRaw, 'description');
  if (explicit) return explicit;

  const p = body
    .split('\n\n')
    .map((s) => s.trim())
    .find((s) => s && !s.startsWith('>') && !s.startsWith('#') && !s.startsWith('- '));

  if (!p) return 'Alchemy blog post.';
  return p.replace(/\s+/g, ' ').slice(0, 180);
}

function collectPosts() {
  const files = walk(blogDir)
    .filter((f) => /\.md$/i.test(f))
    .map((abs) => path.relative(blogDir, abs).replace(/\\/g, '/'))
    .filter((rel) => !RESERVED_FILES.has(rel))
    .filter((rel) => !RESERVED_PREFIXES.some((prefix) => rel.startsWith(prefix)));

  return files
    .map((rel) => {
      const abs = path.join(blogDir, rel);
      const src = fs.readFileSync(abs, 'utf8');
      const { fmRaw, body } = parseFrontmatter(src);
      const title = getScalar(fmRaw, 'title') || rel.replace(/\.md$/, '');
      const date = inferDate(rel, fmRaw, body);
      const tags = getTags(fmRaw, body);
      const description = inferDescription(fmRaw, body);
      const route = routeFromRel(rel);
      const year = date.slice(0, 4);

      return { rel, title, date, tags, description, route, year };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function removeGeneratedDirectories() {
  fs.rmSync(yearsDir, { recursive: true, force: true });
  fs.rmSync(tagsDir, { recursive: true, force: true });
}

function generateRootIndex(posts) {
  const tagCounts = new Map();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8);

  let md = '';
  md += '---\n';
  md += 'title: Blog\n';
  md += 'description: Alchemy development updates, release notes, and project news archive.\n';
  md += '---\n\n';
  md += 'Find release notes, development updates, and project news.\n\n';

  md += '## Browse\n\n';
  md += '- [Browse posts by year](./years/)\n';
  md += '- [Browse posts by tag](./tags/)\n';

  if (topTags.length > 0) {
    md += '\nTop tags: ';
    md += topTags.map(([tag]) => `[${tag}](./tags/${slugify(tag)}/)`).join(' | ');
    md += '\n';
  }

  md += '\n## Latest Updates\n\n';
  for (const post of posts.slice(0, 8)) {
    md += `- ${post.date} - [${post.title}](./${post.route}/)\n`;
    md += `  ${post.description}\n`;
  }

  writeFile(path.join(blogDir, 'index.md'), md);
}

function generateYearPages(posts) {
  const years = [...new Set(posts.map((p) => p.year))].sort((a, b) => Number(b) - Number(a));

  let index = '';
  index += '---\n';
  index += 'title: Blog By Year\n';
  index += 'description: Browse blog posts grouped by year.\n';
  index += '---\n\n';

  for (const year of years) {
    const yearPosts = posts.filter((p) => p.year === year);
    const filePath = path.join(yearsDir, `${year}.md`);

    let md = '';
    md += '---\n';
    md += `title: "${year}"\n`;
    md += `description: Alchemy blog posts from ${year}.\n`;
    md += '---\n\n';
    md += '[Back to Blog Overview](../)\n\n';
    md += `## Posts From ${year}\n\n`;
    for (const post of yearPosts) {
      md += `- ${post.date} - [${post.title}](../../${post.route}/)\n`;
    }

    writeFile(filePath, md);
    index += `- [${year}](./${year}/) (${yearPosts.length})\n`;
  }

  writeFile(path.join(yearsDir, 'index.md'), index);
}

function generateTagPages(posts) {
  const tagMap = new Map();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagMap.has(tag)) tagMap.set(tag, []);
      tagMap.get(tag).push(post);
    }
  }

  const sortedTags = [...tagMap.keys()].sort((a, b) => a.localeCompare(b));

  let index = '';
  index += '---\n';
  index += 'title: Blog Tags\n';
  index += 'description: Browse blog posts by topic tags.\n';
  index += '---\n\n';
  index += '[Back to Blog Overview](../)\n\n';

  for (const tag of sortedTags) {
    const slug = slugify(tag);
    const postsForTag = tagMap.get(tag).sort((a, b) => b.date.localeCompare(a.date));
    const filePath = path.join(tagsDir, `${slug}.md`);

    let md = '';
    md += '---\n';
    md += `title: Tag ${tag}\n`;
    md += `description: Blog posts tagged ${tag}.\n`;
    md += '---\n\n';
    md += '[Back to Tags](./)\n\n';
    md += `## ${tag}\n\n`;
    for (const post of postsForTag) {
      md += `- ${post.date} - [${post.title}](../../${post.route}/)\n`;
    }

    writeFile(filePath, md);
    index += `- [${tag}](./${slug}/) (${postsForTag.length})\n`;
  }

  writeFile(path.join(tagsDir, 'index.md'), index);
}

const posts = collectPosts();
removeGeneratedDirectories();
generateRootIndex(posts);
generateYearPages(posts);
generateTagPages(posts);

console.log(`Generated blog navigation for ${posts.length} posts.`);
