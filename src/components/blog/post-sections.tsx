import { ArrowLeft } from 'lucide-react';
import { type Locale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { Container } from '@/components/container';
import { Link } from '@/i18n/navigation';
import { formatPostDate } from '@/lib/blog';
import { imageUrl } from '@/sanity/lib/image';
import type { PostQueryResult } from '@/sanity/types';

import { PostBody } from './post-body';

export function PostArticle({
  post,
  locale,
}: {
  post: NonNullable<PostQueryResult>;
  locale: Locale;
}) {
  const t = useTranslations('Blog');
  const date = formatPostDate(post.publishedAt, locale);

  return (
    <article>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div
            data-grid-content
            className="@4xl:p-12 col-span-full p-6 sm:col-span-8"
          >
            {/* Okuma genişliği: hücrenin tamamı (~55rem) satır başına çok
                fazla karakter düşürüyor, göz satır sonunda kayboluyor. */}
            <div className="mx-auto max-w-2xl">
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
              >
                <ArrowLeft className="size-4" />
                {t('backToList')}
              </Link>

              <h1 className="text-foreground mt-8 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
                {post.title}
              </h1>

              {post.excerpt ? (
                <p className="text-muted-foreground mt-6 text-balance text-lg">
                  {post.excerpt}
                </p>
              ) : null}

              <div className="mt-8 flex items-center gap-3">
                {post.author?.avatar ? (
                  <Image
                    // Adı hemen yanında yazdığı için fotoğraf dekoratif:
                    // ekran okuyucuya aynı bilgiyi iki kez okutmuyoruz.
                    alt=""
                    src={imageUrl(post.author.avatar, 80, 80)}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                ) : null}

                <div className="text-sm">
                  {post.author?.name ? (
                    <p className="text-foreground font-medium">
                      {post.author.name}
                    </p>
                  ) : null}
                  <p className="text-muted-foreground flex flex-wrap items-center gap-x-2">
                    {post.author?.role ? <span>{post.author.role}</span> : null}
                    {post.author?.role && date ? (
                      <span aria-hidden>·</span>
                    ) : null}
                    {date ? (
                      <time dateTime={post.publishedAt ?? undefined}>
                        {date}
                      </time>
                    ) : null}
                  </p>
                </div>
              </div>

              {post.coverImage ? (
                <Image
                  src={imageUrl(post.coverImage, 1600, 900)}
                  alt={post.coverImage.alt ?? ''}
                  width={1600}
                  height={900}
                  priority
                  sizes="(min-width: 1024px) 42rem, 100vw"
                  className="mt-10 h-auto w-full rounded"
                />
              ) : null}

              {post.body ? <PostBody value={post.body} /> : null}

              {post.tags && post.tags.length > 0 ? (
                <ul className="mt-12 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="bg-grid-line text-muted-foreground rounded px-2.5 py-1 font-mono text-xs"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </article>
  );
}
