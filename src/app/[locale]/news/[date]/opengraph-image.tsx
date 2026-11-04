import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { formatDigestDate, getDigest } from '@/lib/news';
import { contentType, size, titleCard } from '@/lib/og';

/** Günün kartı: "// news" etiketi, bülten adı ve tarih. */
export const alt = 'YTÜ Blockchain — news';
export { size, contentType };

export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale; date: string }>;
}) {
  const { locale, date } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  // Bülten bulunamasa da kart üretilebilmeli: görsel isteği sayfadan ayrı geliyor.
  const title = getDigest(date)
    ? `${t('news.title')} · ${formatDigestDate(date, locale)}`
    : t('news.title');
  return titleCard({ eyebrow: 'news', title });
}
