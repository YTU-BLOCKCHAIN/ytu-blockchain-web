import { ArrowUpRight } from 'lucide-react';
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
import { Container } from '@/components/container';
import { toCard } from '@/components/events/events-sections';
import { JOIN_HREF } from '@/components/site-link';
import { ButtonLink, buttonClasses } from '@/components/ui/button';
import { getEvents, isUpcoming, todayInClubTimeZone } from '@/lib/events';

/*
  Ana sayfa, kulübün sosyal medya postlarının diliyle kuruldu: signal mavisi
  yüzey, büyük VHS başlık, dither'lı görsel, altta beyaz bilgi bandı. Bölümler
  void ve signal arasında gidip geliyor; aynı ızgara (Container asGrid) her
  bölümü taşıyor.
*/

/** Izgaranın yan rayları: masaüstünde boş hücreler, telefonda yok. */
function Rail({ rows = 1 }: { rows?: number }) {
  return (
    <div
      aria-hidden
      className="@4xl:grid hidden gap-px"
      style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i}>
          <div data-grid-content />
        </div>
      ))}
    </div>
  );
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

          <div className="@2xl:grid-cols-2 col-span-full grid gap-px sm:col-span-8">
            <div
              data-grid-content
              className="@4xl:p-12 relative col-span-full overflow-hidden p-6"
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
 * Rakam bandı (kit `.stat`, signal yüzeyde en güçlü). Etkinlik ve ülke
 * sayısı kayıtlardan hesaplanıyor (bkz. `EventsHero`); hackathon dereceleri
 * Bahar 2026'nın sonucu, metin dosyasında.
 */
export async function LandingStats() {
  const events = await getEvents();
  const t = await getTranslations('Landing.stats');

  const countries = new Set(
    events.flatMap((event) => (event.country ? [event.country] : [])),
  ).size;

  const stats = [
    { value: events.length, label: t('events') },
    { value: countries, label: t('countries') },
    { value: 5, label: t('awards') },
    { value: 3, label: t('firsts') },
  ].filter((stat) => stat.value > 0);

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
              className="@4xl:p-12 relative overflow-hidden p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Eyebrow>{t('heading')}</Eyebrow>
                <RuleBlock className="max-sm:hidden" />
              </div>
              <div className="@2xl:grid-cols-4 mt-10 grid grid-cols-2 gap-x-6 gap-y-10">
                {stats.map((stat) => (
                  <Stat
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    className="border-border border-l pl-4"
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

          <div className="col-span-full sm:col-span-8">
            <div
              data-grid-content
              className="@4xl:p-12 @2xl:grid-cols-[3fr_2fr] relative grid items-end gap-10 overflow-hidden p-6"
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
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

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

              <div className="border-border @4xl:px-12 flex flex-col gap-6 border-t px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
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

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
