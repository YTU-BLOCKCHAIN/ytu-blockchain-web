import Image from 'next/image';

import { cn } from '@/lib/utils';

/**
 * Etkinlik kapağı — görsel KIRPILMADAN sabit oranlı bir kutuya sığdırılır,
 * kalan boşluk düz void.
 *
 * Neden kırpmıyoruz: kapakların çoğu Instagram'dan geliyor ve oranları
 * karışık (arşivde 101 kapağın ~35'i kare, ~22'si 4:5/3:4 dikey afiş, 16'sı
 * 9:16 reel kapağı, yalnızca ~28'i yatay). 16:10'a kırpınca afişin başlığı ve
 * tarihi kesiliyordu; her görsele elle odak noktası (hotspot) vermek de her
 * yeni afişte tekrarlanan bir iş. Kutuya sığdırmak kartların düzenini
 * bozmadan her oranı olduğu gibi gösteriyor.
 *
 * Zemin neden void: sayfa signal mavisi ve kapakların çoğu kulübün yine
 * #0154FF zeminli afişleri; koyu çerçeve olmadan afiş karta karışıyordu.
 * Eskiden aynı görselin bulanık kopyası vardı — fiilen bir gradient'ti ve
 * kit gradient'i yasaklıyor.
 */
export function EventCover({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  /** Kırpılmamış, yalnızca genişliği sınırlanmış görsel adresi. */
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Kutunun oranı, ör. `aspect-[16/10]`. */
  className?: string;
}) {
  return (
    <div className={cn('surface-void relative overflow-hidden', className)}>
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

/**
 * Kapağı olmayan etkinliğin yer tutucusu — kartlar aynı hizada dursun, boş
 * gri bir kutu da görünmesin. Etkinliğin ilk kurumunun (partner ya da
 * ekosistem) logosu ortada; hiç kurum yoksa kulübün amblemi.
 *
 * Kurum logoları kare ve çoğu beyaz zemine göre çizilmiş; o yüzden beyaz bir
 * kare içinde, zemin kapaklarla aynı void.
 */
export function EventPlaceholder({
  logoUrl,
  label,
  className,
}: {
  /** Ortadaki logo; yoksa kulübün amblemi. */
  logoUrl: string | null;
  /** Logonun altındaki küçük yazı — kurum adı ya da etkinlik türü. */
  label: string | null;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'surface-void relative flex flex-col items-center justify-center gap-3 overflow-hidden',
        className,
      )}
    >
      {/* Kare köşeli kutu: logoların çoğu kendi zeminiyle kare çizilmiş, daire
          onları köşelerinden kesiyordu. */}
      <span className="relative flex size-20 items-center justify-center overflow-hidden bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl ?? '/logo/mark.svg'}
          alt=""
          className="size-full object-contain"
        />
      </span>
      {label ? (
        // Büyük harfe çevrilmiyor: kurum adı marka ("Sui Hub Türkiye" →
        // "SUİ HUB" olurdu).
        <span className="font-display relative text-sm text-white">
          {label}
        </span>
      ) : null}
    </div>
  );
}
