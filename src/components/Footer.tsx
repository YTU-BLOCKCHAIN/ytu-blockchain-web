import { useTranslations } from 'next-intl';

import { Container, Separator } from '@/components/container';
import { Logo } from '@/components/logo';
import { Link } from '@/i18n/navigation';

const GROUPS = [
  {
    heading: 'exploreHeading',
    items: [
      { key: 'about', href: '/about' },
      { key: 'projects', href: '/projects' },
      { key: 'blog', href: '/blog' },
    ],
  },
  {
    heading: 'communityHeading',
    items: [
      { key: 'community', href: '/community' },
      { key: 'sponsors', href: '/sponsors' },
      { key: 'contact', href: '/contact' },
      { key: 'join', href: '/join' },
    ],
  },
] as const;

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');

  return (
    <footer role="contentinfo">
      <Container>
        <div className="h-12" />
      </Container>

      <Container asGrid>
        <div className="@4xl:grid-cols-4 grid gap-px">
          <div
            data-grid-content
            className="@4xl:col-span-2 relative overflow-hidden p-6 lg:p-12"
          >
            {/* Dekoratif noktalı dünya + ₿. Community bg ile aynı teknik:
                CSS mask + bg-foreground → metin rengini alır (dark açık, light
                koyu), her iki temada aynı silik görsel. Şiddet = opacity-*. */}
            <div
              aria-hidden
              className="bg-foreground pointer-events-none absolute inset-0 opacity-20 dark:opacity-15"
              style={{
                maskImage: 'url(/images/footer-bg.png)',
                WebkitMaskImage: 'url(/images/footer-bg.png)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
              }}
            />
            <div className="relative space-y-6">
              <Link href="/" aria-label="home" className="block size-fit">
                <Logo />
              </Link>
              <p className="text-muted-foreground text-balance">
                {t('tagline')}
              </p>
            </div>
          </div>

          {GROUPS.map((group) => (
            <div
              key={group.heading}
              data-grid-content
              className="space-y-4 p-6 text-sm lg:p-12"
            >
              <span className="block font-medium">{t(group.heading)}</span>
              <div className="flex flex-wrap gap-4 sm:flex-col">
                {group.items.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary block duration-150"
                  >
                    {tNav(item.key)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
