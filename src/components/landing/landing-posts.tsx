import { ArrowUpRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { XIcon } from '@/components/community/brand-icons';
import { Container } from '@/components/container';
import { getFeaturedPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/site';

/**
 * Öne çıkan X paylaşımları. İçerik `content/posts.json`'daki adreslerden
 * build sırasında oEmbed ile çekilir (bkz. `@/lib/posts`) ve sitenin kendi
 * kart tasarımıyla çizilir — istemciye X'in JS'i / çerezi gitmez.
 *
 * Hiç paylaşım çekilemezse (liste boş ya da X yanıt vermedi) bölüm hiç
 * çizilmez; ana sayfada boş bir kutu kalmaz.
 */
export async function LandingPosts() {
  const posts = await getFeaturedPosts();
  if (posts.length === 0) return null;

  const t = await getTranslations('Landing.posts');
  const locale = await getLocale();
  // `timeZone: 'UTC'` + ISO'yu UTC olarak okumak şart: aksi halde sunucunun
  // saat dilimine göre gün bir ileri/geri kayabilir.
  const dateFormat = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="@2xl:grid-cols-3 col-span-full grid gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <h2 className="text-muted-foreground text-balance">
                {t('heading')}
              </h2>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                {t('intro')}
              </p>
              <a
                href={siteConfig.social.x}
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary mt-6 inline-flex items-center gap-2 text-sm font-medium"
              >
                <XIcon className="size-4" />
                {t('follow')}
              </a>
            </div>

            {posts.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group relative"
              >
                <div
                  data-grid-content
                  className="@4xl:p-8 hover:bg-card! flex h-full flex-col gap-4 p-6 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground flex items-center gap-2 text-sm">
                      <XIcon className="text-foreground size-4" />
                      {post.authorHandle && `@${post.authorHandle}`}
                    </span>
                    <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                  </div>

                  <p className="text-foreground whitespace-pre-line">
                    {post.text}
                  </p>

                  <div className="text-muted-foreground mt-auto flex items-center justify-between gap-2 pt-2 font-mono text-xs">
                    {post.date && (
                      <time dateTime={post.date}>
                        {dateFormat.format(new Date(`${post.date}T00:00:00Z`))}
                      </time>
                    )}
                    <span className="group-hover:text-primary transition-colors">
                      {t('view')}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
