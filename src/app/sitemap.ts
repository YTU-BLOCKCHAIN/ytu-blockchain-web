import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site';

/** Locale ön eki olmadan indekslenecek sayfa yolları. */
const PATHS = ['', '/about', '/projects', '/community', '/contact', '/join'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, '');

  // Linktree sayfası dil ön eki almaz → hreflang alternatifi de yok.
  const links: MetadataRoute.Sitemap[number] = {
    url: `${base}/links`,
    changeFrequency: 'weekly',
  };

  const localized = PATHS.map((path): MetadataRoute.Sitemap[number] => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = `${base}/${locale}${path}`;
    }

    return {
      url: `${base}/${routing.defaultLocale}${path}`,
      changeFrequency: 'monthly',
      alternates: { languages },
    };
  });

  return [...localized, links];
}
