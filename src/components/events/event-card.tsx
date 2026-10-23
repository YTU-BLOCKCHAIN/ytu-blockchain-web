import { ArrowUpRight, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonClasses } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { EventOrg } from '@/lib/events';
import { EVENT_TYPE_LABEL_KEY, type EventType } from '@/sanity/event-types';

import { EventCover, EventPlaceholder } from './event-cover';
import { OrgLogos } from './org-logos';

/**
 * Bir kartın çizilmesi için gereken her şey — sunucuda hazırlanmış düz veri
 * (gerekçe: `blog-card.tsx` → `BlogCardPost`). Izgara istemcide süzüldüğü için
 * görsel adresi ve tarih biçimi burada string olarak geliyor.
 */
export type EventCardData = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Okunur tarih — "20 Ekim 2026" ya da "28 Eylül – 1 Ekim 2026". */
  date: string | null;
  /** `<time datetime>` için ham `YYYY-MM-DD`. */
  dateTime: string | null;
  time: string | null;
  /** Tanınmayan bir değerse `null` — süzgeçte hayalet düğme doğmasın. */
  type: EventType | null;
  place: string | null;
  coverUrl: string | null;
  /** Kapağın arkasındaki bulanık zemin için küçük kopya (bkz. `EventCover`). */
  coverBlurUrl: string | null;
  coverAlt: string;
  /** "2025–2026" — geçmiş etkinlikler bu başlıklar altında gruplanıyor. */
  academicYear: string;
  lumaUrl: string | null;
  /** Partnerler + ekosistemler, logosu olanlar (bkz. `eventOrgs`). */
  orgs: EventOrg[];
};

export function EventTypeBadge({ type }: { type: EventType | null }) {
  const t = useTranslations('Events');
  if (!type) return null;

  return (
    <span className="bg-foreground/8 text-foreground/75 inline-flex px-2 py-0.5 text-xs font-medium">
      {t(EVENT_TYPE_LABEL_KEY[type])}
    </span>
  );
}

/**
 * Etkinlik kartı. Kartın tamamı detay sayfasına tıklanabilir (başlıktaki
 * bağlantının `before:inset-0` alanı, bkz. `PostCard`).
 *
 * `upcoming`: yaklaşan etkinlikte Luma bağlantısı varsa "Kayıt ol" düğmesi
 * çıkıyor. Düğme kartın tıklama katmanının ÜSTÜNDE (`relative z-10`) —
 * yoksa kayıt düğmesine basan detay sayfasına giderdi.
 */
export function EventCard({
  event,
  upcoming = false,
}: {
  event: EventCardData;
  upcoming?: boolean;
}) {
  const t = useTranslations('Events');

  return (
    <article className="group relative">
      <div
        data-grid-content
        className="@4xl:p-8 hover:bg-muted! flex flex-col gap-4 p-6 transition duration-200"
      >
        {event.coverUrl && event.coverBlurUrl ? (
          <EventCover
            src={event.coverUrl}
            blurSrc={event.coverBlurUrl}
            alt={event.coverAlt}
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
            className="aspect-[16/10]"
          />
        ) : (
          <EventPlaceholder
            logoUrl={event.orgs[0]?.logoUrl ?? null}
            label={
              event.orgs[0]?.name ??
              (event.type ? t(EVENT_TYPE_LABEL_KEY[event.type]) : null)
            }
            className="aspect-[16/10]"
          />
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {event.date ? (
            <time
              dateTime={event.dateTime ?? undefined}
              className="text-muted-foreground text-sm"
            >
              {event.date}
              {upcoming && event.time ? ` · ${event.time}` : null}
            </time>
          ) : null}
          <EventTypeBadge type={event.type} />
        </div>

        <div className="space-y-2">
          <h3 className="text-foreground text-balance font-semibold">
            <Link
              href={`/events/${event.slug}`}
              className="before:absolute before:inset-0"
            >
              {event.title}
            </Link>
          </h3>

          {event.place ? (
            <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
              <MapPin aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              {event.place}
            </p>
          ) : null}

          <p className="text-muted-foreground line-clamp-3">{event.summary}</p>
        </div>

        <OrgLogos orgs={event.orgs} />

        {upcoming && event.lumaUrl ? (
          <div className="mt-auto pt-2">
            <a
              href={event.lumaUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(buttonClasses({ size: 'sm' }), 'relative z-10')}
            >
              {t('register')}
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}
