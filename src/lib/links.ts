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
 */

export type LinkItem = {
  label: string;
  url: string;
  note: string | null;
  /** Dolu/vurgulu çizilir; listede en fazla bir tane olması beklenir. */
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

function asFlag(value: unknown, field: string): boolean {
  if (value === undefined) return false;
  if (typeof value !== 'boolean') {
    fail(`${field} yalnızca true veya false olabilir (tırnaksız)`);
  }
  return value;
}

/** Dış bağlantı `https://`, kendi sayfamız `/` ile başlar. */
function asUrl(
  value: unknown,
  field: string,
): { url: string; external: boolean } {
  const url = asText(value, field, 300);
  if (url.startsWith('https://')) return { url, external: true };
  if (url.startsWith('/')) return { url, external: false };
  fail(
    `${field} "https://" ile (dış bağlantı) veya "/" ile (sitemizdeki bir sayfa) başlamalı, gelen değer: "${url}"`,
  );
}

function parseContent(raw: unknown): LinksContent {
  const root = asRecord(raw, 'dosyanın kökü');
  const profile = asRecord(root['profile'], '"profile"');
  const rawLinks = root['links'];

  if (!Array.isArray(rawLinks)) {
    fail('"links" bir liste olmalı ([ ... ])');
  }

  const links: LinkItem[] = [];
  rawLinks.forEach((item, index) => {
    const at = `"links[${index}]`;
    const link = asRecord(item, `${at}"`);

    if (asFlag(link['hidden'], `${at}.hidden"`)) return;

    const { url, external } = asUrl(link['url'], `${at}.url"`);
    links.push({
      label: asText(link['label'], `${at}.label"`, 60),
      url,
      external,
      note:
        link['note'] === undefined
          ? null
          : asText(link['note'], `${at}.note"`, 80),
      featured: asFlag(link['featured'], `${at}.featured"`),
    });
  });

  return {
    profile: {
      title: asText(profile['title'], '"profile.title"', 60),
      tagline: asText(profile['tagline'], '"profile.tagline"', 140),
    },
    links,
  };
}

const raw: unknown = rawContent;

/** Doğrulanmış `/links` içeriği. Bozuk düzenlemede build burada kırılır. */
export const linksContent: LinksContent = parseContent(raw);
