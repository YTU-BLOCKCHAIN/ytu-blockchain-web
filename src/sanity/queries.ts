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
      category,
      author->{ name, role, avatar }
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
    category,
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

/**
 * Ana sayfa karuseli için bütün hackathon kayıtları, yeniden eskiye.
 *
 * Dile göre süzülmüyor: dil alan seviyesinde tutuluyor (`award`/`detail`
 * içindeki alt alanlar), yani tek kayıt iki dili de taşıyor ve indirgeme
 * sunucu bileşeninde `localize()` ile yapılıyor.
 *
 * `year` eşit olursa sonra eklenen üste gelir; aksi halde aynı yıla ait iki
 * derecenin sırası sorgudan sorguya değişebilirdi.
 */
export const hackathonsQuery = defineQuery(`
  *[_type == "hackathon"] | order(year desc, _createdAt desc) {
    _id,
    event,
    year,
    award,
    detail,
    image,
    url
  }
`);
