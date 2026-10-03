import { brandCard, contentType, size } from '@/lib/og';
import { siteConfig } from '@/lib/site';

/**
 * Linktree sayfasının paylaşım kartı. Sayfa `[locale]` ağacının dışında
 * yaşadığı için oradaki kök kartı devralmıyor; dosya olmadan `/links` linki
 * kartsız paylaşılıyordu. Sayfa tek dilli (TR) ve başlığı zaten site adı,
 * marka kartı yeterli.
 */
export const alt = `${siteConfig.name} — Bağlantılar`;
export { size, contentType };

export default async function Image() {
  return brandCard();
}
