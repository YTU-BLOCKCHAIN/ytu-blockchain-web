import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { siteConfig } from '@/lib/site';

/**
 * Paylaşım kartı (Open Graph) görselleri — `opengraph-image.tsx` rotalarının
 * ortak katmanı.
 *
 * Neden kod: kart her sayfa için üretiliyor, yani yeni bir sayfa veya blog
 * yazısı eklendiğinde kimsenin görsel hazırlaması gerekmiyor.
 *
 * `ImageResponse` arkada Satori çalıştırıyor ve CSS'in yalnızca bir alt
 * kümesini destekliyor. İki sınır burada belirleyici oldu:
 *
 * - **`mask-image` yok.** Sitede logo maske olarak çiziliyor (`Logo` bileşeni,
 *   `bg-current` + `mask-image`), o teknik burada çalışmaz. Neyse ki logo
 *   SVG'leri zaten `fill="white"` ve şeffaf zeminli, yani koyu zeminde
 *   doğrudan `<img>` olarak basılabiliyorlar.
 * - **Grid yok, flexbox var.** Birden fazla çocuğu olan her kutu `display:
 *   flex` demek zorunda; Satori bunu varsaymıyor.
 */

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#09090b';
const FG = '#ffffff';
const BLUE = '#3b82f6';
const MUTE = '#a1a1aa';
const LINE = 'rgba(255,255,255,0.10)';
const PAD = 80;

/**
 * Diskten okunan varlıklar: logo SVG'leri ve yazı tipleri.
 *
 * Yazı tipleri `geist` paketinden değil depodan (`assets/fonts/`) geliyor. İki
 * sebep: Satori **woff2 kabul etmiyor** (paket ağırlıklı woff2 dağıtıyor) ve
 * `node_modules`un çalışma zamanı paketlemesine güvenmek kırılgan.
 *
 * Yollar bilerek **sabit dize**: `readFile(join(process.cwd(), değişken))`
 * yazıldığında Turbopack hangi dosyanın gerektiğini çözemeyip bütün projeyi
 * izlemeye alıyor ve build uyarı veriyor ("the whole project was traced
 * unintentionally"). Literal yolla yalnızca bu beş dosya paketleniyor.
 */
function dataUri(svg: Buffer) {
  return `data:image/svg+xml;base64,${svg.toString('base64')}`;
}

async function loadLogo() {
  const [mark, ytu, blockchain] = await Promise.all([
    readFile(join(process.cwd(), 'public/logo/mark.svg')),
    readFile(join(process.cwd(), 'public/logo/ytu.svg')),
    readFile(join(process.cwd(), 'public/logo/blockchain.svg')),
  ]);

  return {
    mark: dataUri(mark),
    ytu: dataUri(ytu),
    blockchain: dataUri(blockchain),
  };
}

async function loadFonts() {
  const [sans, mono] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/Geist-SemiBold.ttf')),
    readFile(join(process.cwd(), 'assets/fonts/GeistMono-Regular.ttf')),
  ]);

  return [
    {
      name: 'Geist',
      data: sans,
      style: 'normal' as const,
      weight: 600 as const,
    },
    {
      name: 'GeistMono',
      data: mono,
      style: 'normal' as const,
      weight: 400 as const,
    },
  ];
}

/**
 * Kartın dört kenarındaki ince çizgiler — sitedeki ızgara hairline'ları.
 *
 * Sarmalayıcıda `inset: 0` kısayolu yerine açık ölçü var: Satori kısayolu
 * çözmüyor, kutu sıfır boyutta kalıp çizgiler hiç görünmüyordu.
 */
function GridLines() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: size.width,
        height: size.height,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: PAD,
          top: 0,
          width: 1,
          height: '100%',
          background: LINE,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: size.width - PAD,
          top: 0,
          width: 1,
          height: '100%',
          background: LINE,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 72,
          width: '100%',
          height: 1,
          background: LINE,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: size.height - 72,
          width: '100%',
          height: 1,
          background: LINE,
        }}
      />
    </div>
  );
}

/**
 * "YTU BLOCKCHAIN" kilidi. Oranlar `Logo` bileşeninden birebir: amblem 28,
 * boşluk 8, YTU 31×16, boşluk 6, BLOCKCHAIN 104×16 — hepsi `k` ile ölçekleniyor,
 * böylece iki varyantta da aynı kilit farklı boyutlarda çıkıyor.
 */
function Lockup({
  k,
  mark,
  ytu,
  blockchain,
}: {
  k: number;
  mark: string;
  ytu: string;
  blockchain: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 * k }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={mark} width={28 * k} height={28 * k} alt="" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 * k }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ytu} width={31 * k} height={16 * k} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={blockchain} width={104 * k} height={16 * k} alt="" />
      </div>
    </div>
  );
}

async function shell(children: React.ReactElement) {
  const fonts = await loadFonts();

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: BG,
        fontFamily: 'Geist',
        position: 'relative',
      }}
    >
      <GridLines />
      {children}
    </div>,
    { ...size, fonts },
  );
}

/**
 * Sade kart: amblem ve wordmark ortada, alt alta. Anasayfa ve başlığı kartta
 * tekrarlamanın değer katmadığı sayfalar için.
 */
export async function brandCard() {
  const { mark, ytu, blockchain } = await loadLogo();

  // Dikey kilit: amblem 150px, wordmark eni 600px (yüksekliği oranla 68px).
  const k = 600 / 141;

  return shell(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        gap: 44,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={mark} width={150} height={150} alt="" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 * k }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ytu} width={31 * k} height={16 * k} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={blockchain} width={104 * k} height={16 * k} alt="" />
      </div>
    </div>,
  );
}

/**
 * Başlıklı kart: logo sol üstte (header'ın yatay dizilimiyle), altında etiket,
 * sayfa başlığı ve alan adı. Blog yazıları için — paylaşılan link kartında
 * yazının adı görünsün diye.
 */
export async function titleCard({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const { mark, ytu, blockchain } = await loadLogo();

  // Uzun başlık kartı taşırmasın: satır yüksekliğiyle birlikte üç satır sığıyor,
  // fazlası kırpılıyor. Kesme kelime ortasından olmasın diye sondaki yarım
  // kelime atılıyor.
  const MAX = 68;
  const clipped =
    title.length > MAX
      ? `${title.slice(0, MAX).replace(/\s+\S*$/, '')}…`
      : title;

  return shell(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: `110px ${PAD}px 96px`,
      }}
    >
      <Lockup k={1.7} mark={mark} ytu={ytu} blockchain={blockchain} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div
          style={{
            fontFamily: 'GeistMono',
            fontSize: 20,
            letterSpacing: 3,
            color: BLUE,
          }}
        >
          {`// ${eyebrow}`}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: -1.5,
            color: FG,
            lineHeight: 1.15,
          }}
        >
          {clipped}
        </div>
        <div style={{ fontSize: 24, color: MUTE }}>
          {siteConfig.url.replace(/^https?:\/\//, '')}
        </div>
      </div>
    </div>,
  );
}
