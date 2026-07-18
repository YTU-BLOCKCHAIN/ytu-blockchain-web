import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { SponsorForm } from '@/components/sponsors/sponsor-form';
import { siteConfig } from '@/lib/site';

export function SponsorsHero() {
  const t = useTranslations('Sponsors.hero');

  return (
    <section className="overflow-hidden">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div
            data-grid-content
            className="@4xl:p-12 col-span-full p-6 sm:col-span-8"
          >
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

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Gerçek sponsor logoları Figma'dan gelene kadar nötr yer tutucu slot sayısı. */
const SPONSOR_SLOTS = 6;

export function SponsorsLogos() {
  const t = useTranslations('Sponsors.logos');

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="@md:grid-cols-3 col-span-full grid grid-cols-2 gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <h2 className="text-muted-foreground text-balance">
                {t('heading')}
              </h2>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                {t('intro')}
              </p>
            </div>

            {Array.from({ length: SPONSOR_SLOTS }).map((_, i) => (
              <div
                key={i}
                data-grid-content
                className="@4xl:px-12 flex items-center justify-center p-6"
              >
                <span className="text-muted-foreground/50 text-sm">
                  {t('placeholder')}
                </span>
              </div>
            ))}
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SponsorsContact() {
  const t = useTranslations('Sponsors');

  const benefits = [
    {
      title: t('benefits.talent.title'),
      description: t('benefits.talent.description'),
    },
    {
      title: t('benefits.brand.title'),
      description: t('benefits.brand.description'),
    },
    {
      title: t('benefits.ecosystem.title'),
      description: t('benefits.ecosystem.description'),
    },
  ];

  return (
    <section>
      <Container asGrid className="@4xl:grid-cols-2">
        <div data-grid-content className="@4xl:p-12 p-6">
          <h2 className="text-foreground font-medium">{t('form.heading')}</h2>
          <p className="text-muted-foreground mb-8 mt-2 text-sm">
            {t('form.intro')}
          </p>

          <SponsorForm
            labels={{
              name: t('form.name'),
              organization: t('form.organization'),
              email: t('form.email'),
              message: t('form.message'),
              submit: t('form.submit'),
            }}
            recipient={siteConfig.contactEmail}
            subject={t('form.subject')}
          />

          <p className="text-muted-foreground mt-6 text-sm">
            {t('form.direct')}:{' '}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-foreground hover:decoration-primary font-medium hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </div>

        <div data-grid-content className="@4xl:p-12 space-y-6 p-6">
          <h2 className="text-foreground font-medium">
            {t('benefits.heading')}
          </h2>
          <ul className="space-y-6">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="space-y-1">
                <h3 className="text-foreground text-sm font-medium">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
