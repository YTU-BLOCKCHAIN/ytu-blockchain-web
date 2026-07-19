import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Desteklenen diller
  locales: ['tr', 'en'],
  // Öntanımlı (fallback) dil. next-intl, tarayıcı Accept-Language'ını
  // [tr, en] ile eşler: sistem dili Türkçe ise TR, aksi halde (eşleşme yoksa)
  // bu değere = EN düşer. Böylece Türkçe→TR, diğer her dil→EN.
  defaultLocale: 'en',
});
