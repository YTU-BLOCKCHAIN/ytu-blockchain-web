'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Container } from '@/components/container';
import { cn } from '@/lib/utils';
import {
  EVENT_TYPE_LABEL_KEY,
  EVENT_TYPES,
  type EventType,
} from '@/sanity/event-types';

import { EventCard, type EventCardData } from './event-card';

/** Süzgeç kapalıyken seçili olan sanal tür. Gerçek bir değerle çakışmaz. */
const ALL = '';

/**
 * Geçmiş etkinlikler: tür süzgeci + akademik yıla göre gruplanmış ızgara.
 *
 * Süzme istemcide (gerekçe: `blog-feed.tsx`) — yüz küsur kayıt tek sayfaya
 * sığıyor, her tıklamada sunucuya gitmenin karşılığı yok.
 *
 * Blog süzgecinden farkı: şeritte yalnızca **içerikte karşılığı olan** türler
 * var. Blogun kategorileri sabit bir konu listesi; etkinlik türleri ise
 * arşivden doğuyor ve hiç etkinliği olmayan bir türün düğmesi yalnızca boş
 * sonuç üretirdi.
 */
export function EventsFeed({ events }: { events: EventCardData[] }) {
  const t = useTranslations('Events');
  const [active, setActive] = useState<EventType | typeof ALL>(ALL);

  // Sıra `EVENT_TYPES`ten: içerik değiştikçe düğmeler yer değiştirmesin.
  const types = useMemo(() => {
    const present = new Set(events.map((event) => event.type));
    return EVENT_TYPES.map(({ value }) => value).filter((value) =>
      present.has(value),
    );
  }, [events]);

  const groups = useMemo(() => {
    const visible =
      active === ALL ? events : events.filter((event) => event.type === active);

    // Kayıtlar zaten yeniden eskiye sıralı geliyor; gruplar da o sırayı korur.
    const byYear = new Map<string, EventCardData[]>();
    for (const event of visible) {
      const group = byYear.get(event.academicYear);
      if (group) group.push(event);
      else byYear.set(event.academicYear, [event]);
    }
    return [...byYear];
  }, [events, active]);

  if (events.length === 0) return null;

  return (
    <>
      <section>
        <Container className="@4xl:px-12 py-4 md:px-6">
          {/* `role="group"` + `aria-pressed`: gerekçe `blog-feed.tsx`. */}
          <div
            role="group"
            aria-label={t('filters.label')}
            className="max-lg:mask-r-from-85% -ml-0.5 flex snap-x snap-mandatory overflow-x-auto py-3 max-md:pl-6"
          >
            {([ALL, ...types] as (EventType | typeof ALL)[]).map((value) => {
              const selected = value === active;

              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(value)}
                  className="text-muted-foreground group shrink-0 snap-center px-1"
                >
                  <span
                    className={cn(
                      'flex w-fit items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors',
                      selected
                        ? 'bg-muted text-primary ring-foreground/10 font-medium ring-1'
                        : 'group-hover:text-foreground group-hover:bg-foreground/5',
                    )}
                  >
                    {value === ALL
                      ? t('filters.all')
                      : t(EVENT_TYPE_LABEL_KEY[value])}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {groups.length === 0 ? (
        <section>
          <Container asGrid>
            <div data-grid-content className="@4xl:p-12 p-6 text-center">
              <p className="text-muted-foreground">{t('filters.empty')}</p>
            </div>
          </Container>
        </section>
      ) : (
        groups.map(([year, items]) => (
          <section key={year} aria-labelledby={`events-${year}`}>
            <Container asGrid>
              {/* Boş sarmalayıcı şart — gerekçe `BlogList`'teki boş durum. */}
              <div>
                <div
                  data-grid-content
                  className="@4xl:px-12 flex items-baseline justify-between gap-4 px-6 py-4"
                >
                  <h2
                    id={`events-${year}`}
                    className="text-foreground font-display text-sm tracking-widest"
                  >
                    {year}
                  </h2>
                  <span className="text-muted-foreground text-sm">
                    {t('stats.events', { count: items.length })}
                  </span>
                </div>
              </div>
            </Container>
            <Container asGrid className="sm:grid-cols-2 lg:grid-cols-3">
              {items.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </Container>
          </section>
        ))
      )}
    </>
  );
}
