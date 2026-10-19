/**
 * Etkinlik türleri ve rapor türleri — şemanın ve sitedeki süzgecin ortak
 * kaynağı (blog kategorileriyle aynı düzen, bkz. `categories.ts`).
 *
 * Saklanan değer sabit; ekranda görünen ad çeviriden geliyor
 * (`Events.types.<değer>`). `studioTitle` yalnızca Studio'daki açılır listede
 * görünür — editör Türkçe çalışıyor.
 *
 * **Yeni tür eklemek:** buraya bir satır, `messages/tr.json` ve
 * `messages/en.json` içine birer etiket. Etiketi unutursan derleme hata verir
 * (aşağıdaki `satisfies`), sitede etiketsiz bir düğme çıkmaz.
 */
export const EVENT_TYPES = [
  { value: 'training', studioTitle: 'Eğitim' },
  { value: 'workshop', studioTitle: 'Workshop' },
  { value: 'meetup', studioTitle: 'Meetup' },
  { value: 'talk', studioTitle: 'Söyleşi / Panel' },
  { value: 'social', studioTitle: 'Sosyal' },
  { value: 'stand', studioTitle: 'Stant' },
  { value: 'conference', studioTitle: 'Konferans katılımı' },
  { value: 'hackathon', studioTitle: 'Hackathon' },
  { value: 'online', studioTitle: 'Online' },
] as const;

export type EventType = (typeof EVENT_TYPES)[number]['value'];

/** Tür → `Events.types.*` çeviri anahtarı. */
export const EVENT_TYPE_LABEL_KEY = {
  training: 'types.training',
  workshop: 'types.workshop',
  meetup: 'types.meetup',
  talk: 'types.talk',
  social: 'types.social',
  stand: 'types.stand',
  conference: 'types.conference',
  hackathon: 'types.hackathon',
  online: 'types.online',
} as const satisfies Record<EventType, string>;

const TYPE_VALUES: readonly string[] = EVENT_TYPES.map((t) => t.value);

/** Sanity'den gelen değeri bilinen bir türe daraltır (bkz. `isPostCategory`). */
export function isEventType(
  value: string | null | undefined,
): value is EventType {
  return typeof value === 'string' && TYPE_VALUES.includes(value);
}

/**
 * Etkinlik sayfasındaki "Rapor" bölümünün üç hâli.
 *
 * - `full`: editörün yazdığı tam rapor (zengin metin).
 * - `summary`: 2–4 cümlelik kısa özet. Elle yazılabilir ya da etkinliğin
 *   paylaşımlarından derlenmiş olabilir (`summarySource`).
 * - `none`: rapor yok — sayfada bunu açıkça söyleyen bir satır çıkar.
 */
export const REPORT_TYPES = [
  { value: 'full', studioTitle: 'Tam rapor' },
  { value: 'summary', studioTitle: 'Kısa özet' },
  { value: 'none', studioTitle: 'Rapor yok' },
] as const;

export type ReportType = (typeof REPORT_TYPES)[number]['value'];

const REPORT_VALUES: readonly string[] = REPORT_TYPES.map((t) => t.value);

export function isReportType(
  value: string | null | undefined,
): value is ReportType {
  return typeof value === 'string' && REPORT_VALUES.includes(value);
}
