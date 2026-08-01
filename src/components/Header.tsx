'use client';

import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Container, Separator } from '@/components/container';
import { Logo } from '@/components/logo';
import { ButtonLink } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * Nav — hepsi düz link; tıklanınca ilgili sayfaya gider. Dropdown YOK.
 * (Radix NavigationMenu'nün fixed Viewport katmanı header'ın üstünü kaplayıp
 * tıklamaları yutuyordu; o yüzden radix header'dan tamamen çıkarıldı.)
 */
const NAV = [
  { key: 'about', href: '/about' },
  { key: 'community', href: '/community' },
  { key: 'sponsors', href: '/sponsors' },
  { key: 'projects', href: '/projects' },
  { key: 'contact', href: '/contact' },
] as const;

const navLinkClass =
  'text-muted-foreground hover:text-foreground hover:bg-foreground/5 inline-flex h-8 items-center rounded-md px-4 text-sm font-medium transition-colors';

export default function Header() {
  const t = useTranslations('Nav');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const original = document.body.style.overflow;
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Üstte boşluk bandı — template gibi hafif zemin tonu, gridin yan
          rayları ve çizgileri header bölgesinde de görünür. */}
      <div aria-hidden className="bg-foreground/10">
        <Separator className="h-6" />
      </div>
      <header
        role="banner"
        data-state={isMobileMenuOpen ? 'active' : 'inactive'}
        {...(isScrolled && { 'data-scrolled': true })}
        className="lg:data-scrolled:pb-[0.5px] bg-foreground/10 sticky inset-x-0 top-0 z-50 max-lg:pb-px"
      >
        <div
          className={cn(
            'w-full max-lg:h-14 max-lg:overflow-hidden',
            isMobileMenuOpen &&
              'bg-background/75 max-lg:h-screen! max-lg:overflow-visible! backdrop-blur',
          )}
        >
          <Container className="backdrop-blur">
            <div className="relative flex flex-wrap items-center justify-between px-6 lg:px-12 lg:py-5">
              <div className="z-51 relative flex justify-between gap-8 max-lg:h-14 max-lg:w-full">
                <Link href="/" aria-label="home" className="flex items-center">
                  <Logo />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen((v) => !v)}
                  aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                  aria-expanded={isMobileMenuOpen}
                  className="text-foreground relative z-20 -m-2.5 -mr-3 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-5 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-5 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>

              {/* Masaüstü: ortalanmış nav — düz linkler, tıklanınca sayfaya gider. */}
              <nav className="absolute inset-0 m-auto hidden size-fit items-center gap-1 lg:flex">
                {NAV.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={navLinkClass}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>

              {/* Mobil menü — düz linkler + CTA (açılınca). */}
              {isMobileMenuOpen && (
                <nav className="w-full lg:hidden">
                  {NAV.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-foreground block py-4 text-lg"
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                  <ButtonLink
                    href="/join"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-4 w-full"
                  >
                    {t('join')}
                  </ButtonLink>
                </nav>
              )}

              <div className="z-51 relative hidden lg:flex lg:w-fit">
                <ButtonLink href="/join" size="sm">
                  {t('join')}
                </ButtonLink>
              </div>
            </div>
          </Container>
        </div>
      </header>
    </>
  );
}
