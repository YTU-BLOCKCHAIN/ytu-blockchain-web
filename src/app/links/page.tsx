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
import { buttonClasses } from '@/components/ui/button';
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
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-12 sm:py-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="flex items-center justify-center">
          <Logo className="scale-110" />
          <span className="sr-only">{profile.title}</span>
        </h1>
        <p className="text-muted-foreground mt-6 text-balance text-sm">
          {profile.tagline}
        </p>
      </div>

      <nav aria-label={profile.title} className="mt-10 flex flex-col gap-3">
        {links.map((link) => {
          const Arrow = link.external ? ArrowUpRight : ArrowRight;

          return (
            <a
              key={`${link.label}-${link.url}`}
              href={link.url}
              {...(link.external
                ? { target: '_blank', rel: 'noreferrer noopener' }
                : {})}
              className={buttonClasses({
                variant: link.featured ? 'primary' : 'outline',
                className:
                  'min-h-14 w-full justify-between gap-4 px-5 py-3 text-left whitespace-normal',
              })}
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-base font-medium">{link.label}</span>
                {link.note && (
                  <span
                    className={cn(
                      'text-xs font-normal',
                      link.featured
                        ? 'text-background/70'
                        : 'text-muted-foreground',
                    )}
                  >
                    {link.note}
                  </span>
                )}
              </span>
              <Arrow className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          );
        })}
      </nav>

      <div className="mt-10 flex items-center justify-center gap-3">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={social.label}
            className="border-border hover:bg-accent text-foreground flex size-11 items-center justify-center rounded-full border transition-colors"
          >
            <social.Icon className="size-5" />
          </a>
        ))}
      </div>

      <footer className="mt-auto pt-14 text-center">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-widest lowercase transition-colors"
        >
          ytublockchain.com
        </Link>
      </footer>
    </main>
  );
}
