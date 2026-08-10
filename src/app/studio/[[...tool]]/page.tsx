import { NextStudio } from 'next-sanity/studio';

import config from '../../../../sanity.config';

/**
 * Gömülü Sanity Studio — editörlerin blog yazdığı arayüz, `/studio` altında.
 *
 * `[[...tool]]` isteğe bağlı catch-all: Studio'nun bütün alt yollarını
 * (structure, vision, media…) tek sayfa karşılar.
 *
 * `force-static`: sayfanın kabuğu derleme anında üretilir — Studio içeriği
 * zaten tarayıcıdan Sanity'ye konuşarak geliyor, sunucunun yapacağı iş yok.
 *
 * `metadata`/`viewport` next-sanity'den geliyor: mobil uyumlu viewport ayarı
 * ve arama motorlarına `noindex` (Studio indekslenmemeli).
 */
export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
