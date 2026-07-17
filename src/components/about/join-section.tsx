import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { Link } from '@/i18n/navigation';

export function JoinSection() {
  const t = useTranslations('About.join');

  const areas = [
    { key: 'defi', label: t('areas.defi') },
    { key: 'zk', label: t('areas.zk') },
    { key: 'contracts', label: t('areas.contracts') },
    { key: 'openSource', label: t('areas.openSource') },
  ];

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full grid gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="text-muted-foreground size-4" />
                <h2 className="text-muted-foreground text-balance">
                  {t('heading')}
                </h2>
              </div>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                {t('intro')}
              </p>
            </div>

            <div className="grid gap-px">
              {areas.map((area) => (
                <div key={area.key}>
                  <div
                    data-grid-content
                    className="@4xl:px-12 group hover:bg-card! hover:z-1 relative grid gap-2 overflow-hidden rounded-xl p-4 px-6 shadow-lg shadow-transparent hover:shadow-indigo-900/5"
                  >
                    <Link
                      href="/join"
                      className="font-medium after:absolute after:inset-0"
                    >
                      {area.label}
                    </Link>
                    <div className="flex items-center">
                      <span className="text-muted-foreground">
                        {t('areasHint')}
                      </span>
                      <div className="ring-border-illustration bg-card shadow-black/6.5 ml-auto flex h-6 items-center rounded-full px-2 shadow ring-1">
                        <ArrowRight className="not-group-hover:opacity-50 group-hover:text-primary size-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div data-grid-content className="@4xl:p-12 p-6">
              <p className="text-muted-foreground">
                {t('contactLead')}{' '}
                <Link
                  href="/contact"
                  className="text-foreground underline underline-offset-4"
                >
                  {t('contactLink')}
                </Link>{' '}
                {t('contactRest')}
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
