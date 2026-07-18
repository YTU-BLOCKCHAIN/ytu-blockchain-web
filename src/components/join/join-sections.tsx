import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { MailtoForm } from '@/components/mailto-form';
import { siteConfig } from '@/lib/site';

export function JoinHero() {
  const t = useTranslations('Join');

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
            {/* Dekoratif halftone "hack / eat / sleep" döngüsü. Diğer hero'lar
                ile aynı teknik: CSS mask + bg-foreground → görsel metin rengini
                alır (dark açık / light koyu), her iki temada aynı silik görsel. */}
            <div
              aria-hidden
              className="bg-foreground pointer-events-none absolute inset-0 opacity-25 dark:opacity-15"
              style={{
                maskImage: 'url(/images/join-bg.png)',
                WebkitMaskImage: 'url(/images/join-bg.png)',
                maskSize: '50%',
                WebkitMaskSize: '50%',
                maskPosition: 'right 40%',
                WebkitMaskPosition: 'right 40%',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
              }}
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

export function JoinApplication() {
  const t = useTranslations('Join');

  const expect = [
    t('expect.learn'),
    t('expect.build'),
    t('expect.community'),
    t('expect.open'),
  ];

  return (
    <section>
      <Container asGrid className="@4xl:grid-cols-2">
        <div data-grid-content className="@4xl:p-12 p-6">
          <h2 className="text-foreground font-medium">{t('form.heading')}</h2>
          <p className="text-muted-foreground mb-8 mt-2 text-sm">
            {t('form.intro')}
          </p>

          <MailtoForm
            fields={[
              {
                name: 'name',
                label: t('form.name'),
                required: true,
                autoComplete: 'name',
              },
              {
                name: 'email',
                label: t('form.email'),
                type: 'email',
                required: true,
                autoComplete: 'email',
              },
              { name: 'department', label: t('form.department') },
              {
                name: 'motivation',
                label: t('form.motivation'),
                multiline: true,
                required: true,
              },
            ]}
            recipient={siteConfig.contactEmail}
            subject={t('form.subject')}
            submitLabel={t('form.submit')}
          />
        </div>

        <div data-grid-content className="@4xl:p-12 p-6">
          <h2 className="text-muted-foreground text-sm">
            {t('expectHeading')}
          </h2>
          <ul className="mt-4 space-y-3">
            {expect.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="size-4 shrink-0 fill-emerald-400/25 text-emerald-600 dark:text-emerald-500" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
