import { useLocale } from 'next-intl';
import type { ComponentProps } from 'react';

import { Link } from '@/i18n/navigation';
import { linksPath } from '@/lib/routes';

/**
 * Sitedeki "Bize Katıl" düğmelerinin hedefi. Başvuru formu, WhatsApp
 * topluluğu ve kanallar `/links` sayfasında bir arada; ayrı bir `/join`
 * sayfası yok (eski adres `next.config.ts`te buraya yönleniyor).
 */
export const JOIN_HREF = '/links';

/**
 * next-intl `Link`i + `/links` istisnası.
 *
 * `/links` dil öneki alan sayfa ağacının dışında (`/links/tr`, `/links/en`);
 * next-intl'in `Link`i ona `/tr/links` yazardı. Bu yüzden o adres düz bir
 * `<a>` ile, açık olan dilin kanonik linktree adresine bağlanıyor.
 */
/**
 * Sitenin dışına çıkan adresler: tam URL'ler ve `next.config.ts`teki
 * yönlendirmeler (`/roadmap`, `/brand`, `/logos` → Notion/Drive). Dil öneki
 * almazlar ve yeni sekmede açılırlar.
 */
const REDIRECTS = new Set(['/roadmap', '/brand', '/logos']);
export function isOutbound(href: string): boolean {
  return /^https?:\/\//.test(href) || REDIRECTS.has(href);
}

export function SiteLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useLocale();
  if (typeof href === 'string' && isOutbound(href)) {
    const anchor: Record<string, unknown> = { ...props };
    delete anchor.prefetch;
    delete anchor.locale;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        {...(anchor as ComponentProps<'a'>)}
      />
    );
  }
  if (href === JOIN_HREF) {
    // `prefetch` ve `locale` yalnız `Link`in anladığı alanlar; `<a>`ya geçmesin.
    const anchor: Record<string, unknown> = { ...props };
    delete anchor.prefetch;
    delete anchor.locale;
    return <a href={linksPath(locale)} {...(anchor as ComponentProps<'a'>)} />;
  }
  return <Link href={href} {...props} />;
}
