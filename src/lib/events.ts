import type { Locale } from 'next-intl';

import { sanityClient } from '@/sanity/lib/client';
import { eventQuery, eventRoutesQuery, eventsQuery } from '@/sanity/queries';

/**
 * Etkinlik sorgularının cache etiketi. `src/app/api/revalidate/route.ts` da bu
 * sabiti kullanıyor (gerekçe: `src/lib/blog.ts` → `POST_TAG`).
 */
export const EVENT_TAG = 'event';

/** Tazelik blog ile aynı iki katmanlı düzende; ayrıntı `src/lib/blog.ts`. */
const EVENT_CACHE = { next: { tags: [EVENT_TAG], revalidate: 300 } };

export async function getEvents() {
  return sanityClient.fetch(eventsQuery, {}, EVENT_CACHE);
}

export async function getEvent(slug: string) {
  return sanityClient.fetch(eventQuery, { slug }, EVENT_CACHE);
}

export async function getEventRoutes() {
  return sanityClient.fetch(eventRoutesQuery, {}, EVENT_CACHE);
}

/**
 * Kulübün saat dilimi. Etkinlik tarihleri takvim günü olarak saklanıyor
 * (`YYYY-MM-DD`, bkz. `schemaTypes/event.ts`); "bugün" de aynı takvime göre
 * hesaplanmalı — sunucu UTC'de çalışıyor ve gece 00:00–03:00 arasında bir gün
 * geride kalırdı.
 */
const CLUB_TIME_ZONE = 'Europe/Istanbul';

/** İstanbul'da bugünün tarihi, `YYYY-MM-DD`. (`en-CA` bu biçimi veriyor.) */
export function todayInClubTimeZone(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: CLUB_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/**
 * Etkinlik henüz bitmedi mi? Çok günlü etkinlik son gününe kadar "yaklaşan"
 * sayılıyor: stant haftasının ikinci günü listeden geçmişe düşmesin.
 *
 * Karşılaştırma düz metinle: `YYYY-MM-DD` sözlük sırası tarih sırasıyla aynı.
 */
export function isUpcoming(
  event: { date: string | null; endDate?: string | null },
  today = todayInClubTimeZone(),
): boolean {
  const last = event.endDate ?? event.date;
  return last !== null && last >= today;
}

/** `YYYY-MM-DD` → UTC gece yarısı. Biçimleme de UTC'de yapıldığı için gün kaymaz. */
function parseDay(value: string): Date | null {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Okunur tarih: "20 Ekim 2026", çok günlüyse "28 Eylül – 1 Ekim 2026".
 *
 * `formatRange` ortak parçayı (ay, yıl) bir kez yazıyor; elle birleştirmek
 * dile göre değişen sırayı ("October 28 – November 1, 2026") bozardı.
 */
export function formatEventDate(
  date: string | null | undefined,
  endDate: string | null | undefined,
  locale: Locale,
): string | null {
  const start = date ? parseDay(date) : null;
  if (!start) return null;

  const format = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const end = endDate && endDate !== date ? parseDay(endDate) : null;
  return end && end > start
    ? format.formatRange(start, end)
    : format.format(start);
}

/**
 * Etkinliğin akademik yılı: Eylül'den Ağustos'a ("2025–2026"). Geçmiş
 * etkinlikler listede bu başlıklar altında gruplanıyor — kulübün takvimi
 * dönemlerle dönüyor, takvim yılıyla değil.
 */
export function academicYear(date: string): string {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const start = month >= 9 ? year : year - 1;
  return `${start}–${start + 1}`;
}

/**
 * İki harfli ülke kodunu ziyaretçinin dilinde ada çevirir (`FR` → "Fransa" /
 * "France"). Tanınmayan bir değer olduğu gibi döner — elle girilmiş eski bir
 * ad ("Türkiye") sayfadan kaybolmasın.
 */
export function countryName(
  code: string | null | undefined,
  locale: Locale,
): string | null {
  if (!code) return null;
  if (!/^[A-Z]{2}$/.test(code)) return code;
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** Yer satırı: "EEF D012 · İstanbul" gibi; boş parçalar atlanır. */
export function eventPlace(
  parts: (string | null | undefined)[],
): string | null {
  const filled = parts.filter((part): part is string => Boolean(part?.trim()));
  return filled.length > 0 ? [...new Set(filled)].join(' · ') : null;
}
