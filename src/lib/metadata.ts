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
}: BuildMetadataOptions): Metadata {
  const suffix = pathname === '/' ? '' : pathname;
  const url = `/${locale}${suffix}`;

  const languages: Record<string, string> = {};
  for (const supported of routing.locales) {
    languages[supported] = `/${supported}${suffix}`;
  }
  languages['x-default'] = `/${routing.defaultLocale}${suffix}`;

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: ogLocales[locale],
      title,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
