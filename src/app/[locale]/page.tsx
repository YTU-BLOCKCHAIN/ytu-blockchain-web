import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Separator } from '@/components/container';
import {
  LandingCta,
  LandingFeatures,
  LandingHero,
  LandingManifesto,
  LandingSponsors,
} from '@/components/landing/landing-sections';
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
    pathname: '/',
    title: t('home.title'),
    description: t('home.description'),
    titleAbsolute: true,
  });
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <LandingHero />
      <Separator />
      <LandingFeatures />
      <Separator />
      <LandingManifesto />
      <Separator />
      <LandingSponsors />
      <Separator />
      <LandingCta />
      <Separator />
    </>
  );
}
