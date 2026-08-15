import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { routing } from '@/i18n/routing';
import { ogLocales, siteConfig, xHandle } from '@/lib/site';

type BuildMetadataOptions = {
  locale: Locale;
  /** Locale ön eki olmadan sayfa yolu, ör. `/about` (anasayfa için `/`). */
  pathname: string;
  title: string;
  description: string;
  /** true ise başlık şablonu (`%s · ...`) uygulanmaz — anasayfa için. */
  titleAbsolute?: boolean;
  /**
   * Paylaşım kartını üreten rotanın yolu. Öntanımlı, dilin kök kartı; kendi
   * `opengraph-image.tsx` dosyası olan segmentler (blog yazıları) kendi
   * yollarını geçer.
   */
  ogImagePath?: string;
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
 *
 * Kart **görseli burada verilmiyor**: onu `opengraph-image.tsx` dosya
 * konvansiyonu üretiyor (bkz. `src/lib/og.tsx`). Next'te dosya tabanlı
 * metadata `generateMetadata`'yı ezdiği için buradan bir görsel geçmek sessizce
 * etkisiz kalırdı — tek kaynak dosya konvansiyonu.
 */
export function buildMetadata({
  locale,
  pathname,
  title,
  description,
  titleAbsolute = false,
  ogImagePath,
  article,
}: BuildMetadataOptions): Metadata {
  const suffix = pathname === '/' ? '' : pathname;
  const url = `/${locale}${suffix}`;

  const languages: Record<string, string> = {};
  for (const supported of routing.locales) {
    languages[supported] = `/${supported}${suffix}`;
  }
  languages['x-default'] = `/${routing.defaultLocale}${suffix}`;

  /*
    Paylaşım kartı görseli. Görseli `opengraph-image.tsx` dosya konvansiyonu
    üretiyor ama adresi BURADAN veriliyor, iki ölçülmüş sebeple:

    1. Dosya yalnızca kendi segmentine uygulanıyor, alt sayfalara devrolmuyor
       (`/tr` kart alırken `/tr/about` almıyordu).
    2. Dokümanın aksine `generateMetadata`, aynı segmentteki dosya
       konvansiyonunu eziyor — yani "dosya her zaman kazanır"a güvenilemiyor.

    Adresi açıkça geçmek ikisini de konu dışı bırakıyor: hangi sayfanın hangi
    kartı alacağı burada, tek yerde ve tahmine yer bırakmadan belli.
  */
  const images = [
    {
      url: ogImagePath ?? `/${locale}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: siteConfig.name,
    },
  ];

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
      // `site` burada da veriliyor: Next metadata'yı alan alan birleştirmiyor,
      // sayfanın `twitter` nesnesi layout'unkini komple değiştiriyor. Yalnız
      // layout'ta bıraksaydık hiçbir sayfada görünmezdi.
      card: 'summary_large_image',
      site: xHandle,
      title,
      description,
      images,
    },
  };
}
