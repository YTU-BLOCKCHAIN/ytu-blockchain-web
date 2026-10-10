import { hasLocale, type Locale } from 'next-intl';

import { routing } from '@/i18n/routing';

/**
 * Yol/adres kuralları. Bu dosya bilerek **içerikten bağımsız**: `/links`
 * adresini çözen yardımcıları proxy de kullanıyor (her istekte çalışıyor),
 * oraya `content/links.json`u ve doğrulamasını taşımak istemiyoruz.
 */

/**
 * Dil öneki alan sayfaların yolları — **tek kaynak**.
 *
 * İki yerden okunuyor: site haritası (`app/sitemap.ts`) bunların her dildeki
 * adresini yayınlıyor, `/links` sayfası ise içerik dosyasındaki bir yolun
 * önüne dil eki gelip gelmeyeceğine buradan karar veriyor. Liste ikiye
 * bölünseydi `content/links.json`a yazılan `/about` dil öneksiz kalır, proxy
 * de onu tarayıcı diline göre yönlendirirdi — yani İngilizce sayfadaki buton
 * ziyaretçiyi Türkçe sayfaya atabilirdi.
 *
 * Anasayfa bilerek boş dize: adres `/tr` biçiminde, sonunda eğik çizgi yok.
 *
 * **Bu listede OLMAYAN iç yollar dil öneki almaz.** `/roadmap`, `/brand` ve
 * `/logos` böyle: onlar sayfa değil, `next.config.ts`teki yönlendirmeler
 * (hedefleri Notion ve Drive).
 */
export const LOCALIZED_PATHS = [
  '',
  '/about',
  '/projects',
  '/community',
  '/blog',
  '/contact',
  '/join',
  '/privacy',
] as const;

/** `'/'` → `''`: içerik dosyasında anasayfa `/` yazılıyor, adreste eki yok. */
function normalize(path: string): string {
  return path === '/' ? '' : path;
}

/**
 * Yol dil öneki alan bir sayfaya mı ait?
 *
 * Alt yollar da sayılıyor (`/blog/blokzincir-nedir` → `/blog` sayfasının
 * altı): tam eşleşme arandığında böyle bir adres dil öneksiz kalır ve
 * proxy onu tarayıcı diline göre yönlendirir, yani sayfanın açıkça seçtiği
 * dil kaybolur.
 */
export function isLocalizedPath(path: string): boolean {
  const normalized = normalize(path);
  if (normalized === '') return true; // anasayfa
  return LOCALIZED_PATHS.some(
    (localized) =>
      localized !== '' &&
      (normalized === localized || normalized.startsWith(`${localized}/`)),
  );
}

/** `('en', '/projects')` → `/en/projects`; `('tr', '/')` → `/tr`. */
export function localizedHref(locale: Locale, path: string): string {
  return `/${locale}${normalize(path)}`;
}

/**
 * Yolun başındaki dil önekini yakalayan kalıp (`/tr`, `/en/projects`).
 * `routing.locales`ten türetiliyor ki üçüncü bir dil eklendiğinde burası
 * kendiliğinden kapsasın.
 */
export const LOCALE_PREFIX_PATTERN = new RegExp(
  `^/(${routing.locales.join('|')})(?:/|$)`,
);

/* ------------------------------------------------------------------ */
/* `/links` (linktree) adresleri                                      */
/* ------------------------------------------------------------------ */

/**
 * Linktree sayfasının adres düzeni, sitenin geri kalanından **farklı**:
 *
 * - `/links/tr` ve `/links/en` → her dilin kanonik adresi.
 * - `/links` → **kapı**: ziyaretçinin tarayıcı diline bakıp yukarıdakilerden
 *   birini sunar (proxy'de rewrite, yani adres çubuğunda `/links` kalır).
 *
 * Neden ayrı bir düzen: `/links` Instagram biyografisinde duruyor,
 * değiştirilemez ve tek bir adres olarak paylaşılıyor — hem Türk öğrenciye hem
 * yabancı bir sponsora aynı link gidiyor. Dil önekini next-intl proxy'sine
 * bırakamıyoruz çünkü o `/links`i `/tr/links`e yönlendirir; sayfa `[locale]`
 * ağacının dışında, kendi kök layout'unda yaşıyor (site kabuğu olmadan).
 */
export const LINKS_FALLBACK_LOCALE: Locale = 'tr';

/** `('en')` → `/links/en`. Her dilin kanonik linktree adresi. */
export function linksPath(locale: Locale): string {
  return `/links/${locale}`;
}

/**
 * URL'deki `[[...locale]]` segmentini dile çevirir.
 *
 * Segment yoksa (`/links`) Türkçeye düşülür: normalde oraya proxy'nin rewrite
 * etmesi beklenir, ama rewrite çalışmazsa (yerel `next start`, matcher hatası)
 * biyografideki adresin 404 vermesi kabul edilemez — o yüzden rota kendi
 * başına da bir şey gösterebiliyor.
 *
 * Tanınmayan segment `null` döner → 404.
 */
export function resolveLinksLocale(
  segments: string[] | undefined,
): Locale | null {
  if (segments === undefined || segments.length === 0) {
    return LINKS_FALLBACK_LOCALE;
  }
  if (segments.length !== 1) return null;
  const [requested] = segments;
  return hasLocale(routing.locales, requested) ? requested : null;
}

/**
 * `Accept-Language` başlığındaki dil etiketleri, tercih sırasına (q değeri)
 * göre. `*` atılıyor: "her dil olur" bir tercih değil.
 */
function preferredTags(header: string): string[] {
  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const quality = params
        .map((param) => /^\s*q=([\d.]+)\s*$/.exec(param))
        .find((match) => match !== null);
      return {
        tag: (tag ?? '').trim().toLowerCase(),
        q: quality ? Number(quality[1]) : 1,
      };
    })
    .filter(
      ({ tag, q }) => tag !== '' && tag !== '*' && !Number.isNaN(q) && q > 0,
    )
    .sort((a, b) => b.q - a.q)
    .map(({ tag }) => tag);
}

/**
 * `/links` kapısının kararı: ziyaretçiye hangi dil sunulacak?
 *
 * Kural, sitenin geri kalanıyla aynı (bkz. `i18n/routing.ts`): tarayıcı
 * Türkçe istiyorsa Türkçe, başka bir dil istiyorsa İngilizce.
 *
 * **Başlık hiç yoksa Türkçe** — ve bu, `routing.defaultLocale`den (EN)
 * bilinçli bir sapma. `Accept-Language` göndermeyen istemciler ağırlıkla link
 * önizlemesi üreten botlar (WhatsApp, X, Slack); kart Türkçe kalmalı, çünkü
 * bu adresi paylaşan da onu gören de çoğunlukla Türkçe konuşuyor. Dilini
 * SÖYLEYEN bir tarayıcıya ise söylediği dil veriliyor.
 *
 * (Sınırı burada: `Accept-Language: en-US` gönderen bir bot İngilizce kart
 * üretir. Başlığı olan bir isteği bot diye ayırmanın güvenilir yolu yok.)
 */
export function matchLinksLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return LINKS_FALLBACK_LOCALE;

  for (const tag of preferredTags(acceptLanguage)) {
    // `en-US` → `en`: alt etiket (bölge) dilimizi değiştirmiyor.
    const [language] = tag.split('-');
    if (hasLocale(routing.locales, language)) return language;
  }

  // Desteklemediğimiz bir dil istendi (ör. `de-DE`) → öntanımlı dil.
  return routing.defaultLocale;
}
