import { ArrowUpRight, Code2, Lightbulb, Unlock, Users } from 'lucide-react';
import type { Locale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { useLocale, useTranslations } from 'next-intl';

import {
  Bars,
  Caret,
  Chip,
  Dither,
  Evolution,
  Eyebrow,
  NumItem,
  RuleBlock,
  Stat,
  Terminal,
} from '@/components/brand';
import { Container, Rail as GridRail } from '@/components/container';
import { CountUp } from '@/components/count-up';
import { toCard } from '@/components/events/events-sections';
import { JOIN_HREF } from '@/components/site-link';
import { ButtonLink, buttonClasses } from '@/components/ui/button';
import { getEvents, isUpcoming, todayInClubTimeZone } from '@/lib/events';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

/*
  Ana sayfa, kulübün sosyal medya postlarının diliyle kuruldu: signal mavisi
  yüzey, büyük VHS başlık, dither'lı görsel, altta beyaz bilgi bandı. Bölümler
  void ve signal arasında gidip geliyor; aynı ızgara (Container asGrid) her
  bölümü taşıyor.
*/

/** Izgaranın yan rayları: masaüstünde boş hücreler, telefonda yok. */
function Rail({ rows = 1 }: { rows?: number }) {
  return <GridRail rows={rows} className="@4xl:grid hidden" />;
}

/**
 * Sezon chip'i ("GÜZ 2026"), postlardaki sağ üst etiket. Bugünün tarihinden
 * hesaplanıyor; elle yazılsaydı her dönem başında eskirdi. Ocak hâlâ güz
 * dönemi (finaller), Temmuz–Ağustos yaz.
 */
function seasonOf(today: string) {
  const [year = 0, month = 1] = today.split('-').map(Number);
  if (month >= 9) return { key: 'fall', year } as const;
  if (month === 1) return { key: 'fall', year: year - 1 } as const;
  if (month <= 6) return { key: 'spring', year } as const;
  return { key: 'summer', year } as const;
}

/**
 * Afişteki tarih barı: "3 KASIM SALI". Büyük harf dile göre yapılıyor
 * (`toLocaleUpperCase`); burada yalnız ay ve gün adı var, marka adı yok —
 * BLOCKCHAIN → BLOCKCHAİN tuzağı bu metne düşmüyor.
 */
function barDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    timeZone: 'UTC',
  })
    .format(new Date(`${date}T00:00:00Z`))
    .toLocaleUpperCase(locale);
}

export async function LandingHero() {
  const t = await getTranslations('Landing');
  const tEvents = await getTranslations('Events');
  const locale = await getLocale();
  const today = todayInClubTimeZone();
  const season = seasonOf(today);

  // Sorgu tarihe göre azalan; yaklaşanların sonuncusu en yakını.
  const next = (await getEvents())
    .filter((event) => isUpcoming(event, today))
    .at(-1);
  const card = next ? toCard(next, locale, tEvents('online')) : null;

  return (
    <section className="surface-signal overflow-hidden">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <Rail rows={6} />

          <div className="@4xl:col-span-8 col-span-full">
            <div data-grid-content className="flex flex-col">
              <div className="@4xl:px-12 @4xl:pt-12 px-6 pt-6 sm:px-10 sm:pt-10">
                <div className="flex items-start justify-between gap-4">
                  <Eyebrow className="pt-2">
                    BLOCKCHAIN · DEFI · ZK · OPEN-SOURCE
                  </Eyebrow>
                  <Chip>
                    {t(`hero.season.${season.key}`, { year: season.year })}
                  </Chip>
                </div>

                <h1 className="@4xl:text-7xl mt-10 text-[2.5rem] leading-[1.12] text-balance sm:text-6xl">
                  {t('hero.title')}
                </h1>
              </div>

              <div className="@4xl:grid-cols-[5fr_7fr] @4xl:items-end @4xl:gap-10 @4xl:pl-12 mt-8 grid gap-10 px-6 sm:px-10 @4xl:pr-0">
                <div className="@4xl:pb-12">
                  <p className="text-muted-foreground text-lg text-balance">
                    {t('subtitle')}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href={JOIN_HREF} withArrow>
                      {t('cta')}
                    </ButtonLink>
                    <ButtonLink href="/projects" variant="outline">
                      {t('ctaSecondary')}
                    </ButtonLink>
                  </div>
                </div>
                <div className="@4xl:pr-12 pt-4">
                  <Evolution you={t('hero.you')} />
                </div>
              </div>

              {/* Postlardaki beyaz bilgi bandı. Yaklaşan etkinlik varsa
                  afişteki gibi tarih barları; yoksa davet. */}
              <div className="surface-paper @4xl:flex-row @4xl:items-end @4xl:justify-between @4xl:px-12 @4xl:py-10 flex flex-col gap-6 px-6 py-8 sm:px-10">
                {card ? (
                  <>
                    <div className="min-w-0">
                      <Chip tone="signal">{t('hero.next')}</Chip>
                      <p className="text-primary font-display mt-4 text-3xl leading-tight sm:text-4xl">
                        {card.title}
                      </p>
                      <Bars
                        className="mt-4 text-lg sm:text-xl"
                        lines={[
                          barDate(card.dateTime ?? '', locale),
                          [card.time, card.place].filter(Boolean).join(' / '),
                        ].filter(Boolean)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {card.lumaUrl ? (
                        <a
                          href={card.lumaUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={buttonClasses()}
                        >
                          {t('hero.register')}
                          <ArrowUpRight aria-hidden className="size-4" />
                        </a>
                      ) : null}
                      <ButtonLink
                        href={`/events/${card.slug}`}
                        variant="outline"
                      >
                        {t('hero.details')}
                      </ButtonLink>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="max-w-xl">
                      <p className="text-primary font-display text-3xl leading-tight sm:text-4xl">
                        {t('hero.fallbackTitle')}
                      </p>
                      <p className="text-muted-foreground mt-3">
                        {t('hero.fallbackText')}
                      </p>
                    </div>
                    <ButtonLink href="/events" withArrow className="shrink-0">
                      {t('events.all')}
                    </ButtonLink>
                  </>
                )}
              </div>
            </div>
          </div>

          <Rail rows={6} />
        </div>
      </Container>
    </section>
  );
}

export function LandingFeatures() {
  const t = useTranslations('Landing');
  const locale = useLocale();

  const items = (
    ['workshops', 'projects', 'community', 'sponsorships'] as const
  ).map((key) => ({
    title: t(`features.${key}.title`),
    description: t(`features.${key}.description`),
  }));

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="reveal-cells @2xl:grid-cols-2 col-span-full grid gap-px sm:col-span-8">
            <div
              data-grid-content
              className="@4xl:p-12 relative col-span-full overflow-clip p-6"
            >
              <Dither
                name="brain"
                width={1400}
                height={878}
                className="text-primary @2xl:block absolute -right-6 -bottom-28 hidden w-[22rem] opacity-40"
              />
              <div className="relative">
                <Eyebrow>
                  {t('features.heading').toLocaleUpperCase(locale)}
                </Eyebrow>
                <h2 className="@4xl:text-5xl mt-5 text-3xl leading-[1.12] sm:text-4xl">
                  {t('featuresTitle')}
                </h2>
              </div>
            </div>

            {items.map((item, i) => (
              <div key={item.title} data-grid-content className="@4xl:p-12 p-6">
                <NumItem n={String(i + 1).padStart(2, '0')} title={item.title}>
                  {item.description}
                </NumItem>
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

/**
 * Vizyon ve misyon — eskiden Hakkımızda sayfasındaydı, kulübü ilk kez gören
 * biri aramadan okusun diye ana sayfaya taşındı. Hero gibi signal yüzeyde. Header'daki "Vizyon ve
 * Misyon" bağlantısı `/#vision`a iniyor.
 */
export function LandingVision() {
  const t = useTranslations('Landing.vision');

  const items = [
    { label: t('visionLabel'), body: t('vision') },
    { label: t('missionLabel'), body: t('mission') },
  ];

  return (
    <section id="vision" className="surface-signal scroll-mt-24">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <GridRail rows={5} />

          <div className="reveal-cells @2xl:grid-cols-2 col-span-full grid gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <Eyebrow>{t('heading')}</Eyebrow>
              <h2 className="@4xl:text-5xl mt-5 text-3xl leading-[1.12] sm:text-4xl">
                {t('title')}
              </h2>
            </div>

            {items.map((item) => (
              <div
                key={item.label}
                data-grid-content
                className="@4xl:p-12 flex flex-col items-start gap-6 p-6"
              >
                <Chip>{item.label}</Chip>
                <p className="text-foreground text-xl leading-relaxed font-medium text-balance">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <GridRail rows={5} />
        </div>
      </Container>
    </section>
  );
}

/** Değerler — vizyon/misyonun hemen altında, dört ilke yan yana. */
export function LandingValues() {
  const t = useTranslations('Landing.values');

  const items = [
    { key: 'curiosity', Icon: Lightbulb },
    { key: 'community', Icon: Users },
    { key: 'building', Icon: Code2 },
    { key: 'openness', Icon: Unlock },
  ] as const;

  return (
    <section id="values" className="scroll-mt-24">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <GridRail />

          <div className="reveal-cells @2xl:grid-cols-2 @4xl:grid-cols-4 col-span-full grid gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <Eyebrow>{t('heading')}</Eyebrow>
              <h2 className="@4xl:text-5xl mt-5 text-3xl leading-[1.12] sm:text-4xl">
                {t('title')}
              </h2>
              <p className="text-muted-foreground mt-6 max-w-2xl text-lg text-balance">
                {t('intro')}
              </p>
            </div>

            {items.map(({ key, Icon }) => (
              <div
                key={key}
                data-grid-content
                className="@4xl:p-8 flex flex-col gap-3 p-6"
              >
                <Icon aria-hidden className="text-primary size-6" />
                <h3 className="text-foreground mt-2 text-lg leading-tight font-semibold">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>

          <GridRail />
        </div>
      </Container>
    </section>
  );
}

/**
 * Web3 yol haritası — Notion'daki rehberin (`/roadmap`) rotası: 6 temel adım
 * ve "kendi yolunu seç". Kaynaklar Notion'da kalıyor; burada yalnızca rota
 * görünüyor ki ziyaretçi rehberin varlığını aramadan fark etsin. Adımlar ve
 * süreler Notion sayfasındaki rota kutularıyla aynı; orası değişirse burası da
 * (toplam süre `total` de).
 *
 * Adımlar postlardaki kademeli barlar gibi merdiven: her satır bir öncekinden
 * `--stair` kadar sağda, hepsi aynı genişlikte. Son basamak (7) yüzeyin tersi,
 * rotanın varış noktası.
 */
export function LandingRoadmap() {
  const t = useTranslations('Landing.roadmap');

  const steps = [
    'basics',
    'bitcoin',
    'ethereum',
    'ecosystem',
    'useCases',
    'advanced',
    'path',
  ] as const;
  const last = steps.length - 1;

  return (
    <section id="roadmap" className="surface-signal scroll-mt-24 overflow-clip">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <GridRail rows={8} />

          <div className="col-span-full grid gap-px sm:col-span-8">
            <div
              data-grid-content
              className="@4xl:p-12 @4xl:flex-row @4xl:items-end @4xl:justify-between flex flex-col gap-8 p-6"
            >
              <div className="reveal">
                <Eyebrow>{t('heading')}</Eyebrow>
                <h2 className="@4xl:text-5xl mt-5 text-3xl leading-[1.12] sm:text-4xl">
                  {t('title')}
                </h2>
                <p className="text-muted-foreground mt-6 max-w-xl text-lg text-balance">
                  {t('intro')}
                </p>
                <p className="text-muted-foreground mt-4 text-sm">
                  <span className="text-foreground font-semibold">
                    {t('shortcutTitle')}
                  </span>{' '}
                  {t('shortcut')}
                </p>
              </div>
              <div className="reveal flex shrink-0 flex-col items-start gap-6">
                <Stat value={t('total')} label={t('totalLabel')} />
                {/* `/roadmap` bir yönlendirme (next.config.ts → Notion), sayfa
                    değil: dil öneki almamalı, bu yüzden i18n `Link` değil düz
                    `<a>`. */}
                <a
                  href={siteConfig.roadmapPath}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonClasses()}
                >
                  {t('open')}
                  <ArrowUpRight aria-hidden className="size-4" />
                </a>
              </div>
            </div>

            <div
              data-grid-content
              className="@4xl:p-12 @4xl:[--stair:3rem] relative overflow-clip p-6 [--stair:0.75rem] sm:[--stair:2rem]"
            >
              {/* Merdivenin altında kalan boş üçgende dither dağlar: tırmanılacak
                  yol. Dekoratif, yalnızca geniş ekranda. */}
              <Dither
                name="bulut"
                width={2200}
                height={1725}
                className="@4xl:block absolute bottom-0 left-0 hidden w-[42%] opacity-25"
              />
              <ol className="relative flex flex-col gap-2">
                {steps.map((key, i) => {
                  const final = i === last;
                  return (
                    <li
                      key={key}
                      style={{
                        marginLeft: `calc(${i} * var(--stair))`,
                        width: `calc(100% - ${last} * var(--stair))`,
                      }}
                      className={cn(
                        'reveal-left flex items-stretch',
                        final
                          ? 'bg-action text-action-foreground'
                          : 'bg-muted text-foreground',
                      )}
                    >
                      <span
                        className={cn(
                          'font-display flex w-14 shrink-0 items-center justify-center text-xl sm:w-20 sm:text-3xl',
                          final
                            ? 'bg-foreground/0 border-action-foreground/30 border-r'
                            : 'bg-action text-action-foreground',
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
                        <div className="min-w-0">
                          <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base leading-tight font-semibold sm:text-lg">
                            {t(`steps.${key}.title`)}
                            {key === 'ecosystem' && (
                              <Chip tone="outline" className="h-6 px-2 text-xs">
                                {t('shortcutChip')}
                              </Chip>
                            )}
                          </h3>
                          <p
                            className={cn(
                              'mt-1 text-sm leading-snug',
                              final
                                ? 'text-action-foreground/80'
                                : 'text-muted-foreground',
                            )}
                          >
                            {t(`steps.${key}.description`)}
                          </p>
                        </div>
                        <span className="font-display shrink-0 text-xs tracking-widest opacity-80">
                          {t(`steps.${key}.time`)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <GridRail rows={8} />
        </div>
      </Container>
    </section>
  );
}

/**
 * Rakam bandı (kit `.stat`, signal yüzeyde en güçlü). Etkinlik ve ülke
 * sayısı kayıtlardan hesaplanıyor (bkz. `EventsHero`). Hackathon dereceleri
 * ve birincilikler son iki yılın toplamı, Sanity'de kaydı olmadığı için elle
 * yazılı ("15+", "10+"); yeni derece gelince buradan güncellenir.
 */
export async function LandingStats() {
  const events = await getEvents();
  const t = await getTranslations('Landing.stats');

  const countries = new Set(
    events.flatMap((event) => (event.country ? [event.country] : [])),
  ).size;

  const stats = [
    ...[
      { value: events.length, label: t('events') },
      { value: countries, label: t('countries') },
    ].filter((stat) => stat.value > 0),
    { value: '15+', label: t('awards') },
    { value: '10+', label: t('firsts') },
  ];

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
              className="@4xl:p-12 relative overflow-clip p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Eyebrow>{t('heading')}</Eyebrow>
                <RuleBlock className="max-sm:hidden" />
              </div>
              <div className="@2xl:grid-cols-4 mt-10 grid grid-cols-2 gap-x-6 gap-y-10">
                {stats.map((stat) => (
                  <Stat
                    key={stat.label}
                    value={<CountUp value={stat.value} />}
                    label={stat.label}
                    className="reveal border-border border-l pl-4"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mt-10 text-sm">
                {t('awardsNote')}
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

export function LandingManifesto() {
  const t = useTranslations('Landing');

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="reveal-cells col-span-full sm:col-span-8">
            <div
              data-grid-content
              className="@4xl:p-12 @2xl:grid-cols-[3fr_2fr] relative grid items-end gap-10 overflow-clip p-6"
            >
              <div>
                <Eyebrow>{t('manifestoTitle')}</Eyebrow>
                <p className="@4xl:text-3xl mt-6 text-2xl leading-snug font-medium text-balance">
                  {t.rich('manifestoRich', {
                    // Kit `.hl`: sayfada tek vurgu bandı, metnin arkasında
                    // dolu signal blok.
                    hl: (chunks) => (
                      <mark className="bg-action text-action-foreground px-1.5 [box-decoration-break:clone]">
                        {chunks}
                      </mark>
                    ),
                  })}
                </p>
                <RuleBlock className="mt-10" />
              </div>
              <Dither
                name="satoshi"
                width={1000}
                height={877}
                className="text-primary @2xl:-mb-12 mx-auto block w-full max-w-xs"
              />
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

/** Kayan şerit — marka banner'ındaki tekrar eden yazı (long-strip.png). */
const TICKER = [
  'YTU BLOCKCHAIN',
  'BLOCKCHAIN',
  'DEFI',
  'ZERO-KNOWLEDGE',
  'OPEN-SOURCE',
  'HACKATHON',
];

export function LandingTicker() {
  const row = (
    <div className="flex shrink-0 items-center">
      {TICKER.map((word) => (
        <span key={word} className="flex items-center">
          <span className="font-display px-6 text-xl whitespace-nowrap sm:text-2xl">
            {word}
          </span>
          <i className="block size-2 bg-current" />
        </span>
      ))}
    </div>
  );

  return (
    <section aria-hidden>
      <Container asGrid>
        <div data-grid-content className="text-primary overflow-hidden py-4">
          <div className="motion-safe:animate-marquee flex w-max">
            {row}
            {row}
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
              <h2 className="text-muted-foreground font-display text-balance text-xs tracking-widest uppercase">
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
  const t = useTranslations('Landing');

  return (
    <section className="surface-signal overflow-hidden">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <GridRail rows={5} />

          <div className="col-span-full sm:col-span-8">
            <div data-grid-content>
              <div className="@4xl:p-12 @2xl:grid-cols-[3fr_2fr] relative grid items-end gap-10 overflow-hidden p-6">
                <div>
                  <h2 className="text-primary @4xl:text-6xl text-4xl leading-[1.12] text-balance sm:text-5xl">
                    {t('ctaTitle')}
                  </h2>
                  <Terminal path="~/ytu-blockchain" className="mt-8 max-w-md">
                    <p>{t('ctaCommand')}</p>
                    <p>
                      {t('ctaOutput')}
                      <Caret />
                    </p>
                  </Terminal>
                </div>
                <Dither
                  name="whale"
                  width={1400}
                  height={916}
                  className="text-primary @2xl:-mb-12 block w-full"
                />
              </div>

              <div className="surface-paper @4xl:px-12 flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-primary font-display text-2xl sm:text-3xl">
                    YTUBLOCKCHAIN.COM/LINKS
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {t('ctaText')}
                  </p>
                </div>
                <ButtonLink href={JOIN_HREF} withArrow className="shrink-0">
                  {t('callToAction.button')}
                </ButtonLink>
              </div>
            </div>
          </div>

          <GridRail rows={5} />
        </div>
      </Container>
    </section>
  );
}
