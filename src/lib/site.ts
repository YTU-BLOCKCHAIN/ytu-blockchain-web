import type { Locale } from 'next-intl';

/**
 * Domain henüz kesinleşmedi (roadmap 1.D-4). Kanonik/OG/sitemap için taban URL
 * bu fallback'ten gelir; prod'da `NEXT_PUBLIC_SITE_URL` (Vercel env) ile override edilir.
 */
const FALLBACK_URL = 'https://ytu-blockchain.vercel.app';

/** Site geneli sabitler. */
export const siteConfig = {
  name: 'YTÜ Blockchain',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL,
  /**
   * İletişim/sponsor formlarının `mailto:` alıcısı ve gösterilen adres.
   * TODO(1.D): Gerçek kulüp e-postası kesinleşince güncelle (şimdilik yer tutucu).
   */
  contactEmail: 'iletisim@ytu-blockchain.example',
} as const;

/** next-intl locale → Open Graph `og:locale` eşlemesi. */
export const ogLocales: Record<Locale, string> = {
  tr: 'tr_TR',
  en: 'en_US',
};
