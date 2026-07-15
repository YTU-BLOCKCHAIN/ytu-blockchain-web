import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Desteklenen diller
  locales: ['tr', 'en'],
  // Öntanımlı dil
  defaultLocale: 'tr',
});
