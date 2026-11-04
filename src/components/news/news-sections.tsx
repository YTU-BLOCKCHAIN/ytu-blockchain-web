import { ArrowRight, ArrowUpRight, Rss } from 'lucide-react';
import { type Locale, useTranslations } from 'next-intl';

import { Container, Rail } from '@/components/container';
import { JOIN_HREF } from '@/components/site-link';
import { ButtonLink } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import {
  formatDigestDate,
  getAdjacentDates,
  type NewsDigest,
  sourceName,
} from '@/lib/news';

const RSS_PATH = '/news/rss.xml';

export function NewsHero() {
  const t = useTranslations('News');

  return (
    <section className="surface-signal overflow-hidden">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <Rail rows={3} />
          <div
            data-grid-content
            className="@4xl:py-12 relative col-span-full overflow-hidden pt-12 pb-6 sm:col-span-8"
          >
            <div className="@4xl:px-12 relative max-w-2xl px-6">
              <h1 className="text-foreground text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
                {t('title')}
              </h1>
              <p className="text-muted-foreground mt-6 text-balance text-lg">
                {t('subtitle')}
              </p>
            </div>
          </div>
          <Rail rows={3} />
        </div>
      </Container>
    </section>
  );
}

/**
 * Bülten şimdilik yalnız Türkçe yazılıyor. İngilizce sayfada kabuk İngilizce
 * kalıyor, bu satır da ziyaretçiye metnin neden Türkçe olduğunu söylüyor.
 */
function LanguageNote({ locale }: { locale: Locale }) {
  const t = useTranslations('News');
  if (locale === 'tr') return null;
  return <p className="text-muted-foreground text-sm">{t('turkishOnly')}</p>;
}

/** En yeni bülten: özet ve başlıklar; her başlık günün sayfasındaki habere gider. */
export function LatestDigest({
  digest,
  locale,
}: {
  digest: NewsDigest;
  locale: Locale;
}) {
  const t = useTranslations('News');

  return (
    <section>
      <Container asGrid>
        <div data-grid-content className="@4xl:p-12 p-6">
          <p className="text-muted-foreground font-display text-sm uppercase">
            {`// ${t('latest')} · `}
            <time dateTime={digest.date}>
              {formatDigestDate(digest.date, locale)}
            </time>
          </p>
          <div lang="tr">
            <p className="text-foreground mt-4 max-w-3xl text-lg">
              {digest.summary}
            </p>
            <ol className="divide-grid-line mt-8 divide-y">
              {digest.items.map((item, index) => (
                <li key={item.sourceUrl}>
                  <Link
                    href={`/news/${digest.date}#item-${index + 1}`}
                    className="group hover:text-primary flex items-baseline gap-4 py-4 duration-150"
                  >
                    <span
                      aria-hidden
                      className="text-muted-foreground font-display text-sm"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-medium">{item.title}</span>
                    <ArrowRight
                      aria-hidden
                      className="size-4 shrink-0 self-center transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-8 space-y-6">
            <LanguageNote locale={locale} />
            <p className="text-muted-foreground text-sm">{t('disclaimer')}</p>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href={`/news/${digest.date}`} withArrow>
                {t('readDigest')}
              </ButtonLink>
              <RssLink />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Eski bültenler. Tek bülten varken liste boş kalacağı için hiç çizilmiyor. */
export function DigestArchive({
  digests,
  locale,
}: {
  digests: NewsDigest[];
  locale: Locale;
}) {
  const t = useTranslations('News');
  if (digests.length === 0) return null;

  return (
    <section>
      <Container asGrid>
        <div data-grid-content className="@4xl:p-12 p-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t('archive')}</h2>
          <ul className="divide-grid-line mt-6 divide-y">
            {digests.map((digest) => (
              <li key={digest.date}>
                <Link
                  href={`/news/${digest.date}`}
                  className="hover:text-primary block py-4 duration-150"
                >
                  <time
                    dateTime={digest.date}
                    className="text-muted-foreground font-display block text-sm uppercase"
                  >
                    {formatDigestDate(digest.date, locale)}
                  </time>
                  <span lang="tr" className="mt-1 line-clamp-2 block">
                    {digest.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/** Tarayıcı `.xml`i dil öneksiz açmalı: besleme `[locale]` ağacının dışında. */
function RssLink() {
  const t = useTranslations('News');
  return (
    <a
      href={RSS_PATH}
      className="text-primary inline-flex items-center gap-2 text-sm font-medium hover:underline"
    >
      <Rss aria-hidden className="size-4" />
      {t('rss')}
    </a>
  );
}

/** Tek günün bülteni. Sosyal paylaşımlar `#item-N` ile doğrudan habere bağlanır. */
export function DigestArticle({
  digest,
  locale,
}: {
  digest: NewsDigest;
  locale: Locale;
}) {
  const t = useTranslations('News');
  const date = formatDigestDate(digest.date, locale);
  const { older, newer } = getAdjacentDates(digest.date);

  return (
    <article>
      <Container asGrid>
        <div data-grid-content className="@4xl:p-12 @max-4xl:p-6">
          <div className="mx-auto max-w-2xl">
            <nav
              aria-label={t('breadcrumb')}
              className="text-muted-foreground text-sm"
            >
              <Link href="/news" className="hover:text-foreground duration-150">
                {t('breadcrumb')}
              </Link>
            </nav>

            <h1 className="text-foreground mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {date}
            </h1>

            <div className="mt-6">
              <LanguageNote locale={locale} />
            </div>

            <div lang="tr">
              <p className="text-foreground mt-6 text-lg">{digest.summary}</p>

              <ol className="mt-10 space-y-10">
                {digest.items.map((item, index) => (
                  <li
                    key={item.sourceUrl}
                    id={`item-${index + 1}`}
                    className="border-grid-line scroll-mt-24 border-t pt-8"
                  >
                    <p
                      aria-hidden
                      className="text-muted-foreground font-display text-sm"
                    >
                      {`// ${String(index + 1).padStart(2, '0')}`}
                    </p>
                    <h2 className="text-foreground mt-2 text-balance text-xl font-semibold">
                      {item.title}
                    </h2>
                    <p className="text-foreground/90 mt-4 leading-relaxed">
                      {item.body}
                    </p>
                    <p className="bg-primary/10 text-foreground mt-4 p-4 leading-relaxed">
                      <strong className="font-semibold">Neden önemli:</strong>{' '}
                      {item.why}
                    </p>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-primary mt-4 inline-flex items-center gap-1 text-sm hover:underline"
                    >
                      {t('source', { name: sourceName(item.sourceUrl) })}
                      <ArrowUpRight aria-hidden className="size-4" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-muted-foreground border-grid-line mt-10 border-t pt-8 text-sm">
              {t('disclaimer')}
            </p>

            <div className="bg-primary/10 mt-8 p-6">
              <h2 className="text-foreground text-xl font-semibold">
                {t('cta.title')}
              </h2>
              <p className="text-muted-foreground mt-2">{t('cta.body')}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <ButtonLink href={JOIN_HREF} withArrow>
                  {t('cta.join')}
                </ButtonLink>
                <RssLink />
              </div>
            </div>

            {older || newer ? (
              <nav
                aria-label={t('archive')}
                className="mt-8 flex justify-between gap-4 text-sm"
              >
                {older ? (
                  <Link href={`/news/${older}`} className="text-primary">
                    {`← ${formatDigestDate(older, locale)}`}
                  </Link>
                ) : (
                  <span />
                )}
                {newer ? (
                  <Link href={`/news/${newer}`} className="text-primary">
                    {`${formatDigestDate(newer, locale)} →`}
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </div>
      </Container>
    </article>
  );
}
