import { GeistMono } from 'geist/font/mono';

import '@fontsource-variable/inter';
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
    <html lang="tr" className={`${GeistMono.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
