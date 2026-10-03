import localFont from 'next/font/local';

/**
 * Marka kitindeki iki font (`ytu-brand/design.md`). Üçüncüsü eklenmez.
 *
 * Dosyalar depoya kopyalandı, ağdan çekilmiyor: kit deck'lerde base64 gömüyor,
 * sitede aynı garantiyi `next/font/local` veriyor — build sırasında hash'lenip
 * kendi kaynağımızdan servis ediliyor, üçüncü taraf isteği yok.
 */

/**
 * EAS VHS TR — display ve chrome. Her zaman büyük harf kullanılır.
 *
 * Bu dosya YAMALI bir sürüm: orijinal EAS VHS'te Ğ İ Ş ğ ş glifleri yoktu ve
 * rakamlar farklı genişlikteydi. Kitteki `tools/patch-eas-vhs.py` bu beş glifi
 * fontun kendi yarım-piksel ızgarasına (120.5 birim) oturtup rakamları tabular
 * hâle getiriyor. Font güncellenirse betik yeniden çalıştırılmalı — aksi hâlde
 * "BAŞVURU" gibi başlıklar sessizce bozulur.
 *
 * `display: 'block'`: display fontu yedek yüzle bir an görünüp sonra yerine
 * oturursa başlık gözle görülür şekilde zıplıyor. Kit de aynı değeri kullanıyor.
 */
export const displayFont = localFont({
  src: './eas-vhs-tr.woff2',
  weight: '400',
  style: 'normal',
  display: 'block',
  variable: '--font-display-face',
  // Yedek yüz monospace: EAS VHS tabular rakamlı ve dar; oransal bir yedek
  // (system-ui) yüklenene kadar satır uzunluğunu belirgin biçimde kaydırırdı.
  fallback: ['Courier New', 'monospace'],
});

/**
 * Clash Grotesk — gövde metni. Değişken ağırlık 200–700; sitede 400/500/600
 * kullanılıyor, tek dosya üçünü de karşılıyor.
 *
 * Küçük harf YALNIZ burada kullanılır (display fontu her zaman büyük harf).
 */
export const bodyFont = localFont({
  src: './clash-grotesk-variable.woff2',
  weight: '200 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-body-face',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});
