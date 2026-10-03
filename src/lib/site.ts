import type { Locale } from 'next-intl';

/**
 * Kanonik/OG/sitemap için taban URL — kulübün alan adı (apex). Prod'da
 * `NEXT_PUBLIC_SITE_URL` (Vercel env) ile override edilebilir. DNS bağlama Faz 8.
 */
const FALLBACK_URL = 'https://ytublockchain.com';

/** Site geneli sabitler. */
export const siteConfig = {
  name: 'YTÜ Blockchain',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL,
  /** İletişim/sponsor formlarının `mailto:` alıcısı ve gösterilen adres. */
  contactEmail: 'dev@ytublockchain.com',
  /** Sponsorluk görüşmeleri için randevu takvimi (iletişim sayfasındaki buton). */
  bookingUrl: 'https://cal.com/ytublockchain',
  /**
   * Üyelik başvuru formu. Başvurular **yalnızca** buradan alınıyor: site
   * içinde ikinci bir form YOK, böylece başvurular tek bir yerde toplanıyor.
   * `/join` sayfası ve `/links` satırı aynı adrese gidiyor.
   */
  applicationFormUrl: 'https://forms.gle/i4SwuLnFhFcEEGQP9',
  /**
   * Kulübün resmî sosyal/topluluk kanalları.
   *
   * Hepsi burada çünkü adresler dört yerden okunuyor: `/links` sayfası,
   * footer, topluluk sayfası ve JSON-LD'deki `sameAs`. Daha önce WhatsApp,
   * Medium ve podcast YALNIZCA `content/links.json` içinde yaşıyordu, yani
   * ana siteyi gezen ziyaretçi kulübün en aktif kanallarını hiç görmüyordu.
   */
  social: {
    github: 'https://github.com/YTU-BLOCKCHAIN',
    x: 'https://x.com/BlockchainYtu',
    instagram: 'https://www.instagram.com/ytu_blockchain/',
    whatsapp: 'https://chat.whatsapp.com/JpClE5mXx8sJQ6ERIIrx0n',
    medium: 'https://medium.com/ytublockchain',
    spotify: 'https://open.spotify.com/show/5bA9wkC2zxASZCOKzu5EOX',
  },
  /** Notion'daki Web3 öğrenme yol haritası — `/roadmap` üzerinden sunuluyor. */
  roadmapPath: '/roadmap',
} as const;

/**
 * X kullanıcı adı, `@handle` biçiminde — paylaşım kartındaki `twitter:site`
 * için. Adresten türetiliyor ki hesap değişince tek yer güncellensin.
 */
export const xHandle = `@${new URL(siteConfig.social.x).pathname.replace(/\//g, '')}`;

/** next-intl locale → Open Graph `og:locale` eşlemesi. */
export const ogLocales: Record<Locale, string> = {
  tr: 'tr_TR',
  en: 'en_US',
};
