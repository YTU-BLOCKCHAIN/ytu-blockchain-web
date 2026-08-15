import { defineField, defineType } from 'sanity';

/**
 * Ana sayfadaki "Kazandığımız hackathonlar" karuselinin bir karesi.
 *
 * Dil **alan seviyesinde**: tek doküman, `award` ve `detail` içinde dil alt
 * alanları (gerekçe: `localized.ts`). `event`, `year`, görsel ve bağlantı
 * dilden bağımsız olduğu için tek yerde duruyor.
 *
 * Sıralama sorguda `year desc` — kayıtların Studio'daki sırası önemsiz, editör
 * elle sıralamakla uğraşmıyor. Aynı yıl içinde sonra eklenen üste geliyor.
 */
export const hackathon = defineType({
  name: 'hackathon',
  title: 'Hackathon',
  type: 'document',
  fields: [
    defineField({
      name: 'event',
      title: 'Etkinlik adı',
      description:
        'Markadır, çevrilmez — her iki dilde de aynı yazılır. Örn. "ETHIstanbul".',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'year',
      title: 'Yıl',
      description:
        'Kartın üstünde küçük yazıyla görünür ve sıralamayı belirler.',
      type: 'number',
      // Üst sınır yok: gelecekteki bir etkinlik önceden girilebilsin. Alt sınır
      // kulübün kuruluşundan öncesini engelliyor — 202 gibi eksik bir giriş
      // sessizce en alta düşerdi.
      validation: (rule) => rule.required().integer().min(2015),
    }),
    defineField({
      name: 'award',
      title: 'Derece',
      description: 'Örn. "1.\'lik" / "1st place". Kartta rozet olarak görünür.',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Not',
      description:
        'Takım, track ya da tek cümlelik hikâye. Boş bırakılabilir — o zaman kartta yer tutucu metin çıkar.',
      type: 'localizedText',
    }),
    defineField({
      name: 'image',
      title: 'Kare görseli',
      description:
        'Yatay (16:10 civarı) bir kare en iyi oturur. Boşsa kupa ikonlu yer tutucu çizilir.',
      type: 'image',
      // Alternatif metin yok: kartta etkinlik adı ve derece zaten yazıyor,
      // ekran okuyucuya aynı bilgiyi tekrar okutmak gürültü olurdu. Sitede
      // `alt` bu iki alandan üretiliyor.
      options: { hotspot: true },
    }),
    defineField({
      name: 'url',
      title: 'Duyuru bağlantısı',
      description:
        'Haber, X paylaşımı ya da etkinlik sayfası. Boş bırakılabilir.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: { event: 'event', year: 'year', award: 'award.tr', media: 'image' },
    prepare: ({ event, year, award }) => ({
      title: `${event}${year ? ` · ${year}` : ''}`,
      subtitle: award,
    }),
  },
});
