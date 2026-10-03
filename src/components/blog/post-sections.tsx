import { type Locale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { Container } from '@/components/container';
import { Link } from '@/i18n/navigation';
import { formatPostDate, postTranslationSlug } from '@/lib/blog';
import { routing } from '@/i18n/routing';
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

  /* Yazının öbür dildeki karşılığı. Çeviri bağları zaten çekiliyordu ama
     yalnızca hreflang'e gidiyordu: okuyucu öbür sürümün VARLIĞINI göremiyordu.
     Slug'lar dile göre farklı olduğu için adres bağlardan çözülüyor; karşılığı
     olmayan yazıda bağlantı hiç çizilmiyor. */
  const otherLocale = routing.locales.find((candidate) => candidate !== locale);
  const otherSlug = otherLocale
    ? postTranslationSlug(post.translations, otherLocale)
    : null;

  // Yazar künyesi — adı olmayan yazarda hiç basılmıyor, çünkü tek başına bir
  // profil fotoğrafı kimin yazdığını söylemiyor.
  const byline = post.author?.name ? (
    <>
      {post.author.avatar ? (
        // Ad hemen yanında yazdığı için fotoğraf dekoratif — ekran okuyucuya
        // aynı bilgiyi iki kez okutmuyoruz.
        <Image
          alt=""
          src={imageUrl(post.author.avatar, 64, 64)}
          width={32}
          height={32}
          className="ring-border-illustration bg-card size-6 shrink-0 rounded-full object-cover ring-1"
        />
      ) : null}
      <span>
        {t('postedBy', { name: post.author.name })}
        {/* Rol şemada toplanıyordu ve sorguya dahildi ama hiçbir yerde
            görünmüyordu — oysa "Developer Lead" gibi bir satır, yazıyı kimin
            yazdığı kadar neden yazdığını da anlatıyor. */}
        {post.author.role ? (
          <span className="text-muted-foreground/70">
            {' '}
            · {post.author.role}
          </span>
        ) : null}
      </span>
    </>
  ) : null;

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

            {/* Künye yalnız tarih: yazar satırı yazının altına, okuma
                bittiği yere alındı. Altındaki ince ayraç gövdeyi başlıktan
                ayırıyor. */}
            {date ? (
              <div className="mt-8 border-b pb-6 text-center">
                <time
                  dateTime={post.publishedAt ?? undefined}
                  className="text-muted-foreground text-sm"
                >
                  {date}
                </time>
              </div>
            ) : null}

            {/* Özet giriş paragrafı olarak: gövdeden bir tık büyük, yazının ne
                anlattığını okumaya başlamadan veriyor. */}
            {post.excerpt ? (
              <p className="text-foreground mt-8 text-balance text-lg">
                {post.excerpt}
              </p>
            ) : null}

            {post.body ? <PostBody value={post.body} /> : null}

            {otherSlug && otherLocale ? (
              <p className="mt-10">
                <Link
                  href={`/blog/${otherSlug}`}
                  locale={otherLocale}
                  lang={otherLocale}
                  className="text-primary text-sm duration-150 hover:underline"
                >
                  {t('readInOtherLanguage')}
                </Link>
              </p>
            ) : null}

            {byline ? (
              <footer className="mt-12 border-t pt-6">
                {/* Bağlantı varsa satırın tamamı tıklanabilir: fotoğraf ve ad
                    tek hedef, küçük yuvarlağı ayrıca nişan almak gerekmiyor. */}
                {post.author?.url ? (
                  <a
                    href={post.author.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm duration-150"
                  >
                    {byline}
                  </a>
                ) : (
                  <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                    {byline}
                  </span>
                )}
              </footer>
            ) : null}
          </div>
        </div>
      </Container>
    </article>
  );
}
