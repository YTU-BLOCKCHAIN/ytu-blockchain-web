/**
 * Blog kategorileri — şemanın ve sitedeki süzgecin ortak kaynağı.
 *
 * Saklanan değer sabit ve İngilizce; ekranda görünen ad çeviriden geliyor
 * (`Blog.categories.<değer>`), böylece aynı yazı Türkçe sitede "Duyurular",
 * İngilizce sitede "Announcements" oluyor. `studioTitle` yalnızca Studio'daki
 * açılır listede görünür — editör Türkçe çalışıyor.
 *
 * **Yeni kategori eklemek:** buraya bir satır, `messages/tr.json` ve
 * `messages/en.json` içine birer etiket. Etiketi unutursan derleme hata verir
 * (bkz. `blog-feed.tsx`'teki `satisfies`), sitede yarım bir düğme çıkmaz.
 */
export const POST_CATEGORIES = [
  { value: 'announcements', studioTitle: 'Duyurular' },
  { value: 'hackathons', studioTitle: 'Hackathonlar' },
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number]['value'];

/**
 * Kategori → `Blog.categories.*` çeviri anahtarı.
 *
 * `satisfies` bilinçli: `POST_CATEGORIES`e kategori eklenip buraya karşılığı
 * yazılmazsa **derleme hata verir**. Aksi hâlde sitede etiketsiz ya da ham
 * değerli ("hackathons") bir düğme belirirdi. Listeyle yan yana duruyor ki
 * ikisini birlikte güncellemek refleks olsun.
 */
export const CATEGORY_LABEL_KEY = {
  announcements: 'categories.announcements',
  hackathons: 'categories.hackathons',
} as const satisfies Record<PostCategory, string>;

const VALUES: readonly string[] = POST_CATEGORIES.map((c) => c.value);

/**
 * Sanity'den gelen değeri bilinen bir kategoriye daraltır.
 *
 * Gerekli, çünkü şemadaki liste yalnızca Studio'daki seçimi kısıtlıyor; API'den
 * dönen alan tip olarak sıradan bir `string`. Kategorisi tanınmayan bir yazı
 * (ör. liste değişmeden önce girilmiş) süzgeçte hayalet bir düğme doğurmasın.
 */
export function isPostCategory(
  value: string | null | undefined,
): value is PostCategory {
  return typeof value === 'string' && VALUES.includes(value);
}
