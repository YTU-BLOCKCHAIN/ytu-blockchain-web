import { notFound } from 'next/navigation';

/**
 * Bilinmeyen adresleri markalı 404'e düşüren tutucu segment (next-intl'in
 * önerdiği kalıp). Bu dosya olmadan `/tr/olmayan-sayfa` Next'in çıplak
 * öntanımlı 404'üne düşüyordu: `not-found.tsx` kendiliğinden devreye girmez,
 * yalnızca aynı ağaçta bir rota eşleşip `notFound()` çağırdığında görünür.
 * Bu segment her eşleşmeyen adresi yakalayıp o çağrıyı yapıyor — ziyaretçi
 * böylece Header/Footer'lı, kendi dilindeki 404'ü görüyor.
 */
export default function CatchAllPage() {
  notFound();
}
