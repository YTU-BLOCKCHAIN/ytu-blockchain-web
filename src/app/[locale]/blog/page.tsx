import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BlogHero, BlogList } from '@/components/blog/blog-sections';
import { getPosts } from '@/lib/blog';
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
    pathname: '/blog',
    title: t('blog.title'),
    description: t('blog.description'),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Yalnızca o dildeki yazılar; çevirisi olmayan yazı öbür dilde listelenmez.
  const posts = await getPosts(locale);

  return (
    <>
      <BlogHero />
      <BlogList posts={posts} locale={locale} />
    </>
  );
}
