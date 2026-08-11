import { defineField, defineType } from 'sanity';

/**
 * Yazı yazarı. Dile bağlı değil — aynı kişi hem TR hem EN yazının altında
 * görünür, bu yüzden `documentInternationalization` kapsamına alınmadı.
 */
export const author = defineType({
  name: 'author',
  title: 'Yazar',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Ad soyad',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Ünvan',
      description:
        'Yazının altında adın yanında görünür. Örn. "Yönetim Kurulu Üyesi".',
      type: 'string',
    }),
    defineField({
      name: 'avatar',
      title: 'Profil fotoğrafı',
      // Alternatif metin yok: fotoğrafın hemen yanında adı zaten yazıyor,
      // ekran okuyucuya aynı bilgiyi iki kez okutmak gürültü olur. Sitede
      // `alt=""` ile dekoratif olarak basılacak.
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'url',
      title: 'Kişisel bağlantı',
      description: 'X, LinkedIn, GitHub ya da kişisel site. Boş bırakılabilir.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'avatar' },
  },
});
