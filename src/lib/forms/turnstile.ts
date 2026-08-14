/**
 * Cloudflare Turnstile doğrulaması (sunucu tarafı).
 *
 * Turnstile, reCAPTCHA'nın çerez kullanmayan ve çoğu kullanıcıya hiçbir bulmaca
 * göstermeyen ücretsiz karşılığı — ziyaretçiyi izlemediği için aydınlatma
 * metnimize yeni bir veri işleme kalemi eklemiyor.
 *
 * İstemci widget'ı çözünce forma `cf-turnstile-response` adlı gizli bir alan
 * bırakır; buradaki `verifyTurnstile` o jetonu Cloudflare'e sorar. Jeton TEK
 * KULLANIMLIK, bu yüzden başarısız her denemeden sonra istemci widget'ı
 * sıfırlar (bkz. `site-form.tsx`).
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Cloudflare yavaşlarsa kullanıcı süresiz beklemesin. */
const VERIFY_TIMEOUT_MS = 10_000;

/**
 * `skipped`: doğrulama yapılmadı — ya anahtar tanımlı değil ya da Cloudflare'e
 * ulaşılamadı. Çağıran tarafta gönderim GEÇER (aşağıdaki gerekçeye bakın).
 */
export type TurnstileVerdict = 'ok' | 'failed' | 'skipped';

export async function verifyTurnstile(
  token: string,
  remoteIp: string | null,
): Promise<TurnstileVerdict> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  /*
    Anahtar yokken koruma kapalı: kulüp Cloudflare hesabını açana kadar formlar
    çalışmaya devam etsin. Honeypot, zaman tuzağı ve hız sınırı zaten yerinde.

    İKİSİ birden aranıyor. Yalnızca secret tanımlıysa (ör. Vercel'de bir ortama
    site key eklenmeyi unutulduysa) istemci widget'ı hiç basmaz, jeton üretilmez
    ve her gönderim "doğrulanamadı" diye reddedilirdi — form tamamen kırılırdı.
    Eksik yapılandırmada korumayı kapatmak, formu kapatmaktan iyidir.
  */
  if (!secret || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return 'skipped';

  // Widget çözülmeden gönderilmiş — ya JS engelli ya da istek arayüzden
  // geçmeden doğrudan Server Action'a atılmış.
  if (!token) return 'failed';

  const body = new URLSearchParams({ secret, response: token });
  // İsteğe bağlı: Cloudflare jetonu üretildiği IP ile karşılaştırır.
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });

    const result: unknown = await response.json();
    if ((result as { success?: unknown }).success === true) return 'ok';

    const codes = (result as { 'error-codes'?: unknown })['error-codes'];
    console.error(`Turnstile jetonu reddetti: ${JSON.stringify(codes)}`);
    return 'failed';
  } catch (error) {
    /*
      Cloudflare'e ULAŞILAMADI (kesinti, ağ hatası, zaman aşımı). Burada
      reddetmek yerine geçiriyoruz — bilinçli bir tercih: kesinti sırasında
      formu tamamen kapatmak, o sırada kaçabilecek birkaç spam'den daha pahalı.
      Üyelik başvuruları sessizce kaybolur ve kulüp bunu günlerce fark etmez.
      Reddedilen jeton (yukarıdaki `failed`) ile ulaşılamama farklı şeyler;
      yalnızca ikincisi geçiliyor ve loglanıyor.
    */
    console.error(
      `Turnstile doğrulamasına ulaşılamadı, gönderim geçirildi: ${String(error)}`,
    );
    return 'skipped';
  }
}
