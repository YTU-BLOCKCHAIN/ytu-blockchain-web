import rawContent from '../../content/posts.json';

/**
 * Ana sayfadaki "öne çıkan paylaşımlar" bölümü. `content/posts.json` yalnızca
 * X paylaşımlarının **adreslerini** tutar; metin, yazar ve tarih X'in resmî
 * **oEmbed** ucundan (`publish.x.com/oembed`) build sırasında çekilir.
 *
 * Neden oEmbed: ücretsiz ve anahtarsız, ayrıca yanıtı sunucuda işleyip kendi
 * kartlarımızda bastığımız için istemciye X'in JS'i / çerezi / iframe'i hiç
 * gitmiyor. (X'in zaman tüneli ucu `syndication.twitter.com` bize 429 "Rate
 * limit exceeded" döndüğü için otomatik listeleme mümkün değil — bu yüzden
 * paylaşımlar elle seçiliyor.)
 *
 * Dayanıklılık: X tarafındaki bir aksaklık build'i ASLA kırmaz. Çekilemeyen
 * paylaşım atlanır; hiçbiri çekilemezse bölüm gizlenir.
 */

export type FeaturedPost = {
  /** Paylaşımın kanonik adresi (x.com'a normalize edilmiş). */
  url: string;
  authorName: string;
  /** Baştaki @ olmadan. */
  authorHandle: string;
  text: string;
  /** ISO tarih (YYYY-MM-DD); okunamazsa null. */
  date: string | null;
};

/** `https://x.com/<hesap>/status/<id>` — twitter.com da kabul edilir. */
const POST_URL =
  /^https:\/\/(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/status\/(\d+)/;

function fail(problem: string): never {
  throw new Error(
    `content/posts.json geçersiz: ${problem}. Nasıl düzeltileceği için content/README.md dosyasına bakın.`,
  );
}

/** Adresleri doğrular ve kanonik `x.com` biçimine getirir. */
function parseUrls(raw: unknown): string[] {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    fail('dosyanın kökü bir nesne olmalı ({ ... })');
  }
  const posts = (raw as Record<string, unknown>)['posts'];
  if (!Array.isArray(posts)) {
    fail('"posts" bir liste olmalı ([ ... ])');
  }

  return posts.map((item, index) => {
    const at = `"posts[${index}]"`;
    if (typeof item !== 'string') {
      fail(`${at} tırnak içinde bir adres olmalı`);
    }
    const match = POST_URL.exec(item);
    const handle = match?.[1];
    const id = match?.[2];
    if (!handle || !id) {
      fail(
        `${at} bir X paylaşımının adresi olmalı (https://x.com/hesap/status/123...), gelen değer: "${item}"`,
      );
    }
    return `https://x.com/${handle}/status/${id}`;
  });
}

const postUrls = parseUrls(rawContent as unknown);

function decodeEntities(input: string): string {
  return input
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 16)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&'); // en sonda: yeni entity üretmesin
}

/** oEmbed `html` alanı: `<blockquote><p …>metin</p>&mdash; yazar <a>tarih</a></blockquote>`. */
function extractText(html: string): string | null {
  const paragraph = /<p[^>]*>([\s\S]*?)<\/p>/.exec(html)?.[1];
  if (!paragraph) return null;

  const text = decodeEntities(
    paragraph.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, ''),
  )
    // Görselli paylaşımların sonuna X'in eklediği `pic.twitter.com/xxxx`
    // yer tutucusu: görseli zaten göstermediğimiz için kartta anlamsız duruyor.
    .replace(/\s*pic\.(?:twitter|x)\.com\/\w+\s*$/i, '')
    .trim();

  return text === '' ? null : text;
}

/** Kapanış bağlantısındaki İngilizce tarih ("March 21, 2006") → ISO. */
function extractDate(html: string): string | null {
  const label = /<a href="[^"]*"[^>]*>([^<]+)<\/a>\s*<\/blockquote>/.exec(
    html,
  )?.[1];
  if (!label) return null;

  const parsed = Date.parse(label);
  if (Number.isNaN(parsed)) return null;

  // `Date.parse("March 21, 2006")` YEREL geceyarısını verir; `toISOString()`
  // bunu UTC'ye çevirip pozitif saat diliminde günü BİR GERİ kaydırır
  // (21 Mart → 20 Mart). Bu yüzden ISO'yu yerel parçalardan kuruyoruz.
  const date = new Date(parsed);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

async function fetchPost(url: string): Promise<FeaturedPost | null> {
  const endpoint = `https://publish.x.com/oembed?omit_script=1&dnt=1&url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;

    const data = (await response.json()) as Record<string, unknown>;
    const html = data['html'];
    const authorName = data['author_name'];
    const authorUrl = data['author_url'];
    if (typeof html !== 'string') return null;

    const text = extractText(html);
    if (!text) return null;

    return {
      url,
      authorName: typeof authorName === 'string' ? authorName : '',
      authorHandle:
        typeof authorUrl === 'string' ? (authorUrl.split('/').pop() ?? '') : '',
      text,
      date: extractDate(html),
    };
  } catch {
    // Ağ hatası / zaman aşımı / bozuk JSON → bu paylaşımı atla, build sürsün.
    return null;
  }
}

/**
 * Seçilmiş paylaşımları çeker. Çekilemeyenler sessizce atlanır; hiçbiri
 * gelmezse boş dizi döner ve bölüm hiç çizilmez.
 */
export async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  if (postUrls.length === 0) return [];

  const results = await Promise.all(postUrls.map(fetchPost));
  const posts = results.filter((post): post is FeaturedPost => post !== null);

  if (posts.length < postUrls.length) {
    console.warn(
      `[posts] ${postUrls.length} paylaşımdan ${posts.length} tanesi çekilebildi (X oEmbed yanıt vermedi).`,
    );
  }

  return posts;
}
