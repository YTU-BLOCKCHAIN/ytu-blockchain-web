import { ArrowUpRight } from 'lucide-react';
import { type Locale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { Container } from '@/components/container';
import { Link } from '@/i18n/navigation';
import { formatPostDate } from '@/lib/blog';
import { imageUrl } from '@/sanity/lib/image';
import type { PostsQueryResult } from '@/sanity/types';

export function BlogHero() {
  const t = useTranslations('Blog');

  return (
    <section className="overflow-hidden">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div
            data-grid-content
            className="@4xl:p-12 col-span-full p-6 sm:col-span-8"
          >
            <span className="text-primary font-mono text-xs tracking-widest lowercase">
              {'//'} {t('eyebrow')}
            </span>
            <h1 className="text-foreground mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-balance text-lg">
              {t('subtitle')}
            </p>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function BlogList({
  posts,
  locale,
}: {
  posts: PostsQueryResult;
  locale: Locale;
}) {
  const t = useTranslations('Blog');

  // Henüz o dilde yazı yoksa bölümü boş bir ızgarayla bırakmak "sayfa bozuk"
  // hissi veriyor; tek hücrede açık bir mesaj daha dürüst.
  if (posts.length === 0) {
    return (
      <section>
        <Container asGrid>
          <div data-grid-content className="@4xl:p-12 p-6 text-center">
            <p className="text-muted-foreground">{t('empty')}</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container asGrid className="sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const date = formatPostDate(post.publishedAt, locale);

          return (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group relative"
            >
              <div
                data-grid-content
                className="hover:bg-card! flex h-full flex-col transition-colors"
              >
                {post.coverImage ? (
                  <Image
                    src={imageUrl(post.coverImage, 800, 450)}
                    alt={post.coverImage.alt ?? ''}
                    width={800}
                    height={450}
                    sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full rounded-t object-cover"
                  />
                ) : null}

                <div className="@4xl:p-8 flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-foreground text-balance font-semibold">
                      {post.title}
                    </h2>
                    <ArrowUpRight className="text-muted-foreground group-hover:text-primary mt-0.5 size-4 shrink-0 transition-colors" />
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="text-muted-foreground mt-auto flex flex-wrap items-center gap-x-2 pt-3 text-xs">
                    {date ? (
                      <time dateTime={post.publishedAt ?? undefined}>
                        {date}
                      </time>
                    ) : null}
                    {date && post.author?.name ? (
                      <span aria-hidden>·</span>
                    ) : null}
                    {post.author?.name ? <span>{post.author.name}</span> : null}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </Container>
    </section>
  );
}
