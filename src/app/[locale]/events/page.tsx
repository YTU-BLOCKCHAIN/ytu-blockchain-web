import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { EventsHero, EventsList } from '@/components/events/events-sections';
import { getEvents } from '@/lib/events';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return buildMetadata({
    locale,
    pathname: '/events',
    title: t('events.title'),
    description: t('events.description'),
    // Sayfanın başlıklı kartı — bu segmentteki `opengraph-image.tsx`.
    ogImagePath: `/${locale}/events/opengraph-image`,
  });
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Dile göre süzülmüyor: her kayıt iki dili de taşıyor (bkz. queries.ts).
  const events = await getEvents();

  return (
    <>
      <EventsHero events={events} />
      <EventsList events={events} locale={locale} />
    </>
  );
}
