import { parseBody } from 'next-sanity/webhook';
import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';

import { POST_TAG } from '@/lib/blog';

/**
 * Sanity webhook ucu — yazı yayınlandığında blog sayfalarını tazeler.
 *
 * Akış: editör Studio'da Publish'e basar → Sanity buraya imzalı bir POST atar →
 * `post` cache etiketi geçersizleşir → bir sonraki ziyaretçi taze içeriği görür.
 * Bu olmadan içerik yalnızca `src/lib/blog.ts`teki zaman aşımı kadar sonra
 * tazeleniyordu.
 *
 * `parseBody` iki iş yapıyor: gövdeyi imzasıyla doğruluyor ve Content Lake'in
 * nihai tutarlılığı için 3 saniye bekliyor. Bu bekleme şart — Sanity webhook'u
 * yazma işlemiyle aynı anda tetikliyor, hemen sorgulasak henüz eski veriyi
 * okuyabilirdik.
 *
 * `{ expire: 0 }`: etiket anında geçersiz olur, sonraki istek taze veriyi
 * bekleyerek alır. Alternatif `'max'` profili eski içeriği bir kez daha servis
 * edip arkada tazeliyor — editör "yayınladım ama görünmüyor" derdi.
 * (`updateTag` daha uygun olurdu ama Next 16'da yalnızca Server Action'larda
 * çağrılabiliyor, route handler'da değil.)
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    // Yapılandırma eksikse sessizce "başarılı" dönmek en kötüsü: webhook
    // Sanity tarafında yeşil görünür, site hiç tazelenmez.
    console.error('[revalidate] SANITY_REVALIDATE_SECRET tanımlı değil.');
    return new Response('Revalidation is not configured', { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    request,
    secret,
  );

  // İmza yoksa `null`, yanlışsa `false` döner; ikisi de reddedilmeli.
  if (!isValidSignature) {
    return new Response('Invalid signature', { status: 401 });
  }

  if (!body?._type) {
    return new Response('Bad request', { status: 400 });
  }

  // Tek etiket bütün blog sorgularını kapsıyor: yazar adı değişse bile
  // yazı sayfaları onu bastığı için hepsinin tazelenmesi gerekiyor.
  revalidateTag(POST_TAG, { expire: 0 });

  return Response.json({ revalidated: true, type: body._type });
}
