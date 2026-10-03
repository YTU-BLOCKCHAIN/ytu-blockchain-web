import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/site';

/**
 * Web uygulama manifestosu. Site bir PWA değil; manifest yine de var çünkü
 * Android'in "ana ekrana ekle"si ve bazı arama/paylaşım yüzeyleri adı, ikonu
 * ve tema rengini buradan okuyor. Renkler kartlardaki zeminle aynı (bkz.
 * `src/lib/og.tsx` BG).
 *
 * Manifest tek ve dilsizdir (`/manifest.webmanifest` — locale ön eki almaz),
 * o yüzden metinler çeviri dosyasından değil `siteConfig`ten geliyor.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  };
}
