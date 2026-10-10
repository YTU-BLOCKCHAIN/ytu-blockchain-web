import { brandCard, contentType, size } from '@/lib/og';

/**
 * Linktree sayfasının paylaşım kartı. Sayfa `[locale]` ağacının dışında
 * yaşadığı için oradaki kök kartı devralmıyor; dosya olmadan `/links` linki
 * kartsız paylaşılıyordu. Başlığı zaten site adı olduğu için marka kartı
 * yeterli.
 *
 * Dosya **bilerek `[[...locale]]` segmentinin üstünde**, yani `/links` ile
 * `/links/en` aynı kartı paylaşıyor. İki sebep:
 *
 * 1. Next isteğe bağlı catch-all'ın ALTINDA metadata rotası kabul etmiyor
 *    ("Optional catch-all must be the last part of the URL").
 * 2. Kartta yazı yok — marka kartı logodan ibaret, yani zaten dilden bağımsız.
 *    Dile göre değişen tek şey `og:image:alt` ve onu sayfanın
 *    `generateMetadata`sı yazıyor.
 */
export { size, contentType };

export default async function Image() {
  return brandCard();
}
