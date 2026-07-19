import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { MailtoForm } from '@/components/mailto-form';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/lib/site';

export function ContactSection() {
  const t = useTranslations('Contact');

  const reasons = [
    t('reasons.partnership'),
    t('reasons.events'),
    t('reasons.press'),
    t('reasons.general'),
  ];

  return (
    <section className="overflow-hidden">
      <Container className="@4xl:px-12 px-6 py-3">
        <span className="text-primary font-mono text-xs tracking-widest lowercase">
          {'//'} {t('eyebrow')}
        </span>
      </Container>

      <Container asGrid className="@4xl:grid-cols-2">
        <div
          data-grid-content
          className="@4xl:p-12 relative overflow-hidden p-6"
        >
          {/* Dekoratif pixel-ASCII Avrupa haritası. Diğer hero'lar ile aynı
              teknik: CSS mask + bg-foreground → görsel metin rengini alır
              (dark açık / light koyu). İçerik relative sarmalayıcıyla üstte. */}
          <div
            aria-hidden
            className="bg-foreground pointer-events-none absolute inset-0 opacity-20 dark:opacity-15"
            style={{
              maskImage: 'url(/images/contact-bg.png)',
              WebkitMaskImage: 'url(/images/contact-bg.png)',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
            }}
          />
          <div className="relative">
            <h1 className="text-foreground text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-6 text-balance text-lg">
              {t('subtitle')}
            </p>

            <h2 className="text-muted-foreground mt-10 text-sm">
              {t('reasonsHeading')}
            </h2>
            <ul className="mt-4 space-y-3">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-center gap-3">
                  <CheckCircle2 className="size-4 shrink-0 fill-emerald-400/25 text-emerald-600 dark:text-emerald-500" />
                  <span className="text-sm">{reason}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-1">
              <h3 className="text-muted-foreground text-sm">
                {t('emailLabel')}
              </h3>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-foreground hover:decoration-primary text-sm font-medium hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
            </div>

            <p className="text-muted-foreground mt-8 text-sm">
              {t('communityNote')}{' '}
              <Link
                href="/community"
                className="text-primary font-medium hover:underline"
              >
                {t('communityCta')}
              </Link>
            </p>
          </div>
        </div>

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
              {
                name: 'message',
                label: t('form.message'),
                multiline: true,
                required: true,
              },
            ]}
            recipient={siteConfig.contactEmail}
            subject={t('form.subject')}
            submitLabel={t('form.submit')}
          />
        </div>
      </Container>
    </section>
  );
}
