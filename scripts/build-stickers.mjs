// Landing'deki sticker'ların görsellerini hazırlar.
//
// `assets/stickers/` içindeki şeffaf zeminli her görselin etrafına beyaz bir
// die-cut kenar çizer ve `public/stickers/<ad>.webp` olarak yazar. Holo/sim
// maskeleri çalışma anında üretilir (bkz. src/components/landing/sticker).
//
// Kullanım: node scripts/build-stickers.mjs
import { readdir } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const SRC = 'assets/stickers';
const OUT = 'public/stickers';
const CONTENT = 900; // görselin uzun kenarı (px)
const BORDER = 26; // beyaz kenarın kalınlığı (px)
const CLOSE = 22; // kenarın küçük girintileri doldurması için ek genişlik
const PAD = BORDER + CLOSE + 4;
const PAPER = [246, 246, 243];

/** 0/1 maskeden en yakın 1 pikselin uzaklığı (iki geçişli chamfer). */
function distance(mask, w, h) {
  const INF = 1e9;
  const d = new Float32Array(w * h);
  for (let i = 0; i < d.length; i++) d[i] = mask[i] ? 0 : INF;
  const D = Math.SQRT2;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + 1);
      if (y > 0) {
        v = Math.min(v, d[i - w] + 1);
        if (x > 0) v = Math.min(v, d[i - w - 1] + D);
        if (x < w - 1) v = Math.min(v, d[i - w + 1] + D);
      }
      d[i] = v;
    }
  for (let y = h - 1; y >= 0; y--)
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      let v = d[i];
      if (x < w - 1) v = Math.min(v, d[i + 1] + 1);
      if (y < h - 1) {
        v = Math.min(v, d[i + w] + 1);
        if (x < w - 1) v = Math.min(v, d[i + w + 1] + D);
        if (x > 0) v = Math.min(v, d[i + w - 1] + D);
      }
      d[i] = v;
    }
  return d;
}

async function build(file) {
  // Yumuşak gölge gibi yarı saydam pikselleri at, gerisini opak say
  const { data, info } = await sharp(path.join(SRC, file))
    .ensureAlpha()
    .trim({ threshold: 0 })
    .resize(CONTENT, CONTENT, { fit: 'inside' })
    .extend({
      top: PAD,
      bottom: PAD,
      left: PAD,
      right: PAD,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const n = w * h;

  const alpha = new Float32Array(n);
  const mask = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const a = data[i * 4 + 3];
    alpha[i] = Math.min(Math.max((a - 110) / 60, 0), 1);
    mask[i] = a > 140 ? 1 : 0;
  }

  // Kapanış: BORDER + CLOSE kadar genişlet, sonra CLOSE kadar daralt →
  // görselin etrafında BORDER kalınlığında, dar boşlukları dolmuş bir kenar
  const grown = distance(mask, w, h);
  const outside = new Uint8Array(n);
  for (let i = 0; i < n; i++) outside[i] = grown[i] > BORDER + CLOSE ? 1 : 0;
  const shrink = distance(outside, w, h);
  const cut = new Float32Array(n);
  for (let i = 0; i < n; i++)
    cut[i] = Math.min(Math.max(shrink[i] - CLOSE + 0.5, 0), 1);

  // İç delikleri doldur: dışarıdan erişilemeyen her yer sticker'a dahil
  const reach = new Uint8Array(n);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (reach[i] || cut[i] >= 0.5) continue;
    reach[i] = 1;
    const x = i % w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < n - w) stack.push(i + w);
  }

  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const c = reach[i] ? cut[i] : 1;
    const a = alpha[i];
    for (let k = 0; k < 3; k++)
      out[i * 4 + k] = Math.round(data[i * 4 + k] * a + PAPER[k] * (1 - a));
    out[i * 4 + 3] = Math.round(Math.max(c, a) * 255);
  }

  const name = path.parse(file).name;
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(path.join(OUT, `${name}.webp`));
  console.log(`${name}.webp  ${w}x${h}`);
}

for (const file of (await readdir(SRC)).sort()) {
  if (/\.(png|webp|jpe?g)$/i.test(file)) await build(file);
}
