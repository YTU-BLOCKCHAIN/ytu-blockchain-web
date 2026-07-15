import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="font-mono text-6xl font-bold text-emerald-500">404</span>
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="text-foreground/60">{t('description')}</p>
      <Link
        href="/"
        className="mt-2 rounded-full border border-foreground/20 px-5 py-2 text-sm transition-colors hover:bg-foreground/5"
      >
        {t('back')}
      </Link>
    </section>
  );
}
