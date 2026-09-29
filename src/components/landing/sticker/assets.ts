/**
 * Sticker dokularını çalışma anında hazırlar.
 *
 * Her sticker için:
 * - `map`: renkler + die-cut şekli (alpha),
 * - `fx`: kanal başına efekt maskesi (R = holo foil, G = glitter,
 *   B = kabartma yüksekliği),
 * - `shadow`: şeklin bulanık siluetinden yumuşak gölge,
 * - `outline`: soyma için kenar noktaları (dünya biriminde).
 *
 * Kulüp logosu `/logo/mark.svg`'den çizilir. Diğerleri
 * `scripts/build-stickers.mjs`'in kırpıp boyutladığı görsellerdir; onlarda
 * lacivert logo alanları sim + holo, geri kalanı ince bir film parlaklığı
 * alır.
 */
import { CanvasTexture, LinearFilter, Vector2 } from 'three';

import type { StickerDef } from './list';

export type StickerAsset = {
  map: CanvasTexture;
  fx: CanvasTexture;
  shadow: CanvasTexture;
  /** Düzlemin dünya birimindeki genişlik/yükseklik (uzun kenar = 2). */
  size: Vector2;
  texel: Vector2;
  /** `d` yönünde merkezden en uzak kenar noktasının uzaklığı. */
  support(dx: number, dy: number): number;
  /** Yerel (x, y) noktası sticker'ın üstünde mi? */
  contains(x: number, y: number): boolean;
  /** (x, y)'ye en yakın kenar noktasını `out`'a yazar, uzaklığını döner. */
  nearestEdge(x: number, y: number, out: Vector2): number;
  dispose(): void;
};

const GRID = 96; // kenar/doluluk ızgarasının uzun kenardaki hücre sayısı

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function ctx2d(c: HTMLCanvasElement) {
  return c.getContext('2d', { willReadFrequently: true })!;
}

/**
 * Küçültüp yumuşatarak geri büyütme: `ctx.filter` her tarayıcıda yok
 * (Safari), bu yüzden bulanıklık bu yolla.
 */
function blurred(
  src: HTMLCanvasElement,
  factor: number,
  w = src.width,
  h = src.height,
) {
  const small = canvas(
    Math.max(2, Math.round(w / factor)),
    Math.max(2, Math.round(h / factor)),
  );
  const s = small.getContext('2d')!;
  s.imageSmoothingQuality = 'high';
  s.drawImage(src, 0, 0, small.width, small.height);
  const out = canvas(w, h);
  const o = out.getContext('2d')!;
  o.imageSmoothingQuality = 'high';
  o.drawImage(small, 0, 0, w, h);
  return out;
}

function texture(c: HTMLCanvasElement) {
  const t = new CanvasTexture(c);
  t.minFilter = LinearFilter;
  t.generateMipmaps = false;
  return t;
}

// --- Kulüp logosu ---

function drawLogo(logo: HTMLImageElement) {
  const TEX = 1024;
  const R_DISK = 500; // simli lacivert zemin (sticker'ın kendisi)
  const LOGO = 900; // logo kutusunun kenarı

  const tinted = (color: string) => {
    const c = canvas(TEX, TEX);
    const ctx = c.getContext('2d')!;
    const o = (TEX - LOGO) / 2;
    ctx.drawImage(logo, o, o, LOGO, LOGO);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, TEX, TEX);
    return c;
  };
  const circle = (ctx: CanvasRenderingContext2D, r: number) => {
    ctx.beginPath();
    ctx.arc(TEX / 2, TEX / 2, r, 0, Math.PI * 2);
    ctx.fill();
  };

  const map = canvas(TEX, TEX);
  const m = ctx2d(map);
  const g = m.createRadialGradient(
    TEX * 0.4,
    TEX * 0.35,
    40,
    TEX / 2,
    TEX / 2,
    R_DISK,
  );
  g.addColorStop(0, '#2449c9');
  g.addColorStop(1, '#0f1d5c');
  m.fillStyle = g;
  circle(m, R_DISK);
  m.drawImage(tinted('#dfe3ea'), 0, 0);

  const fx = canvas(TEX, TEX);
  const f = fx.getContext('2d')!;
  f.fillStyle = 'rgb(0,0,0)';
  f.fillRect(0, 0, TEX, TEX);
  f.fillStyle = 'rgb(35,200,110)';
  circle(f, R_DISK);
  f.drawImage(tinted('rgb(255,70,255)'), 0, 0);

  return { map, fx };
}

// --- Görselden sticker ---

function drawImageSticker(img: HTMLImageElement) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const map = canvas(w, h);
  const m = ctx2d(map);
  m.drawImage(img, 0, 0);
  const px = m.getImageData(0, 0, w, h).data;

  // Lacivert logo pikselleri
  const navy = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const r = px[i * 4]!;
    const g = px[i * 4 + 1]!;
    const b = px[i * 4 + 2]!;
    if (px[i * 4 + 3]! > 128 && b > 60 && b > r + 35 && b > g + 25 && r < 90)
      navy[i * 4 + 3] = 255;
  }
  const navyCanvas = canvas(w, h);
  navyCanvas.getContext('2d')!.putImageData(new ImageData(navy, w, h), 0, 0);
  // Logonun içindeki beyaz çizgileri de kapsayan bölge
  const region = ctx2d(blurred(navyCanvas, 14)).getImageData(0, 0, w, h).data;

  const fxData = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    fxData[o + 3] = 255;
    if (px[o + 3]! < 8) continue;
    const r = px[o]!;
    const g = px[o + 1]!;
    const b = px[o + 2]!;
    const min = Math.min(r, g, b);
    const white = min > 215;
    const inLogo = region[o + 3]! > 90;
    // Yükseklik baskıda sabit: renge bağlı olsaydı açık tonlar (ör. pembe)
    // eşiğin iki yanına düşüp yüzeyi pütür pütür gösterirdi
    fxData[o + 2] = 120;
    if (navy[o + 3]) {
      fxData[o] = 30;
      fxData[o + 1] = 200;
      fxData[o + 2] = 140;
    } else if (inLogo && white) {
      // Logonun beyaz çizgileri: holo foil
      fxData[o] = 255;
      fxData[o + 1] = 70;
      fxData[o + 2] = 255;
    } else if (!(min > 236 && Math.max(r, g, b) - min < 10)) {
      // Baskı (düz beyaz alanlar hariç): hafif film parlaklığı
      fxData[o] = 26;
    }
  }
  const fx = canvas(w, h);
  fx.getContext('2d')!.putImageData(new ImageData(fxData, w, h), 0, 0);
  return { map, fx };
}

// --- Ortak ---

function finish(map: HTMLCanvasElement, fx: HTMLCanvasElement): StickerAsset {
  const w = map.width;
  const h = map.height;
  const long = Math.max(w, h);
  const W = (2 * w) / long;
  const H = (2 * h) / long;

  // Doluluk ızgarası ve kenar noktaları
  const gw = Math.max(2, Math.round((GRID * w) / long));
  const gh = Math.max(2, Math.round((GRID * h) / long));
  const small = canvas(gw, gh);
  const sctx = ctx2d(small);
  sctx.drawImage(map, 0, 0, gw, gh);
  const a = sctx.getImageData(0, 0, gw, gh).data;
  const filled = new Uint8Array(gw * gh);
  for (let i = 0; i < gw * gh; i++) filled[i] = a[i * 4 + 3]! > 128 ? 1 : 0;
  const pts: number[] = [];
  for (let y = 0; y < gh; y++)
    for (let x = 0; x < gw; x++) {
      if (!filled[y * gw + x]) continue;
      const edge =
        x === 0 ||
        y === 0 ||
        x === gw - 1 ||
        y === gh - 1 ||
        !filled[y * gw + x - 1] ||
        !filled[y * gw + x + 1] ||
        !filled[(y - 1) * gw + x] ||
        !filled[(y + 1) * gw + x];
      if (edge)
        pts.push(((x + 0.5) / gw - 0.5) * W, (0.5 - (y + 0.5) / gh) * H);
    }
  const outline = new Float32Array(pts);

  // Gölge: kenarlarda boşluk bırakılmış, bulanık siyah siluet
  const SH = 192;
  const pad = 0.12;
  const sw = Math.round((SH * w) / long);
  const shh = Math.round((SH * h) / long);
  const silhouette = canvas(
    Math.round(sw * (1 + 2 * pad)),
    Math.round(shh * (1 + 2 * pad)),
  );
  const sil = silhouette.getContext('2d')!;
  sil.drawImage(map, sw * pad, shh * pad, sw, shh);
  sil.globalCompositeOperation = 'source-in';
  sil.fillStyle = '#000';
  sil.fillRect(0, 0, silhouette.width, silhouette.height);
  const shadow = blurred(silhouette, 10);

  const tMap = texture(map);
  const tFx = texture(fx);
  const tShadow = texture(shadow);

  return {
    map: tMap,
    fx: tFx,
    shadow: tShadow,
    size: new Vector2(W, H),
    texel: new Vector2(1.5 / w, 1.5 / h),
    support(dx, dy) {
      let best = 0;
      for (let i = 0; i < outline.length; i += 2) {
        const d = outline[i]! * dx + outline[i + 1]! * dy;
        if (d > best) best = d;
      }
      return best;
    },
    nearestEdge(x, y, out) {
      let best = Infinity;
      for (let i = 0; i < outline.length; i += 2) {
        const d = Math.hypot(outline[i]! - x, outline[i + 1]! - y);
        if (d < best) {
          best = d;
          out.set(outline[i]!, outline[i + 1]!);
        }
      }
      return best;
    },
    contains(x, y) {
      const gx = Math.floor((x / W + 0.5) * gw);
      const gy = Math.floor((0.5 - y / H) * gh);
      if (gx < 0 || gy < 0 || gx >= gw || gy >= gh) return false;
      return filled[gy * gw + gx] === 1;
    },
    dispose() {
      tMap.dispose();
      tFx.dispose();
      tShadow.dispose();
    },
  };
}

export async function loadSticker(def: StickerDef): Promise<StickerAsset> {
  if (!def.src) {
    const { map, fx } = drawLogo(await loadImage('/logo/mark.svg'));
    return finish(map, fx);
  }
  const { map, fx } = drawImageSticker(await loadImage(def.src));
  return finish(map, fx);
}
