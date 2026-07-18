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
 * Gerçek ekip buraya eklenecek. Yukarıdaki `Member` tipini örnek alın.
 * Dizi boşken üye render edilmez (About ekip bölümü şu an komite etiketleri kullanıyor).
 */
export const members: readonly Member[] = [];
