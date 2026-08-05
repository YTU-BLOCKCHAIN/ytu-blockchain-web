import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
// Bilerek `next/link`: bu sayfa next-intl sağlayıcısının dışında, dolayısıyla
// `@/i18n/navigation` Link'i (dil ön eki ekler) burada yanlış olur. `/` isteğini
// proxy tarayıcı diline göre /tr veya /en'e yönlendirir.
import Link from 'next/link';

import {
  GithubIcon,
  InstagramIcon,
  XIcon,
} from '@/components/community/brand-icons';
import { Logo } from '@/components/logo';
import { linksContent } from '@/lib/links';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

const { profile, links } = linksContent;

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

/** İkon şeridi. Adresler `siteConfig.social`'den — sitenin geri kalanıyla tek kaynak. */
const socials = [
  {
    label: 'Instagram',
    href: siteConfig.social.instagram,
    Icon: InstagramIcon,
  },
  { label: 'X', href: siteConfig.social.x, Icon: XIcon },
  { label: 'GitHub', href: siteConfig.social.github, Icon: GithubIcon },
];

export default function LinksPage() {
  return (
    /* Zemin tonu sitenin <main>'iyle aynı (`bg-foreground/10`): hücreler arası
       1px boşluklardan sızarak grid çerçevesini oluşturur. */
    <main className="bg-foreground/10 flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-md">
        {/* Sitenin Container asGrid deseninin linktree genişliğindeki karşılığı:
            bg-border zemin + gap-px → paneller arasında hairline çizgiler. */}
        <div className="bg-border grid gap-px rounded p-px">
          <header className="bg-card relative overflow-hidden rounded px-6 py-10 text-center">
            {/* Sitedeki hero'larla aynı teknik: CSS mask + bg-foreground →
                görsel metin rengini alır, her iki temada da aynı silik doku. */}
            <div
              aria-hidden
              className="bg-foreground pointer-events-none absolute inset-0 opacity-25 dark:opacity-15"
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

          {links.map((link) => {
            const Arrow = link.external ? ArrowUpRight : ArrowRight;

            return (
              <a
                key={`${link.label}-${link.url}`}
                href={link.url}
                {...(link.external
                  ? { target: '_blank', rel: 'noreferrer noopener' }
                  : {})}
                className={cn(
                  'group focus-visible:ring-ring flex min-h-14 items-center justify-between gap-4 rounded px-5 py-4 transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  link.featured
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'bg-card hover:bg-accent',
                )}
              >
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">{link.label}</span>
                  {link.note && (
                    <span
                      className={cn(
                        'text-xs',
                        link.featured
                          ? 'text-background/70'
                          : 'text-muted-foreground',
                      )}
                    >
                      {link.note}
                    </span>
                  )}
                </span>
                <Arrow
                  className={cn(
                    'size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5',
                    !link.featured && 'text-muted-foreground',
                  )}
                />
              </a>
            );
          })}

          {/* Sosyal hesaplar da çerçevenin bir hücresi — kanal kartlarıyla aynı dil. */}
          <div className="bg-card flex items-center justify-center gap-2 rounded px-5 py-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
                className="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring flex size-11 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <social.Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <footer className="mt-8 text-center">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-widest lowercase transition-colors"
          >
            ytublockchain.com
          </Link>
        </footer>
      </div>
    </main>
  );
}
