import type { Metadata } from 'next';
import { hasLocale, type Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { PostArticle } from '@/components/blog/post-sections';
import { routing } from '@/i18n/routing';
import { getPost, getPostRoutes } from '@/lib/blog';
import { buildMetadata } from '@/lib/metadata';
import { imageUrl } from '@/sanity/lib/image';

type PostParams = { locale: Locale; slug: string };

/**
 * Yayındaki yazıları derleme anında üretir. Listede olmayan bir adres
 * (derlemeden sonra yayınlanan yazı) ilk istekte üretilir — `dynamicParams`
 * öntanımlı olarak açık.
 */
export async function generateStaticParams(): Promise<PostParams[]> {
  const routes = await getPostRoutes();

  return routes.flatMap((route) => {
    const { slug, language } = route;
    if (!slug || !hasLocale(routing.locales, language)) return [];
    return [{ locale: language, slug }];
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PostParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);

  // Yazı yoksa sayfa zaten 404 verecek; kök layout'un öntanımlı metadata'sı
  // yeterli, yanlış bir kanonik adres üretmeyelim.
  if (!post) return {};

  return buildMetadata({
    locale,
    pathname: `/blog/${slug}`,
    title: post.title ?? '',
    description: post.excerpt ?? '',
    image: post.coverImage
      ? {
          url: imageUrl(post.coverImage, 1200, 630),
          alt: post.coverImage.alt ?? post.title ?? '',
        }
      : undefined,
    article: post.publishedAt
      ? {
          publishedTime: post.publishedAt,
          authors: post.author?.name ? [post.author.name] : undefined,
        }
      : undefined,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<PostParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost(locale, slug);
  if (!post) notFound();

  return <PostArticle post={post} locale={locale} />;
}
