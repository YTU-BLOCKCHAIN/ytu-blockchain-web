'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1 font-mono text-xs">
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            disabled={isPending || active}
            aria-current={active ? 'true' : undefined}
            onClick={() =>
              startTransition(() => router.replace(pathname, { locale: loc }))
            }
            className={
              active
                ? 'rounded px-2 py-1 font-bold text-emerald-500'
                : 'rounded px-2 py-1 text-foreground/60 transition-colors hover:text-foreground'
            }
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
