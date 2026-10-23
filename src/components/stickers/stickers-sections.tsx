import { useTranslations } from 'next-intl';

import { Dither, Eyebrow } from '@/components/brand';
import { Container, Rail } from '@/components/container';

import { STICKERS } from './sticker/list';

/** Görseli olan sticker'lar; kulüp logosu sahnede `mark.svg`'den çiziliyor. */
const PRINTED = STICKERS.filter(
  (sticker): sticker is { id: string; src: string } => Boolean(sticker.src),
);

export function StickersHero() {
  const t = useTranslations('Stickers.hero');

  return (
    <section className="surface-signal overflow-hidden">
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <Rail rows={3} />

          <div
            data-grid-content
            className="@4xl:p-12 @2xl:grid-cols-[3fr_2fr] relative col-span-full grid items-end gap-10 overflow-hidden p-6 sm:col-span-8"
          >
            <div>
              <Eyebrow>{t('eyebrow')}</Eyebrow>
              <h1 className="mt-6 text-4xl text-balance sm:text-6xl">
                {t('title')}
              </h1>
              <p className="text-muted-foreground mt-6 max-w-xl text-lg text-balance">
                {t('subtitle')}
              </p>
            </div>
            <Dither
              name="satoshi"
              width={1000}
              height={877}
              className="@2xl:-mb-12 @2xl:block mx-auto hidden w-full max-w-xs"
            />
          </div>

          <Rail rows={3} />
        </div>
      </Container>
    </section>
  );
}

/** Bölüm başı: VHS başlık + kısa metin, ana sayfadaki bölümlerle aynı ölçü. */
export function StickersHeading({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <Rail />
          <div className="col-span-full sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 p-6">
              <h2 className="@4xl:text-5xl text-3xl leading-[1.12] sm:text-4xl">
                {title}
              </h2>
              {intro ? (
                <p className="text-muted-foreground mt-3">{intro}</p>
              ) : null}
            </div>
          </div>
          <Rail />
        </div>
      </Container>
    </section>
  );
}

/**
 * Setin tamamı, düz görsellerle. 3D sahne tek tek gezdiriyor; burada hepsi
 * bir bakışta. Görseller `scripts/build-stickers.mjs`'in ürettiği kesimli
 * WebP'ler (şeffaf zemin).
 */
export function StickersGallery() {
  const t = useTranslations('Stickers');

  return (
    <>
      <StickersHeading
        title={t('galleryTitle')}
        intro={t('galleryIntro', { count: PRINTED.length })}
      />
      <section>
        <Container asGrid>
          <div className="grid grid-cols-10 gap-px">
            <Rail />
            <div className="@2xl:grid-cols-3 col-span-full grid grid-cols-2 gap-px sm:col-span-8">
              {PRINTED.map((sticker) => (
                <figure
                  key={sticker.id}
                  data-grid-content
                  className="@4xl:p-10 flex flex-col items-center justify-between gap-4 p-5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sticker.src}
                    alt={t(`names.${sticker.id}` as 'names.sell')}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-contain transition-transform duration-300 hover:scale-105 hover:-rotate-3"
                  />
                  <figcaption className="text-primary font-display text-sm">
                    {t(`names.${sticker.id}` as 'names.sell')}
                  </figcaption>
                </figure>
              ))}
            </div>
            <Rail />
          </div>
        </Container>
      </section>
    </>
  );
}
