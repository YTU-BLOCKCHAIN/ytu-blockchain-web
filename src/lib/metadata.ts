import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { routing } from '@/i18n/routing';
import { ogLocales, siteConfig } from '@/lib/site';

type BuildMetadataOptions = {
  locale: Locale;
  /** Locale ön eki olmadan sayfa yolu, ör. `/about` (anasayfa için `/`). */
  pathname: string;
  title: string;
  description: string;
  /** true ise başlık şablonu (`%s · ...`) uygulanmaz — anasayfa için. */
  titleAbsolute?: boolean;
  /** Paylaşım kartındaki görsel. 1200×630 önerilir. */
  image?: { url: string; alt: string };
  /**
   * Verilirse sayfa `og:type=article` olur — blog yazıları için. Tarih ISO
   * biçiminde; sosyal platformlar ve arama motorları yayın tarihini buradan
   * okur.
   */
  article?: { publishedTime: string; authors?: string[] };
};

/**
 * Bir sayfa için locale-aware metadata üretir: başlık, açıklama, kanonik URL,
 * hreflang alternatifleri ve Open Graph / Twitter kartları. `metadataBase`,
 * başlık şablonu ve robots kök layout'ta tanımlıdır.
 */
export function buildMetadata({
  locale,
  pathname,
  title,
  description,
  titleAbsolute = false,
  image,
  article,
}: BuildMetadataOptions): Metadata {
  const suffix = pathname === '/' ? '' : pathname;
  const url = `/${locale}${suffix}`;

  const languages: Record<string, string> = {};
  for (const supported of routing.locales) {
    languages[supported] = `/${supported}${suffix}`;
  }
  languages['x-default'] = `/${routing.defaultLocale}${suffix}`;

  const images = image
    ? [{ url: image.url, width: 1200, height: 630, alt: image.alt }]
    : undefined;

  const openGraphBase = {
    siteName: siteConfig.name,
    locale: ogLocales[locale],
    title,
    description,
    url,
    images,
  };

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages },
    openGraph: article
      ? {
          ...openGraphBase,
          type: 'article',
          publishedTime: article.publishedTime,
          authors: article.authors,
        }
      : { ...openGraphBase, type: 'website' },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}
