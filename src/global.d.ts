import type { routing } from '@/i18n/routing';
import type messages from '../messages/tr.json';

// next-intl için tip güvenliği: geçerli locale'ler ve mesaj anahtarları
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
