import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { routing } from './i18n/routing';
import { linksPath, matchLinksLocale } from './lib/routes';

// Next.js 16: `middleware` -> `proxy` olarak yeniden adlandırıldı.
const handleI18nRouting = createMiddleware(routing);

/**
 * İki iş yapıyor:
 *
 * 1. **`/links` kapısı.** Linktree adresi Instagram biyografisinde duruyor ve
 *    tek bir link olarak paylaşılıyor — hem Türk öğrenciye hem yabancı bir
 *    sponsora aynı adres gidiyor. Burada tarayıcının dilini okuyup `/links/tr`
 *    ya da `/links/en`e **rewrite** ediyoruz: ziyaretçi ilk ekranda kendi
 *    dilini görüyor, adres çubuğunda `/links` kalıyor, iki sayfa da statik
 *    üretilmiş dosyadan servis ediliyor (karar burada veriliyor, sayfada
 *    değil).
 *
 *    Yönlendirme (redirect) DEĞİL rewrite: `/links` paylaşılan adres olarak
 *    kalsın ve ziyaretçi başka bir adrese savrulmasın diye.
 *
 * 2. Geri kalan her yolda next-intl'in dil öneki akışı (`/about` → `/en/about`).
 *
 * `/links/...` alt yolları (`/links/en`, `/links/opengraph-image`) matcher'ın
 * dışında: oraya dokunulmuyor, yoksa next-intl `/links/en`i `/en/links/en`e
 * yönlendirirdi.
 */
export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/links') {
    const locale = matchLinksLocale(request.headers.get('accept-language'));
    const response = NextResponse.rewrite(
      new URL(linksPath(locale), request.url),
    );

    /*
      Kapının cevabı ziyaretçinin diline göre DEĞİŞİYOR, yani paylaşılan bir
      önbellekte saklanamaz: rewrite edilen sayfa `s-maxage=31536000` ile
      geliyor ve CDN onu `/links` anahtarıyla saklarsa ilk isteğin dili
      herkese servis edilir (Türk ziyaretçiye İngilizce sayfa, ya da tersi).

      Klasik çözüm `Vary: Accept-Language` olurdu ama burada iki sebeple
      yetmiyor: rewrite edilen sayfanın kendi `Vary`si bu başlığı eziyor
      (ölçüldü), ve başlığın binlerce farklı yazımı olduğu için ona dayanan
      bir önbellek zaten neredeyse hiç isabet etmezdi.

      Bu yüzden doküman paylaşılan önbellekten tamamen çıkarılıyor. Kaybı yok:
      karar her istekte burada veriliyor, iki hedef sayfa (`/links/tr`,
      `/links/en`) ise statik dosya olarak önbellekte kalmaya devam ediyor.
    */
    response.headers.set('Cache-Control', 'private, no-store');

    return response;
  }

  return handleI18nRouting(request);
}

export const config = {
  // API, Next dahili yolları ve dosyalar (nokta içerenler) hariç her yolu eşle.
  // `/studio` dışarıda: gömülü Sanity Studio dil ön eki tanımıyor,
  // `/en/studio`ya yönlendirilirse hiç açılmaz.
  //
  // `links/` (eğik çizgiyle) dışarıda ama `/links` İÇERİDE: yukarıdaki kapı
  // yalnızca tam `/links` isteğinde çalışıyor, alt yollar olduğu gibi
  // filesystem'e gidiyor. `/linksxyz` de normal akışta kalır ve temiz 404 verir.
  matcher: '/((?!api|_next|_vercel|links/|studio(?:$|/)|.*\\..*).*)',
};
