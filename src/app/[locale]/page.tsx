import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LandingHackathons } from '@/components/landing/landing-hackathons';
import { LandingPosts } from '@/components/landing/landing-posts';
import {
  LandingCta,
  LandingFeatures,
  LandingHero,
  LandingManifesto,
  // Sponsorlar & Partnerler bölümü şimdilik yayında değil (aşağıya bakın).
  // LandingSponsors,
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
      <LandingFeatures />
      <LandingManifesto />
      <LandingHackathons />
      {/* Gerçek sponsor/partner logoları hazır olana kadar gizlendi; bileşen
          `landing-sections.tsx` içinde duruyor, geri açmak için yorumu kaldırın. */}
      {/* <LandingSponsors /> */}
      <LandingPosts />
      <LandingCta />
    </>
  );
}
