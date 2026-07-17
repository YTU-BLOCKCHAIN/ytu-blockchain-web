import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CoreValuesSection } from '@/components/about/core-values-section';
import { JoinSection } from '@/components/about/join-section';
import { MissionSection } from '@/components/about/mission-section';
import { SponsorsSection } from '@/components/about/sponsors-section';
import { TeamSection } from '@/components/about/team-section';
import { Separator } from '@/components/container';
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
    pathname: '/about',
    title: t('about.title'),
    description: t('about.description'),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-8 sm:py-12">
      <Separator />
      <MissionSection />
      <Separator />
      <CoreValuesSection />
      <Separator />
      <TeamSection />
      <Separator />
      <SponsorsSection />
      <Separator />
      <JoinSection />
      <Separator />
    </div>
  );
}
