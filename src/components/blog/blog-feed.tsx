'use client';

import { type Locale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Container } from '@/components/container';
import { cn } from '@/lib/utils';

import { type BlogCardPost, PostCard } from './blog-card';

/** Süzgeç kapalıyken seçili olan sanal etiket. Gerçek bir etiketle çakışmaz. */
const ALL = '';

/**
 * Etiket süzgeci + yazı ızgarası.
 *
 * Süzme istemcide, bellekteki listede yapılıyor: kulübün yazı sayısı bir sayfaya
 * sığacak ölçekte, dolayısıyla her etiket değişiminde sunucuya gidip yeniden
 * çizmenin (ve her tıklamada ağ beklemenin) karşılığı yok.
 */
export function BlogFeed({
  posts,
  locale,
}: {
  posts: BlogCardPost[];
  locale: Locale;
}) {
  const t = useTranslations('Blog');
  const [activeTag, setActiveTag] = useState(ALL);

  /*
    Etiketler ızgaradaki yazılardan türetiliyor; sabit bir liste değil. İki
    sonucu var: editör Studio'da yeni bir etiket yazdığında süzgeçte kendiliğinden
    beliriyor, ve her düğmenin arkasında en az bir kart olduğu garanti — "süzdüm,
    hiçbir şey kalmadı" ekranı oluşamıyor.
  */
  const tags = useMemo(() => {
    const seen = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags) seen.add(tag);
    }
    // Sıralama dile bağlı (ı/i, ç, ş): `locale` açıkça veriliyor, aksi halde
    // sunucu ile tarayıcı farklı sıralayıp hydration uyuşmazlığı çıkarabilir.
    return [...seen].sort((a, b) => a.localeCompare(b, locale));
  }, [posts, locale]);

  const visible =
    activeTag === ALL
      ? posts
      : posts.filter((post) => post.tags.includes(activeTag));

  return (
    <>
      {/* Tek etiket varsa süzgeç bir şeye yaramaz ("Tümü" ile aynı sonucu
          verir); şerit hiç çizilmiyor. */}
      {tags.length > 1 ? (
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
              {[ALL, ...tags].map((tag) => {
                const active = tag === activeTag;

                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveTag(tag)}
                    className="text-muted-foreground group shrink-0 snap-center px-1"
                  >
                    <span
                      className={cn(
                        'flex w-fit items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors',
                        active
                          ? 'bg-muted text-primary ring-foreground/10 font-medium ring-1'
                          : 'group-hover:text-foreground group-hover:bg-foreground/5',
                      )}
                    >
                      {/* Etiket editörün Studio'da yazdığı gibi basılıyor.
                          Tasarımın `capitalize`ı tek kelimelik kategorilere
                          göre; bizim serbest etiketlerimizde "zk"yı "Zk",
                          "defi"yi "Defi" yapıp kısaltmaları bozuyordu. */}
                      <span>{tag === ALL ? t('filters.all') : tag}</span>
                    </span>
                  </button>
                );
              })}
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
