import { useTranslations } from 'next-intl';

import { Container, Rail } from '@/components/container';
import { JOIN_HREF } from '@/components/site-link';
import { ButtonLink } from '@/components/ui/button';

export function CommunityHero() {
  const t = useTranslations('Community');

  return (
    <section className="surface-signal overflow-hidden">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <Rail rows={2} />

          <div
            data-grid-content
            className="@4xl:p-12 relative col-span-full overflow-hidden p-6 sm:col-span-8"
          >
            {/* Dekoratif ASCII küre. CSS mask + bg-foreground ile çizilir →
                metin rengini alır: dark modda açık, light modda koyu, yani
                her iki temada da AYNI silik görsel (ayrı varyant/geçiş yok).
                "Silik" şiddeti = opacity-*. Görsel: public/images/community-bg.png */}
            <div
              aria-hidden
              className="bg-foreground pointer-events-none absolute inset-0 opacity-15"
              style={{
                maskImage: 'url(/images/community-bg.png)',
                WebkitMaskImage: 'url(/images/community-bg.png)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
              }}
            />
            <div className="relative">
              <span className="text-primary font-display text-xs tracking-widest uppercase">
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

          <Rail rows={2} />
        </div>
      </Container>
    </section>
  );
}

export function CommunityCta() {
  const t = useTranslations('Community.cta');

  return (
    <section id="join" className="scroll-mt-24">
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
              <ButtonLink href={JOIN_HREF} withArrow>
                {t('button')}
              </ButtonLink>
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
