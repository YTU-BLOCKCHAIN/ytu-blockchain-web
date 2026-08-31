'use client';

import { useSyncExternalStore } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

import { buttonClasses } from '@/components/ui/button';
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_REOPEN_EVENT,
  CONSENT_STORAGE_KEY,
  type ConsentChoice,
} from '@/lib/analytics';

/**
 * Çubuğun metinleri prop olarak geliyor, `useTranslations` ile değil: bu bileşen
 * `/links` sayfasında da basılıyor ve orası `NextIntlClientProvider`'ın dışında
 * kendi kök layout'unda yaşıyor (bkz. `app/links/layout.tsx`). Metni sunucuda
 * çözüp aşağı vermek, iki kök layout'un tek bir çubuğu paylaşmasını sağlıyor.
 */
export type ConsentLabels = {
  title: string;
  body: string;
  accept: string;
  reject: string;
  privacy: string;
};

/**
 * Çubuğun üç durumu + bir "sunucu" durumu.
 *
 * `unknown` yalnızca ilk (sunucu) render'ında geçerli: karar `localStorage`'da
 * olduğu için sunucu ne olduğunu bilemez ve hiçbir şey basmaz. Bunun yerine
 * doğrudan `undecided` dönseydi, kararını çoktan vermiş herkeste çubuk bir kare
 * boyunca yanıp sönerdi.
 */
type ConsentState = ConsentChoice | 'undecided' | 'unknown';

/**
 * Onay geri çekilince GA'nın bıraktığı `_ga*` çerezlerini siler. Consent Mode
 * güncellemesi yeni çerez YAZILMASINI durdurur ama eskisini kaldırmaz; KVKK'da
 * rızanın geri çekilmesi verinin de silinmesi demek olduğu için bu şart.
 *
 * Aynı ad birden çok alan adı kapsamında yazılmış olabilir (GA apex alan adını
 * kullanır, `www` üzerinden gelen ziyarette değer alt alana da düşebilir);
 * silme yalnızca yazıldığı kapsamda çalıştığı için üç olasılık da denenir.
 */
function clearGaCookies() {
  const host = window.location.hostname;
  const apex = host.split('.').slice(-2).join('.');
  const scopes = ['', `; domain=${host}`, `; domain=.${apex}`];

  for (const entry of document.cookie.split(';')) {
    const name = entry.split('=')[0]?.trim();
    if (!name?.startsWith('_ga')) continue;

    for (const scope of scopes) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${scope}`;
    }
  }
}

/** gtag.js henüz yüklenmemişken de güvenli: komut `dataLayer` kuyruğunda bekler. */
function updateGtagConsent(choice: ConsentChoice) {
  window.gtag?.('consent', 'update', { analytics_storage: choice });
}

/**
 * Kararı kaydeder ve çubuğu dinleyen herkesi haberdar eder. Bileşenin dışında:
 * state'e değil `localStorage`'a yazıyor, o yüzden render'dan bağımsız.
 */
function decide(choice: ConsentChoice) {
  // Gizli sekmede ve depolama kapalı tarayıcılarda erişim istisna fırlatır;
  // karar o oturumda hatırlanmaz ama çubuk yine de kapanır.
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {}

  updateGtagConsent(choice);
  if (choice === 'denied') clearGaCookies();

  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

/**
 * Footer'daki "Çerez tercihleri" bağlantısının karşılığı: kayıtlı kararı siler,
 * böylece çubuk yeniden çıkar. Tercihleri açmak rızayı ANINDA geri çeker —
 * yeniden karar verilene kadar ortada geçerli bir rıza yok, ölçüm de durur.
 */
function withdrawConsent() {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {}

  updateGtagConsent('denied');
  clearGaCookies();
}

function subscribeToConsent(onStoreChange: () => void) {
  const reopen = () => {
    withdrawConsent();
    onStoreChange();
  };

  window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  // Başka sekmede verilen karar bu sekmeye de yansısın.
  window.addEventListener('storage', onStoreChange);

  return () => {
    window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function readConsent(): ConsentState {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') return stored;
  } catch {}

  return 'undecided';
}

const readConsentOnServer = (): ConsentState => 'unknown';

/**
 * Çerez onay çubuğu ve GA etiketinin kapısı.
 *
 * Kural: **ziyaretçi kabul etmeden `<GoogleAnalytics />` hiç basılmaz**, yani
 * googletagmanager.com'a tek bir istek bile gitmez. Consent Mode'un "yükle ama
 * reddedilmiş say" modeli yerine bu sıkı yorum tercih edildi — KVKK'da
 * savunması daha kolay ve kulüp sitesi için kaybedilen veri önemsiz.
 *
 * Karar React state'inde değil `localStorage`'da yaşıyor; `useSyncExternalStore`
 * de tam olarak bunun için: aynı karar footer'daki bağlantıdan ve diğer
 * sekmelerden de değişebiliyor.
 */
export function ConsentBanner({
  gaId,
  privacyHref,
  labels,
}: {
  gaId: string;
  privacyHref: string;
  labels: ConsentLabels;
}) {
  const state = useSyncExternalStore(
    subscribeToConsent,
    readConsent,
    readConsentOnServer,
  );

  if (state === 'granted') return <GoogleAnalytics gaId={gaId} />;
  if (state !== 'undecided') return null;

  return (
    /* `dialog` ama `aria-modal` değil: çubuk sayfanın kullanımını engellemiyor,
       odak da hapsedilmiyor — karar verilene kadar zaten hiçbir ölçüm yok. */
    <div
      role="dialog"
      aria-label={labels.title}
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="bg-card border-border mx-auto flex max-w-3xl flex-col gap-4 rounded-lg border p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-foreground text-sm font-medium">{labels.title}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {labels.body}{' '}
            {/* i18n `Link`'i değil düz `<a>`: bu bileşen `/links` kökünde de
                basılıyor ve orada next-intl yönlendiricisi yok. Adresin dil
                öneki sunucuda hazırlanıp `privacyHref` ile geliyor. */}
            <a
              href={privacyHref}
              className="hover:text-primary underline underline-offset-4 duration-150"
            >
              {labels.privacy}
            </a>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide('denied')}
            className={buttonClasses({ variant: 'outline', size: 'sm' })}
          >
            {labels.reject}
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className={buttonClasses({ variant: 'primary', size: 'sm' })}
          >
            {labels.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
