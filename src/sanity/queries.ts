import { defineQuery } from 'next-sanity';

/**
 * GROQ sorguları.
 *
 * `defineQuery` sarmalayıcısı şart: `npm run content:types` sorguları bu
 * çağrılardan tarayıp dönüş tiplerini üretiyor, böylece `client.fetch(...)`
 * elle tip yazmadan tiplenmiş oluyor. Düz şablon dizesi kullanılırsa sorgu
 * `any` döner ve sessizce tip güvenliği kaybedilir.
 */

/** Bir dildeki bütün yazılar, yeniden eskiye. */
export const postsQuery = defineQuery(`
  *[_type == "post" && language == $language && defined(slug.current)]
    | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      coverImage,
      tags,
      author->{ name, role }
    }
`);

/** Tek yazı — dil + adres ile. */
export const postQuery = defineQuery(`
  *[_type == "post" && language == $language && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    tags,
    body,
    author->{ name, role, avatar, url }
  }
`);

/**
 * Bütün dillerdeki adresler — `generateStaticParams` ve site haritası için.
 * Gövde/görsel çekilmiyor: yalnız yol üretmek için gereken alanlar.
 */
export const postRoutesQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && defined(language)] {
    "slug": slug.current,
    language,
    _updatedAt
  }
`);
