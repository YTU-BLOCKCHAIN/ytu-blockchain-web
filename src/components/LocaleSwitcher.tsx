'use client';

import { useLocale } from 'next-intl';

import { usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/**
 * Dil seçici. Yumuşak (client-side) yerine gerçek `<a>` bağlantılarıyla tam
 * navigasyon yapar: böylece `<html>`/next-themes ağacı istemcide yeniden render
 * edilmez (next-themes'in enjekte ettiği script'in React 19'da tetiklediği
 * "script tag while rendering" uyarısı önlenir). Ayrıca `hrefLang`'li gerçek
 * bağlantılar SEO için diller arası keşfi kolaylaştırır.
 */
export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 font-mono text-xs">
      {routing.locales.map((loc) => {
        const active = loc === locale;
        const href = `/${loc}${pathname === '/' ? '' : pathname}`;

        if (active) {
          return (
            <span
              key={loc}
              aria-current="true"
              className="rounded px-2 py-1 font-bold text-emerald-500"
            >
              {loc.toUpperCase()}
            </span>
          );
        }

        return (
          <a
            key={loc}
            href={href}
            hrefLang={loc}
            className="text-foreground/60 hover:text-foreground rounded px-2 py-1 transition-colors"
          >
            {loc.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
