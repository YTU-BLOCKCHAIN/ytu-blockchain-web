import { type Locale, useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import {
  academicYear,
  countryName,
  eventPlace,
  formatEventDate,
  isUpcoming,
  todayInClubTimeZone,
} from '@/lib/events';
import { cn } from '@/lib/utils';
import { isEventType } from '@/sanity/event-types';
import { imageUrl } from '@/sanity/lib/image';
import type { EventsQueryResult } from '@/sanity/types';

import { EventCard, type EventCardData } from './event-card';
import { EventsFeed } from './events-feed';

type EventRecord = EventsQueryResult[number];

/**
 * Sanity kaydını kartın beklediği düz veriye çevirir. Adresi ya da tarihi
 * olmayan kayıt çizilemez (sorgu zaten süzüyor; bu kapı tipteki `null`ları
 * kapatmak için). Dil burada indirgeniyor — kayıt iki dili birden taşıyor.
 */
function toCard(
  event: EventRecord,
  locale: Locale,
  onlineLabel: string,
): EventCardData | null {
  if (!event.slug || !event.date) return null;

  return {
    id: event._id,
    slug: event.slug,
    title: event.title?.[locale] ?? '',
    summary: event.summary?.[locale] ?? '',
    date: formatEventDate(event.date, event.endDate, locale),
    dateTime: event.date,
    time: event.time,
    type: isEventType(event.type) ? event.type : null,
    place: event.online
      ? onlineLabel
      : eventPlace([event.city, countryName(event.country, locale)]),
    // 16:10, kartın oranı; 2× ölçü retina ekran için.
    coverUrl: event.cover?.asset ? imageUrl(event.cover, 800, 500) : null,
    coverAlt: event.cover?.alt ?? '',
    academicYear: academicYear(event.date),
    lumaUrl: event.lumaUrl,
  };
}

/**
 * Başlık + arşivin kısa özeti ("101 etkinlik · 12 ülke · 40 partner").
 * Sayılar kayıtlardan hesaplanıyor; elle yazılmış bir rakam ilk yeni
 * etkinlikte eskirdi.
 */
export function EventsHero({ events }: { events: EventsQueryResult }) {
  const t = useTranslations('Events');

  const countries = new Set(
    events.flatMap((event) => (event.country ? [event.country] : [])),
  ).size;
  const partners = new Set(
    events.flatMap((event) =>
      (event.partners ?? []).filter((name): name is string => Boolean(name)),
    ),
  ).size;

  const stats = [
    t('stats.events', { count: events.length }),
    countries > 0 ? t('stats.countries', { count: countries }) : null,
    partners > 0 ? t('stats.partners', { count: partners }) : null,
  ].filter(Boolean);

  return (
    <section>
      <Container className="@4xl:py-12 pb-6 pt-12">
        <div className="@4xl:px-12 max-w-2xl px-6">
          <span className="text-primary font-display text-xs tracking-widest uppercase">
            {'//'} {t('eyebrow')}
          </span>
          {/* Geniş ekranda ölçüler blog hero'suyla aynı. Mobilde bir kademe
              küçük: "öğrendiğimiz," piksel fontta 36px'te 390px'lik ekrana
              sığmıyor, bölünemeyen kelime bütün sayfayı yatay kaydırıyordu. */}
          <h1 className="text-foreground mt-6 text-balance text-3xl font-semibold sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-6 text-balance text-lg">
            {t('intro')}
          </p>
          {events.length > 0 ? (
            <p className="text-foreground mt-6 text-sm font-medium">
              {stats.join(' · ')}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/**
 * Yaklaşan ve geçmiş etkinlikler.
 *
 * Ayrım her çizimde "bugün"e göre yapılıyor; sayfa önbellekte en fazla
 * `lib/events.ts`teki `revalidate` kadar kalıyor, yani biten bir etkinlik
 * birkaç dakika içinde geçmişe iner. Yaklaşanlar en yakından uzağa dizilir
 * (sorgu yeniden eskiye getiriyor, burada ters çevriliyor).
 */
export function EventsList({
  events,
  locale,
}: {
  events: EventsQueryResult;
  locale: Locale;
}) {
  const t = useTranslations('Events');

  if (events.length === 0) {
    return (
      <section>
        <Container asGrid>
          <div>
            <div data-grid-content className="@4xl:p-12 p-6 text-center">
              <p className="text-muted-foreground">{t('empty')}</p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const today = todayInClubTimeZone();
  const upcoming: EventCardData[] = [];
  const past: EventCardData[] = [];

  for (const event of events) {
    const card = toCard(event, locale, t('online'));
    if (!card) continue;
    if (isUpcoming(event, today)) upcoming.push(card);
    else past.push(card);
  }
  upcoming.reverse();

  return (
    <>
      {upcoming.length > 0 ? (
        <section aria-labelledby="events-upcoming">
          <Container asGrid>
            <div>
              <div data-grid-content className="@4xl:px-12 px-6 py-4">
                <h2
                  id="events-upcoming"
                  className="text-primary font-display text-sm tracking-widest uppercase"
                >
                  {t('upcoming')}
                </h2>
              </div>
            </div>
          </Container>
          {/* Sütun sayısı kart sayısına göre: üçlü ızgarada iki kart kalınca
              üçüncü hücre boş bir gri kutu olarak görünüyordu. */}
          <Container
            asGrid
            className={cn(
              upcoming.length > 1 && 'sm:grid-cols-2',
              upcoming.length > 2 && 'lg:grid-cols-3',
            )}
          >
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} upcoming />
            ))}
          </Container>
        </section>
      ) : null}

      {past.length > 0 ? (
        <>
          <section>
            <Container>
              <h2 className="@4xl:px-12 text-foreground px-6 pt-10 text-2xl font-semibold tracking-tight">
                {t('past')}
              </h2>
            </Container>
          </section>
          <EventsFeed events={past} />
        </>
      ) : null}
    </>
  );
}
