import type { Metadata } from 'next';
import { hasLocale, type Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { PostArticle } from '@/components/blog/post-sections';
import { routing } from '@/i18n/routing';
import { getPost, getPostRoutes, postLanguageAlternates } from '@/lib/blog';
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/site';

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
    // Yazının kendi başlıklı kartı — bu segmentteki `opengraph-image.tsx`.
    ogImagePath: `/${locale}/blog/${slug}/opengraph-image`,
    article: post.publishedAt
      ? {
          publishedTime: post.publishedAt,
          modifiedTime: post._updatedAt,
          authors: post.author?.name ? [post.author.name] : undefined,
        }
      : undefined,
    // Çeviri bağlarından kurulan gerçek hreflang eşlemesi. Öntanımlı davranış
    // (aynı yol bütün dillerde) burada yanlış: TR/EN sürümlerin slug'ları farklı.
    languageAlternates: postLanguageAlternates(post.translations),
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

  const t = await getTranslations({ locale, namespace: 'Meta' });
  const pageUrl = `${siteConfig.url}/${locale}/blog/${slug}`;

  /* Yazının makine okunur kimliği (schema.org). `BlogPosting` arama motoruna
     başlığı, tarihleri ve yazarı metinden tahmin ettirmek yerine açıkça verir;
     `publisher` kök layout'taki Organization kimliğine `@id` ile bağlanır.
     `BreadcrumbList` sonuç sayfasında "Blog › Yazı" kırıntısını mümkün kılar. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title ?? undefined,
        description: post.excerpt ?? undefined,
        datePublished: post.publishedAt ?? undefined,
        dateModified: post._updatedAt,
        inLanguage: locale,
        image: `${pageUrl}/opengraph-image`,
        mainEntityOfPage: pageUrl,
        author: post.author?.name
          ? {
              '@type': 'Person',
              name: post.author.name,
              url: post.author.url ?? undefined,
            }
          : undefined,
        publisher: { '@id': `${siteConfig.url}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('blog.title'),
            item: `${siteConfig.url}/${locale}/blog`,
          },
          { '@type': 'ListItem', position: 2, name: post.title ?? slug },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Kaynak Sanity'deki kendi içeriğimiz; JSON.stringify kaçışlıyor.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostArticle post={post} locale={locale} />
    </>
  );
}
