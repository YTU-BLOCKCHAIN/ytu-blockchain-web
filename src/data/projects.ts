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
 * YER TUTUCU veri — gerçek projeler eklenince değiştirilecek.
 * Sayfa bu diziden beslenir; dizi boşken sayfa "coming soon" gösterebilir.
 */
export const projects: readonly Project[] = [
  {
    slug: 'placeholder-defi-dashboard',
    title: 'DeFi Dashboard',
    summary: {
      tr: 'Yer tutucu proje — DeFi protokollerini tek ekranda izleyen gösterge paneli.',
      en: 'Placeholder project — a dashboard that tracks DeFi protocols on a single screen.',
    },
    tags: ['DeFi', 'Next.js', 'The Graph'],
    status: 'wip',
  },
  {
    slug: 'placeholder-zk-workshop',
    title: 'zkProof Workshop',
    summary: {
      tr: 'Yer tutucu proje — sıfır bilgi ispatlarına giriş atölyesi materyalleri.',
      en: 'Placeholder project — introductory workshop materials for zero-knowledge proofs.',
    },
    tags: ['zero-knowledge', 'education'],
    status: 'archived',
  },
];
