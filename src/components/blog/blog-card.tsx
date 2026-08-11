import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * Bir kartın çizilmesi için gereken her şey — sunucuda hazırlanmış düz veri.
 *
 * Ham Sanity kaydını taşımıyoruz: ızgara istemci tarafında süzüldüğü için
 * (bkz. `blog-feed.tsx`) görsel adresini üretmek ve tarihi biçimlemek istemciye
 * düşseydi `@sanity/image-url` ve `Intl` tabloları da paketle birlikte inecekti.
 * İkisi de sunucuda bir kez yapılıp buraya string olarak geçiyor.
 */
export type BlogCardPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Okunur tarih — "11 Ağustos 2026". */
  date: string | null;
  /** `<time datetime>` için ham ISO değer. */
  dateTime: string | null;
  tags: string[];
  authorName: string | null;
  authorAvatarUrl: string | null;
};

export function PostDate({ post }: { post: BlogCardPost }) {
  if (!post.date) return null;

  return (
    <time
      dateTime={post.dateTime ?? undefined}
      className="text-muted-foreground block text-sm"
    >
      {post.date}
    </time>
  );
}

/** Kartın alt satırı: yazar solda, "Oku" çağrısı sağda. */
export function PostMeta({
  post,
  className,
}: {
  post: BlogCardPost;
  className?: string;
}) {
  const t = useTranslations('Blog');

  return (
    <div
      className={cn(
        'mt-auto grid grid-cols-[1fr_auto] items-end gap-2',
        className,
      )}
    >
      <div className="space-y-2">
        {post.authorName ? (
          <div className="grid grid-cols-[auto_1fr] items-center gap-2">
            {post.authorAvatarUrl ? (
              <div className="ring-border-illustration bg-card aspect-square size-6 overflow-hidden rounded-md border border-transparent shadow-md shadow-black/15 ring-1">
                {/* Adı hemen yanında yazdığı için fotoğraf dekoratif —
                    ekran okuyucuya aynı bilgiyi iki kez okutmuyoruz. */}
                <Image
                  alt=""
                  src={post.authorAvatarUrl}
                  width={24}
                  height={24}
                  className="size-full object-cover"
                />
              </div>
            ) : null}
            <span className="text-muted-foreground line-clamp-1 text-sm">
              {post.authorName}
            </span>
          </div>
        ) : null}
      </div>

      {/* Kartın her yeri zaten başlıktaki bağlantıya tıklanabilir
          (`before:inset-0`); bu satır yalnız görsel bir çağrı. `aria-hidden`
          olmasa ekran okuyucu her kartta ikinci bir "Oku" bağlantısı duyurur. */}
      <div aria-hidden className="flex h-6 items-center">
        <span className="text-primary group-hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors duration-200">
          {t('read')}
          <ChevronRight
            strokeWidth={2.5}
            className="size-3.5 translate-y-px duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </div>
  );
}

/**
 * Izgara kartı. Kapak görseli **bilerek** yok: tasarımda görsel yalnız öne
 * çıkan yazıda duruyor, altındaki üçlü ızgara metne bırakılıyor. Kapak yine de
 * boşa gitmiyor — yazının kendi sayfasında ve paylaşım önizlemesinde kullanılır.
 */
export function PostCard({ post }: { post: BlogCardPost }) {
  return (
    <article className="group relative">
      <div
        data-grid-content
        className="@4xl:p-12 hover:bg-muted! flex flex-col p-6 shadow-xl shadow-transparent transition duration-200 hover:shadow-indigo-900/5"
      >
        <div className="space-y-4">
          <PostDate post={post} />

          <h2 className="text-foreground text-balance font-semibold">
            {/* Bağlantı başlıkta: ekran okuyucuda bağlantı listesi "Oku, Oku,
                Oku" yerine yazı başlıklarıyla dolar. `before:inset-0` kartın
                tamamını aynı bağlantının tıklama alanına çevirir. */}
            <Link
              href={`/blog/${post.slug}`}
              className="before:absolute before:inset-0"
            >
              {post.title}
            </Link>
          </h2>

          <p className="text-muted-foreground">{post.excerpt}</p>
        </div>

        <PostMeta post={post} className="pt-6" />
      </div>
    </article>
  );
}
