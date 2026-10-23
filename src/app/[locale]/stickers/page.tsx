import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { StickerViewer } from '@/components/stickers/sticker-viewer';
import {
  StickersGallery,
  StickersHeading,
  StickersHero,
} from '@/components/stickers/stickers-sections';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return buildMetadata({
    locale,
    pathname: '/stickers',
    title: t('stickers.title'),
    description: t('stickers.description'),
    ogImagePath: `/${locale}/stickers/opengraph-image`,
  });
}

/**
 * Sticker seti kendi sayfasında: ana sayfanın en altındaki 3D sahne buraya
 * taşındı (WebGL ve `three` artık yalnız bu sayfada iniyor), altında setin
 * tamamı düz görsellerle.
 */
export default async function StickersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Stickers' });

  return (
    <>
      <StickersHero />
      <StickersHeading title={t('viewerTitle')} />
      <StickerViewer />
      <StickersGallery />
    </>
  );
}
