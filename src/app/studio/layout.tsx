/**
 * `/studio` kendi **kök layout'udur** — `/links` ile aynı desen. Projede
 * `app/layout.tsx` yok; üstünde layout bulunmayan her layout kendi kökü olur,
 * bu yüzden `app/[locale]`, `app/links` ve `app/studio` yan yana üç ayrı kök
 * olarak yaşıyor. Bu dosya olmadan `/studio`nun `<html>/<body>`si hiç
 * oluşmuyor ve Studio konsola "cannot render outside the main document" hatası
 * düşürüyor.
 *
 * Bilerek `globals.css` YOK: Studio kendi tasarım sistemini ve global
 * sıfırlamasını (`unstable_globalStyles`) getiriyor — Tailwind'in preflight'ı
 * üstüne binerse editör arayüzünü bozar. Aynı sebeple burada Tailwind sınıfı
 * da kullanılmıyor; yükseklik/taşma ayarını next-sanity'nin kendi sarmalayıcısı
 * yapıyor.
 *
 * `lang="en"`: Studio arayüzü İngilizce, sayfanın dili de öyle olmalı.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
