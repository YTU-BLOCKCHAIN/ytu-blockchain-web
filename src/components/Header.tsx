'use client';

import {
  ArrowRight,
  Eye,
  FolderGit2,
  Gem,
  Link2,
  Map as MapIcon,
  Menu,
  Palette,
  Sticker,
  UserPlus,
  X,
  type LucideIcon,
} from 'lucide-react';
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
        icon: Eye,
        label: 'sections.about.mission',
        desc: 'sections.about.missionDesc',
      },
      {
        href: '/#values',
        icon: Gem,
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
    // yalnızca menüyü açıyor. Sosyal kanallar tek tek listelenmiyor, hepsi
    // zaten `/links`te; menü oraya ve sitenin topluluk içeriklerine gidiyor.
    key: 'community',
    heading: 'menu.community.heading',
    promo: {
      href: JOIN_HREF,
      title: 'menu.community.promo.title',
      desc: 'menu.community.promo.desc',
    },
    sections: [
      {
        href: JOIN_HREF,
        icon: Link2,
        label: 'sections.community.links',
        desc: 'sections.community.linksDesc',
        wide: true,
      },
      {
        href: siteConfig.roadmapPath,
        icon: MapIcon,
        label: 'sections.community.roadmap',
        desc: 'sections.community.roadmapDesc',
      },
      {
        href: '/projects',
        icon: FolderGit2,
        label: 'sections.community.projects',
        desc: 'sections.community.projectsDesc',
      },
      {
        href: '/stickers',
        icon: Sticker,
        label: 'sections.community.stickers',
        desc: 'sections.community.stickersDesc',
      },
      {
        href: '/brand',
        icon: Palette,
        label: 'sections.community.brand',
        desc: 'sections.community.brandDesc',
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
 *
 * Aynı dinleyici `scrolled`ı da (sayfa 50px'ten fazla kaydı mı) hesaplıyor;
 * eskiden ikisi için ayrı scroll dinleyicisi vardı ve biri her olayda,
 * kare beklemeden state yazıyordu.
 */
function useHeaderScroll(
  header: React.RefObject<HTMLElement | null>,
  pathname: string,
) {
  const [overSignal, setOverSignal] = React.useState(() =>
    SIGNAL_ENTRANCE.has(pathname),
  );
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      setScrolled(window.scrollY > 50);
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

  return { overSignal, scrolled };
}

export default function Header() {
  const t = useTranslations('Nav');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { overSignal, scrolled: isScrolled } = useHeaderScroll(
    headerRef,
    pathname,
  );
  // Header altındaki yüzeyin rengini alıyor: mavi girişte mavi, beyaz
  // bölümlerde beyaz. Geçiş BİLEREK anlık: eskiden yalnız zemin 300ms'de
  // soluyordu, yazı ve buton renkleri (değişken) ise anında dönüyordu; arada
  // "Bize Katıl" beyaz-üstüne-beyaz kalıp kayboluyordu. Değişim, bölüm sınırı
  // header'ın altından geçtiği karede oluyor, yani anlık dönüş sınırla
  // birlikte akıyor.
  const surface = overSignal ? 'surface-signal' : 'surface-paper';

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
          {/* Burada `backdrop-blur` vardı; header zemini opak olduğu için
              bulanıklık hiç görünmüyor ama her kaydırma karesinde yeniden
              hesaplanıyordu. */}
          <Container>
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
              <NavigationMenuContent className="md:right-0 md:w-full">
                {/* Panel header genişliğinde; içerik de onu dolduruyor. */}
                <div className="w-full">
                  {/* Kategori başlığı (template: "Features" / "More Features"). */}
                  <span className="text-muted-foreground mx-3 block border-b pb-3 text-sm">
                    {t(item.heading)}
                  </span>

                  <ul className="mt-2 grid grid-cols-2 gap-1">
                    {item.sections.map((section) => (
                      <ListItem
                        key={section.label}
                        href={section.href}
                        title={t(section.label)}
                        description={t(section.desc)}
                        icon={section.icon}
                        wide={'wide' in section && section.wide}
                      />
                    ))}
                  </ul>

                  {/* Tanıtım kartı: düz beyaz kare + başlık + açıklama. Kit gradient'i
                      yasaklıyor; kare logonun 24px modülünü hatırlatıyor. */}
                  <div className="relative m-3 grid grid-cols-[auto_1fr] items-center gap-3 border-t pt-6">
                    <span
                      aria-hidden
                      className="bg-action text-action-foreground flex size-11 shrink-0 items-center justify-center"
                    >
                      <UserPlus className="text-action-foreground size-5" />
                    </span>
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

/**
 * Menü satırı: solda ikon karesi (yüzeyin tersi — mavi header'da beyaz kare,
 * beyaz header'da mavi; postlardaki numara chip'leriyle aynı dil), sağda
 * başlık + tek satır açıklama.
 */
function ListItem({
  title,
  description,
  href,
  icon: Icon,
  wide = false,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** İki sütunu da kaplar: menünün öne çıkan satırı. */
  wide?: boolean;
}) {
  return (
    <li className={wide ? 'col-span-2' : undefined}>
      <NavigationMenuLink asChild className="group p-3">
        <SiteLink
          href={href}
          className="grid grid-cols-[auto_1fr] items-center gap-4"
        >
          <span
            aria-hidden
            className="bg-action text-action-foreground flex size-11 shrink-0 items-center justify-center"
          >
            <Icon className="text-action-foreground size-5" />
          </span>
          <span className="grid min-w-0 gap-1">
            <span className="text-foreground flex items-center gap-2 text-sm font-medium">
              {title}
              <ArrowRight
                aria-hidden
                strokeWidth={2.5}
                className="not-group-hover:opacity-0 not-group-hover:-translate-x-1 size-3 duration-200"
              />
            </span>
            <span className="text-muted-foreground line-clamp-1 text-sm">
              {description}
            </span>
          </span>
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
                        className="text-muted-foreground flex items-center gap-3 px-4 py-2.5 text-lg"
                      >
                        <span
                          aria-hidden
                          className="bg-action text-action-foreground flex size-9 shrink-0 items-center justify-center"
                        >
                          <section.icon className="text-action-foreground size-4" />
                        </span>
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
