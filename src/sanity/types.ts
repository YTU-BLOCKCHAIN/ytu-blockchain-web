/**
 * `npm run content:types` çıktısını `@/sanity/types` altından erişilebilir kılar.
 *
 * Üretilen dosya proje kökünde (`sanity.types.ts`) duruyor — Sanity CLI'nin
 * öntanımlı konumu, `src/` dışında. Bu yeniden dışa aktarım olmasa her tüketici
 * `../../../sanity.types` gibi derinliğe bağlı bir yol yazmak zorunda kalırdı.
 */
export type * from '../../sanity.types';
