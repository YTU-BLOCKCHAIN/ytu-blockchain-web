import type { Locale } from 'next-intl';

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
