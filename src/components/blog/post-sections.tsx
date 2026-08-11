import { type Locale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { Container } from '@/components/container';
import { Link } from '@/i18n/navigation';
import { formatPostDate } from '@/lib/blog';
import { CATEGORY_LABEL_KEY, isPostCategory } from '@/sanity/categories';
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
  const category = isPostCategory(post.category) ? post.category : null;

  return (
    <article>
      <Container asGrid>
        <div data-grid-content className="@4xl:p-12 p-6">
          {/* Okuma genişliği: hücrenin tamamı (~55rem) satır başına çok fazla
              karakter düşürüyor, göz satır sonunda kayboluyor. */}
          <div className="mx-auto max-w-2xl">
            {/* Kırıntı, listeye dönüş bağlantısının yerini tutuyor: hem yolu
                gösteriyor hem geri götürüyor, ayrı bir "Tüm yazılar" düğmesine
                gerek kalmıyor. */}
            <nav
              aria-label={t('breadcrumb')}
              className="text-muted-foreground text-center text-sm"
            >
              <Link href="/blog" className="hover:text-foreground duration-150">
                {t('breadcrumb')}
              </Link>
              {category ? (
                <>
                  <span aria-hidden className="px-2">
                    /
                  </span>
                  <span>{t(CATEGORY_LABEL_KEY[category])}</span>
                </>
              ) : null}
            </nav>

            <h1 className="text-foreground mt-6 text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>

            {post.coverImage ? (
              // `before`: görselin üstüne ince bir iç kenarlık koyar — açık
              // zeminde soluk bir kapak sayfanın içinde yüzer gibi durmasın.
              <div className="before:border-foreground/10 before:inset-ring-background/10 relative mt-10 aspect-video overflow-hidden rounded-[10px] shadow-md shadow-black/10 before:absolute before:inset-0 before:rounded-[10px] before:border before:inset-ring-1">
                <Image
                  src={imageUrl(post.coverImage, 1600, 900)}
                  alt={post.coverImage.alt ?? ''}
                  width={1600}
                  height={900}
                  priority
                  sizes="(min-width: 1024px) 42rem, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            {/* Yazar solda, tarih sağda, altında ince ayraç — gövdeyi
                künyeden ayırıyor. */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b pb-6">
              <div className="flex items-center gap-2">
                {post.author?.avatar ? (
                  <div className="ring-border-illustration bg-card aspect-square size-6 overflow-hidden rounded-md border border-transparent shadow-md shadow-black/15 ring-1">
                    {/* Adı hemen yanında yazdığı için fotoğraf dekoratif —
                        ekran okuyucuya aynı bilgiyi iki kez okutmuyoruz. */}
                    <Image
                      alt=""
                      src={imageUrl(post.author.avatar, 48, 48)}
                      width={24}
                      height={24}
                      className="size-full object-cover"
                    />
                  </div>
                ) : null}
                {post.author?.name ? (
                  <span className="text-foreground text-sm font-medium">
                    {post.author.name}
                  </span>
                ) : null}
              </div>

              {date ? (
                <time
                  dateTime={post.publishedAt ?? undefined}
                  className="text-muted-foreground text-sm"
                >
                  {date}
                </time>
              ) : null}
            </div>

            {/* Özet giriş paragrafı olarak: gövdeden bir tık büyük, yazının ne
                anlattığını okumaya başlamadan veriyor. */}
            {post.excerpt ? (
              <p className="text-foreground mt-8 text-balance text-lg">
                {post.excerpt}
              </p>
            ) : null}

            {post.body ? <PostBody value={post.body} /> : null}
          </div>
        </div>
      </Container>
    </article>
  );
}
