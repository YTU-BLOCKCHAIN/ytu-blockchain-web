import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { Link } from '@/i18n/navigation';

/** Gerçek sponsor gelene kadar nötr yer tutucu kutu sayısı. */
const PLACEHOLDER_COUNT = 6;

export function SponsorsSection() {
  const t = useTranslations('About.sponsors');

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

            {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
              <div
                key={i}
                data-grid-content
                className="@4xl:px-12 flex items-center justify-center p-6"
              >
                <span className="text-muted-foreground/60 text-sm font-medium">
                  {t('placeholder')}
                </span>
              </div>
            ))}

            <div
              data-grid-content
              className="@4xl:p-12 col-span-full flex items-center justify-between gap-4 p-6"
            >
              <p className="text-muted-foreground text-balance">
                {t('ctaLead')}
              </p>
              <Link
                href="/sponsors"
                className="text-foreground shrink-0 underline underline-offset-4"
              >
                {t('cta')}
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
