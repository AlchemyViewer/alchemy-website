import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docsRoot = path.join(root, 'src/content/docs');

const kind = process.argv[2];
const category = process.argv[3];
const rawTitle = process.argv.slice(4).join(' ').trim();

if (!kind || !rawTitle) {
  console.error('Usage: node ./scripts/new-entry.mjs <faq|kb> [category] "Title or Question"');
  console.error('  e.g. node ./scripts/new-entry.mjs faq Settings "How do I hide everyone?"');
  process.exit(1);
}

const dir = kind === 'faq' ? 'faq' : kind === 'kb' ? 'knowledge-base' : null;
if (!dir) {
  console.error('First argument must be faq or kb.');
  process.exit(1);
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

const slug = slugify(rawTitle);
const parentDir = category ? path.join(docsRoot, dir, category) : path.join(docsRoot, dir);
const outPath = path.join(parentDir, `${slug}.md`);
const imagesDir = path.join(parentDir, 'images', slug);

if (fs.existsSync(outPath)) {
  console.error(`File already exists: ${outPath}`);
  process.exit(1);
}

const template = kind === 'faq'
  ? `---\ntitle: "${rawTitle}"\ndescription: "FAQ entry: ${rawTitle}"\n---\n\n## Question\n\n${rawTitle}\n\n## Answer\n\nAdd a concise answer in plain language.\n\n## Details\n\nAdd extra context, caveats, and links if needed.\n\n## Images\n\n![alt text](./images/${slug}/example.webp)\n`
  : `---\ntitle: "${rawTitle}"\ndescription: "Knowledge base article: ${rawTitle}"\n---\n\n## Summary\n\nWrite a short overview of this issue or topic.\n\n## Symptoms\n\n- Describe what users observe.\n\n## Cause\n\nExplain the root cause.\n\n## Resolution\n\n1. Step one.\n2. Step two.\n3. Verify result.\n\n## Notes\n\nAdd platform-specific notes and follow-up actions.\n\n## Images\n\n![alt text](./images/${slug}/example.webp)\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, template, 'utf8');
fs.mkdirSync(imagesDir, { recursive: true });

console.log(`Created ${path.relative(root, outPath)}`);
console.log(`Created ${path.relative(root, imagesDir)}/`);
