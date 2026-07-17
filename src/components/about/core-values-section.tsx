import { Code2, Lightbulb, ShieldCheck, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';

export function CoreValuesSection() {
  const t = useTranslations('About.values');

  const values = [
    {
      icon: Lightbulb,
      title: t('items.learn.title'),
      description: t('items.learn.description'),
    },
    {
      icon: Code2,
      title: t('items.openSource.title'),
      description: t('items.openSource.description'),
    },
    {
      icon: Users,
      title: t('items.community.title'),
      description: t('items.community.description'),
    },
    {
      icon: ShieldCheck,
      title: t('items.security.title'),
      description: t('items.security.description'),
    },
  ];

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="@4xl:grid-cols-2 col-span-full grid gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <h2 className="text-muted-foreground text-balance">
                {t('heading')}
              </h2>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                {t('intro')}
              </p>
            </div>

            {values.map((value) => (
              <div
                key={value.title}
                data-grid-content
                className="@4xl:p-12 flex flex-col gap-3 p-6"
              >
                <value.icon className="text-muted-foreground size-5" />
                <h3 className="text-foreground font-medium">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
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
