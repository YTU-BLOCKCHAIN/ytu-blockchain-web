import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
  AboutHero,
  AboutJoin,
  AboutMission,
  // Ekibimiz ve Destekçilerimiz bölümleri şimdilik yayında değil (aşağıya bakın).
  // AboutSponsors,
  // AboutTeam,
  AboutValues,
} from '@/components/about/about-sections';
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
    <>
      <AboutHero />
      <AboutMission />
      <AboutValues />
      {/* Ekip fotoğrafları ve sponsor logoları hazır olana kadar gizlendi;
          bileşenler `about-sections.tsx` içinde duruyor, geri açmak için
          yorumu kaldırın (Header'daki #team / #sponsors linkleriyle birlikte). */}
      {/* <AboutTeam /> */}
      {/* <AboutSponsors /> */}
      <AboutJoin />
    </>
  );
}
