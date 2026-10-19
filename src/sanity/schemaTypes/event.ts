import { defineArrayMember, defineField, defineType } from 'sanity';

import { EVENT_TYPES, REPORT_TYPES } from '../event-types';
import { sanityLanguages } from '../languages';
import { SLUG_MAX_LENGTH, slugify } from '../slugify';

/**
 * Etkinlik — `/events` listesinin bir kartı ve `/events/<adres>` sayfası.
 *
 * Dil **alan seviyesinde** (hackathon kaydıyla aynı gerekçe, bkz.
 * `localized.ts`): bir etkinliğin tarihi, yeri, görselleri ve bağlantıları
 * dilden bağımsız; yalnızca başlık, özet ve rapor çevriliyor. Doküman
 * seviyesinde olsaydı çevirisi girilmemiş bir etkinlik İngilizce listede hiç
 * görünmezdi — arşivin yarısı kaybolurdu.
 *
 * Bu yüzden adres de tek: `/tr/events/x` ile `/en/events/x` aynı slug.
 *
 * Tarih `date` + isteğe bağlı `time` olarak ayrı tutuluyor, `datetime` değil:
 * eski etkinliklerin çoğunun saati bilinmiyor ve `datetime` saati olmayan bir
 * etkinliği gece yarısına (UTC) sabitleyip İstanbul saatinde bir önceki güne
 * kaydırırdı.
 *
 * **Bu kayıtlar herkese açık okunur** (Sanity API'si şifresiz sorgulanabiliyor):
 * bütçe, katılımcı isim listesi, iletişim bilgisi gibi iç notlar buraya
 * girilmez — onların yeri Notion.
 */
export const event = defineType({
  name: 'event',
  title: 'Etkinlik',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Temel bilgiler', default: true },
    { name: 'place', title: 'Yer' },
    { name: 'report', title: 'Rapor' },
    { name: 'media', title: 'Görseller' },
    { name: 'links', title: 'Bağlantılar' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Etkinlik adı',
      description:
        'Türkçe ve İngilizce. Marka adları çevrilmez: "Blockchain 101" iki dilde de aynı.',
      type: 'localizedString',
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Tarih',
      description:
        'Etkinliğin (başlangıç) günü. Liste bu tarihe göre dizilir; bugünden sonraki etkinlikler "Yaklaşan" bölümüne düşer.',
      type: 'date',
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Bitiş tarihi',
      description: 'Yalnızca birden fazla gün süren etkinlikler için.',
      type: 'date',
      group: 'basics',
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const date = (context.document as { date?: string } | undefined)
            ?.date;
          if (!endDate || !date) return true;
          return endDate >= date
            ? true
            : 'Bitiş tarihi başlangıçtan önce olamaz.';
        }),
    }),
    defineField({
      name: 'time',
      title: 'Saat',
      description: 'İsteğe bağlı, İstanbul saatiyle. Örn. 17:00',
      type: 'string',
      group: 'basics',
      validation: (rule) =>
        rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: 'SS:DD' }),
    }),
    defineField({
      name: 'slug',
      title: 'Adres',
      description:
        'Etkinliğin adresi: /events/<adres>. Tarih ve Türkçe addan üretilir. Yayına aldıktan sonra DEĞİŞTİRME — paylaşılmış bağlantılar kırılır.',
      type: 'slug',
      group: 'basics',
      options: {
        // Başa tarih: "Blockchain 101" her yıl tekrarlanıyor, yalnız addan
        // üretilen adres ikinci yılda çakışırdı.
        source: (doc) => {
          const { date, title } = doc as {
            date?: string;
            title?: { tr?: string };
          };
          return [date, title?.tr].filter(Boolean).join(' ');
        },
        maxLength: SLUG_MAX_LENGTH,
        slugify,
      },
      validation: (rule) =>
        rule.required().custom((slug) => {
          const value = slug?.current;
          if (!value) return true;
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
            ? true
            : 'Yalnızca küçük harf, rakam ve tire kullanılabilir. "Generate" düğmesi doğru biçimi üretir.';
        }),
    }),
    defineField({
      name: 'type',
      title: 'Tür',
      description: 'Listedeki süzgeç bundan geliyor.',
      type: 'string',
      group: 'basics',
      options: {
        list: EVENT_TYPES.map(({ value, studioTitle }) => ({
          value,
          title: studioTitle,
        })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'series',
      title: 'Seri',
      description:
        'Tekrarlanan etkinlikler için ortak ad: "Blockchain 101", "Chit Chat Chain", "Solidity Eğitimi". Aynı serideki etkinlikler sayfada birbirine bağlanır. Yazımı her seferinde aynı olmalı.',
      type: 'string',
      group: 'basics',
    }),
    defineField({
      name: 'ecosystems',
      title: 'Ekosistemler',
      description: 'Konu ya da destekçi zincirler: Sui, Solana, Ethereum…',
      type: 'array',
      group: 'basics',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'partners',
      title: 'Partnerler',
      description:
        'Birlikte düzenlediğimiz, destekleyen ya da ev sahipliği yapan kurumlar. Listede yoksa önce sol menüden partner oluştur.',
      type: 'array',
      group: 'basics',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'partner' }] })],
    }),
    defineField({
      name: 'speakers',
      title: 'Konuşmacılar / eğitmenler',
      description: 'Herkese açık olarak duyurulmuş adlar. Örn. "Turan Sert".',
      type: 'array',
      group: 'basics',
      of: [defineArrayMember({ type: 'string' })],
    }),

    defineField({
      name: 'online',
      title: 'Online',
      type: 'boolean',
      group: 'place',
      initialValue: false,
    }),
    defineField({
      name: 'venue',
      title: 'Mekân',
      description: 'Örn. "EEF D012", "Yıldız Kafe", "ODTÜ KKM".',
      type: 'string',
      group: 'place',
    }),
    defineField({
      name: 'city',
      title: 'Şehir',
      description:
        'Tek alan, iki dilde aynı görünür: yurt dışı şehirleri uluslararası adıyla yaz ("Lisbon", "Brussels").',
      type: 'string',
      group: 'place',
    }),
    defineField({
      name: 'country',
      title: 'Ülke',
      description:
        'İki harfli ülke kodu, büyük harfle: TR, FR, BE, PT… Sitede ziyaretçinin dilinde ad olarak görünür (TR → "Türkiye" / "Türkiye", FR → "Fransa" / "France").',
      type: 'string',
      group: 'place',
      // Ad yerine kod: İngilizce sayfada "Fransa" yazmasın diye. Adı
      // `Intl.DisplayNames` her dil için kendisi üretiyor (bkz. `countryName`).
      validation: (rule) =>
        rule.regex(/^[A-Z]{2}$/, { name: 'ülke kodu (ör. TR)' }),
    }),
    defineField({
      name: 'attendees',
      title: 'Katılımcı sayısı',
      description:
        'Yalnızca biliniyorsa. Tahmin yazma — boş bırakmak daha iyi.',
      type: 'number',
      group: 'place',
      validation: (rule) => rule.integer().min(0),
    }),

    defineField({
      name: 'summary',
      title: 'Özet',
      description:
        'İki dilde 2–4 cümle. Liste kartında ve paylaşım önizlemesinde görünür; "Kısa özet" seçiliyse rapor da budur.',
      type: 'localizedText',
      group: 'report',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reportType',
      title: 'Rapor',
      description:
        'Sayfadaki rapor bölümünde ne görüneceği. "Rapor yok" seçilirse sayfada bunu söyleyen bir satır çıkar.',
      type: 'string',
      group: 'report',
      options: {
        list: REPORT_TYPES.map(({ value, studioTitle }) => ({
          value,
          title: studioTitle,
        })),
        layout: 'radio',
      },
      initialValue: 'none',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'report',
      title: 'Tam rapor',
      description:
        'Önerilen başlıklar: Kısaca · Neler yaptık · Konuşmacılar · Katılım ve öne çıkanlar · Partnerler · Materyaller.',
      type: 'localizedBlockContent',
      group: 'report',
      hidden: ({ document }) => document?.reportType !== 'full',
      // "Tam rapor" seçilip gövdesi boş bırakılırsa sayfada başlığı olan ama
      // içeriği olmayan bir bölüm çıkardı. Yarım çeviri de aynı sebeple kapıda.
      validation: (rule) =>
        rule.custom((report, context) => {
          if (context.document?.reportType !== 'full') return true;
          const value = report as Record<string, unknown[] | undefined> | null;
          const missing = sanityLanguages.filter(
            (language) => !value?.[language.id]?.length,
          );
          return missing.length === 0
            ? true
            : `Tam rapor seçildi ama şu dillerde boş: ${missing.map((l) => l.title).join(', ')}.`;
        }),
    }),
    defineField({
      name: 'summarySource',
      title: 'Özetin kaynağı',
      description:
        'Özet etkinliğin paylaşımlarından derlendiyse sayfada bunu söyleyen küçük bir not çıkar.',
      type: 'string',
      group: 'report',
      options: {
        list: [
          { value: 'manual', title: 'Elle yazıldı' },
          { value: 'instagram', title: 'Paylaşımlardan derlendi' },
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),

    defineField({
      name: 'cover',
      title: 'Kapak görseli',
      description: 'Yatay görseller en iyi durur. Kartta 16:10 kırpılır.',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternatif metin',
          description: 'Görseli göremeyen biri için tek cümlelik tarif.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galeri',
      description: 'Etkinlikten fotoğraflar.',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternatif metin',
              type: 'string',
            }),
          ],
        }),
      ],
      options: { layout: 'grid' },
    }),

    defineField({
      name: 'lumaUrl',
      title: 'Luma',
      description:
        'Kayıt sayfası. Yaklaşan etkinlikte "Kayıt ol" düğmesi olarak görünür.',
      type: 'url',
      group: 'links',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'instagramUrls',
      title: 'Instagram paylaşımları',
      type: 'array',
      group: 'links',
      of: [
        defineArrayMember({
          type: 'url',
          validation: (rule) => rule.uri({ scheme: ['https'] }),
        }),
      ],
    }),
    defineField({
      name: 'xUrls',
      title: 'X paylaşımları',
      type: 'array',
      group: 'links',
      of: [
        defineArrayMember({
          type: 'url',
          validation: (rule) => rule.uri({ scheme: ['https'] }),
        }),
      ],
    }),
    defineField({
      name: 'resources',
      title: 'Materyaller',
      description: 'Sunum, kayıt videosu, repo, yazı…',
      type: 'array',
      group: 'links',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'resource',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiket',
              type: 'string',
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: 'url',
              title: 'Bağlantı',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'featured',
      title: 'Öne çıkar',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
    }),
    defineField({
      name: 'hidden',
      title: 'Sitede gizle',
      description: 'Kaydı silmeden siteden kaldırır.',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      name: 'dateDesc',
      title: 'Tarih (yeniden eskiye)',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.tr',
      date: 'date',
      reportType: 'reportType',
      hidden: 'hidden',
      media: 'cover',
    },
    prepare({ title, date, reportType, hidden, media }) {
      const report =
        REPORT_TYPES.find((type) => type.value === reportType)?.studioTitle ??
        '—';
      return {
        title: `${hidden ? '[gizli] ' : ''}${title ?? 'Adsız etkinlik'}`,
        subtitle: `${date ?? 'tarihsiz'} · ${report}`,
        media,
      };
    },
  },
});
