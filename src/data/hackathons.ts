import type { Localized } from '@/lib/localized';

/**
 * Ana sayfadaki "Kazandığımız hackathonlar" karuselinin veri modeli.
 * Projeler/üyeler gibi repo içi TS objesi — Sanity yok.
 *
 * Görseller `public/images/hackathons/` altına konur ve `image` alanına
 * `/images/hackathons/<dosya>.jpg` biçiminde yazılır. Yatay (16:10 civarı)
 * kareler en iyi oturur; kart görseli `object-cover` ile kırpar.
 *
 * Dizi boşken karusel yer tutucu kareler gösterir (sponsor slotları gibi),
 * kayıt eklendiğinde gerçek kareler otomatik listelenir.
 */
export type Hackathon = {
  /** Benzersiz kimlik (React key + olası detay bağlantısı için). */
  slug: string;
  /** Etkinlik adı — genelde markadır, dile bağlı değildir. */
  event: string;
  /** Derece/ödül (ör. "1.'lik" / "1st place") — dile bağlı. */
  award: Localized;
  /** Etkinlik yılı; kartta eyebrow olarak görünür. */
  year: number;
  /** Takım, track ya da tek cümlelik hikâye — dile bağlı, isteğe bağlı. */
  detail?: Localized;
  /** Kare görseli yolu (public/ altına göreli). Yoksa yer tutucu çizilir. */
  image?: string;
  /** Duyuru/haber bağlantısı (dış adres). */
  url?: string;
};

/**
 * Gerçek dereceler buraya eklenecek. Sıralama buradaki sıradır — en yeniyi
 * en üste koyun.
 */
export const hackathons: readonly Hackathon[] = [];
