import type { Localized } from '@/lib/localized';

/** Bir projenin yayın durumu. */
export type ProjectStatus = 'live' | 'wip' | 'archived';

/**
 * Kulüp projeleri için veri modeli.
 * Not: İçerik Sanity'de DEĞİL — repo içi TS objesi (roadmap kararı).
 * Gerçek veriyi Samet dolduracak; sayfa/template bu tipe göre hazır bekler.
 */
export type Project = {
  /** URL-güvenli benzersiz kimlik (ör. /projects/[slug]). */
  slug: string;
  /** Proje adı (genelde markadır, dile bağlı değildir). */
  title: string;
  /** Kısa açıklama — dile bağlı. */
  summary: Localized;
  /** Etiketler (teknoloji/konu). */
  tags: string[];
  status: ProjectStatus;
  repoUrl?: string;
  liveUrl?: string;
  /** Kapak görseli yolu (public/ altına göreli). */
  cover?: string;
};

/**
 * Gerçek projeler buraya eklenecek (Samet). Yeni bir kayıt için yukarıdaki
 * `Project` tipini örnek alın. Dizi boşken projeler sayfası "coming soon"
 * boş durumunu gösterir; kayıt eklenince kartlar otomatik listelenir.
 */
export const projects: readonly Project[] = [];
