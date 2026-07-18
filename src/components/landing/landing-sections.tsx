import { BookOpen, Code2, Lightbulb, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { Link } from '@/i18n/navigation';

export function LandingHero() {
  const t = useTranslations('Landing');

  return (
    <section className="overflow-hidden">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="@4xl:grid hidden grid-rows-4 gap-px">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div data-grid-content />
              </div>
            ))}
          </div>

          <div className="@4xl:col-span-8 col-span-full">
            <div
              data-grid-content
              className="relative overflow-hidden px-6 py-16 text-center sm:py-24"
            >
              {/* Dekoratif kripto coin halftone (₿/D/₮) backdrop. Community bg
                  ile aynı teknik: CSS mask + bg-foreground → metin rengini alır
                  (dark açık, light koyu), her iki temada aynı silik görsel.
                  Konum biraz aşağıda (center 40%). */}
              <div
                aria-hidden
                className="bg-foreground pointer-events-none absolute inset-0 opacity-25 dark:opacity-15"
                style={{
                  maskImage: 'url(/images/landing-bg.png)',
                  WebkitMaskImage: 'url(/images/landing-bg.png)',
                  maskSize: 'cover',
                  WebkitMaskSize: 'cover',
                  maskPosition: 'center 40%',
                  WebkitMaskPosition: 'center 40%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                }}
              />
              <div className="relative mx-auto max-w-3xl">
                <span className="text-primary font-mono text-xs tracking-widest lowercase">
                  {'//'} blockchain · defi · zk · open-source
                </span>
                <h1 className="text-foreground mt-4 text-balance text-4xl font-semibold sm:text-6xl">
                  {t('title')}
                </h1>
                <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-balance text-lg">
                  {t('subtitle')}
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/join"
                    className="bg-primary text-primary-foreground rounded-md px-6 py-3 text-sm font-medium shadow-xl shadow-indigo-900/30 transition-opacity hover:opacity-90"
                  >
                    {t('cta')}
                  </Link>
                  <Link
                    href="/projects"
                    className="border-border hover:bg-accent rounded-md border px-6 py-3 text-sm font-medium transition-colors"
                  >
                    {t('ctaSecondary')}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div aria-hidden className="@4xl:grid hidden grid-rows-4 gap-px">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div data-grid-content />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function LandingFeatures() {
  const t = useTranslations('Landing.features');

  const items = [
    {
      icon: Lightbulb,
      title: t('workshops.title'),
      description: t('workshops.description'),
    },
    {
      icon: Code2,
      title: t('projects.title'),
      description: t('projects.description'),
    },
    {
      icon: BookOpen,
      title: t('blog.title'),
      description: t('blog.description'),
    },
    {
      icon: Users,
      title: t('community.title'),
      description: t('community.description'),
    },
  ];

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="@2xl:grid-cols-2 col-span-full grid gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <h2 className="text-muted-foreground text-balance">
                {t('heading')}
              </h2>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                {t('intro')}
              </p>
            </div>

            {items.map((item) => (
              <div
                key={item.title}
                data-grid-content
                className="@4xl:p-12 flex flex-col gap-3 p-6"
              >
                <item.icon className="text-muted-foreground size-5" />
                <h3 className="text-foreground font-medium">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
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

export function LandingManifesto() {
  const t = useTranslations('Landing.manifesto');

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 p-6">
              <h2 className="text-muted-foreground text-balance">
                {t('heading')}
              </h2>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl leading-relaxed font-medium">
                {t('body')}
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

/** Gerçek sponsor logoları Figma'dan gelene kadar nötr yer tutucu slot sayısı. */
const SPONSOR_SLOTS = 6;

export function LandingSponsors() {
  const t = useTranslations('Landing.sponsors');

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

export function LandingCta() {
  const t = useTranslations('Landing.callToAction');

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
