import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Blog yazısı.
 *
 * Dil **doküman seviyesinde**: her dil ayrı bir `post` dokümanı, aralarındaki
 * bağ `documentInternationalization` eklentisinin ürettiği
 * `translation.metadata` dokümanı üzerinden kuruluyor. Böylece bir yazı tek
 * dilde de var olabiliyor — çevirisi yoksa o dildeki listede hiç görünmez.
 *
 * `language` alanını editör doldurmaz; eklenti yazar (bu yüzden gizli ve
 * salt okunur). Eklenti yapılandırmasındaki `languageField` ile aynı adı
 * taşımak zorunda.
 */
export const post = defineType({
  name: 'post',
  title: 'Blog yazısı',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Adres',
      description:
        'Yazının adresi: /blog/<adres>. Başlıktan üretilir. Yayına aldıktan sonra DEĞİŞTİRME — paylaşılmış bağlantılar kırılır.',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Dil',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Yayın tarihi',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Özet',
      description:
        'Liste kartında, arama sonuçlarında ve sosyal medya önizlemesinde görünen 1–2 cümle.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'coverImage',
      title: 'Kapak görseli',
      description:
        'Liste kartında ve paylaşım önizlemesinde kullanılır. Yatay (16:9) görseller en iyi durur.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternatif metin',
          description:
            'Görseli göremeyen biri için tek cümlelik tarif — ekran okuyucular bunu okur.',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Yazar',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Etiketler',
      description: 'En fazla dört tane. Örn. "ethereum", "etkinlik".',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (rule) => rule.max(4).unique(),
    }),
    defineField({
      name: 'body',
      title: 'İçerik',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      name: 'publishedAtDesc',
      title: 'Yayın tarihi (yeniden eskiye)',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
      publishedAt: 'publishedAt',
      media: 'coverImage',
    },
    prepare({ title, language, publishedAt, media }) {
      const date =
        typeof publishedAt === 'string' ? publishedAt.slice(0, 10) : 'tarihsiz';
      const code = typeof language === 'string' ? language.toUpperCase() : '—';

      return { title, subtitle: `${code} · ${date}`, media };
    },
  },
});
