import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import LocaleSwitcher from './LocaleSwitcher';
import StatusBanner from './StatusBanner';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { key: 'about', href: '/about' },
  { key: 'projects', href: '/projects' },
  { key: 'blog', href: '/blog' },
  { key: 'community', href: '/community' },
  { key: 'sponsors', href: '/sponsors' },
  { key: 'contact', href: '/contact' },
  { key: 'join', href: '/join' },
] as const;

export default function Header() {
  const t = useTranslations('Nav');

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/80 backdrop-blur dark:border-white/10">
      <StatusBanner />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-mono text-sm font-bold tracking-tight whitespace-nowrap"
        >
          YTÜ<span className="text-emerald-500">::</span>BLOCKCHAIN
        </Link>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
