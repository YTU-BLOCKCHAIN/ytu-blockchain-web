import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/lib/site';

export function CommunityHero() {
  const t = useTranslations('Community');

  return (
    <section className="overflow-hidden">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div
            data-grid-content
            className="@4xl:p-12 relative col-span-full overflow-hidden p-6 sm:col-span-8"
          >
            {/* Dekoratif arka plan: YALNIZCA dark modda ve silik görünür; light
                modda gizlenir (kart beyaz kalır — koyu görsel çirkin durmaz).
                "Silik" şiddeti opacity-* ile ayarlanır. Görsel:
                public/images/community-bg.png */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden bg-cover bg-center opacity-15 dark:block"
              style={{ backgroundImage: 'url(/images/community-bg.png)' }}
            />
            <div className="relative">
              <span className="text-primary font-mono text-xs tracking-widest lowercase">
                {'//'} {t('eyebrow')}
              </span>
              <h1 className="text-foreground mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                {t('title')}
              </h1>
              <p className="text-muted-foreground mt-6 max-w-2xl text-balance text-lg">
                {t('subtitle')}
              </p>
            </div>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function CommunityChannels() {
  const t = useTranslations('Community');

  const channels = [
    {
      name: t('channels.github.name'),
      description: t('channels.github.description'),
      cta: t('channels.github.cta'),
      href: siteConfig.social.github,
    },
    {
      name: t('channels.x.name'),
      description: t('channels.x.description'),
      cta: t('channels.x.cta'),
      href: siteConfig.social.x,
    },
    {
      name: t('channels.instagram.name'),
      description: t('channels.instagram.description'),
      cta: t('channels.instagram.cta'),
      href: siteConfig.social.instagram,
    },
  ];

  return (
    <section>
      <Container asGrid className="sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <a
            key={channel.name}
            href={channel.href}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative"
          >
            <div
              data-grid-content
              className="@4xl:p-8 hover:bg-card! flex h-full flex-col gap-3 p-6 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-foreground font-semibold">
                  {channel.name}
                </h2>
                <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {channel.description}
              </p>
              <span className="text-primary mt-auto text-sm font-medium">
                {channel.cta}
              </span>
            </div>
          </a>
        ))}
      </Container>
    </section>
  );
}

export function CommunityCta() {
  const t = useTranslations('Community.cta');

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full sm:col-span-8">
            <div
              data-grid-content
              className="@4xl:p-12 flex flex-col items-center gap-6 p-6 text-center"
            >
              <h2 className="text-foreground text-balance text-2xl font-semibold sm:text-3xl">
                {t('heading')}
              </h2>
              <p className="text-muted-foreground max-w-xl text-balance">
                {t('body')}
              </p>
              <Link
                href="/join"
                className="bg-primary text-primary-foreground rounded-md px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              >
                {t('button')}
              </Link>
            </div>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
