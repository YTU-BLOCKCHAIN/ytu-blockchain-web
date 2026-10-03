import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { titleCard } from '@/lib/og';

/**
 * Statik sayfaların `opengraph-image.tsx` gövdesi. Her sayfanın kartı aynı
 * kalıp — "// segment" etiketi + sayfanın `Meta` çevirisindeki başlığı — bu
 * yüzden kalıp tek yerde duruyor; sayfa başına dosya yalnızca `pageCard('x')`
 * deyip boyut/tip sabitlerini dışa aktarıyor.
 *
 * Etiket bilerek çevrilmiyor: URL segmentiyle aynı (`/tr/about` → "// about"),
 * blog kartlarındaki "// blog" ile de tutarlı.
 */
export function pageCard(
  key:
    | 'about'
    | 'projects'
    | 'community'
    | 'blog'
    | 'contact'
    | 'join'
    | 'privacy',
) {
  return async function Image({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Meta' });
    return titleCard({ eyebrow: key, title: t(`${key}.title`) });
  };
}
