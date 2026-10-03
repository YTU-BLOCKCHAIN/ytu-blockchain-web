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

/**
 * Bir yazının diğer dillerdeki karşılıkları. `@sanity/document-internationalization`
 * çeviri bağlarını ayrı bir `translation.metadata` dokümanında tutuyor; bu
 * parça o dokümanı bulup her sürümün dilini ve adresini çıkarır (yazının kendisi
 * de listede gelir). hreflang alternatifleri ve site haritası bundan besleniyor:
 * TR/EN sürümlerin slug'ları farklı olduğundan eşleme tahminle kurulamaz.
 */
const TRANSLATIONS_FRAGMENT = `
  "translations": *[_type == "translation.metadata" && references(^._id)][0]
    .translations[]{
      "slug": value->slug.current,
      "language": value->language
    }
`;

/** Tek yazı — dil + adres ile. */
export const postQuery = defineQuery(`
  *[_type == "post" && language == $language && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    category,
    body,
    author->{ name, role, avatar, url },
    ${TRANSLATIONS_FRAGMENT}
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
    _updatedAt,
    ${TRANSLATIONS_FRAGMENT}
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
