import { getCollection } from 'astro:content';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function routeFromId(id: string) {
  if (!id.startsWith('blog/')) return null;
  if (id === 'blog/index' || id === 'blog/posting-guide') return null;
  if (id.startsWith('blog/years/') || id.startsWith('blog/tags/')) return null;

  const slug = id.slice('blog/'.length);
  return slug.endsWith('/index') ? slug.slice(0, -'/index'.length) : slug;
}

function inferDate(entry: { id: string; body?: string }) {
  const fmDate = /^date:\s*(.+)$/m.exec(entry.body ?? '');
  if (fmDate) return fmDate[1].trim().slice(0, 10);

  const metaDate = /^>\s*Originally published:\s*(\d{4}-\d{2}-\d{2})$/m.exec(entry.body ?? '');
  if (metaDate) return metaDate[1];

  const fromId = entry.id.match(/(\d{4}-\d{2}-\d{2})/);
  return fromId ? fromId[1] : '1970-01-01';
}

export async function GET(context: { site?: URL }) {
  const siteUrl = context.site?.toString().replace(/\/$/, '') ?? 'https://www.alchemyviewer.org';
  const docs = await getCollection('docs');

  const posts = docs
    .map((entry) => {
      const route = routeFromId(entry.id);
      if (!route) return null;
      const date = inferDate({ id: entry.id, body: entry.body });
      return {
        title: String((entry.data as { title?: string }).title ?? route),
        description: String((entry.data as { description?: string }).description ?? 'Alchemy blog post.'),
        link: `${siteUrl}/blog/${route}/`,
        pubDate: new Date(`${date}T00:00:00Z`),
      };
    })
    .filter((p): p is { title: string; description: string; link: string; pubDate: Date } => !!p)
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 50);

  const items = posts
    .map(
      (post) => `\n    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${post.link}</link>\n      <guid>${post.link}</guid>\n      <pubDate>${post.pubDate.toUTCString()}</pubDate>\n      <description>${escapeXml(post.description)}</description>\n    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Alchemy Viewer Blog</title>\n    <link>${siteUrl}/blog/</link>\n    <description>Alchemy development updates, release notes, and project news.</description>${items}\n  </channel>\n</rss>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
