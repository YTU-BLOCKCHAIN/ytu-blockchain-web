import type { MetadataRoute } from 'next';
import { hasLocale } from 'next-intl';

import { routing } from '@/i18n/routing';
import { getPostRoutes, postLanguageAlternates } from '@/lib/blog';
import { linksPath, LOCALIZED_PATHS } from '@/lib/routes';
import { siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, '');

  /*
    Linktree sayfası: `/links/tr` ve `/links/en`. Paylaşılan `/links` adresi
    BİLEREK listede yok — o, tarayıcı diline göre bu ikisinden birini sunan bir
    kapı (bkz. `lib/routes.ts`), yani kanonik bir sayfa değil; sayfaların
    kanonik etiketi de buradaki adresleri gösteriyor. hreflang kümesi sayfanın
    `generateMetadata`sındakiyle birebir aynı olmalı.
  */
  const linksLanguages: Record<string, string> = {};
  for (const locale of routing.locales) {
    linksLanguages[locale] = `${base}${linksPath(locale)}`;
  }
  linksLanguages['x-default'] = `${base}${linksPath(routing.defaultLocale)}`;

  const links = routing.locales.map(
    (locale): MetadataRoute.Sitemap[number] => ({
      url: `${base}${linksPath(locale)}`,
      changeFrequency: 'weekly',
      alternates: { languages: linksLanguages },
    }),
  );

  const localized = LOCALIZED_PATHS.map(
    (path): MetadataRoute.Sitemap[number] => {
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
    },
  );

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

  return [...localized, ...links, ...posts];
}
