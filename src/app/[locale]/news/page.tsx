import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
  DigestArchive,
  LatestDigest,
  NewsHero,
} from '@/components/news/news-sections';
import { buildMetadata } from '@/lib/metadata';
import { getDigests } from '@/lib/news';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  const metadata = buildMetadata({
    locale,
    pathname: '/news',
    title: t('news.title'),
    description: t('news.description'),
    ogImagePath: `/${locale}/news/opengraph-image`,
  });
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types: { 'application/rss+xml': '/news/rss.xml' },
    },
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [latest, ...older] = getDigests();

  return (
    <>
      <NewsHero />
      {latest ? <LatestDigest digest={latest} locale={locale} /> : null}
      <DigestArchive digests={older} locale={locale} />
    </>
  );
}
