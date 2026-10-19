import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { getEvent } from '@/lib/events';
import { contentType, size, titleCard } from '@/lib/og';
import { siteConfig } from '@/lib/site';

/**
 * Etkinliğin paylaşım kartı: logo, "// events" etiketi ve etkinliğin adı.
 * Kapak görseli kullanılmıyor — gerekçe blog yazısının kartında
 * (`blog/[slug]/opengraph-image.tsx`).
 */
export const alt = 'YTÜ Blockchain — events';
export { size, contentType };

type EventParams = { locale: Locale; slug: string };

export default async function Image({
  params,
}: {
  params: Promise<EventParams>;
}) {
  const { locale, slug } = await params;
  const event = await getEvent(slug);
  const t = await getTranslations({ locale, namespace: 'Meta' });

  return titleCard({
    eyebrow: 'events',
    title: event?.title?.[locale] || t('events.title') || siteConfig.name,
  });
}
