'use client';

import { ChevronDown, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/logo';
import { buttonClasses } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

/**
 * Nav yapısı. `sections` varsa dropdown açılır; öğeler ilgili sayfanın
 * bölümüne kaydıran hash anchor'larıdır (yeni sayfa yok — bölümlere id
 * eklenmiştir). `label` doğrudan i18n anahtarıdır (next-intl tip güvenliği için
 * literal). `sections` yoksa düz link. `as const` → t() anahtarları literal.
 */
const NAV = [
  {
    key: 'about',
    href: '/about',
    sections: [
      { href: '/about#mission', label: 'sections.about.mission' },
      { href: '/about#values', label: 'sections.about.values' },
      { href: '/about#team', label: 'sections.about.team' },
      { href: '/about#sponsors', label: 'sections.about.sponsors' },
    ],
  },
  {
    key: 'community',
    href: '/community',
    sections: [
      { href: '/community#channels', label: 'sections.community.channels' },
      { href: '/community#join', label: 'sections.community.join' },
    ],
  },
  {
    key: 'sponsors',
    href: '/sponsors',
    sections: [
      { href: '/sponsors#logos', label: 'sections.sponsors.logos' },
      { href: '/sponsors#contact', label: 'sections.sponsors.contact' },
    ],
  },
  { key: 'projects', href: '/projects' },
  { key: 'contact', href: '/contact' },
] as const;

const triggerClass =
  'text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-colors';

export default function Header() {
  const t = useTranslations('Nav');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      role="banner"
      className="border-border bg-background/70 sticky top-0 z-50 border-b backdrop-blur"
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="home"
          className="relative z-10 flex items-center"
        >
          <Logo />
        </Link>

        {/* Masaüstü: ortalanmış nav (Tailark grid-2 deseni). */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {NAV.map((item) =>
            'sections' in item ? (
              <div key={item.key} className="group relative">
                <Link
                  href={item.href}
                  className={`${triggerClass} flex items-center gap-1`}
                >
                  {t(item.key)}
                  <ChevronDown
                    aria-hidden
                    className="size-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180"
                  />
                </Link>
                <div className="absolute left-1/2 top-full z-50 hidden -translate-x-1/2 pt-2 group-hover:block">
                  <ul className="border-border bg-popover min-w-48 rounded-lg border p-1.5 shadow-lg">
                    {item.sections.map((section) => (
                      <li key={section.label}>
                        <Link
                          href={section.href}
                          className="text-foreground hover:bg-muted block rounded-md px-3 py-2 text-sm"
                        >
                          {t(section.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link key={item.key} href={item.href} className={triggerClass}>
                {t(item.key)}
              </Link>
            ),
          )}
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <Link
            href="/join"
            className={buttonClasses({
              size: 'sm',
              className: 'max-lg:hidden',
            })}
          >
            {t('join')}
          </Link>
          <button
            type="button"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="text-foreground -mr-2 p-2 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-border border-t lg:hidden">
          <MobileNav onNavigate={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const t = useTranslations('Nav');

  return (
    <nav
      role="navigation"
      className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6"
    >
      {NAV.map((item) => (
        <div key={item.key}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="text-foreground block py-2 font-medium"
          >
            {t(item.key)}
          </Link>
          {'sections' in item && (
            <ul className="border-border ml-2 flex flex-col border-l pl-3">
              {item.sections.map((section) => (
                <li key={section.label}>
                  <Link
                    href={section.href}
                    onClick={onNavigate}
                    className="text-muted-foreground hover:text-foreground block py-1.5 text-sm"
                  >
                    {t(section.label)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <Link
        href="/join"
        onClick={onNavigate}
        className={buttonClasses({ size: 'sm', className: 'mt-3 w-full' })}
      >
        {t('join')}
      </Link>
    </nav>
  );
}
