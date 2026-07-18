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
  /** Kulübün resmî sosyal/topluluk kanalları. */
  social: {
    github: 'https://github.com/YTU-BLOCKCHAIN',
    x: 'https://x.com/BlockchainYtu',
    instagram: 'https://www.instagram.com/ytu_blockchain/',
  },
} as const;

/** next-intl locale → Open Graph `og:locale` eşlemesi. */
export const ogLocales: Record<Locale, string> = {
  tr: 'tr_TR',
  en: 'en_US',
};
