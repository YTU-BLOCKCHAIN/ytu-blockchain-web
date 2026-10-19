import { defineField, defineType } from 'sanity';

/**
 * Birlikte etkinlik yaptığımız ya da bizi destekleyen kurum.
 *
 * Etkinliklerde düz metin yerine referans olarak tutuluyor: aynı kurum onlarca
 * etkinlikte geçiyor ("Sui", "Sui Network", "Sui Türkiye" gibi yazım farkları
 * listeyi bölüyordu) ve logo/bağlantı tek yerden güncellenebilmeli. İleride
 * bir sponsorlar bölümü de buradan beslenebilir.
 *
 * Dilden bağımsız: kurum adı markadır, çevrilmez.
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
      description: 'İsteğe bağlı. Şimdilik sitede kullanılmıyor.',
      type: 'image',
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
