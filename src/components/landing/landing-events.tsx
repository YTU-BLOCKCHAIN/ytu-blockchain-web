import { ArrowRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Container } from '@/components/container';
import { EventCard } from '@/components/events/event-card';
import { toCard } from '@/components/events/events-sections';
import { Link } from '@/i18n/navigation';
import { getEvents, isUpcoming, todayInClubTimeZone } from '@/lib/events';

/** Ana sayfada gösterilen kart sayısı — ızgaranın bir satırı. */
const LIMIT = 3;

/**
 * Ana sayfanın "Etkinlikler" bölümü: `/events` sayfasına giriş kapısı.
 *
 * Önce yaklaşan etkinlikler (en yakından), satır dolmazsa en son yapılanlar
 * tamamlıyor — dönem arasında da bölüm boş kalmasın, kulübün en son ne
 * yaptığını göstersin. Hiç etkinlik yoksa bölüm çizilmez (`LandingPosts` ile
 * aynı davranış).
 */
export async function LandingEvents() {
  const events = await getEvents();
  if (events.length === 0) return null;

  const t = await getTranslations('Landing.events');
  const tLanding = await getTranslations('Landing');
  const tEvents = await getTranslations('Events');
  const locale = await getLocale();

  const today = todayInClubTimeZone();
  const upcoming = events.filter((event) => isUpcoming(event, today)).reverse();
  const recent = events.filter((event) => !isUpcoming(event, today));
  const picked = [...upcoming, ...recent].slice(0, LIMIT);

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="reveal-cells @2xl:grid-cols-3 col-span-full grid gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <h2 className="@4xl:text-5xl text-3xl leading-[1.12] sm:text-4xl">
                {tLanding('eventsTitle')}
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl text-balance">
                {t('intro', { count: events.length })}
              </p>
              <Link
                href="/events"
                className="text-primary group mt-6 inline-flex items-center gap-2 text-sm font-medium"
              >
                {t('all')}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {picked.map((event) => {
              const card = toCard(event, locale, tEvents('online'));
              return card ? (
                <EventCard
                  key={card.id}
                  event={card}
                  upcoming={isUpcoming(event, today)}
                />
              ) : null;
            })}
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
