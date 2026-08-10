/**
 * Başlıktan adres (slug) üretir — Studio'daki "Generate" düğmesinin yaptığı iş.
 *
 * Sanity'nin varsayılanı Türkçe için yanlış sonuç veriyor: kullandığı
 * `speakingurl` kütüphanesi ÖNTANIMLI OLARAK ALMANCA çeviriyor, yani `ü → ue`,
 * `ö → oe`. "YTÜ Blockchain" → `ytue-blockchain`, "Güvenliği" → `guevenligi`.
 * Adresler kalıcı ve paylaşılıyor; ilk yazı girilmeden düzeltilmesi gerekiyordu.
 *
 * `İ` büyük harfi `toLowerCase()`ten ÖNCE çevriliyor: JavaScript onu birleşik
 * noktalı `i̇` (i + U+0307) yapıyor. Sonraki aksan temizliği noktayı zaten
 * atardı ama bu tesadüfe güvenmenin anlamı yok.
 */
const TURKISH_LETTERS: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
  Ç: 'c',
  Ğ: 'g',
  İ: 'i',
  Ö: 'o',
  Ş: 's',
  Ü: 'u',
};

/** Adresin en fazla uzunluğu — şemadaki `maxLength` ile aynı olmalı. */
export const SLUG_MAX_LENGTH = 96;

export function slugify(input: string): string {
  return (
    input
      .replace(/[çğıöşüÇĞİÖŞÜ]/g, (letter) => TURKISH_LETTERS[letter] ?? letter)
      .toLowerCase()
      // Kalan aksanlı harfler (é, ñ, å...) → aksansız karşılıkları.
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Harf ve rakam dışındaki her şey tek tireye iner.
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, SLUG_MAX_LENGTH)
      // Kesme tam tirenin üstüne denk gelmiş olabilir.
      .replace(/-+$/, '')
  );
}
