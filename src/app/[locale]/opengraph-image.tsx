import { brandCard, contentType, size } from '@/lib/og';
import { siteConfig } from '@/lib/site';

/**
 * Sitenin varsayılan paylaşım kartı. Bu segmentte durduğu için altındaki bütün
 * sayfalar (hakkımızda, iletişim, topluluk, blog listesi…) devralıyor; yalnızca
 * kendi `opengraph-image` dosyasını tanımlayan segment üzerine yazıyor.
 */
export const alt = `${siteConfig.name} — Yıldız Teknik Üniversitesi Blockchain Kulübü`;
export { size, contentType };

export default async function Image() {
  return brandCard();
}
