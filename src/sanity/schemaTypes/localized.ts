import { defineField, defineType } from 'sanity';

import { sanityLanguages } from '../languages';

/**
 * Dile bağlı metin alanları — **alan seviyesinde** çeviri.
 *
 * Blog'da dil doküman seviyesinde (her dil ayrı `post`), burada değil. Sebep:
 * bir hackathon kaydının çoğu alanı dilden bağımsız (etkinlik adı marka, yıl
 * sayı, görsel ve bağlantı ortak). Doküman seviyesine çıkarsaydık görseli iki
 * kez yüklemek, yılı iki kez yazmak gerekirdi ve çevirisi girilmemiş bir kayıt
 * o dilde **hiç görünmezdi** — kazanılmış bir dereceyi göstermek istediğimiz
 * yerde kötü bir hata modu.
 *
 * Alt alanlar `routing.locales`ten üretiliyor: siteye yeni bir dil eklendiğinde
 * Studio'da da kendiliğinden beliriyor, elle senkron tutulacak ikinci bir liste
 * kalmıyor. Karşılığı koddaki `Localized<T>` tipi (`src/lib/localized.ts`).
 *
 * Hepsi zorunlu: derleyicinin `Record<Locale, T>` ile verdiği "eksik çeviri
 * olamaz" garantisi Sanity'ye taşınınca kaybolur, o garantiyi burada Studio
 * doğrulaması geri veriyor.
 */
function localizedFields(rows?: number) {
  return sanityLanguages.map((language) =>
    defineField({
      name: language.id,
      title: language.title,
      type: rows ? 'text' : 'string',
      ...(rows ? { rows } : {}),
      validation: (rule) => rule.required(),
    }),
  );
}

/** Tek satırlık dile bağlı metin (ör. derece). */
export const localizedString = defineType({
  name: 'localizedString',
  title: 'Dile bağlı metin',
  type: 'object',
  fields: localizedFields(),
});

/** Çok satırlı dile bağlı metin (ör. tek cümlelik hikâye). */
export const localizedText = defineType({
  name: 'localizedText',
  title: 'Dile bağlı metin',
  type: 'object',
  fields: localizedFields(3),
});
