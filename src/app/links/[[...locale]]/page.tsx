import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import {
  ArrowUpRight,
  BookText,
  CalendarClock,
  FolderGit2,
  Globe,
  Mail,
  Network,
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
import { routing } from '@/i18n/routing';
import { type LinkItem, linksContentFor } from '@/lib/links';
import { linksPath, resolveLinksLocale } from '@/lib/routes';
import { ogLocales, siteConfig, xHandle } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Her dilin kanonik adresi (`/links/tr`, `/links/en`) ve dil öneksiz `/links`
 * build'de üretiliyor — Instagram biyografisinden açılan bir sayfanın isteği
 * beklemesi için sebep yok.
 *
 * `/links` normalde proxy tarafından yukarıdakilerden birine rewrite ediliyor;
 * yine de üretiliyor, çünkü rewrite çalışmazsa biyografideki adres 404
 * vermemeli (bkz. `resolveLinksLocale`).
 */
export function generateStaticParams(): { locale: string[] }[] {
  return [
    // Dil öneksiz adres (`/links`): boş segment listesi.
    { locale: [] },
    ...routing.locales.map((locale) => ({ locale: [locale] })),
  ];
}

/**
 * Yukarıdakilerin dışında kalan her şey (`/links/de`, `/links/en/x`) 404.
 * Böylece sayfa isteğe göre üretilen bir rota olmaktan çıkıyor.
 */
export const dynamicParams = false;

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
 *
 * Eşleşme `url` (içerik dosyasındaki dil öneksiz hâli) ile yapılıyor, `href`
 * ile değil: önek eklendikten sonra da çalışırdı ama ikon seçimi dilin
 * bilinmesini gerektirmeyen bir karar, o yüzden ham adresle kalıyor.
 */
function iconForLink(link: LinkItem): RowIconSpec {
  const url = link.url.toLowerCase();

  /* Departman seçim formu da Google Forms'ta, adresi başvuru formundan
     ayırt edilemiyor; bu yüzden etiketten tanınıyor ve ekip yapısını anlatan
     kendi ikonunu alıyor.

     Gövde bilerek kısa (`departm`): etiket artık dile göre değişiyor
     ("Departmanını Seç" / "Choose Your Department") ve bu iki kelimenin ortak
     kökü bu. Tam kelimeyle eşleştirilse ikon yalnızca bir dilde çıkardı. */
  if (link.label.toLocaleLowerCase('tr').includes('departm'))
    return { Icon: Network, tone: 'text-primary' };

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
  // `/brand` ve `/roadmap` Notion'a yönlenir (bkz. next.config.ts): satır içeride
  // görünür ama hedef dışarıda, o yüzden ikonları burada eşleşiyor.
  if (url.includes('/brand')) return { Icon: Palette, tone: 'text-pink-400' };
  if (url.includes('/roadmap'))
    return { Icon: MapFilledIcon, tone: 'text-amber-400' };
  // "Web Sitemiz" (`/`) ve tanımsız iç sayfalar
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
 *
 * Çevrilecek bir yanı yok (hesap adları ve kullanıcı adları her dilde aynı),
 * bu yüzden iki dilde de bu liste kullanılıyor.
 */
const socialLinks: LinkItem[] = [
  { label: 'Instagram', url: siteConfig.social.instagram },
  { label: 'X', url: siteConfig.social.x },
  { label: 'GitHub', url: siteConfig.social.github },
].map(({ label, url }) => ({
  label,
  url,
  href: url,
  note: handleFromUrl(url),
  featured: false,
  external: true,
}));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string[] }>;
}): Promise<Metadata> {
  const locale = resolveLinksLocale((await params).locale);
  if (!locale) notFound();

  const t = await getTranslations({ locale, namespace: 'Links' });
  const { profile } = linksContentFor(locale);
  const title = `${profile.title} · ${t('titleSuffix')}`;
  /* Kanonik adres her zaman dilin kendi adresi (`/links/en`), ziyaretçinin
     girdiği adres (`/links`) değil: `/links` tarayıcı diline göre iki farklı
     sayfa sunan bir kapı, kanonik olamaz. */
  const pathname = linksPath(locale);

  /* hreflang: iki adres birbirini işaret ediyor, böylece arama motoru ikisini
     kopya değil çeviri olarak görür ve ziyaretçiye dilini sunar. `x-default`
     sitenin geri kalanıyla aynı mantıkta (`buildMetadata`): dil tercihi
     eşleşmeyen ziyaretçi öntanımlı dile (EN) düşer. */
  const languages: Record<string, string> = {};
  for (const candidate of routing.locales) {
    languages[candidate] = linksPath(candidate);
  }
  languages['x-default'] = linksPath(routing.defaultLocale);

  /* Kart görselini bir üst segmentteki `opengraph-image.tsx` üretiyor (orada
     neden orada olduğu yazılı); adresi `buildMetadata`daki ile aynı gerekçeyle
     buradan açıkça veriyoruz. İki dil de aynı görseli kullanıyor, değişen
     yalnızca alt metni. */
  const ogImages = [
    {
      url: '/links/opengraph-image',
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} — ${t('titleSuffix')}`,
    },
  ];

  return {
    metadataBase: new URL(siteConfig.url),
    title: { absolute: title },
    description: profile.tagline,
    alternates: { canonical: pathname, languages },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: ogLocales[locale],
      title,
      description: profile.tagline,
      url: pathname,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      site: xHandle,
      title,
      description: profile.tagline,
      images: ogImages,
    },
  };
}

/** Listenin tek satırı — içerik bağlantıları ve sosyal hesaplar aynı kart. */
function LinkRow({
  link,
  LeadingIcon,
  tone,
}: {
  link: LinkItem;
  LeadingIcon: RowIcon;
  tone: string;
}) {
  return (
    <a
      href={link.href}
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

/**
 * TR / EN geçişi — sayfanın kendi sürümü.
 *
 * Header'daki `LanguageSwitcher` burada kullanılamıyor: o bileşen next-intl'in
 * `useRouter`/`usePathname`ine dayanıyor, bu sayfa ise o ağacın (ve
 * proxy'nin) dışında. Düz `<a>` zaten doğru araç — iki adres iki ayrı kök
 * layout, aralarındaki geçiş her hâlükârda tam sayfa yüklemesi.
 *
 * Adresler dilin **kanonik** adresi (`/links/tr`, `/links/en`), kapı (`/links`)
 * değil: kapı tarayıcı diline bakıyor, yani İngilizce bir tarayıcıda "TR"
 * düğmesi `/links`e gitseydi ziyaretçiyi yine İngilizceye döndürürdü. Açık
 * adres bu yüzden tarayıcı tercihini ezebilen tek şey.
 *
 * Düğme yazıları ve erişilebilirlik etiketleri `Nav` mesajlarından geliyor,
 * yani site genelindeki geçişle aynı kelimeler.
 */
async function LinksLanguageSwitcher({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Nav' });

  return (
    <div
      className="border-foreground/15 mt-6 flex items-center rounded-full border p-0.5 text-xs"
      role="group"
      aria-label={t('languageLabel')}
    >
      {routing.locales.map((candidate) => {
        const selected = candidate === locale;

        return (
          <a
            key={candidate}
            href={linksPath(candidate)}
            lang={candidate}
            hrefLang={candidate}
            // Bunlar gerçek adresler (düğme değil), o yüzden açık olan sayfa
            // `aria-current="page"` ile duyuruluyor.
            aria-current={selected ? 'page' : undefined}
            aria-label={t('switchTo', { language: t(`language.${candidate}`) })}
            className={cn(
              'rounded-full px-2.5 py-1 font-medium uppercase transition-colors',
              selected
                ? 'bg-foreground/10 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {candidate}
          </a>
        );
      })}
    </div>
  );
}

export default async function LinksPage({
  params,
}: {
  params: Promise<{ locale?: string[] }>;
}) {
  const locale = resolveLinksLocale((await params).locale);
  if (!locale) notFound();

  const t = await getTranslations({ locale, namespace: 'Links' });
  const { profile, links } = linksContentFor(locale);

  /**
   * Sosyal hesaplar "Projelerimiz" (`/projects`) satırının hemen üstüne girer
   * (yani "Web Sitemiz" ve WhatsApp topluluğunun altına); o satır içerik
   * dosyasından kaldırılırsa listenin sonuna düşer.
   */
  const projectsAt = links.findIndex((link) => link.url === '/projects');
  const socialsAt = projectsAt === -1 ? links.length : projectsAt;

  /** Ekranda görünen satırlar: içerik bağlantıları, araya sosyal hesaplar. */
  const rows = [
    ...links.slice(0, socialsAt),
    ...socialLinks,
    ...links.slice(socialsAt),
  ].map((link) => {
    const { Icon, tone } = iconForLink(link);
    return { link, LeadingIcon: Icon, tone };
  });

  return (
    /* Telefonda tam ekran: yatay padding yok, kartlar kenardan kenara. Yatay
       boşluk ve üst nefes payı yalnızca sm'den itibaren (orada liste `max-w-md`
       ile ortalanıyor). Alt padding, son satırı sabit kaydırma şeridinin
       yoğun kısmından kurtarır. md'den itibaren içerik dikeyde de ortalanır:
       geniş ekranda sayfa tek karttan ibaret, tepeye yapışınca altı boş bir
       kuyu gibi kalıyordu. (İçerik taşarsa main zaten içerikle uzar,
       justify-center etkisiz kalır — kırpma riski yok.) */
    <main className="flex flex-1 flex-col items-center pb-24 sm:px-4 sm:pt-14 md:justify-center md:py-16">
      <div className="w-full max-w-md md:max-w-4xl">
        {/* `gap-px`: kartlar arasındaki 1px boşluklardan zemin (tam siyah)
            sızar, ayraç çizgisi bu. Kartlar siyahın üstünde hafif yükselti.

            md'den itibaren iki panel: solda profil (header), sağda bağlantı
            listesi. Telefondaki dar sütun geniş ekranda siyah boşlukta ince
            bir şerit gibi kaybolmasın diye. Aradaki 1px boşluk da satır
            araları ile aynı ayraç dili. */}
        <div className="grid gap-px md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
          {/* md'de header sol kolonun tamamını kaplar (grid stretch) ve içerik
              dikeyde ortalanır; mask zaten absolute, flex'ten etkilenmez. */}
          <header className="bg-card relative overflow-hidden px-6 py-10 text-center sm:rounded md:flex md:flex-col md:justify-center md:px-10 md:py-16">
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
                <Logo className="scale-110 md:scale-125" />
                <span className="sr-only">{profile.title}</span>
              </h1>
              <span className="text-primary mt-6 font-display text-xs tracking-widest uppercase">
                {'//'} {t('kicker')}
              </span>
              <p className="text-muted-foreground mt-3 text-balance text-sm md:text-base">
                {profile.tagline}
              </p>
              {/* Dil geçişi profilin altında: tarayıcı dili doğru tahmini
                  vermediğinde (ortak bilgisayar, İngilizce kurulmuş telefon)
                  ziyaretçinin ilk ekranda görebileceği bir düzeltme olmalı.
                  Listenin altında kalsa kaydırmadan görünmezdi. */}
              <LinksLanguageSwitcher locale={locale} />
            </div>
          </header>

          {/* İç grid de `gap-px`: telefonda dıştaki ile aynı ayraçlar, yani
              görünüm eskisiyle birebir. md'de sağ kolon soldan kısaysa
              satırlar stretch ile eşit büyüyüp paneli doldurur. */}
          <div className="grid gap-px">
            {rows.map((row) => (
              <LinkRow key={`${row.link.label}-${row.link.href}`} {...row} />
            ))}
          </div>
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
