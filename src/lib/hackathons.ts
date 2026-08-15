import { sanityClient } from '@/sanity/lib/client';
import { hackathonsQuery } from '@/sanity/queries';

/**
 * Hackathon sorgusunun cache etiketi. `src/app/api/revalidate/route.ts` da bu
 * sabiti kullanıyor — iki yerde ayrı ayrı yazılsaydı birindeki yazım hatası
 * "webhook çalışıyor ama site tazelenmiyor" gibi sessiz bir arızaya dönerdi.
 */
export const HACKATHON_TAG = 'hackathon';

/**
 * Tazelik blog ile aynı iki katmanlı düzende: asıl yol webhook (kayıt
 * yayınlanınca etiket geçersizleşir), `revalidate` yalnızca bir teslimat
 * düşerse devreye giren emniyet ağı. Ayrıntı: `src/lib/blog.ts`.
 */
const HACKATHON_CACHE = { next: { tags: [HACKATHON_TAG], revalidate: 300 } };

export async function getHackathons() {
  return sanityClient.fetch(hackathonsQuery, {}, HACKATHON_CACHE);
}
