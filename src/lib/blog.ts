import { hasLocale, type Locale } from 'next-intl';

import { routing } from '@/i18n/routing';
import { sanityClient } from '@/sanity/lib/client';
import { postQuery, postRoutesQuery, postsQuery } from '@/sanity/queries';

/**
 * Blog sorgularının cache etiketi. `src/app/api/revalidate/route.ts` da bu
 * sabiti kullanıyor — iki yerde ayrı ayrı yazılsaydı birindeki yazım hatası
 * "webhook çalışıyor ama site tazelenmiyor" gibi sessiz bir arızaya dönerdi.
 */
export const POST_TAG = 'post';

/**
 * Tazelik iki katmanlı:
 *
 * - **Asıl yol webhook:** yazı yayınlanınca Sanity `/api/revalidate` ucunu
 *   çağırıyor, etiket geçersizleşiyor ve içerik saniyeler içinde sitede.
 * - **`revalidate` yalnızca emniyet ağı:** bir webhook teslimatı düşerse içerik
 *   en fazla bu kadar bayat kalır. Webhook geldiğine göre kısa tutmanın anlamı
 *   yok; her ziyaret sonrası yeniden sorgulamak ücretsiz plan kotasını boşuna
 *   yiyor.
 */
const POST_CACHE = { next: { tags: [POST_TAG], revalidate: 300 } };

export async function getPosts(language: Locale) {
  return sanityClient.fetch(postsQuery, { language }, POST_CACHE);
}

export async function getPost(language: Locale, slug: string) {
  return sanityClient.fetch(postQuery, { language, slug }, POST_CACHE);
}

/** Site haritası ve statik üretim için: bütün dillerdeki yazı adresleri. */
export async function getPostRoutes() {
  return sanityClient.fetch(postRoutesQuery, {}, POST_CACHE);
}

/** Sorgudaki `translations` parçasının eleman biçimi (bkz. queries.ts). */
type PostTranslation = {
  slug: string | null;
  language: string | null;
} | null;

/**
 * Bir yazının BAŞKA bir dildeki karşılığının adresi (`blokzincir-nedir`).
 *
 * TR ve EN sürümler ayrı dokümanlar ve slug'ları farklı, yani "aynı yolu öbür
 * dille kur" yaklaşımı 404 verir. Yazı sayfasındaki "İngilizce oku" bağlantısı
 * ve site haritası bu eşlemeden besleniyor.
 *
 * Karşılığı yoksa `null` — bağlantı o zaman hiç çizilmiyor.
 */
export function postTranslationSlug(
  translations: PostTranslation[] | null | undefined,
  locale: Locale,
): string | null {
  const match = (translations ?? []).find(
    (entry) => entry?.language === locale && entry.slug,
  );

  return match?.slug ?? null;
}

/**
 * Bir yazının çeviri bağlarını hreflang eşlemesine çevirir
 * (`{ tr: '/tr/blog/…', en: '/en/blog/…', 'x-default': … }`).
 *
 * TR ve EN sürümler ayrı dokümanlar ve slug'ları farklı; eşleme bu yüzden
 * tahminle değil, Sanity'deki çeviri bağlarından kuruluyor. Yazının çevirisi
 * yoksa `null` döner — tek dilli sayfaya hreflang basmak yanlış sinyal olur,
 * var olmayan adrese basmak düpedüz 404'e işaret ederdi.
 *
 * `base`: site haritası mutlak URL ister (`https://…`), sayfa metadata'sı ise
 * `metadataBase`e göre çözülen göreli yol — öntanımlı boş.
 */
export function postLanguageAlternates(
  translations: PostTranslation[] | null | undefined,
  base = '',
): Record<string, string> | null {
  const resolved = (translations ?? []).flatMap((entry) =>
    entry?.slug && hasLocale(routing.locales, entry.language)
      ? [{ slug: entry.slug, language: entry.language }]
      : [],
  );
  if (resolved.length < 2) return null;

  const languages: Record<string, string> = {};
  for (const entry of resolved) {
    languages[entry.language] = `${base}/${entry.language}/blog/${entry.slug}`;
  }

  // Dil tercihi eşleşmeyen ziyaretçi için öntanımlı sürüm — yalnızca o dilde
  // bir sürüm gerçekten varsa.
  const xDefault = languages[routing.defaultLocale];
  if (xDefault) languages['x-default'] = xDefault;

  return languages;
}

/**
 * Yayın tarihini okunur biçime çevirir ("11 Ağustos 2026").
 *
 * `timeZone: 'UTC'`: tarih Sanity'de UTC saklanıyor. Sunucunun yerel saatine
 * göre biçimlenirse gece yarısına yakın yayınlanan bir yazı sunucuda bir gün,
 * tarayıcıda başka bir gün görünür — üstelik ikisi uyuşmayınca React hydration
 * uyarısı verir.
 */
export function formatPostDate(
  value: string | null | undefined,
  locale: Locale,
): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
