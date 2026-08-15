import { getLocale } from 'next-intl/server';

import { getHackathons } from '@/lib/hackathons';
import { imageUrl } from '@/sanity/lib/image';

import { type HackathonSlide, HackathonsCarousel } from './hackathons-carousel';

/**
 * "Kazandığımız hackathonlar" bölümünün veri katmanı.
 *
 * Karusel istemci bileşeni (kaydırma durumu tarayıcıda) olduğu için verisini
 * kendisi çekemiyor — `LandingPosts` gibi tek parça olamamasının sebebi bu.
 * Burada Sanity'den çekilip düz veriye indirgeniyor, karusel yalnızca çiziyor.
 *
 * Dil burada indirgeniyor: kayıtlar iki dili birden taşıyor (alan seviyesinde
 * çeviri), karusele tek dilin metni iniyor.
 */
export async function LandingHackathons() {
  const locale = await getLocale();
  const hackathons = await getHackathons();

  const items: HackathonSlide[] = hackathons.map((hackathon) => ({
    key: hackathon._id,
    event: hackathon.event ?? undefined,
    year: hackathon.year ?? undefined,
    // Şema iki dili de zorunlu kılıyor; yine de `?.` ile geçiyoruz çünkü
    // üretilen tipler alanları isteğe bağlı sayıyor: doğrulama Studio'da
    // çalışıyor, Content Lake'te eski/eksik bir kayıt bulunması mümkün.
    award: hackathon.award?.[locale] ?? undefined,
    detail: hackathon.detail?.[locale] ?? undefined,
    // 16:10 — kartın mobildeki en/boy oranı. 2× ölçü retina ekran için.
    image: hackathon.image ? imageUrl(hackathon.image, 1200, 750) : undefined,
    url: hackathon.url ?? undefined,
  }));

  return <HackathonsCarousel items={items} />;
}
