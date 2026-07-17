import type { Localized } from '@/lib/localized';

/** Üyenin sosyal medya / iletişim bağlantıları. */
export type SocialLinks = {
  github?: string;
  twitter?: string;
  linkedin?: string;
  telegram?: string;
  website?: string;
};

/**
 * Kulüp üyeleri / ekip için veri modeli.
 * Not: İçerik repo içi TS objesi (roadmap kararı); Sanity değil.
 * Aşağıdaki kayıtlar yalnızca yer tutucudur.
 */
export type Member = {
  /** URL-güvenli benzersiz kimlik. */
  slug: string;
  /** Ad soyad (dile bağlı değil). */
  name: string;
  /** Kulüpteki rol/unvan — dile bağlı (ör. "Kurucu" / "Founder"). */
  role: Localized;
  /** Bölüm (opsiyonel). */
  department?: string;
  /** Kısa biyografi — dile bağlı (opsiyonel). */
  bio?: Localized;
  /** Profil görseli yolu (public/ altına göreli). */
  avatar?: string;
  socials?: SocialLinks;
};

/**
 * YER TUTUCU veri — gerçek ekip eklenince değiştirilecek.
 */
export const members: readonly Member[] = [
  {
    slug: 'placeholder-founder',
    name: 'Ada Yıldız',
    role: { tr: 'Kurucu', en: 'Founder' },
    department: 'Bilgisayar Mühendisliği',
  },
  {
    slug: 'placeholder-lead',
    name: 'Deniz Kaya',
    role: { tr: 'Teknik Lider', en: 'Tech Lead' },
    department: 'Elektronik ve Haberleşme Mühendisliği',
  },
];
