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
   * Verilirse sayfa `og:type=article` olur — blog yazıları için. Tarihler ISO
   * biçiminde; sosyal platformlar ve arama motorları yayın/güncelleme tarihini
   * buradan okur.
   */
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    authors?: string[];
  };
  /**
   * hreflang alternatifleri (locale → yol). Verilmezse sayfanın BÜTÜN dillerde
   * aynı yolda yaşadığı varsayılır — statik sayfalar için doğru. Blog yazıları
   * gibi dile göre adresi değişen sayfalar gerçek eşlemeyi geçmeli; `null`
   * alternatifleri tamamen kapatır (ör. çevirisi olmayan yazı — var olmayan
   * adrese hreflang vermekten kaçınmak için).
   */
  languageAlternates?: Record<string, string> | null;
};

/**
 * Bir sayfa için locale-aware metadata üretir: başlık, açıklama, kanonik URL,
 * hreflang alternatifleri ve Open Graph / Twitter kartları. `metadataBase`,
 * başlık şablonu ve robots kök layout'ta tanımlıdır.
 *
 * Kart görselini `opengraph-image.tsx` dosya konvansiyonu ÜRETİYOR (bkz.
 * `src/lib/og.tsx`), ama og/twitter etiketlerine adresi buradaki `images`
 * bloğu yazıyor — gerekçesi aşağıdaki yorumda.
 */
export function buildMetadata({
  locale,
  pathname,
  title,
  description,
  titleAbsolute = false,
  ogImagePath,
  article,
  languageAlternates,
}: BuildMetadataOptions): Metadata {
  const suffix = pathname === '/' ? '' : pathname;
  const url = `/${locale}${suffix}`;

  let languages: Record<string, string> | undefined;
  if (languageAlternates === undefined) {
    languages = {};
    for (const supported of routing.locales) {
      languages[supported] = `/${supported}${suffix}`;
    }
    languages['x-default'] = `/${routing.defaultLocale}${suffix}`;
  } else if (languageAlternates !== null) {
    languages = languageAlternates;
  }

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
      // Kart görselinde sayfanın başlığı yazıyor (ya da marka kartında logo);
      // alt metin sabit site adı yerine o başlığı taşımalı.
      alt: `${siteConfig.name} — ${title}`,
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
    alternates: languages ? { canonical: url, languages } : { canonical: url },
    openGraph: article
      ? {
          ...openGraphBase,
          type: 'article',
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
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
