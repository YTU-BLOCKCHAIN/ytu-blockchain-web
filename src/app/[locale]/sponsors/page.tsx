import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import ComingSoon from '@/components/ComingSoon';

export default async function SponsorsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Nav');
  return <ComingSoon title={t('sponsors')} />;
}
