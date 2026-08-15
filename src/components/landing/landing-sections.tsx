import { ArrowRight, Code2, Handshake, Lightbulb, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { ButtonLink } from '@/components/ui/button';
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
              // Telefonda py-16 hero'yu ilk ekranın tamamına yayıyordu; py-12
              // ile başlığın altındaki içeriğin varlığı görünür kalıyor.
              //
              // Üst dolgu alttan daha az: hero'nun ilk elemanı artık duyuru
              // rozeti ve header'la arasında 98px boşluk kalıyordu — rozet
              // sayfadan kopuk duruyordu. Alt dolgu aynı kaldı, oradaki nefes
              // butonların altında hâlâ gerekli.
              className="relative overflow-hidden px-6 pt-6 pb-12 text-center sm:pt-10 sm:pb-24"
            >
              {/* Dekoratif kripto coin halftone (₿/D/₮) backdrop. Community bg
                  ile aynı teknik: CSS mask + bg-foreground → metin rengini alır
                  (dark açık, light koyu), her iki temada aynı silik görsel.
                  Konum biraz aşağıda (center 15%). */}
              <div
                aria-hidden
                className="bg-foreground pointer-events-none absolute inset-0 opacity-25 dark:opacity-15"
                style={{
                  maskImage: 'url(/images/landing-bg.png)',
                  WebkitMaskImage: 'url(/images/landing-bg.png)',
                  maskSize: 'cover',
                  WebkitMaskSize: 'cover',
                  maskPosition: 'center 15%',
                  WebkitMaskPosition: 'center 15%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                }}
              />
              <div className="relative mx-auto max-w-3xl">
                {/* Duyuru rozeti. Görsel dili sıfırdan uydurulmadı: footer'daki
                    durum rozetiyle aynı — `rounded-full`, `bg-card`, ince ring
                    ve nabız atan nokta. Yeşil bu sitede "açık / canlı" demek
                    (form onayları, footer durumu), o yüzden "alımlar başladı"
                    için doğru renk.

                    Rozet bir bağlantı: duyuruyu görüp ne yapacağını sorduran
                    bir etiket olmasın, doğrudan başvuru sayfasına götürsün.
                    Hover'da yarım adım kalkması sitedeki buton diliyle aynı.

                    `motion-safe:`: kullanıcı hareket azaltma diyorsa nabız
                    durur, rozet sabit kalır. */}
                <Link
                  href="/join"
                  className="ring-foreground/5 bg-card hover:ring-foreground/15 group mb-6 inline-flex items-center gap-2.5 rounded-full py-1 pr-4 pl-2.5 text-lg shadow ring-1 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span className="relative flex size-4">
                    <span className="absolute inset-0 block size-full rounded-full bg-emerald-400/40 motion-safe:animate-pulse" />
                    <span className="relative m-auto block size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span>{t('announcement')}</span>
                  <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>

                <div className="text-primary font-mono text-xs tracking-widest lowercase">
                  {'//'} blockchain · defi · zk · open-source
                </div>
                <h1 className="text-foreground mt-4 text-balance text-4xl font-semibold sm:text-6xl">
                  {t('title')}
                </h1>
                <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-balance text-lg">
                  {t('subtitle')}
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <ButtonLink href="/join" withArrow>
                    {t('cta')}
                  </ButtonLink>
                  <ButtonLink href="/projects" variant="outline">
                    {t('ctaSecondary')}
                  </ButtonLink>
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
      icon: Users,
      title: t('community.title'),
      description: t('community.description'),
    },
    {
      icon: Handshake,
      title: t('sponsorships.title'),
      description: t('sponsorships.description'),
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
              <ButtonLink href="/join" withArrow>
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
