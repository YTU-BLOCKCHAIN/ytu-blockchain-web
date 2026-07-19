import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
  SponsorsContact,
  SponsorsHero,
  SponsorsLogos,
} from '@/components/sponsors/sponsor-sections';
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
    pathname: '/sponsors',
    title: t('sponsors.title'),
    description: t('sponsors.description'),
  });
}

export default async function SponsorsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SponsorsHero />
      <SponsorsLogos />
      <SponsorsContact />
    </>
  );
}
