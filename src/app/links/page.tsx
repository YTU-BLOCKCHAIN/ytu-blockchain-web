import type { Metadata } from 'next';
import {
  ArrowUpRight,
  BookText,
  CalendarClock,
  FolderGit2,
  Globe,
  Mail,
  Palette,
  Podcast,
  UserPlus,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

import {
  GithubIcon,
  InstagramIcon,
  WhatsappIcon,
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
 * Dolu harita ikonu (Heroicons 24/solid "map", MIT). Yol haritası satırı için;
 * lucide'ın çizgi ikonları arasında dolu olarak öne çıksın diye.
 */
function MapFilledIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z"
      />
    </svg>
  );
}

/**
 * Satırın ikonu ve rengi. Marka kanalları markanın kendi rengini taşır;
 * siyah/beyaz markalar (X, GitHub) koyu zeminde beyaz kalır. Sayfa
 * hep koyu olduğu için tonlar tek değer.
 */
type RowIconSpec = { Icon: RowIcon; tone: string };

/**
 * Her bağlantıya kanalını anlatan bir ikon. Eşleşme adresten türetilir; içerik
 * dosyasına ekstra bir alan gerekmez. Bilinmeyen adres nötr `Globe`'a düşer.
 */
function iconForLink(link: LinkItem): RowIconSpec {
  const url = link.url.toLowerCase();

  if (link.external) {
    if (url.includes('cal.com'))
      return { Icon: CalendarClock, tone: 'text-violet-400' };
    // Başvuru formu dışarıda (Google Forms) barınıyor ama satır hâlâ bir
    // başvuru satırı: ikon `/join` sayfasınınkiyle aynı kalsın.
    if (url.includes('forms.gle') || url.includes('docs.google.com/forms'))
      return { Icon: UserPlus, tone: 'text-primary' };
    if (url.includes('notion.site'))
      return { Icon: MapFilledIcon, tone: 'text-amber-400' };
    if (url.includes('medium.com'))
      return { Icon: BookText, tone: 'text-emerald-400' };
    if (url.includes('spotify.com'))
      return { Icon: Podcast, tone: 'text-[#1DB954]' };
    if (url.includes('instagram.com'))
      return { Icon: InstagramIcon, tone: 'text-[#E4405F]' };
    if (url.includes('whatsapp.com'))
      return { Icon: WhatsappIcon, tone: 'text-[#25D366]' };
    // `//x.com` (yalnız "x.com" değil): adres hep `https://` ile başladığı için
    // bu kalıp host'u yakalar, içinde "x.com" geçen başka adreslere uymaz.
    if (url.includes('//x.com') || url.includes('twitter.com'))
      return { Icon: XIcon, tone: 'text-foreground' };
    if (url.includes('github.com'))
      return { Icon: GithubIcon, tone: 'text-foreground' };
    return { Icon: Globe, tone: 'text-sky-400' };
  }

  if (url.includes('/join')) return { Icon: UserPlus, tone: 'text-primary' };
  if (url.includes('/projects'))
    return { Icon: FolderGit2, tone: 'text-orange-400' };
  if (url.includes('/contact')) return { Icon: Mail, tone: 'text-rose-400' };
  // `/brand` Notion'daki marka kılavuzuna yönlenir (bkz. next.config.ts)
  if (url.includes('/brand')) return { Icon: Palette, tone: 'text-pink-400' };
  // "Web Sitemiz" (/tr) ve tanımsız iç sayfalar
  return { Icon: Globe, tone: 'text-sky-400' };
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
 * Sosyal hesaplar "Projelerimiz" (`/tr/projects`) satırının hemen üstüne girer
 * (yani "Web Sitemiz" ve WhatsApp topluluğunun altına); o satır içerik
 * dosyasından kaldırılırsa listenin sonuna düşer.
 */
const projectsAt = links.findIndex((link) => link.url === '/tr/projects');
const socialsAt = projectsAt === -1 ? links.length : projectsAt;

/**
 * Ekranda görünen satırlar: içerik bağlantıları, araya sosyal hesaplar.
 * İkon eşleşmesi adresten türetildiği ve iki liste de sabit olduğu için render
 * sırasında değil, modül yüklenirken bir kez hesaplanıyor.
 */
const rows: { link: LinkItem; LeadingIcon: RowIcon; tone: string }[] = [
  ...links.slice(0, socialsAt),
  ...socialLinks,
  ...links.slice(socialsAt),
].map((link) => {
  const { Icon, tone } = iconForLink(link);
  return { link, LeadingIcon: Icon, tone };
});

/** Listenin tek satırı — içerik bağlantıları ve sosyal hesaplar aynı kart. */
function LinkRow({ link, LeadingIcon, tone }: (typeof rows)[number]) {
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
        {/* Kanal ikonu: satırı taranabilir kılar, adresten türetilir. Renk
            kanalın kendisi; öne çıkan (ters renkli) kartta zemine uyar. */}
        <LeadingIcon
          className={cn(
            'size-5 shrink-0',
            link.featured ? 'text-background' : tone,
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
