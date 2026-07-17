import type { Locale } from 'next-intl';

/**
 * Dile bağlı içerik: desteklenen her locale için bir değer taşır.
 * `Record<Locale, T>` sayesinde yeni bir dil eklendiğinde eksik çeviriler
 * derleme anında (build) yakalanır — çalışma zamanında değil.
 */
export type Localized<T = string> = Record<Locale, T>;

/** Dile bağlı bir değeri verilen locale'e indirger. */
export function localize<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
