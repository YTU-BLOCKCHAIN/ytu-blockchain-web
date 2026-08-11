'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Container } from '@/components/container';
import { cn } from '@/lib/utils';
import {
  CATEGORY_LABEL_KEY,
  POST_CATEGORIES,
  type PostCategory,
} from '@/sanity/categories';

import { type BlogCardPost, PostCard } from './blog-card';

/** Süzgeç kapalıyken seçili olan sanal kategori. Gerçek bir değerle çakışmaz. */
const ALL = '';

/**
 * Kategori süzgeci + yazı ızgarası.
 *
 * Süzme istemcide, bellekteki listede yapılıyor: kulübün yazı sayısı bir sayfaya
 * sığacak ölçekte, dolayısıyla her kategori değişiminde sunucuya gidip yeniden
 * çizmenin (ve her tıklamada ağ beklemenin) karşılığı yok.
 */
export function BlogFeed({ posts }: { posts: BlogCardPost[] }) {
  const t = useTranslations('Blog');
  const [active, setActive] = useState<PostCategory | typeof ALL>(ALL);

  /*
    Şeritte yalnızca en az bir yazısı olan kategoriler var. Sabit listenin
    tamamını basmak "süzdüm, hiçbir şey çıkmadı" ekranı üretirdi; sıra ise
    `POST_CATEGORIES`ten geliyor, yani içerik değiştikçe düğmeler yer
    değiştirmiyor.
  */
  const categories = useMemo(() => {
    const present = new Set(posts.map((post) => post.category));
    return POST_CATEGORIES.map(({ value }) => value).filter((value) =>
      present.has(value),
    );
  }, [posts]);

  const visible =
    active === ALL ? posts : posts.filter((post) => post.category === active);

  return (
    <>
      {/* Tek kategori varsa süzgeç bir şeye yaramaz ("Tümü" ile aynı sonucu
          verir); şerit hiç çizilmiyor. */}
      {categories.length > 1 ? (
        <section>
          <Container className="@4xl:px-12 py-4 md:px-6">
            {/*
              `role="tablist"` değil: gerçek sekme kalıbı ok tuşlarıyla gezinme
              ve roving tabindex ister. Bunlar birer aç/kapa düğmesi, `aria-pressed`
              durumu doğru duyurur ve Tab ile tek tek gezilirler.
            */}
            <div
              role="group"
              aria-label={t('filters.label')}
              className="max-lg:mask-r-from-85% -ml-0.5 flex snap-x snap-mandatory overflow-x-auto py-3 max-md:pl-6"
            >
              {/* Dizi açıkça tipleniyor: `[ALL, ...categories]` yayılınca TS
                  düz `string[]`e genişletiyor ve hem `setActive` hem etiket
                  aramasının daraltması kayboluyor. */}
              {([ALL, ...categories] as (PostCategory | typeof ALL)[]).map(
                (value) => {
                  const selected = value === active;

                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setActive(value)}
                      className="text-muted-foreground group shrink-0 snap-center px-1"
                    >
                      <span
                        className={cn(
                          'flex w-fit items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors',
                          selected
                            ? 'bg-muted text-primary ring-foreground/10 font-medium ring-1'
                            : 'group-hover:text-foreground group-hover:bg-foreground/5',
                        )}
                      >
                        {value === ALL
                          ? t('filters.all')
                          : t(CATEGORY_LABEL_KEY[value])}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </Container>
        </section>
      ) : null}

      <section>
        <Container asGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Container>
      </section>
    </>
  );
}
