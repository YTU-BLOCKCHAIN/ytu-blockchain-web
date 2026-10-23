'use client';

import { ArrowRight, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Container, Separator } from '@/components/container';
import { LanguageSwitcher } from '@/components/language-switcher';
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
import { JOIN_HREF, SiteLink } from '@/components/site-link';
import { siteConfig } from '@/lib/site';
import { usePathname } from '@/i18n/navigation';
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
      href: JOIN_HREF,
      title: 'menu.about.promo.title',
      desc: 'menu.about.promo.desc',
    },
    sections: [
      {
        href: '/#vision',
        label: 'sections.about.mission',
        desc: 'sections.about.missionDesc',
      },
      {
        href: '/#values',
        label: 'sections.about.values',
        desc: 'sections.about.valuesDesc',
      },
      // Ekibimiz bölümü about sayfasında gizli olduğu için menüden de kaldırıldı;
      // `<AboutTeam />` geri açıldığında bu öğeyi de geri alın.
      // {
      //   href: '/about#team',
      //   label: 'sections.about.team',
      //   desc: 'sections.about.teamDesc',
      // },
    ],
  },
  {
    // Ayrı bir topluluk sayfası yok (eski `/community` → `/links`): başlık
    // yalnızca menüyü açıyor, kanallar doğrudan burada. Dış adresler
    // `SiteLink` içinde yeni sekmede açılıyor.
    key: 'community',
    heading: 'menu.community.heading',
    promo: {
      href: JOIN_HREF,
      title: 'menu.community.promo.title',
      desc: 'menu.community.promo.desc',
    },
    sections: [
      {
        href: siteConfig.social.whatsapp,
        label: 'sections.community.whatsapp',
        desc: 'sections.community.whatsappDesc',
      },
      {
        href: siteConfig.social.luma,
        label: 'sections.community.luma',
        desc: 'sections.community.lumaDesc',
      },
      {
        href: siteConfig.roadmapPath,
        label: 'sections.community.roadmap',
        desc: 'sections.community.roadmapDesc',
      },
      {
        href: '/projects',
        label: 'sections.community.projects',
        desc: 'sections.community.projectsDesc',
      },
      {
        href: siteConfig.social.github,
        label: 'sections.community.github',
        desc: 'sections.community.githubDesc',
      },
      {
        href: '/stickers',
        label: 'sections.community.stickers',
        desc: 'sections.community.stickersDesc',
      },
      {
        href: siteConfig.social.instagram,
        label: 'sections.community.instagram',
        desc: 'sections.community.instagramDesc',
      },
      {
        href: siteConfig.social.x,
        label: 'sections.community.x',
        desc: 'sections.community.xDesc',
      },
      {
        href: siteConfig.social.medium,
        label: 'sections.community.medium',
        desc: 'sections.community.mediumDesc',
      },
      {
        href: siteConfig.social.spotify,
        label: 'sections.community.podcast',
        desc: 'sections.community.podcastDesc',
      },
      // Destekçilerimiz bölümü about sayfasında gizli olduğu için menüden de
      // kaldırıldı; `<AboutSponsors />` geri açıldığında bu öğeyi de geri alın.
      // {
      //   href: '/about#sponsors',
      //   label: 'sections.community.sponsors',
      //   desc: 'sections.community.sponsorsDesc',
      // },
    ],
  },
  { key: 'events', href: '/events' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '/contact' },
] as const;

/**
 * Mavi girişi (`.surface-signal` hero) olan sayfalar. Header ilk çizimde bu
 * listeye göre boyanıyor; yoksa hero'suz sayfada (etkinlik detayı, blog
 * yazısı) hidrasyona kadar mavi görünüp beyaza atlardı.
 */
const SIGNAL_ENTRANCE = new Set([
  '/',
  '/about',
  '/events',
  '/contact',
  '/projects',
  '/blog',
  '/stickers',
]);

/**
 * Header'ın hemen altındaki bölüm mavi mi? Header'ın alt kenarının bir
 * piksel altındaki elemanlara bakılıyor (header'ın kendisi ve
 * `pointer-events: none` katmanlar — film grain — atlanıyor) ve en yakın
 * yüzey sınıfı okunuyor. Hero'nun içindeki beyaz bant `.surface-paper`
 * olduğu için orada da doğru sonuç çıkıyor.
 */
function useOverSignal(
  header: React.RefObject<HTMLElement | null>,
  pathname: string,
) {
  const [overSignal, setOverSignal] = React.useState(() =>
    SIGNAL_ENTRANCE.has(pathname),
  );

  React.useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const el = header.current;
      if (!el) return;
      const y = el.getBoundingClientRect().bottom + 1;
      const below = document
        .elementsFromPoint(window.innerWidth / 2, y)
        .find((node) => !el.contains(node));
      const surface = below?.closest('.surface-signal, .surface-paper');
      setOverSignal(surface?.classList.contains('surface-signal') ?? false);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [header, pathname]);

  return overSignal;
}

export default function Header() {
  const t = useTranslations('Nav');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const pathname = usePathname();
  const overSignal = useOverSignal(headerRef, pathname);
  // Header altındaki yüzeyin rengini alıyor: mavi girişte mavi, beyaz
  // bölümlerde beyaz. Renk değişkenleri anında, zemin yumuşak geçiyor.
  const surface = cn(
    overSignal ? 'surface-signal' : 'surface-paper',
    'transition-[background-color] duration-300',
  );

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    // `passive`: dinleyici yalnızca `scrollY` okuyor, `preventDefault`
    // çağırmıyor. İşaretlenmezse tarayıcı her kaydırma karesinde handler'ın
    // dönmesini beklemek zorunda kalıyor ve mobilde kaydırma takılabiliyor.
    window.addEventListener('scroll', handleScroll, { passive: true });
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
      {/* Üstte boşluk bandı — template gibi hafif zemin tonu (grid çizgileri).
          Header ile aynı yüzeyi alıyor (bkz. `useOverSignal`). */}
      <div aria-hidden className={cn(surface, 'bg-grid-line')}>
        <Separator className="h-6" />
      </div>
      <header
        ref={headerRef}
        role="banner"
        data-state={isMobileMenuOpen ? 'active' : 'inactive'}
        {...(isScrolled && { 'data-scrolled': true })}
        className={cn(
          surface,
          'lg:data-scrolled:pb-[0.5px] bg-grid-line sticky inset-x-0 top-0 z-50 max-lg:pb-px',
        )}
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
                <SiteLink
                  href="/"
                  aria-label={t('homeLabel')}
                  className="flex items-center"
                >
                  <Logo />
                </SiteLink>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen((v) => !v)}
                  aria-label={isMobileMenuOpen ? t('closeMenu') : t('openMenu')}
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
              <div className="z-51 relative hidden items-center justify-end gap-3 lg:flex">
                <LanguageSwitcher />
                <ButtonLink href={JOIN_HREF} size="sm">
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
    /* `min-w-276` (sabit 1104px) yerine `min-w-full`: panel yine içerik
       sütununun tamamını kaplıyor ama sütun daraldığında onunla birlikte
       küçülüyor — sabit ölçü dar pencerede kutudan taşıp kırpılıyordu. */
    <NavigationMenu className="**:data-[slot=navigation-menu-link]:relative **:data-[slot=navigation-menu-link]:z-51 **:data-[slot=navigation-menu-trigger]:relative **:data-[slot=navigation-menu-trigger]:z-51 **:data-[slot=navigation-menu-viewport]:min-w-full max-lg:hidden">
      <NavigationMenuList className="gap-3">
        {NAV.map((item) =>
          'sections' in item ? (
            <NavigationMenuItem key={item.key} value={item.key}>
              {/* Trigger'ın kendisi gerçek bir <a>: fare üzerine gelince radix
                  dropdown'ı açıyor, tıklayınca sayfaya gidiyor. Radix'in click
                  handler'ı açık menüyü kapatıyor (onItemSelect toggle), Next
                  Link de ardından yönlendiriyor — ikisi çakışmıyor. */}
              {'href' in item ? (
                <NavigationMenuTrigger asChild>
                  <SiteLink href={item.href}>{t(item.key)}</SiteLink>
                </NavigationMenuTrigger>
              ) : (
                <NavigationMenuTrigger>{t(item.key)}</NavigationMenuTrigger>
              )}
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

                  {/* Tanıtım kartı: düz beyaz kare + başlık + açıklama. Kit gradient'i
                      yasaklıyor; kare logonun 24px modülünü hatırlatıyor. */}
                  <div className="relative m-3 grid grid-cols-[auto_1fr] items-center gap-3 border-t pt-6">
                    <div
                      aria-hidden
                      className="bg-foreground size-11 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <SiteLink
                        href={item.promo.href}
                        className="text-foreground text-sm font-medium before:absolute before:inset-0"
                      >
                        {t(item.promo.title)}
                      </SiteLink>
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
                <SiteLink href={item.href}>{t(item.key)}</SiteLink>
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
      <NavigationMenuLink asChild className="group p-3">
        <SiteLink href={href} className="grid gap-1">
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
        </SiteLink>
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
                      <SiteLink
                        href={section.href}
                        onClick={closeMenu}
                        className="text-muted-foreground block gap-2.5 px-4 py-3 text-lg"
                      >
                        {t(section.label)}
                      </SiteLink>
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
          <SiteLink
            key={item.key}
            href={item.href}
            onClick={closeMenu}
            className="group relative block py-4 text-lg"
          >
            {t(item.key)}
          </SiteLink>
        ),
      )}

      <ButtonLink href={JOIN_HREF} onClick={closeMenu} className="mt-4 w-full">
        {t('join')}
      </ButtonLink>

      {/* Mobilde dil seçimi menünün sonunda: CTA'nın önüne geçmemeli ama
          masaüstündeki gibi her sayfadan erişilebilir olmalı. */}
      <LanguageSwitcher className="mt-6 w-fit" />
    </nav>
  );
}
