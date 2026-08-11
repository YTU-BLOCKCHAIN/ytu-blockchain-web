import { createClient } from 'next-sanity';

import { sanityApiVersion, sanityDataset, sanityProjectId } from '../env';

/**
 * İçeriği okuyan Sanity istemcisi.
 *
 * `perspective: 'published'` — taslaklar siteye ASLA sızmaz. Zaten token
 * kullanmıyoruz (yayınlanmış içerik herkese açık), yani taslaklar teknik olarak
 * da erişilemez; bu ayar niyeti açık ediyor.
 *
 * `useCdn: true` — istekler `apicdn.sanity.io` üzerinden gider. Ücretsiz planda
 * CDN kotası 1M/ay, ham API kotası 250K/ay; okuma yolunu CDN'e vermek kotayı
 * dört kat rahatlatıyor. Tazelik zaten Next tarafındaki cache etiketleriyle
 * yönetiliyor (bkz. src/lib/blog.ts).
 */
export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
  perspective: 'published',
});
