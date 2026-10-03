import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
// Başvuru formu geçici olarak kapalı; aşağıdaki blokla birlikte geri açılacak.
// import { SiteForm } from '@/components/site-form';

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
      {/* Dolgu `@max-4xl:` ile: bu hücreler `Container asGrid`'in DOĞRUDAN
          çocuğu, `*:p-[0.5px]` kuralını da alıyorlar ve düz `p-6` ona sıralamada
          yeniliyor → mobilde dolgu 1px'e düşüyordu (masaüstünde `@4xl:p-12`
          zaten kazandığı için sorun görünmüyordu). */}
      <Container asGrid className="@4xl:grid-cols-2">
        {/* Başvuru formu şimdilik kapalı: alım dönemi açılınca aşağıdaki blok
            ve dosyanın başındaki `SiteForm` importu birlikte geri açılacak.
            `Join.form.*` çeviri anahtarları da o gün için duruyor.

        <div data-grid-content className="@4xl:p-12 @max-4xl:p-6">
          <h2 className="text-foreground font-medium">{t('form.heading')}</h2>
          <p className="text-muted-foreground mb-8 mt-2 text-sm">
            {t('form.intro')}
          </p>

          <SiteForm
            kind="join"
            labels={{
              name: t('form.name'),
              email: t('form.email'),
              department: t('form.department'),
              motivation: t('form.motivation'),
            }}
            submitLabel={t('form.submit')}
          />
        </div>

        */}

        {/* Formun yerini tutan mesaj. `min-h-64`: masaüstünde hücre zaten yan
            sütunun boyuna uzuyor, bu taban yalnızca tek sütuna düşen mobilde
            iş görüyor — yoksa yazı ince bir şeride sıkışıyordu. */}
        <div
          data-grid-content
          className="@4xl:p-12 @max-4xl:p-6 flex min-h-64 items-center justify-center"
        >
          <p className="text-foreground text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('soon')}
          </p>
        </div>

        <div data-grid-content className="@4xl:p-12 @max-4xl:p-6">
          <h2 className="text-muted-foreground text-sm">
            {t('expectHeading')}
          </h2>
          <ul className="mt-4 space-y-3">
            {expect.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="size-4 shrink-0 fill-primary/25 text-primary" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
