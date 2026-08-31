import type { routing } from '@/i18n/routing';
import type messages from '../messages/tr.json';

// next-intl için tip güvenliği: geçerli locale'ler ve mesaj anahtarları
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

/**
 * Cloudflare Turnstile. `challenges.cloudflare.com/turnstile/v0/api.js` yüklenince
 * `window.turnstile` oluşur — script gelmeden önce ve site anahtarı tanımsızken
 * `undefined` olduğu için alan isteğe bağlı. Kullanımı: `site-form.tsx`.
 */
declare global {
  interface Window {
    turnstile?: {
      render(
        container: HTMLElement,
        options: {
          sitekey: string;
          /** Widget dili — sayfanın locale'i veriliyor. */
          language?: string;
          theme?: 'auto' | 'light' | 'dark';
        },
      ): string;
      /** Jeton tek kullanımlık; başarısız gönderimden sonra yenisi gerekir. */
      reset(widgetId: string): void;
      remove(widgetId: string): void;
    };
  }
}

/**
 * Google Analytics (gtag.js). `window.gtag`, sayfanın HTML'ine basılan Consent
 * Mode varsayılan bloğu tarafından gtag.js gelmeden ÖNCE tanımlanıyor
 * (`lib/analytics.ts`), bu yüzden onay güncellemesi script yüklenmemişken de
 * güvenle çağrılabilir — komut `dataLayer` kuyruğunda bekler. Yine de alan
 * isteğe bağlı: ölçüm kimliği tanımsızken o blok hiç basılmıyor.
 * Kullanımı: `components/analytics/consent-banner.tsx`.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
