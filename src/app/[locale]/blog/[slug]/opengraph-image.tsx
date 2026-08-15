import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { getPost } from '@/lib/blog';
import { contentType, size, titleCard } from '@/lib/og';
import { siteConfig } from '@/lib/site';

/**
 * Blog yazısının paylaşım kartı: logo, "// blog" etiketi ve yazının başlığı.
 *
 * Kart, yazının **kapak görselini kullanmıyor** — bilinçli. Dosya tabanlı
 * metadata `generateMetadata`'yı ezdiği için (Next: "File-based metadata has
 * the higher priority") ikisi bir arada yaşayamıyor; tercih, her yazının
 * kartında adının okunabilir biçimde görünmesi oldu. Kapak fotoğrafını
 * göstermek istersek bu dosya kaldırılır, `buildMetadata`'daki `image`
 * yeniden devreye girer.
 */
export const alt = 'YTÜ Blockchain — blog';
export { size, contentType };

type PostParams = { locale: Locale; slug: string };

export default async function Image({
  params,
}: {
  params: Promise<PostParams>;
}) {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);
  const t = await getTranslations({ locale, namespace: 'Meta' });

  // Yazı bulunamazsa (silinmiş ya da henüz yayınlanmamış) kart yine de
  // üretilebilmeli: rota 404 verse bile görsel isteği ayrı geliyor.
  return titleCard({
    eyebrow: 'blog',
    title: post?.title || t('blog.title') || siteConfig.name,
  });
}
