import type { MetadataRoute } from 'next';
import { hasLocale } from 'next-intl';

import { routing } from '@/i18n/routing';
import { getPostRoutes, postLanguageAlternates } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

/** Locale ön eki olmadan indekslenecek sayfa yolları. */
const PATHS = [
  '',
  '/about',
  '/projects',
  '/community',
  '/blog',
  '/contact',
  '/join',
  '/privacy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    // Dil tercihi eşleşmeyen ziyaretçiye öntanımlı dil — sayfa metadata'sındaki
    // (`buildMetadata`) hreflang kümesiyle birebir aynı olmalı.
    languages['x-default'] = `${base}/${routing.defaultLocale}${path}`;

    return {
      url: `${base}/${routing.defaultLocale}${path}`,
      changeFrequency: 'monthly',
      alternates: { languages },
    };
  });

  /*
    Blog yazıları. Hreflang eşlemesi sabit sayfalardaki gibi tahminle DEĞİL,
    Sanity'deki çeviri bağlarından kuruluyor: bir yazının Türkçe ve İngilizce
    sürümü ayrı dokümanlar ve adresleri de farklı (`blokzincir-nedir` /
    `what-is-blockchain`), üstelik yazının her dilde karşılığı olmak zorunda
    değil. Çevirisi olmayan yazı alternates almaz.

    Sanity erişilemezse burada hata fırlar ve derleme kırılır. Bu bilinçli:
    içeriği sessizce eksik bir site haritası yayınlamaktansa deploy'un durması
    yeğdir.
  */
  const routes = await getPostRoutes();
  const posts = routes.flatMap((route): MetadataRoute.Sitemap => {
    const { slug, language } = route;
    if (!slug || !hasLocale(routing.locales, language)) return [];

    const languages = postLanguageAlternates(route.translations, base);

    return [
      {
        url: `${base}/${language}/blog/${slug}`,
        lastModified: new Date(route._updatedAt),
        changeFrequency: 'yearly',
        ...(languages ? { alternates: { languages } } : {}),
      },
    ];
  });

  return [...localized, links, ...posts];
}
