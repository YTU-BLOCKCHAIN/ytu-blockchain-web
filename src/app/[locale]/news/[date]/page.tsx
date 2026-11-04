import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { DigestArticle } from '@/components/news/news-sections';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/metadata';
import { formatDigestDate, getDigest, getDigests } from '@/lib/news';
import { siteConfig } from '@/lib/site';

type DigestParams = { locale: Locale; date: string };

/** Bültenler depodaki dosyalardan geliyor: listede olmayan tarih 404 verir. */
export const dynamicParams = false;

export function generateStaticParams(): DigestParams[] {
  return getDigests().flatMap((digest) =>
    routing.locales.map((locale) => ({ locale, date: digest.date })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<DigestParams>;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const digest = getDigest(date);
  if (!digest) return {};

  const t = await getTranslations({ locale, namespace: 'Meta' });
  const metadata = buildMetadata({
    locale,
    pathname: `/news/${date}`,
    title: `${t('news.title')} · ${formatDigestDate(date, locale)}`,
    description: digest.summary,
    ogImagePath: `/${locale}/news/${date}/opengraph-image`,
    article: { publishedTime: `${date}T09:00:00+03:00` },
    // Metin yalnız Türkçe: İngilizce kabuk ayrı bir sürüm sayılmamalı.
    languageAlternates: null,
  });
  return {
    ...metadata,
    alternates: {
      canonical: `/tr/news/${date}`,
      types: { 'application/rss+xml': '/news/rss.xml' },
    },
  };
}

export default async function DigestPage({
  params,
}: {
  params: Promise<DigestParams>;
}) {
  const { locale, date } = await params;
  setRequestLocale(locale);

  const digest = getDigest(date);
  if (!digest) notFound();

  const t = await getTranslations({ locale, namespace: 'Meta' });
  const pageUrl = `${siteConfig.url}/tr/news/${date}`;
  const title = `${t('news.title')} · ${formatDigestDate(date, locale)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description: digest.summary,
        datePublished: `${date}T09:00:00+03:00`,
        inLanguage: 'tr',
        image: `${pageUrl}/opengraph-image`,
        mainEntityOfPage: pageUrl,
        author: { '@id': `${siteConfig.url}/#organization` },
        publisher: { '@id': `${siteConfig.url}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('news.title'),
            item: `${siteConfig.url}/${locale}/news`,
          },
          { '@type': 'ListItem', position: 2, name: title },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Kaynak depodaki kendi içeriğimiz; `<` kaçışlanıyor ki metin etiketi kapatamasın.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <DigestArticle digest={digest} locale={locale} />
    </>
  );
}
