'use client';

import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Logo } from '@/components/logo';
import { buttonClasses } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

import LocaleSwitcher from './LocaleSwitcher';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { key: 'about', href: '/about' },
  { key: 'projects', href: '/projects' },
  { key: 'blog', href: '/blog' },
  { key: 'community', href: '/community' },
  { key: 'sponsors', href: '/sponsors' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Header() {
  const t = useTranslations('Nav');
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        role="banner"
        className="border-border bg-background/75 sticky top-0 z-50 border-b backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="home" className="flex items-center">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 text-sm lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-muted-foreground hover:text-foreground duration-150"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LocaleSwitcher />
            <Link
              href="/join"
              className={buttonClasses({
                size: 'sm',
                className: 'ml-1 max-sm:hidden',
              })}
            >
              {t('join')}
            </Link>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((value) => !value)}
              className="text-foreground -mr-2 p-2 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-border mx-auto flex max-w-6xl flex-col gap-1 border-t px-4 py-4 sm:px-6 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground py-2 text-sm"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/join"
              onClick={() => setOpen(false)}
              className={buttonClasses({
                size: 'sm',
                className: 'mt-2 w-full',
              })}
            >
              {t('join')}
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
