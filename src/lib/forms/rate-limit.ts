/**
 * Form gönderimleri için süreç içi (in-memory) hız sınırı.
 *
 * Redis/KV gerektirmez — ücretsiz ve anında çalışır. Karşılığında sınır SÜREÇ
 * BAŞINA geçerlidir: Vercel aynı anda birden çok sunucu örneği çalıştırırsa
 * gerçek sınır örnek sayısı kadar gevşer, örnek uykuya dalınca sayaç sıfırlanır.
 * Amaç hedefli bir saldırıyı durdurmak değil (o iş Turnstile'ın), tek bir
 * betiğin Sheets'i satırla ve Gmail'in günlük kotasını e-postayla doldurmasını
 * engellemek — her gönderim 2 e-posta demek (kulübe bildirim + onay).
 *
 * Sınır bilerek geniş: kampüs ve yurt ağlarında yüzlerce öğrenci aynı dış IP'yi
 * paylaşabiliyor, dar bir eşik etkinlik günlerinde gerçek başvuruları keserdi.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10;

/** Anahtar (IP) → penceredeki gönderim zamanları. */
const hits = new Map<string, number[]>();

/** Harita bu boyutu aşınca süresi geçmiş kayıtlar atılır (sınırsız büyümesin). */
const PRUNE_AT = 500;

function prune(now: number) {
  for (const [key, times] of hits) {
    if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(key);
  }
}

/**
 * Bir gönderim hakkı ister. `true` → geçebilir (ve hak düşülür), `false` →
 * pencere dolmuş. Sayma ile kontrol tek yerde: çağıran taraf hakkı düşmeyi
 * unutamaz.
 */
export function takeSubmissionSlot(key: string): boolean {
  const now = Date.now();
  if (hits.size > PRUNE_AT) prune(now);

  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    // Süresi geçmişleri temizlenmiş hâliyle geri yaz: pencere kaymaya devam
    // etsin, sınıra takılan kullanıcı sonsuza kadar kilitli kalmasın.
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  return true;
}
