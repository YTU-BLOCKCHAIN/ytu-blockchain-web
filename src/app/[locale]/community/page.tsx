import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
  CommunityChannels,
  CommunityCta,
  CommunityHero,
} from '@/components/community/community-sections';
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
    pathname: '/community',
    title: t('community.title'),
    description: t('community.description'),
    // Sayfanın başlıklı kartı — bu segmentteki `opengraph-image.tsx`.
    ogImagePath: `/${locale}/community/opengraph-image`,
  });
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CommunityHero />
      <CommunityChannels />
      <CommunityCta />
    </>
  );
}
