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
 * Nav — `sections` olan öğeler zengin dropdown (radix NavigationMenu, template
 * grid-2 gibi: kategori başlığı + başlık/açıklamalı öğeler + tanıtım kartı),
 * diğerleri düz link. `label`/`desc`/`heading`/`promo.*` doğrudan i18n anahtarı
 * (`as const` → literal, tip güvenli).
 */
const NAV = [
  {
    key: 'about',
    href: '/about',
    heading: 'menu.about.heading',
    promo: {
      href: '/join',
      title: 'menu.about.promo.title',
      desc: 'menu.about.promo.desc',
    },
    sections: [
      {
        href: '/about#mission',
        label: 'sections.about.mission',
        desc: 'sections.about.missionDesc',
      },
      {
        href: '/about#values',
        label: 'sections.about.values',
        desc: 'sections.about.valuesDesc',
      },
      {
        href: '/about#team',
        label: 'sections.about.team',
        desc: 'sections.about.teamDesc',
      },
      {
        href: '/about#sponsors',
        label: 'sections.about.sponsors',
        desc: 'sections.about.sponsorsDesc',
      },
    ],
  },
  {
    key: 'community',
    href: '/community',
    heading: 'menu.community.heading',
    promo: {
      href: '/join',
      title: 'menu.community.promo.title',
      desc: 'menu.community.promo.desc',
    },
    sections: [
      {
        href: '/community#channels',
        label: 'sections.community.channels',
        desc: 'sections.community.channelsDesc',
      },
      {
        href: '/community#join',
        label: 'sections.community.join',
        desc: 'sections.community.joinDesc',
      },
    ],
  },
  {
    key: 'sponsors',
    href: '/sponsors',
    heading: 'menu.sponsors.heading',
    promo: {
      href: '/sponsors#contact',
      title: 'menu.sponsors.promo.title',
      desc: 'menu.sponsors.promo.desc',
    },
    sections: [
      {
        href: '/sponsors#logos',
        label: 'sections.sponsors.logos',
        desc: 'sections.sponsors.logosDesc',
      },
      {
        href: '/sponsors#contact',
        label: 'sections.sponsors.contact',
        desc: 'sections.sponsors.contactDesc',
      },
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
      {/* Üstte boşluk bandı — template gibi hafif zemin tonu (grid çizgileri). */}
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

              {/* Masaüstü: ortalanmış mega-menü nav (Tailark grid-2, radix). */}
              <div className="absolute inset-0 m-auto size-fit max-lg:hidden">
                <NavMenu />
              </div>

              {isMobileMenuOpen && (
                <div className="w-full lg:hidden">
                  <MobileMenu closeMenu={() => setIsMobileMenuOpen(false)} />
                </div>
              )}

              {/* Yalnızca masaüstü CTA — mobilde MobileMenu kendi "Bize Katıl"
                  butonunu render ediyor (o, tıklanınca menüyü de kapatıyor).
                  Burayı mobilde göstermek iki özdeş buton demek. */}
              <div className="z-51 relative hidden items-center justify-end lg:flex">
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

/**
 * Masaüstü mega-menü. KRİTİK: NavMenu className'i trigger/link'e `z-51` verir
 * (radix Viewport `fixed top-0 z-50` header'ı kaplar; z-51 olmadan tıklamalar
 * yutulur — template'in aynı sınıfları). Bu satırlar OLMADAN dropdown açılmaz.
 */
function NavMenu() {
  const t = useTranslations('Nav');

  return (
    <NavigationMenu className="**:data-[slot=navigation-menu-link]:relative **:data-[slot=navigation-menu-link]:z-51 **:data-[slot=navigation-menu-trigger]:relative **:data-[slot=navigation-menu-trigger]:z-51 **:data-[slot=navigation-menu-viewport]:min-w-276 [--viewport-outer-px:2rem] max-lg:hidden">
      <NavigationMenuList className="gap-3">
        {NAV.map((item) =>
          'sections' in item ? (
            <NavigationMenuItem key={item.key} value={item.key}>
              <NavigationMenuTrigger>{t(item.key)}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[38rem] max-w-[calc(100vw-4rem)]">
                  {/* Kategori başlığı (template: "Features" / "More Features"). */}
                  <span className="text-muted-foreground ml-3 block border-b pb-3 text-sm">
                    {t(item.heading)}
                  </span>

                  <ul className="mt-2 grid grid-cols-2 gap-1">
                    {item.sections.map((section) => (
                      <ListItem
                        key={section.label}
                        href={section.href}
                        title={t(section.label)}
                        description={t(section.desc)}
                      />
                    ))}
                  </ul>

                  {/* Tanıtım kartı (template: gradient ikon + başlık + açıklama). */}
                  <div className="relative m-3 grid grid-cols-[auto_1fr] items-center gap-3 border-t pt-6">
                    <div
                      aria-hidden
                      className="bg-linear-to-br inset-ring-foreground/10 inset-ring-1 size-11 shrink-0 rounded-xl from-blue-400 to-indigo-500"
                    />
                    <div className="space-y-0.5">
                      <Link
                        href={item.promo.href}
                        className="text-foreground text-sm font-medium before:absolute before:inset-0"
                      >
                        {t(item.promo.title)}
                      </Link>
                      <p className="text-foreground/60 line-clamp-1 text-sm">
                        {t(item.promo.desc)}
                      </p>
                    </div>
                  </div>
                </div>
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

function ListItem({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
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
          <p className="text-muted-foreground line-clamp-1 text-sm">
            {description}
          </p>
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
