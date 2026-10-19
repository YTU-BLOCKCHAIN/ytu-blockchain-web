import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { EventArticle } from '@/components/events/event-article';
import { routing } from '@/i18n/routing';
import {
  countryName,
  eventPlace,
  getEvent,
  getEventRoutes,
} from '@/lib/events';
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/site';

type EventParams = { locale: Locale; slug: string };

/**
 * Etkinlikleri derleme anında her dilde üretir. Adres dilden bağımsız (bkz.
 * `schemaTypes/event.ts`), yani her kayıt her dil için bir sayfa. Sonradan
 * eklenen etkinlik ilk istekte üretilir — `dynamicParams` öntanımlı açık.
 */
export async function generateStaticParams(): Promise<EventParams[]> {
  const routes = await getEventRoutes();

  return routes.flatMap((route) =>
    route.slug
      ? routing.locales.map((locale) => ({
          locale,
          slug: route.slug as string,
        }))
      : [],
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<EventParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};

  return buildMetadata({
    locale,
    pathname: `/events/${slug}`,
    title: event.title?.[locale] ?? '',
    description: event.summary?.[locale] ?? '',
    ogImagePath: `/${locale}/events/${slug}/opengraph-image`,
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<EventParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const event = await getEvent(slug);
  if (!event) notFound();

  const t = await getTranslations({ locale, namespace: 'Meta' });
  const pageUrl = `${siteConfig.url}/${locale}/events/${slug}`;
  const startDate = event.time ? `${event.date}T${event.time}` : event.date;

  /* Etkinliğin makine okunur kimliği (schema.org `Event`). Saat yalnızca
     biliniyorsa yazılıyor; bilinmeyen saati 00:00 diye yayınlamak arama
     motoruna yanlış bilgi verirdi. Düzenleyen kulüp kök layout'taki
     Organization kimliğine `@id` ile bağlanıyor. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Event',
        name: event.title?.[locale] ?? undefined,
        description: event.summary?.[locale] ?? undefined,
        startDate: startDate ?? undefined,
        endDate: event.endDate ?? undefined,
        inLanguage: locale,
        image: `${pageUrl}/opengraph-image`,
        url: pageUrl,
        eventAttendanceMode: event.online
          ? 'https://schema.org/OnlineEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
        location: event.online
          ? { '@type': 'VirtualLocation', url: event.lumaUrl ?? pageUrl }
          : {
              '@type': 'Place',
              name:
                eventPlace([
                  event.venue,
                  event.city,
                  countryName(event.country, locale),
                ]) ?? undefined,
              address:
                eventPlace([event.city, countryName(event.country, locale)]) ??
                undefined,
            },
        organizer: { '@id': `${siteConfig.url}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('events.title'),
            item: `${siteConfig.url}/${locale}/events`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: event.title?.[locale] ?? slug,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Kaynak Sanity'deki kendi içeriğimiz; JSON.stringify kaçışlıyor.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventArticle event={event} locale={locale} />
    </>
  );
}
