import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Gömülü Sanity Studio: editör arayüzü, indekslenecek içerik değil.
      // (Sayfa ayrıca `noindex` meta'sı da basıyor — bu ikinci savunma hattı.)
      disallow: '/studio',
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
