import { hasLocale, type Locale } from 'next-intl';

import { routing } from '@/i18n/routing';
import {
  isLocalizedPath,
  LOCALE_PREFIX_PATTERN,
  localizedHref,
} from '@/lib/routes';

import rawContent from '../../content/links.json';

/**
 * `/links` (linktree) sayfasının içeriği `content/links.json` dosyasından gelir;
 * o dosyayı kod bilmeyen kulüp üyeleri GitHub arayüzünden düzenler
 * (bkz. `content/README.md`).
 *
 * Bu yüzden dosya burada **çalışma zamanında** doğrulanır: sayfa statik
 * üretildiği için hatalı bir düzenleme build'i kırar → pull request kontrolü
 * kırmızı yanar → hata canlıya çıkamaz. Mesajlar bilerek Türkçe ve dosyadaki
 * alanı işaret ediyor, çünkü onları okuyacak kişi geliştirici değil.
 *
 * Sayfa **iki dilli** (`/links/tr`, `/links/en`; `/links` kapısı tarayıcı
 * diline göre birini sunuyor — bkz. `lib/routes.ts`). Bu yüzden
 * `label`, `note` ve `tagline` alanları dosyada `{ "tr": ..., "en": ... }`
 * biçiminde; eksik çeviri de bir doğrulama hatasıdır (aşağıya bkz.). Yarım
 * çevrilmiş bir sayfanın sessizce yayına girmesi, build'in kırılmasından kötü:
 * ziyaretçi anlamadığı bir butona basar.
 */

/** Dosyadaki iki dilli metin alanı. */
type LocalizedText = Record<Locale, string>;

/** Doğrulanmış ham satır — dili henüz seçilmemiş hâli. */
type ParsedLink = {
  label: LocalizedText;
  note: LocalizedText | null;
  url: string;
  featured: boolean;
  external: boolean;
};

type ParsedContent = {
  profile: { title: string; tagline: LocalizedText };
  links: ParsedLink[];
};

/** Sayfada çizilen satır — tek dile indirgenmiş hâli. */
export type LinkItem = {
  label: string;
  note: string | null;
  /**
   * Dosyadaki ham adres: dış bağlantı ya da dil öneksiz iç yol (`/projects`).
   * Satırın ikonu bundan türetildiği için ham hâli taşınıyor.
   */
  url: string;
  /** Ziyaretçinin gittiği adres: iç sayfalarda dil öneki eklenmiş hâli. */
  href: string;
  /** Dolu/vurgulu çizilir; yalnızca başvuru satırlarında kullanılır. */
  featured: boolean;
  /** `https://` ile başlayan adresler yeni sekmede açılır. */
  external: boolean;
};

export type LinksContent = {
  profile: { title: string; tagline: string };
  links: LinkItem[];
};

function fail(problem: string): never {
  throw new Error(
    `content/links.json geçersiz: ${problem}. Nasıl düzeltileceği için content/README.md dosyasına bakın.`,
  );
}

function asRecord(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail(`${field} bir nesne olmalı ({ ... })`);
  }
  return value as Record<string, unknown>;
}

function asText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${field} boş olmayan bir metin olmalı`);
  }
  if (value.length > maxLength) {
    fail(
      `${field} en fazla ${maxLength} karakter olabilir (şu an ${value.length})`,
    );
  }
  return value;
}

/**
 * İki dilli metin alanı. Diller `routing.locales`ten okunuyor: siteye üçüncü
 * bir dil eklenirse içerik dosyası da o dili istemeye kendiliğinden başlar.
 */
function asLocalizedText(
  value: unknown,
  field: string,
  maxLength: number,
): LocalizedText {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail(
      `${field} her dil için bir metin taşımalı: { "tr": "...", "en": "..." }`,
    );
  }
  const record = value as Record<string, unknown>;

  const text = {} as LocalizedText;
  for (const locale of routing.locales) {
    if (record[locale] === undefined) {
      fail(`${field} içinde "${locale}" çevirisi eksik`);
    }
    text[locale] = asText(
      record[locale],
      `${field} içindeki "${locale}"`,
      maxLength,
    );
  }

  for (const key of Object.keys(record)) {
    if (!hasLocale(routing.locales, key)) {
      fail(
        `${field} içindeki "${key}" tanınmıyor; yalnızca ${routing.locales.map((locale) => `"${locale}"`).join(' ve ')} yazılabilir`,
      );
    }
  }

  return text;
}

function asFlag(value: unknown, field: string): boolean {
  if (value === undefined) return false;
  if (typeof value !== 'boolean') {
    fail(`${field} yalnızca true veya false olabilir (tırnaksız)`);
  }
  return value;
}

/**
 * Dış bağlantı `https://`, kendi sayfamız `/` ile başlar.
 *
 * İç yollar **dil öneksiz** yazılır (`/projects`), çünkü önek ziyaretçinin
 * diline göre `linksContentFor` içinde ekleniyor. Önek elle yazılırsa
 * engelliyoruz: eskiden dosyada `/tr/projects` yazıyordu ve İngilizce sayfadan
 * gelen ziyaretçi Türkçe siteye düşüyordu.
 */
function asUrl(
  value: unknown,
  field: string,
): { url: string; external: boolean } {
  const url = asText(value, field, 300);
  if (url.startsWith('https://')) return { url, external: true };

  if (url.startsWith('/')) {
    const prefix = LOCALE_PREFIX_PATTERN.exec(url)?.[1];
    if (prefix) {
      fail(
        `${field} dil öneki içermemeli: "${url}" yerine "${url.slice(prefix.length + 1) || '/'}" yazın — sayfa ziyaretçinin diline göre önekini kendisi koyar`,
      );
    }
    return { url, external: false };
  }

  fail(
    `${field} "https://" ile (dış bağlantı) veya "/" ile (sitemizdeki bir sayfa) başlamalı, gelen değer: "${url}"`,
  );
}

function parseContent(raw: unknown): ParsedContent {
  const root = asRecord(raw, 'dosyanın kökü');
  const profile = asRecord(root['profile'], '"profile"');
  const rawLinks = root['links'];

  if (!Array.isArray(rawLinks)) {
    fail('"links" bir liste olmalı ([ ... ])');
  }

  const links: ParsedLink[] = [];
  rawLinks.forEach((item, index) => {
    const at = `"links[${index}]`;
    const link = asRecord(item, `${at}"`);

    if (asFlag(link['hidden'], `${at}.hidden"`)) return;

    const { url, external } = asUrl(link['url'], `${at}.url"`);
    links.push({
      label: asLocalizedText(link['label'], `${at}.label"`, 60),
      url,
      external,
      note:
        link['note'] === undefined
          ? null
          : asLocalizedText(link['note'], `${at}.note"`, 80),
      featured: asFlag(link['featured'], `${at}.featured"`),
    });
  });

  return {
    profile: {
      title: asText(profile['title'], '"profile.title"', 60),
      tagline: asLocalizedText(profile['tagline'], '"profile.tagline"', 140),
    },
    links,
  };
}

/**
 * Doğrulanmış `/links` içeriği (dili seçilmemiş). Bozuk düzenlemede build
 * burada kırılır: modül yüklenirken bir kez çalışıyor, iki dil için iki kez
 * değil.
 */
const parsedContent: ParsedContent = parseContent(rawContent as unknown);

/** Tek dile indirgenmiş sayfa içeriği — rotanın tek okuduğu şey. */
export function linksContentFor(locale: Locale): LinksContent {
  return {
    profile: {
      title: parsedContent.profile.title,
      tagline: parsedContent.profile.tagline[locale],
    },
    links: parsedContent.links.map((link) => ({
      label: link.label[locale],
      note: link.note ? link.note[locale] : null,
      url: link.url,
      /* Dil öneki yalnızca gerçekten dile göre ikizi olan sayfalara eklenir
         (bkz. `lib/routes.ts`): `/projects` → `/en/projects`, ama `/roadmap`
         bir yönlendirme olduğu için öneksiz kalır. */
      href:
        link.external || !isLocalizedPath(link.url)
          ? link.url
          : localizedHref(locale, link.url),
      featured: link.featured,
      external: link.external,
    })),
  };
}
