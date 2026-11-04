import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { Locale } from 'next-intl';

/**
 * Günlük haber bülteni. Her gün `content/news/YYYY-MM-DD.json` dosyasında,
 * pull request ile geliyor (bkz. `content/README.md`).
 *
 * Dosyalar burada doğrulanıyor: sayfalar statik üretildiği için hatalı bir
 * dosya build'i kırar, PR kontrolü kırmızı yanar ve hata canlıya çıkamaz.
 */

export type NewsItem = {
  title: string;
  body: string;
  why: string;
  sourceUrl: string;
};

export type NewsDigest = {
  /** `YYYY-MM-DD`, dosya adıyla aynı. */
  date: string;
  summary: string;
  items: NewsItem[];
};

const NEWS_DIR = path.join(process.cwd(), 'content', 'news');
const DATE_FILE = /^(\d{4}-\d{2}-\d{2})\.json$/;

function fail(file: string, problem: string): never {
  throw new Error(
    `content/news/${file} geçersiz: ${problem}. Biçim için content/README.md dosyasına bakın.`,
  );
}

function text(file: string, field: string, value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(file, `"${field}" dolu bir metin olmalı`);
  }
  return value;
}

function parseItem(file: string, value: unknown, index: number): NewsItem {
  const at = `items[${index}]`;
  if (typeof value !== 'object' || value === null) {
    fail(file, `"${at}" bir nesne olmalı`);
  }
  const item = value as Record<string, unknown>;
  const sourceUrl = text(file, `${at}.sourceUrl`, item['sourceUrl']);
  if (!sourceUrl.startsWith('https://') || !URL.canParse(sourceUrl)) {
    fail(file, `"${at}.sourceUrl" https:// ile başlayan bir adres olmalı`);
  }
  return {
    title: text(file, `${at}.title`, item['title']),
    body: text(file, `${at}.body`, item['body']),
    why: text(file, `${at}.why`, item['why']),
    sourceUrl,
  };
}

function parseDigest(file: string, date: string, raw: unknown): NewsDigest {
  if (typeof raw !== 'object' || raw === null) {
    fail(file, 'dosyanın kökü bir nesne olmalı');
  }
  const digest = raw as Record<string, unknown>;
  if (digest['date'] !== date) {
    fail(file, `"date" dosya adıyla aynı olmalı (${date})`);
  }
  if (Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    fail(file, 'dosya adındaki tarih geçerli değil');
  }
  const items = digest['items'];
  if (!Array.isArray(items) || items.length === 0) {
    fail(file, '"items" en az bir haber içermeli');
  }
  return {
    date,
    summary: text(file, 'summary', digest['summary']),
    items: items.map((item, index) => parseItem(file, item, index)),
  };
}

/** Bütün bültenler, en yeniden eskiye. */
export function getDigests(): NewsDigest[] {
  return readdirSync(NEWS_DIR)
    .flatMap((file) => {
      const date = DATE_FILE.exec(file)?.[1];
      if (!date) return [];
      const raw: unknown = JSON.parse(
        readFileSync(path.join(NEWS_DIR, file), 'utf8'),
      );
      return [parseDigest(file, date, raw)];
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getDigest(date: string): NewsDigest | null {
  return getDigests().find((digest) => digest.date === date) ?? null;
}

/** Bültenin bir önceki ve bir sonraki günü (varsa). */
export function getAdjacentDates(date: string): {
  older: string | null;
  newer: string | null;
} {
  const dates = getDigests().map((digest) => digest.date);
  const index = dates.indexOf(date);
  return {
    older: dates[index + 1] ?? null,
    newer: index > 0 ? (dates[index - 1] ?? null) : null,
  };
}

/**
 * `timeZone: 'UTC'` şart: tarih takvim günü olarak saklanıyor, sunucunun saat
 * dilimi günü bir ileri ya da geri kaydırmamalı.
 */
export function formatDigestDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

/** `https://www.decrypt.co/...` → `decrypt.co`: kaynak bağlantısının etiketi. */
export function sourceName(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '');
}
