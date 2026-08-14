import type { Metadata } from 'next';
import {
  ArrowUpRight,
  BookText,
  FolderGit2,
  Globe,
  Mail,
  Podcast,
  Send,
  UserPlus,
} from 'lucide-react';
import type { ComponentType } from 'react';

import {
  GithubIcon,
  InstagramIcon,
  XIcon,
} from '@/components/community/brand-icons';
import { Logo } from '@/components/logo';
import { type LinkItem, linksContent } from '@/lib/links';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

const { profile, links } = linksContent;

/**
 * Satır ikonu. Hem lucide ikonları hem de kendi marka logolarımız bu imzaya
 * uyar, böylece ikisi de aynı satır bileşenine verilebiliyor.
 */
type RowIcon = ComponentType<{ className?: string }>;

/**
 * Her bağlantıya kanalını anlatan bir ikon. Eşleşme adresten türetilir; içerik
 * dosyasına ekstra bir alan gerekmez. Bilinmeyen adres nötr `Globe`'a düşer.
 */
function iconForLink(link: LinkItem): RowIcon {
  const url = link.url.toLowerCase();

  if (link.external) {
    if (url.includes('t.me') || url.includes('telegram')) return Send;
    if (url.includes('medium.com')) return BookText;
    if (url.includes('spotify.com')) return Podcast;
    if (url.includes('instagram.com')) return InstagramIcon;
    // `//x.com` (yalnız "x.com" değil): adres hep `https://` ile başladığı için
    // bu kalıp host'u yakalar, içinde "x.com" geçen başka adreslere uymaz.
    if (url.includes('//x.com') || url.includes('twitter.com')) return XIcon;
    if (url.includes('github.com')) return GithubIcon;
    return Globe;
  }

  if (url.includes('/join')) return UserPlus;
  if (url.includes('/projects')) return FolderGit2;
  if (url.includes('/contact')) return Mail;
  return Globe; // "Web Sitemiz" (/tr) ve tanımsız iç sayfalar
}

/** "https://x.com/BlockchainYtu" → "@BlockchainYtu". */
function handleFromUrl(url: string): string | null {
  const handle = new URL(url).pathname.split('/').filter(Boolean).at(-1);
  return handle ? `@${handle}` : null;
}

/**
 * Sosyal hesaplar. Eskiden sayfanın altında üçlü bir ikon şeridiydi; artık
 * listenin devamında teker teker kendi satırları. Adresler `siteConfig.social`
 * ile tek kaynaktan, kullanıcı adı da adresten türetiliyor — elle yazılmış
 * ikinci bir kopya `siteConfig` değişince eskimiş olurdu.
 */
const socialLinks: LinkItem[] = [
  { label: 'Instagram', url: siteConfig.social.instagram },
  { label: 'X', url: siteConfig.social.x },
  { label: 'GitHub', url: siteConfig.social.github },
].map(({ label, url }) => ({
  label,
  url,
  note: handleFromUrl(url),
  featured: false,
  external: true,
}));

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { absolute: `${profile.title} · Bağlantılar` },
  description: profile.tagline,
  alternates: { canonical: '/links' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: 'tr_TR',
    title: `${profile.title} · Bağlantılar`,
    description: profile.tagline,
    url: '/links',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.title} · Bağlantılar`,
    description: profile.tagline,
  },
};

/**
 * Ekranda görünen satırlar: önce içerik bağlantıları, sonra sosyal hesaplar.
 * İkon eşleşmesi adresten türetildiği ve iki liste de sabit olduğu için render
 * sırasında değil, modül yüklenirken bir kez hesaplanıyor.
 */
const rows: { link: LinkItem; LeadingIcon: RowIcon }[] = [
  ...links,
  ...socialLinks,
].map((link) => ({ link, LeadingIcon: iconForLink(link) }));

/** Listenin tek satırı — içerik bağlantıları ve sosyal hesaplar aynı kart. */
function LinkRow({ link, LeadingIcon }: (typeof rows)[number]) {
  return (
    <a
      href={link.url}
      {...(link.external
        ? { target: '_blank', rel: 'noreferrer noopener' }
        : {})}
      className={cn(
        // Köşeler yalnızca sm'den itibaren: telefonda kartlar ekranın iki
        // kenarına dayanıyor, orada yuvarlatma kırpılmış gibi duruyordu.
        'group focus-visible:ring-ring flex min-h-14 items-center justify-between gap-4 px-5 py-4 transition-colors focus-visible:ring-2 focus-visible:outline-none sm:rounded',
        link.featured
          ? 'bg-foreground text-background hover:bg-foreground/90'
          : 'bg-card hover:bg-accent',
      )}
    >
      <span className="flex min-w-0 items-center gap-3.5">
        {/* Kanal ikonu: satırı taranabilir kılar, adresten türetilir. */}
        <LeadingIcon
          className={cn(
            'size-5 shrink-0',
            link.featured
              ? 'text-background'
              : 'text-muted-foreground group-hover:text-foreground',
          )}
        />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate font-medium">{link.label}</span>
          {link.note && (
            <span
              className={cn(
                'flex items-center gap-1.5 text-xs',
                link.featured ? 'text-background/70' : 'text-muted-foreground',
              )}
            >
              {/* "Canlı" işaret: yalnızca öne çıkan (başvuru) kartında,
                  "başvurular açık" mesajını nabız gibi vurgular. */}
              {link.featured && (
                <span aria-hidden className="relative flex size-1.5 shrink-0">
                  <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                  <span className="bg-primary relative inline-flex size-1.5 rounded-full" />
                </span>
              )}
              {link.note}
            </span>
          )}
        </span>
      </span>
      {/* Ok her satırda aynı (çapraz): burada iç/dış ayrımı yapmıyoruz, sayfadaki
          her bağlantı zaten ziyaretçiyi linktree'den bir yere götürüyor. */}
      <ArrowUpRight
        className={cn(
          'size-4 shrink-0 transition-all duration-200 group-hover:translate-x-0.5',
          !link.featured && 'text-muted-foreground group-hover:text-primary',
        )}
      />
    </a>
  );
}

export default function LinksPage() {
  return (
    /* Telefonda tam ekran: yatay padding yok, kartlar kenardan kenara. Yatay
       boşluk ve üst nefes payı yalnızca sm'den itibaren (orada liste `max-w-md`
       ile ortalanıyor). Alt padding, son satırı sabit kaydırma şeridinin
       yoğun kısmından kurtarır. */
    <main className="flex flex-1 flex-col items-center pb-24 sm:px-4 sm:pt-14">
      <div className="w-full max-w-md">
        {/* `gap-px`: kartlar arasındaki 1px boşluklardan zemin (tam siyah)
            sızar, ayraç çizgisi bu. Kartlar siyahın üstünde hafif yükselti. */}
        <div className="grid gap-px">
          <header className="bg-card relative overflow-hidden px-6 py-10 text-center sm:rounded">
            {/* Sitedeki hero'larla aynı teknik: CSS mask + bg-foreground →
                görsel metin rengini alır. Sayfa her zaman koyu olduğu için
                opaklık tek değer (`dark:` varyantı OS temasına bakardı, bu
                sayfa ise ona bakmıyor). */}
            <div
              aria-hidden
              className="bg-foreground pointer-events-none absolute inset-0 opacity-15"
              style={{
                maskImage: 'url(/images/landing-bg.png)',
                WebkitMaskImage: 'url(/images/landing-bg.png)',
                maskSize: 'cover',
                WebkitMaskSize: 'cover',
                maskPosition: 'center 20%',
                WebkitMaskPosition: 'center 20%',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
              }}
            />
            <div className="relative flex flex-col items-center">
              <h1 className="flex items-center justify-center">
                <Logo className="scale-110" />
                <span className="sr-only">{profile.title}</span>
              </h1>
              <span className="text-primary mt-6 font-mono text-xs tracking-widest lowercase">
                {'//'} bağlantılar
              </span>
              <p className="text-muted-foreground mt-3 text-balance text-sm">
                {profile.tagline}
              </p>
            </div>
          </header>

          {rows.map((row) => (
            <LinkRow key={`${row.link.label}-${row.link.url}`} {...row} />
          ))}
        </div>
      </div>

      {/* Alt kenarda hafif blur + karartma: içerik bu şeridin altında eriyerek
          sayfanın devam ettiğini, yani kaydırılabildiğini belli eder. Zemin
          siyah olduğu için altında içerik kalmadığında kendiliğinden görünmez
          olur — kısa ekranda gizlemek için ayrıca JS gerekmiyor. */}
      <div
        aria-hidden
        // Maske yalnızca en alttaki ~%15'i tam opak bırakır, kalanı uzun bir
        // rampayla söner: kısa/sert bir bant yerine yumuşak bir eriyiş.
        className="from-background pointer-events-none fixed inset-x-0 bottom-0 h-32 bg-linear-to-t to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_top,#000_15%,transparent)]"
      />
    </main>
  );
}
