import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { SiteForm } from '@/components/site-form';
import { buttonClasses } from '@/components/ui/button';
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
        {/* Dolgu `@max-4xl:` ile veriliyor: bu hücreler `Container asGrid`'in
            DOĞRUDAN çocuğu, yani `*:p-[0.5px]` sınıfını da yiyorlar. Düz `p-6`
            o kurala sıralamada yeniliyor (masaüstündeki `@4xl:p-12` yeniyor) →
            mobilde dolgu 1px'e düşüp metin kartın kenarına yapışıyordu. */}
        <div
          data-grid-content
          className="@4xl:p-12 @max-4xl:p-6 relative overflow-hidden"
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

        <div data-grid-content className="@4xl:p-12 @max-4xl:p-6">
          <h2 className="text-foreground font-medium">{t('form.heading')}</h2>
          <p className="text-muted-foreground mb-8 mt-2 text-sm">
            {t('form.intro')}
          </p>

          <SiteForm
            kind="contact"
            labels={{
              name: t('form.name'),
              email: t('form.email'),
              message: t('form.message'),
            }}
            submitLabel={t('form.submit')}
          />
        </div>
      </Container>
    </section>
  );
}

/**
 * Sponsorluk şeridi — iletişim kartının hemen altında, tek hücrelik tam
 * genişlikte bir bant. Metin solda, randevu butonu sağda: hackathon başlığıyla
 * aynı `justify-between` deseni, dar ekranda alt alta sarıyor.
 *
 * Buton dışarı (cal.com) çıktığı için `ButtonLink` değil düz `<a>`: `ButtonLink`
 * next-intl'in `Link`'ini kullanır, o da adresin başına dil önekini takar.
 */
export function SponsorshipSection() {
  const t = useTranslations('Contact.sponsorship');

  return (
    <section>
      <Container asGrid>
        {/* Dolgu `@max-4xl:` ile veriliyor — yukarıdaki iletişim hücresiyle
            aynı sebep: bu hücre `Container asGrid`'in DOĞRUDAN çocuğu, yani
            `*:p-[0.5px]` sınıfını da yiyor. Düz `p-6` o kurala sıralamada
            yeniliyor (masaüstündeki `@4xl:p-12` yeniyor) → mobilde dolgu 1px'e
            düşüp başlık ve buton ızgara çizgilerine yapışıyordu. */}
        <div
          data-grid-content
          className="@4xl:p-12 @max-4xl:p-6 relative flex flex-wrap items-end justify-between gap-6 overflow-hidden"
        >
          {/* Dekoratif halftone dünya haritası + ortada ₿. Diğer hero'lar ile
              aynı teknik: CSS mask + bg-foreground → görsel metin rengini alır
              (dark açık / light koyu), her iki temada aynı silik görsel. */}
          <div
            aria-hidden
            className="bg-foreground pointer-events-none absolute inset-0 opacity-20 dark:opacity-15"
            style={{
              maskImage: 'url(/images/sponsorship-bg.png)',
              WebkitMaskImage: 'url(/images/sponsorship-bg.png)',
              maskSize: 'cover',
              WebkitMaskSize: 'cover',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
            }}
          />
          <div className="relative max-w-xl">
            <h2 className="text-foreground text-balance text-2xl font-semibold sm:text-3xl">
              {t('heading')}
            </h2>
            <p className="text-muted-foreground mt-3 text-balance">
              {t('body')}
            </p>
          </div>

          {/* Telefonda tam genişlik: formdaki gönder butonuyla aynı davranış,
              dar ekranda yarım kalan buton hem küçük bir hedef hem de bandı
              bitmemiş gösteriyor. */}
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonClasses({ className: 'relative max-sm:w-full' })}
          >
            {t('button')}
            {/* Dışarı çıkan bağlantı: ok sağ-yukarı. `withArrow`'un yatay
                kaymasının çapraz karşılığı. */}
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </Container>
    </section>
  );
}
