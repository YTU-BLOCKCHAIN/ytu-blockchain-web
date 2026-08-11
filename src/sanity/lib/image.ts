// Adlandırılmış export: paketin `default` export'u deprecated.
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';

import { sanityDataset, sanityProjectId } from '../env';

const builder = createImageUrlBuilder({
  projectId: sanityProjectId,
  dataset: sanityDataset,
});

/**
 * Sabit orana kırpılmış görsel adresi — kapaklar ve kartlar için.
 *
 * Ölçeklendirmeyi Sanity'nin görsel CDN'i yapıyor: 4000px'lik bir kapak
 * yüklense bile tarayıcıya istenen boyut iniyor. `fit('crop')` editörün
 * Studio'da seçtiği odak noktasına (hotspot) saygı duyar; `auto('format')`
 * destekleyen tarayıcıya WebP/AVIF gönderir.
 */
export function imageUrl(
  source: SanityImageSource,
  width: number,
  height: number,
): string {
  return builder
    .image(source)
    .width(width)
    .height(height)
    .fit('crop')
    .auto('format')
    .url();
}

/**
 * Kendi oranını koruyan görsel adresi — yazı gövdesindeki görseller için.
 * Dikey bir görseli 16:9'a kırpmak içeriği mahveder, bu yüzden yalnız genişlik
 * veriliyor.
 */
export function imageUrlByWidth(
  source: SanityImageSource,
  width: number,
): string {
  return builder.image(source).width(width).auto('format').url();
}

/**
 * Görselin gerçek ölçüsünü **varlık referansından** okur.
 *
 * Sanity referansları ölçüyü adında taşıyor:
 * `image-<hash>-<genişlik>x<yükseklik>-<uzantı>`. Bu sayede `next/image`e
 * doğru en/boy verebiliyoruz — yani sayfa yüklenirken görselin yeri baştan
 * ayrılıyor, içerik zıplamıyor — ve bunun için sorguya varlık meta verisini
 * eklemek (ekstra bir dolaşım) gerekmiyor.
 */
const ASSET_REF = /^image-[a-f\d]+-(\d+)x(\d+)-\w+$/;

export function imageDimensions(
  ref: string | undefined,
): { width: number; height: number } | null {
  const match = ref ? ASSET_REF.exec(ref) : null;
  const width = Number(match?.[1]);
  const height = Number(match?.[2]);

  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  return { width, height };
}
