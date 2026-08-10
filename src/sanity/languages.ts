import type { Locale } from 'next-intl';

import { routing } from '../i18n/routing';

/**
 * Studio'daki dil seçenekleri.
 *
 * Tek kaynak sitenin dil listesi (`routing.locales`) — Studio'da ayrı bir liste
 * tutulsaydı ikisi zamanla ayrışırdı. `Record<Locale, string>` sayesinde siteye
 * yeni bir dil eklenip başlığı buraya yazılmazsa derleme hata verir
 * (`ogLocales` ile aynı yaklaşım).
 */
const TITLES: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
};

export const sanityLanguages = routing.locales.map((id) => ({
  id,
  title: TITLES[id],
}));
