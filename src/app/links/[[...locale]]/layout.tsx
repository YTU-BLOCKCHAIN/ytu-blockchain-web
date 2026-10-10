import { notFound } from 'next/navigation';

import { Analytics } from '@/components/analytics';
import { bodyFont, displayFont } from '@/fonts';
import { resolveLinksLocale } from '@/lib/routes';

import '../../globals.css';

/**
 * `/links` kendi **kök layout'udur**. Projede `app/layout.tsx` yok; Next 16'da
 * üstünde layout bulunmayan her layout kendi kökü olur, bu yüzden `app/[locale]`
 * ile `app/links` yan yana iki ayrı kök olarak yaşayabiliyor (statik segment
 * dinamik olandan önce eşleşir → `/links` buraya düşer).
 *
 * Sayfa bilerek site kabuğunun (Header/Footer) dışında: Instagram
 * biyografisinden gelen ziyaretçi tek ekranda yalnızca bağlantıları görsün diye.
 *
 * `[[...locale]]` (isteğe bağlı catch-all) sayesinde aynı kök üç adrese
 * hizmet ediyor: `/links/tr`, `/links/en` ve dil öneksiz `/links` — sonuncusu
 * proxy'de ziyaretçinin tarayıcı diline göre ilk ikisinden birine rewrite
 * ediliyor (bkz. `lib/routes.ts` ve `proxy.ts`). Dil öneki sitenin geri
 * kalanındaki gibi next-intl'den GELMİYOR, çünkü Instagram'daki adresin
 * `/tr/links`e yönlenmemesi ve sayfanın site kabuğu dışında kalması gerekiyor.
 *
 * Kök layout bir dinamik segmentin altında yaşayabildiği için `<html lang>`
 * yine de doğru dili taşıyor; ekran okuyucunun sayfayı hangi dilde
 * seslendireceğini o belirler.
 */
export default async function LinksLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string[] }>;
}) {
  const locale = resolveLinksLocale((await params).locale);
  // Tanınmayan segment (`/links/de`) ve ikinci bir Türkçe adres (`/links/tr`)
  // burada kapanır: her dilin tek bir kanonik adresi olsun diye.
  if (!locale) notFound();

  return (
    /* `links-theme`: sayfayı OS temasından bağımsız olarak koyu ve tam siyah
       zeminli sabitler (globals.css). */
    <html
      lang={locale}
      className={`${displayFont.variable} ${bodyFont.variable} links-theme h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {children}
        {/* Instagram biyografisinden gelen trafiğin indiği sayfa burası, yani
            ölçmeye en çok değen yer. Çubuk sayfanın diliyle aynı dilde çıkıyor. */}
        <Analytics locale={locale} />
      </body>
    </html>
  );
}
