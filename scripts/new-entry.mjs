import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docsRoot = path.join(root, 'src/content/docs');

const kind = process.argv[2];
const rawTitle = process.argv.slice(3).join(' ').trim();

if (!kind || !rawTitle) {
  console.error('Usage: node ./scripts/new-entry.mjs <faq|kb> "Title or Question"');
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

const date = new Date().toISOString().slice(0, 10);
const slug = slugify(rawTitle);
const fileName = `${date}-${slug}.md`;
const outPath = path.join(docsRoot, dir, fileName);

if (fs.existsSync(outPath)) {
  console.error(`File already exists: ${outPath}`);
  process.exit(1);
}

const template = kind === 'faq'
  ? `---\ntitle: ${rawTitle}\ndescription: FAQ entry: ${rawTitle}\n---\n\n## Question\n\n${rawTitle}\n\n## Answer\n\nAdd a concise answer in plain language.\n\n## Details\n\nAdd extra context, caveats, and links if needed.\n`
  : `---\ntitle: ${rawTitle}\ndescription: Knowledge base article: ${rawTitle}\n---\n\n## Summary\n\nWrite a short overview of this issue or topic.\n\n## Symptoms\n\n- Describe what users observe.\n\n## Cause\n\nExplain the root cause.\n\n## Resolution\n\n1. Step one.\n2. Step two.\n3. Verify result.\n\n## Notes\n\nAdd platform-specific notes and follow-up actions.\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, template, 'utf8');

console.log(`Created ${path.relative(root, outPath)}`);
