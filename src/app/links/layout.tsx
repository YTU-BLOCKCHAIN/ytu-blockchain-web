import { Analytics } from '@/components/analytics';
import { bodyFont, displayFont } from '@/fonts';

import '../globals.css';

/**
 * `/links` kendi **kök layout'udur**. Projede `app/layout.tsx` yok; Next 16'da
 * üstünde layout bulunmayan her layout kendi kökü olur, bu yüzden `app/[locale]`
 * ile `app/links` yan yana iki ayrı kök olarak yaşayabiliyor (statik segment
 * dinamik olandan önce eşleşir → `/links` buraya düşer).
 *
 * Sayfa bilerek site kabuğunun (Header/Footer/dil ön eki) dışında: Instagram
 * biyografisinden gelen ziyaretçi tek ekranda yalnızca bağlantıları görsün diye.
 */
export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* `links-theme`: sayfayı OS temasından bağımsız olarak koyu ve tam siyah
       zeminli sabitler (globals.css). */
    <html
      lang="tr"
      className={`${displayFont.variable} ${bodyFont.variable} links-theme h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {children}
        {/* Instagram biyografisinden gelen trafiğin indiği sayfa burası, yani
            ölçmeye en çok değen yer. Sayfa `lang="tr"` olduğu için çubuk da
            Türkçe: burada dil seçici yok. */}
        <Analytics locale="tr" />
      </body>
    </html>
  );
}
