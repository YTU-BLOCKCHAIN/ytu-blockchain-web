import { defineField, defineType } from 'sanity';

/**
 * Birlikte etkinlik yaptığımız ya da bizi destekleyen kurum.
 *
 * Etkinliklerde düz metin yerine referans olarak tutuluyor: aynı kurum onlarca
 * etkinlikte geçiyor ("Sui", "Sui Network", "Sui Türkiye" gibi yazım farkları
 * listeyi bölüyordu) ve logo/bağlantı tek yerden güncellenebilmeli. İleride
 * bir sponsorlar bölümü de buradan beslenebilir.
 *
 * Ad markadır, çevrilmez; yalnız kısa açıklama iki dilli.
 *
 * Bir zincirin ya da protokolün kendisi de (Ethereum, Solana) burada tutulur
 * ve `ecosystem` alanıyla etkinliklerdeki ekosistem etiketine bağlanır: kart
 * ve etkinlik sayfası o etiketin logosunu buradan bulur. Böyle bir kayıt
 * etkinliğin "Partnerler" satırında görünmez, yalnız logo şeridinde çıkar.
 */
export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Kurum adı',
      description: 'Markadır, çevrilmez. Örn. "Sui Türkiye", "Paribu Hub".',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'url',
      title: 'Web sitesi',
      description:
        'İsteğe bağlı. Etkinlik sayfasında kurum adı buraya bağlanır.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description:
        'Kare, sade bir ikon en iyisi; kartta 24px, üzerine gelince 40px gösteriliyor. Kapağı olmayan etkinlikte kapak yerine de bu kullanılır.',
      type: 'image',
    }),
    defineField({
      name: 'description',
      title: 'Kısa açıklama',
      description:
        'Logonun üzerine gelince çıkan tek cümle. Ör. "Move dilini kullanan bir Layer 1 blokzincir."',
      type: 'localizedString',
    }),
    defineField({
      name: 'ecosystem',
      title: 'Ekosistem etiketi',
      description:
        'Bu kurum bir etkinlikteki "Ekosistemler" etiketinin karşılığıysa o etiket, harfi harfine (ör. "Sui", "Ethereum"). O etiketi taşıyan etkinlikler bu logoyu da gösterir.',
      type: 'string',
    }),
  ],
  orderings: [
    {
      name: 'nameAsc',
      title: 'Ada göre',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'url', media: 'logo' },
  },
});
