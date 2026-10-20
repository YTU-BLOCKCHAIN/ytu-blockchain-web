import Image from 'next/image';

import { cn } from '@/lib/utils';

/**
 * Etkinlik kapağı — görsel KIRPILMADAN sabit oranlı bir kutuya sığdırılır,
 * kalan boşluk aynı görselin bulanık kopyasıyla dolar.
 *
 * Neden kırpmıyoruz: kapakların çoğu Instagram'dan geliyor ve oranları
 * karışık (arşivde 101 kapağın ~35'i kare, ~22'si 4:5/3:4 dikey afiş, 16'sı
 * 9:16 reel kapağı, yalnızca ~28'i yatay). 16:10'a kırpınca afişin başlığı ve
 * tarihi kesiliyordu; her görsele elle odak noktası (hotspot) vermek de her
 * yeni afişte tekrarlanan bir iş. Kutuya sığdırmak kartların düzenini
 * bozmadan her oranı olduğu gibi gösteriyor.
 *
 * Bulanık zemin için ayrı, çok küçük bir kaynak (`blurSrc`, ~48px) iniyor:
 * zaten bulanıklaştırılacağı için çözünürlüğün önemi yok, sayfaya yük
 * bindirmiyor. Dekoratif olduğu için ekran okuyucudan gizli.
 */
export function EventCover({
  src,
  blurSrc,
  alt,
  sizes,
  priority = false,
  className,
}: {
  /** Kırpılmamış, yalnızca genişliği sınırlanmış görsel adresi. */
  src: string;
  blurSrc: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Kutunun oranı ve köşeleri, ör. `aspect-[16/10] rounded-[10px]`. */
  className?: string;
}) {
  return (
    <div
      className={cn(
        'before:border-foreground/10 bg-muted relative overflow-hidden before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:border',
        className,
      )}
    >
      <Image
        aria-hidden
        alt=""
        src={blurSrc}
        fill
        sizes="48px"
        className="scale-125 object-cover opacity-70 blur-2xl"
      />
      {/* Zemini koyulaştırır: açık renkli bir afişin bulanık kopyası öndeki
          görselle yarışmasın, kenarı belli olsun. */}
      <div aria-hidden className="absolute inset-0 bg-black/25" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="relative object-contain"
      />
    </div>
  );
}
