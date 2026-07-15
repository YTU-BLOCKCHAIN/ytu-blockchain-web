import { useTranslations } from 'next-intl';

const SOCIALS = [
  { label: 'Telegram', href: '#' },
  { label: 'GitHub', href: 'https://github.com/YTU-BLOCKCHAIN' },
  { label: 'Twitter / X', href: '#' },
] as const;

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-sm font-bold">YTÜ::BLOCKCHAIN</p>
          <p className="mt-1 max-w-sm text-sm text-foreground/60">
            {t('tagline')}
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm sm:items-end">
          <span className="font-mono text-xs tracking-widest text-foreground/40 uppercase">
            {t('communityHeading')}
          </span>
          <div className="flex gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-foreground/70 transition-colors hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                {social.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <div className="border-t border-black/5 py-4 text-center text-xs text-foreground/40 dark:border-white/5">
        {t('rights')}
      </div>
    </footer>
  );
}
