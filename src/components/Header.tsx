'use client';

import { ArrowRight, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Container, Separator } from '@/components/container';
import { Logo } from '@/components/logo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ButtonLink } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * Nav yapısı. `sections` varsa Tailark grid-2 mega-menü (NavigationMenuContent)
 * açılır; öğeler ilgili sayfanın bölümüne kayan hash anchor'lardır. `label`
 * doğrudan i18n anahtarı (next-intl tip güvenliği için literal); `sections`
 * yoksa düz link. `as const` → t() anahtarları literal.
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
      {/* Üstte boşluk bandı — template gibi hafif zemin tonu, öyle ki gridin
          yan rayları ve çizgileri header bölgesinde de görünür. */}
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

              {/* Masaüstü: ortalanmış mega-menü nav (Tailark grid-2). */}
              <div className="absolute inset-0 m-auto size-fit max-lg:hidden">
                <NavMenu />
              </div>

              {isMobileMenuOpen && (
                <div className="w-full lg:hidden">
                  <MobileMenu closeMenu={() => setIsMobileMenuOpen(false)} />
                </div>
              )}

              <div className="z-51 max-lg:in-data-[state=active]:mt-6 in-data-[state=active]:flex relative mb-6 hidden w-full flex-wrap items-center justify-end lg:m-0 lg:flex lg:w-fit lg:p-0">
                <ButtonLink href="/join" size="sm" className="max-lg:w-full">
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

/** Masaüstü mega-menü — sections'lı öğeler açılır panel, diğerleri düz link. */
function NavMenu() {
  const t = useTranslations('Nav');

  return (
    <NavigationMenu className="**:data-[slot=navigation-menu-viewport]:min-w-276 [--viewport-outer-px:2rem] max-lg:hidden">
      <NavigationMenuList className="gap-3">
        {NAV.map((item) =>
          'sections' in item ? (
            <NavigationMenuItem key={item.key} value={item.key}>
              <NavigationMenuTrigger>{t(item.key)}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-full gap-1 sm:grid-cols-2">
                  {item.sections.map((section) => (
                    <ListItem
                      key={section.label}
                      href={section.href}
                      title={t(section.label)}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.key} value={item.key}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href={item.href}>{t(item.key)}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ title, href }: { title: string; href: string }) {
  return (
    <li>
      <NavigationMenuLink asChild className="group rounded-xl p-3">
        <Link href={href} className="grid gap-1">
          <span className="text-foreground flex items-center gap-2 text-sm font-medium">
            {title}
            <ArrowRight
              aria-hidden
              strokeWidth={2.5}
              className="not-group-hover:opacity-0 not-group-hover:-translate-x-1 size-3 duration-200"
            />
          </span>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

/** Mobil menü — Accordion (sections'lı) + düz linkler + CTA. */
function MobileMenu({ closeMenu }: { closeMenu: () => void }) {
  const t = useTranslations('Nav');

  return (
    <nav
      role="navigation"
      className="w-full [--color-muted:--alpha(var(--color-foreground)/5%)]"
    >
      <Accordion
        type="single"
        collapsible
        className="**:hover:no-underline -mx-4 mt-0.5 space-y-0.5"
      >
        {NAV.map((item) =>
          'sections' in item ? (
            <AccordionItem
              key={item.key}
              value={item.key}
              className="group relative border-b-0"
            >
              <AccordionTrigger className="**:font-normal! data-[state=open]:bg-muted flex items-center justify-between px-4 py-3 text-lg">
                {t(item.key)}
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <ul>
                  {item.sections.map((section) => (
                    <li key={section.label}>
                      <Link
                        href={section.href}
                        onClick={closeMenu}
                        className="text-muted-foreground block gap-2.5 px-4 py-3 text-lg"
                      >
                        {t(section.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ) : null,
        )}
      </Accordion>

      {NAV.map((item) =>
        'sections' in item ? null : (
          <Link
            key={item.key}
            href={item.href}
            onClick={closeMenu}
            className="group relative block py-4 text-lg"
          >
            {t(item.key)}
          </Link>
        ),
      )}

      <ButtonLink href="/join" onClick={closeMenu} className="mt-4 w-full">
        {t('join')}
      </ButtonLink>
    </nav>
  );
}
