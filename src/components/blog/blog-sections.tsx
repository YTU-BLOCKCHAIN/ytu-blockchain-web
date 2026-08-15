import { type Locale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { Container } from '@/components/container';
import { Link } from '@/i18n/navigation';
import { formatPostDate } from '@/lib/blog';
import { cn } from '@/lib/utils';
import { isPostCategory } from '@/sanity/categories';
import { imageUrl } from '@/sanity/lib/image';
import type { PostsQueryResult } from '@/sanity/types';

import { type BlogCardPost, PostDate, PostMeta } from './blog-card';
import { BlogFeed } from './blog-feed';

type Post = PostsQueryResult[number];

/**
 * Sanity kaydını kartın beklediği düz veriye çevirir. Adresi olmayan bir yazı
 * kart olarak çizilemez (bağlantısı hiçbir yere gitmez) — `null` dönüp listeden
 * düşüyor. Sorgu zaten `defined(slug.current)` süzüyor; bu ikinci kapı yalnız
 * tipteki `string | null`ı kapatmak için.
 */
function toCard(post: Post, locale: Locale): BlogCardPost | null {
  if (!post.slug) return null;

  return {
    id: post._id,
    slug: post.slug,
    title: post.title ?? '',
    excerpt: post.excerpt ?? '',
    date: formatPostDate(post.publishedAt, locale),
    dateTime: post.publishedAt,
    category: isPostCategory(post.category) ? post.category : null,
    authorName: post.author?.name ?? null,
    // 2× ölçü: kutu 24px, retina ekranda 48px'lik kaynak keskin durur.
    authorAvatarUrl: post.author?.avatar
      ? imageUrl(post.author.avatar, 48, 48)
      : null,
  };
}

export function BlogHero() {
  const t = useTranslations('Blog');

  return (
    <section>
      {/* `relative overflow-hidden` kartın kendisinde: leke kartın yuvarlatılmış
          sınırında kırpılsın, yan raylara taşmasın. */}
      <Container className="@4xl:py-12 relative overflow-hidden pb-6 pt-12">
        {/* Dekoratif halftone leke. Diğer hero'lar ile aynı teknik: CSS mask +
            bg-foreground → görsel metin rengini alır (dark açık / light koyu),
            her iki temada aynı silik görsel, tek dosya, geçiş yok. Yatay
            çevrilip (-scale-x-100) sağa yaslanır: kaynaktaki parlak leke solda,
            başlık da solda — çevirmezsek metnin altında kalıyor.

            Ölçü `cover` değil: bu bant çok geniş ve alçak (≈1103×356), `cover`
            görseli 1103×620'ye çekiyordu → dpr 2'de 2206 fiziksel piksel, oysa
            kaynak 1920. Yani maske büyütülüyor ve tanecikler şişip bulanıyordu.
            `auto 100%` ile çizim 633×356'ya iniyor: 1266 fiziksel piksel, yani
            kaynağın 0.66'sı — net bir küçültme, halftone keskin kalıyor.
            Karşılığında bant enini tam doldurmuyor (%57); leke sağda toplanıp
            sola doğru sönüyor, başlığın olduğu taraf tamamen temiz kalıyor.
            Daha da küçültmek gerekirse tek değişecek sayı bu yüzde. */}
        <div
          aria-hidden
          className="bg-foreground pointer-events-none absolute inset-0 -scale-x-100 opacity-15 dark:opacity-15"
          style={{
            maskImage: 'url(/images/blog-bg.png)',
            WebkitMaskImage: 'url(/images/blog-bg.png)',
            maskSize: 'auto 100%',
            WebkitMaskSize: 'auto 100%',
            maskPosition: 'left top',
            WebkitMaskPosition: 'left top',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
        <div className="@4xl:px-12 relative max-w-xl px-6">
          {/* Mobilde 36px — diğer sayfa hero'larıyla aynı ölçü; 48px telefonda
              başlığı fazladan satıra bölüp hero'yu ekranın tamamına şişiriyor.
              Geniş ekranda tasarımın 60px'ine çıkıyor. */}
          <h1 className="text-foreground text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-6 text-balance text-lg">
            {t('subtitle')}
          </p>
        </div>
      </Container>
    </section>
  );
}

/**
 * En yeni yazı — iki sütunlu, kapak görselli büyük kart. Süzgecin üstünde
 * durduğu için etiket seçiminden etkilenmez: sayfaya giren herkes kulübün en
 * son ne yazdığını görür.
 */
function FeaturedPost({ post, locale }: { post: Post; locale: Locale }) {
  const card = toCard(post, locale);
  if (!card) return null;

  const cover = post.coverImage;

  return (
    <section>
      <Container asGrid>
        <article
          className={cn(
            'group relative grid gap-px',
            cover && 'md:grid-cols-2',
          )}
        >
          {cover ? (
            <div>
              <div data-grid-content className="@4xl:p-12 p-6">
                {/* `before`: görselin üstüne ince bir iç kenarlık koyar — açık
                    zeminde soluk bir kapak kartın içinde yüzer gibi durmasın. */}
                <div className="before:border-foreground/10 before:inset-ring-background/10 relative aspect-video overflow-hidden rounded-[10px] shadow-md shadow-black/10 before:absolute before:inset-0 before:rounded-[10px] before:border before:inset-ring-1">
                  <Image
                    src={imageUrl(cover, 1200, 675)}
                    alt={cover.alt ?? ''}
                    width={1200}
                    height={675}
                    priority
                    sizes="(min-width: 768px) 34rem, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <div
              data-grid-content
              className="@4xl:p-12 flex flex-col p-6 transition duration-200"
            >
              <div className="space-y-4">
                <PostDate post={card} />

                <h2 className="text-foreground text-balance text-lg font-semibold md:text-xl">
                  <Link
                    href={`/blog/${card.slug}`}
                    className="before:absolute before:inset-0"
                  >
                    {card.title}
                  </Link>
                </h2>

                <p className="text-muted-foreground">{card.excerpt}</p>
              </div>

              <PostMeta post={card} className="pt-4" />
            </div>
          </div>
        </article>
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
  const [featured, ...rest] = posts;
  if (!featured) {
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

  const cards = rest
    .map((post) => toCard(post, locale))
    .filter((card): card is BlogCardPost => card !== null);

  return (
    <>
      <FeaturedPost post={featured} locale={locale} />
      <BlogFeed posts={cards} />
    </>
  );
}
