// Landing'deki sticker'ların görsellerini hazırlar.
//
// `assets/stickers/` içindeki şeffaf zeminli her görseli kırpar, boyutlar ve
// `public/stickers/<ad>.webp` olarak yazar. Sticker şekli görselin kendi
// silueti; etrafına kenar eklenmez. Holo/sim maskeleri çalışma anında
// üretilir (bkz. src/components/landing/sticker).
//
// Kullanım: node scripts/build-stickers.mjs
import { readdir } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const SRC = 'assets/stickers';
const OUT = 'public/stickers';
const CONTENT = 900; // görselin uzun kenarı (px)
const PAD = 4; // kenar örneklemesi taşmasın diye şeffaf pay

async function build(file) {
  // Yumuşak gölge gibi yarı saydam pikselleri at, gerisini opak say. Kırpma
  // bundan sonra: gölge kırpılan kutuya girmesin, sticker ortalı kalsın.
  const src = await sharp(path.join(SRC, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 3; i < src.data.length; i += 4) {
    const a = Math.min(Math.max((src.data[i] - 110) / 60, 0), 1);
    src.data[i] = Math.round(a * 255);
  }

  const { data, info } = await sharp(src.data, { raw: src.info })
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

  const name = path.parse(file).name;
  await sharp(data, { raw: info })
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(path.join(OUT, `${name}.webp`));
  console.log(`${name}.webp  ${info.width}x${info.height}`);
}

for (const file of (await readdir(SRC)).sort()) {
  if (/\.(png|webp|jpe?g)$/i.test(file)) await build(file);
}
