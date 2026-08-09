import { useTranslations } from 'next-intl';

import {
  GithubIcon,
  InstagramIcon,
  XIcon,
} from '@/components/community/brand-icons';
import { Container, Separator } from '@/components/container';
import { Logo } from '@/components/logo';
import { buttonClasses } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/lib/site';

/** Keşfet sütunu — sitenin tüm ana sayfaları tek listede. */
const EXPLORE = [
  { key: 'about', href: '/about' },
  { key: 'projects', href: '/projects' },
  { key: 'community', href: '/community' },
  { key: 'contact', href: '/contact' },
  { key: 'join', href: '/join' },
] as const;

/** Sosyal medya sütunu — marka adları çevrilmez, olduğu gibi gösterilir. */
const SOCIALS = [
  { name: 'GitHub', Icon: GithubIcon, href: siteConfig.social.github },
  { name: 'X', Icon: XIcon, href: siteConfig.social.x },
  { name: 'Instagram', Icon: InstagramIcon, href: siteConfig.social.instagram },
] as const;

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');

  return (
    <footer role="contentinfo">
      <Container asGrid>
        {/* Telefonda iki sütun: marka hücresi tam genişlik, altında "Sosyal
            Medya" ve "Keşfet" yan yana. Tek sütunda üç blok alt alta uzayıp
            footer'ı gereksiz uzatıyor, linkler de sarmalanmış bir yığın gibi
            görünüyordu. @4xl (masaüstü) düzeni değişmedi. */}
        <div className="@4xl:grid-cols-4 grid grid-cols-2 gap-px">
          <div data-grid-content className="col-span-2 space-y-6 p-6 lg:p-12">
            <Link href="/" aria-label="home" className="block size-fit">
              <Logo />
            </Link>
            <p className="text-muted-foreground text-balance">{t('tagline')}</p>
          </div>

          <div
            data-grid-content
            className="space-y-4 p-6 text-sm max-sm:p-4 lg:p-12"
          >
            <span className="block font-medium">{t('socialHeading')}</span>
            <div className="flex flex-col items-start gap-3">
              {SOCIALS.map(({ name, Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonClasses({
                    variant: 'outline',
                    size: 'sm',
                    // Dar sütuna sığsın diye telefonda yatay dolgu bir tık dar.
                    className: 'justify-start max-sm:px-3',
                  })}
                >
                  <Icon className="size-4" />
                  {name}
                </a>
              ))}
            </div>
          </div>

          <div
            data-grid-content
            className="space-y-4 p-6 text-sm max-sm:p-4 lg:p-12"
          >
            <span className="block font-medium">{t('exploreHeading')}</span>
            {/* Telefonda da dikey liste (eskiden sarmalanan bir satırdı) ve
                satır başına ~34px dokunma yüksekliği. */}
            <div className="flex flex-col gap-1 sm:gap-4">
              {EXPLORE.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary block duration-150 max-sm:py-1.5"
                >
                  {tNav(item.key)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div
            data-grid-content
            className="flex flex-wrap items-center justify-between gap-4 p-6 lg:px-12"
          >
            <span className="text-muted-foreground text-sm">{t('rights')}</span>
            <div className="ring-foreground/5 bg-card flex items-center gap-2 rounded-full border border-transparent py-1 pr-4 pl-2 shadow ring-1">
              <span className="relative flex size-3">
                <span className="absolute inset-0 block size-full animate-pulse rounded-full bg-emerald-400/40" />
                <span className="relative m-auto block size-1 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm">{t('status')}</span>
            </div>
          </div>
        </div>
      </Container>

      <Separator className="h-6" />
      <Separator className="h-12" />
    </footer>
  );
}
