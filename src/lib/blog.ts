import type { Locale } from 'next-intl';

import { sanityClient } from '@/sanity/lib/client';
import { postQuery, postRoutesQuery, postsQuery } from '@/sanity/queries';

/**
 * Blog içeriğini çeken katman.
 *
 * **Tazelik:** her istek `post` cache etiketiyle işaretleniyor. Bir sonraki
 * adımda kurulacak Sanity webhook'u yazı yayınlandığında bu etiketi
 * bayatlatacak ve sayfa saniyeler içinde tazelenecek. Webhook henüz yokken
 * içerik donup kalmasın diye ayrıca 60 saniyelik bir üst sınır var — webhook
 * devreye girince bu sınır yalnızca emniyet ağı olarak kalır.
 */
const POST_CACHE = { next: { tags: ['post'], revalidate: 60 } };

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
