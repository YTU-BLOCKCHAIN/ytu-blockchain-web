/**
 * Google Analytics 4 ölçüm kimliği (`G-XXXXXXXXXX`).
 *
 * `NEXT_PUBLIC_` ön eki şart: değer build sırasında istemci paketine gömülüyor.
 * Gizli değil — ölçüm kimliği zaten her ziyaretçinin sayfa kaynağında görünür,
 * gizlenmesi de anlamsız (Turnstile site anahtarıyla aynı durum).
 *
 * TANIMSIZSA ÖLÇÜM TAMAMEN KAPALIDIR: ne gtag yüklenir ne de onay çubuğu çıkar.
 * Bu bilinçli: değişken yalnızca Vercel'in Production ortamına girilir, böylece
 * yerel geliştirme ve Preview deploy'ları gerçek rakamları kirletmez.
 */
export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Ziyaretçinin çerez kararının saklandığı `localStorage` anahtarı. Karar
 * çerezde DEĞİL localStorage'da tutuluyor: onay çerezinin kendisi için onay
 * almak gerekmesin diye (localStorage sunucuya hiç gönderilmez).
 */
export const CONSENT_STORAGE_KEY = 'ytub.analytics-consent';

/**
 * Footer'daki "Çerez tercihleri" bağlantısının çubuğu yeniden açmak için
 * yaydığı tarayıcı içi olay. Bağlantı ile çubuk DOM'un iki ayrı ucunda
 * (footer / sayfa altı katman) yaşıyor; ortak bir üst bileşene state taşımak
 * yerine `window` üzerinden konuşuyorlar.
 */
export const CONSENT_REOPEN_EVENT = 'ytub:consent-reopen';

/**
 * Kararın aynı sekmede değiştiğini duyuran olay. `storage` olayı yalnızca DİĞER
 * sekmelerde tetiklendiği için, kararı veren sekmenin kendisini haberdar etmeye
 * yetmiyor — çubuk ikisini birden dinliyor.
 */
export const CONSENT_CHANGE_EVENT = 'ytub:consent-change';

/** Ziyaretçinin ölçüm çerezlerine dair kararı. */
export type ConsentChoice = 'granted' | 'denied';

/**
 * gtag.js'ten ÖNCE çalışan Consent Mode v2 varsayılanı. Sayfanın HTML'ine düz
 * `<script>` olarak basılıyor; `next/script` ile gelen GA etiketi ancak
 * hidrasyondan sonra yükleniyor, dolayısıyla bu blok her zaman önce koşar.
 *
 * Hepsi `denied` başlıyor — kabul edilmediği sürece GA bileşeni zaten hiç
 * basılmıyor, bu satırlar ikinci savunma hattı: gtag başka bir yoldan sayfaya
 * girse bile çerez yazamaz. Reklam ölçümü (`ad_*`) kalıcı olarak kapalı;
 * kabul edilse bile yalnızca `analytics_storage` açılıyor.
 */
export const consentDefaultScript = `
(function(){
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
  var granted = false;
  try { granted = localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}) === 'granted'; } catch (e) {}
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: granted ? 'granted' : 'denied'
  });
})();
`.trim();
