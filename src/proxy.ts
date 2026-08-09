import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

// Next.js 16: `middleware` -> `proxy` olarak yeniden adlandırıldı.
// next-intl handler'ı proxy dosyasında default export olarak kullanılabilir.
export default createMiddleware(routing);

export const config = {
  // API, Next dahili yolları ve dosyalar (nokta içerenler) hariç her yolu eşle.
  // `/links` de dışarıda: linktree sayfası dil ön eki almaz (Instagram
  // biyografisindeki adres `/tr/links`e yönlenmesin), kendi kök layout'unda
  // yaşar. `links(?:$|/)` yalnızca tam eşleşmeyi dışlar → `/linksxyz` normal
  // akışta kalır ve temiz 404 verir.
  matcher: '/((?!api|_next|_vercel|links(?:$|/)|.*\\..*).*)',
};
