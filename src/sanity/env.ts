/**
 * Sanity bağlantı sabitleri.
 *
 * Proje kimliği ve dataset adı **gizli değildir** — Studio istemcide çalıştığı
 * için ikisi de tarayıcıya gönderilen pakete gömülür; Sanity de bu yüzden
 * bunları `NEXT_PUBLIC_` ön ekiyle tutmayı öneriyor. Gizli olmadıkları için
 * `siteConfig.url` gibi kodda birer yedek değer taşıyorlar: CI'da hiçbir env
 * tanımlı olmadan da `npm run verify` yeşil kalıyor. Env değişkeni verilirse
 * (örn. ayrı bir test dataset'i) o kazanır.
 */
const FALLBACK_PROJECT_ID = '0mrzbn1y';
const FALLBACK_DATASET = 'production';

export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? FALLBACK_PROJECT_ID;

export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? FALLBACK_DATASET;

/**
 * GROQ sorgularının hangi API sürümüne göre yorumlanacağı. Sanity'de sürüm =
 * tarih; sabit tutulur, çünkü ileri bir tarihe alınmak sorgu davranışını
 * değiştirebilir. Yükseltmek bilinçli bir karar olmalı (ve sorguların test
 * edilmesini gerektirir).
 */
export const sanityApiVersion = '2026-08-10';
