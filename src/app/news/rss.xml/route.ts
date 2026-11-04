import { getDigests } from '@/lib/news';
import { siteConfig } from '@/lib/site';

/** Bültenler build sırasında belli: besleme statik üretiliyor. */
export const dynamic = 'force-static';

const LIMIT = 30;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RSS, RFC 822 tarih ister. Bülten 09:00 İstanbul'da (06:00 UTC) çıkıyor. */
function pubDate(date: string): string {
  return new Date(`${date}T06:00:00Z`).toUTCString();
}

export function GET() {
  const base = siteConfig.url.replace(/\/$/, '');
  const digests = getDigests().slice(0, LIMIT);

  const items = digests
    .map((digest) => {
      const url = `${base}/tr/news/${digest.date}`;
      const headlines = digest.items
        .map((item) => `- ${item.title}`)
        .join('\n');
      return `    <item>
      <title>${escapeXml(`Günlük Haber Bülteni · ${digest.date}`)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate(digest.date)}</pubDate>
      <description>${escapeXml(`${digest.summary}\n\n${headlines}\n\nYatırım tavsiyesi değildir. Bilgilendirme amaçlıdır.`)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteConfig.name} · Günlük Haber Bülteni`)}</title>
    <link>${base}/tr/news</link>
    <atom:link href="${base}/news/rss.xml" rel="self" type="application/rss+xml" />
    <description>Blockchain ve kripto dünyasından günün öne çıkan haberleri.</description>
    <language>tr</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
