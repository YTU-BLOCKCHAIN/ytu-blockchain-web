import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Yazı gövdesinin zengin metin tipi (Portable Text).
 *
 * Bilerek dar tutuldu: editörün seçebileceği her biçim, sitede karşılığını
 * yazmamız gereken bir bileşen demek. Buraya bir şey eklenirse
 * `PortableText` render tarafına da eklenmeli, yoksa içerik sessizce kaybolur.
 *
 * `h1` yok: sayfadaki tek `h1` yazının başlığı olmalı (SEO + ekran okuyucu
 * başlık hiyerarşisi). Editör en üstte `h2`den başlar.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'İçerik',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraf', value: 'normal' },
        { title: 'Başlık', value: 'h2' },
        { title: 'Alt başlık', value: 'h3' },
        { title: 'Alıntı', value: 'blockquote' },
      ],
      lists: [
        { title: 'Madde işaretli', value: 'bullet' },
        { title: 'Numaralı', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Kalın', value: 'strong' },
          { title: 'İtalik', value: 'em' },
          { title: 'Kod', value: 'code' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Bağlantı',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Adres',
                type: 'url',
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ scheme: ['http', 'https', 'mailto'] })
                    .error('https:// ile başlayan geçerli bir adres girin.'),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Görsel',
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
        defineField({
          name: 'caption',
          title: 'Açıklama',
          description: 'Görselin altında görünür. Boş bırakılabilir.',
          type: 'string',
        }),
      ],
    }),
  ],
});
