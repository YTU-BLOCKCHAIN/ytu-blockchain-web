import { ArrowUpRight } from 'lucide-react';
import { type Locale, useTranslations } from 'next-intl';
import Image from 'next/image';
import type { ReactNode } from 'react';

import { PostBody } from '@/components/blog/post-body';
import { Container } from '@/components/container';
import { buttonClasses } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import {
  countryName,
  eventOrgs,
  eventPlace,
  formatEventDate,
  isUpcoming,
} from '@/lib/events';
import { EVENT_TYPE_LABEL_KEY, isEventType } from '@/sanity/event-types';
import { imageDimensions, imageUrlByWidth } from '@/sanity/lib/image';
import type { EventQueryResult } from '@/sanity/types';

import { EventCover, EventPlaceholder } from './event-cover';
import { OrgChip } from './org-logos';

type EventRecord = NonNullable<EventQueryResult>;

/** Künye satırı: solda etiket, sağda değer. Değeri olmayan satır hiç çizilmez. */
function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-foreground text-sm">{children}</dd>
    </div>
  );
}

const externalLink =
  'text-primary inline-flex items-center gap-1 text-sm duration-150 hover:underline';

export function EventArticle({
  event,
  locale,
}: {
  event: EventRecord;
  locale: Locale;
}) {
  const t = useTranslations('Events');

  const title = event.title?.[locale] ?? '';
  const summary = event.summary?.[locale] ?? '';
  const date = formatEventDate(event.date, event.endDate, locale);
  const upcoming = isUpcoming(event);
  const type = isEventType(event.type) ? event.type : null;
  const place = event.online
    ? t('online')
    : eventPlace([event.venue, event.city, countryName(event.country, locale)]);
  // Silinmiş bir partnere kalan referans `null` döner; sayfa çökmesin.
  const partners = (event.partners ?? []).filter(
    (partner): partner is NonNullable<typeof partner> => Boolean(partner?.name),
  );
  // Logosu olan kurumlar etiket olarak, olmayanlar eskisi gibi düz ad.
  const partnerOrgs = new Map(
    eventOrgs([event.partners], locale).map((org) => [org.id, org]),
  );
  const ecosystemOrgs = new Map(
    (event.ecosystemOrgs ?? []).flatMap((record) => {
      const [org] = eventOrgs([[record]], locale);
      return org && record.ecosystem ? [[record.ecosystem, org] as const] : [];
    }),
  );
  const placeholderOrg = eventOrgs(
    [event.partners, event.ecosystemOrgs],
    locale,
  )[0];
  const report = event.report?.[locale];

  /*
    Rapor bölümünün üç hâli (bkz. `REPORT_TYPES`). "Tam rapor" seçili ama bu
    dilde gövde yoksa özete düşüyoruz: Studio doğrulaması iki dili de istiyor,
    yine de eski bir kayıtta boş başlıklı bir bölüm göstermektense özet iyidir.

    Yaklaşan etkinlikte "rapor yok" yazmak yanlış bir izlenim verir (henüz
    olmadı); onun yerine raporun sonradan geleceği söyleniyor.
  */
  const reportType =
    event.reportType === 'full' && !report?.length
      ? 'summary'
      : (event.reportType ?? 'none');

  // Özet, rapor olarak gösterilmiyorsa giriş paragrafı olur — etkinliğin ne
  // olduğunu her sayfa söylemeli.
  const leadIsSummary = reportType !== 'summary';

  const gallery = (event.gallery ?? []).filter((image) => image.asset);
  const resources = (event.resources ?? []).filter(
    (resource) => resource.url && resource.label,
  );
  const links = [
    ...(event.lumaUrl
      ? [{ href: event.lumaUrl, label: t('detail.luma') }]
      : []),
    ...(event.instagramUrls ?? []).map((href, i, all) => ({
      href,
      label:
        all.length > 1
          ? `${t('detail.instagram')} ${i + 1}`
          : t('detail.instagram'),
    })),
    ...(event.xUrls ?? []).map((href, i, all) => ({
      href,
      label: all.length > 1 ? `${t('detail.x')} ${i + 1}` : t('detail.x'),
    })),
    ...resources.map((resource) => ({
      href: resource.url as string,
      label: resource.label as string,
    })),
  ];

  return (
    <article>
      <Container asGrid>
        <div data-grid-content className="@4xl:p-12 @max-4xl:p-6">
          <div className="mx-auto max-w-2xl">
            <nav
              aria-label={t('detail.breadcrumb')}
              className="text-muted-foreground text-center text-sm"
            >
              <Link
                href="/events"
                className="hover:text-foreground duration-150"
              >
                {t('detail.breadcrumb')}
              </Link>
              {type ? (
                <>
                  <span aria-hidden className="px-2">
                    /
                  </span>
                  <span>{t(EVENT_TYPE_LABEL_KEY[type])}</span>
                </>
              ) : null}
            </nav>

            <h1 className="text-foreground mt-6 text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>

            {date ? (
              <p className="text-muted-foreground mt-4 text-center text-sm">
                <time dateTime={event.date ?? undefined}>{date}</time>
                {event.time ? ` · ${event.time}` : null}
                {upcoming ? (
                  <span className="bg-primary/10 dark:text-primary ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-[var(--brand-deep)]">
                    {t('upcoming')}
                  </span>
                ) : null}
              </p>
            ) : null}

            {upcoming && event.lumaUrl ? (
              <div className="mt-6 flex justify-center">
                <a
                  href={event.lumaUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonClasses()}
                >
                  {t('register')}
                  <ArrowUpRight aria-hidden className="size-4" />
                </a>
              </div>
            ) : null}

            {/* 4:3 kutu: 16:9 dikey afişleri ve reel kapaklarını sayfada
                küçücük bırakıyordu; kırpılmadığı için yatay fotoğraf da
                tamamıyla görünüyor (bkz. `EventCover`). */}
            {event.cover?.asset ? (
              <EventCover
                src={imageUrlByWidth(event.cover, 1600)}
                blurSrc={imageUrlByWidth(event.cover, 48)}
                alt={event.cover.alt ?? ''}
                priority
                sizes="(min-width: 1024px) 42rem, 100vw"
                className="mt-10 aspect-[4/3] rounded-[10px] shadow-md shadow-black/10"
              />
            ) : (
              <EventPlaceholder
                logoUrl={placeholderOrg?.logoUrl ?? null}
                label={
                  placeholderOrg?.name ??
                  (type ? t(EVENT_TYPE_LABEL_KEY[type]) : null)
                }
                className="mt-10 aspect-[16/7] rounded-[10px]"
              />
            )}

            {leadIsSummary && summary ? (
              <p className="text-foreground mt-8 text-balance text-lg">
                {summary}
              </p>
            ) : null}

            <dl className="mt-8 space-y-3 border-y py-6">
              {date ? (
                <Fact label={t('detail.when')}>
                  {date}
                  {event.time ? ` · ${event.time}` : null}
                </Fact>
              ) : null}
              {place ? <Fact label={t('detail.where')}>{place}</Fact> : null}
              {event.series ? (
                <Fact label={t('detail.series')}>{event.series}</Fact>
              ) : null}
              {partners.length > 0 ? (
                <Fact label={t('detail.partners')}>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    {partners.map((partner) => {
                      const org = partnerOrgs.get(partner._id);
                      if (org) return <OrgChip key={partner._id} org={org} />;
                      return partner.url ? (
                        <a
                          key={partner._id}
                          href={partner.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="hover:text-primary underline-offset-4 hover:underline"
                        >
                          {partner.name}
                        </a>
                      ) : (
                        <span key={partner._id}>{partner.name}</span>
                      );
                    })}
                  </span>
                </Fact>
              ) : null}
              {event.speakers?.length ? (
                <Fact label={t('detail.speakers')}>
                  {event.speakers.join(', ')}
                </Fact>
              ) : null}
              {event.ecosystems?.length ? (
                <Fact label={t('detail.ecosystems')}>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    {event.ecosystems.map((name) => {
                      const org = ecosystemOrgs.get(name);
                      return org ? (
                        <OrgChip key={name} org={org} />
                      ) : (
                        <span key={name}>{name}</span>
                      );
                    })}
                  </span>
                </Fact>
              ) : null}
              {typeof event.attendees === 'number' ? (
                <Fact label={t('detail.attendees')}>{event.attendees}</Fact>
              ) : null}
            </dl>

            <section aria-labelledby="event-report" className="mt-12">
              <h2
                id="event-report"
                className="text-foreground text-2xl font-semibold tracking-tight"
              >
                {t('detail.report')}
              </h2>

              {reportType === 'full' && report ? (
                <PostBody value={report} />
              ) : reportType === 'summary' ? (
                <>
                  <p className="text-muted-foreground mt-6 leading-relaxed">
                    {summary}
                  </p>
                  {event.summarySource === 'instagram' ? (
                    <p className="text-muted-foreground/70 mt-4 text-xs">
                      {t('detail.summaryNote')}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="text-muted-foreground mt-6">
                  {upcoming
                    ? t('detail.reportUpcoming')
                    : t('detail.reportNone')}
                </p>
              )}
            </section>

            {gallery.length > 0 ? (
              <section aria-labelledby="event-gallery" className="mt-12">
                <h2
                  id="event-gallery"
                  className="text-foreground text-2xl font-semibold tracking-tight"
                >
                  {t('detail.gallery')}
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {gallery.map((image) => {
                    const dimensions = imageDimensions(image.asset?._ref);
                    return (
                      <Image
                        key={image._key}
                        src={imageUrlByWidth(image, 800)}
                        alt={image.alt ?? ''}
                        width={dimensions?.width ?? 800}
                        height={dimensions?.height ?? 800}
                        sizes="(min-width: 1024px) 21rem, 50vw"
                        className="h-auto w-full rounded"
                      />
                    );
                  })}
                </div>
              </section>
            ) : null}

            {links.length > 0 ? (
              <section aria-labelledby="event-links" className="mt-12">
                <h2
                  id="event-links"
                  className="text-foreground text-2xl font-semibold tracking-tight"
                >
                  {t('detail.links')}
                </h2>
                <ul className="mt-6 space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={externalLink}
                      >
                        {link.label}
                        <ArrowUpRight aria-hidden className="size-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {event.seriesEvents.length > 0 ? (
              <section
                aria-labelledby="event-series"
                className="mt-12 border-t pt-6"
              >
                <h2
                  id="event-series"
                  className="text-muted-foreground text-sm font-medium"
                >
                  {t('detail.seriesEvents')}
                </h2>
                <ul className="mt-4 space-y-2">
                  {event.seriesEvents.map((other) =>
                    other.slug ? (
                      <li key={other._id} className="text-sm">
                        <Link
                          href={`/events/${other.slug}`}
                          className="text-foreground hover:text-primary duration-150"
                        >
                          {other.title?.[locale]}
                        </Link>
                        <span className="text-muted-foreground">
                          {' · '}
                          {formatEventDate(other.date, null, locale)}
                        </span>
                      </li>
                    ) : null,
                  )}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </Container>
    </article>
  );
}
