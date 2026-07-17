import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';

export function MissionSection() {
  const t = useTranslations('About.mission');

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
              <div className="text-muted-foreground mt-6 space-y-4 text-xl font-medium *:text-balance *:leading-relaxed">
                <p>
                  <span className="text-foreground">{t('lead')}</span>{' '}
                  {t('leadRest')}
                </p>
                <p>{t('body')}</p>
              </div>
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
