import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return buildMetadata({
    locale,
    pathname: '/',
    title: t('home.title'),
    description: t('home.description'),
    titleAbsolute: true,
  });
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Landing');
  const tNav = await getTranslations('Nav');

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:py-32">
      <span className="font-mono text-xs tracking-widest text-emerald-500 lowercase">
        {'//'} blockchain · defi · zk · open-source
      </span>
      <h1 className="max-w-3xl text-4xl leading-tight font-bold tracking-tight sm:text-6xl">
        {t('title')}
      </h1>
      <p className="max-w-2xl text-lg text-foreground/70">{t('subtitle')}</p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/community"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          {t('cta')}
        </Link>
        <Link
          href="/projects"
          className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground/5"
        >
          {tNav('projects')}
        </Link>
      </div>
    </section>
  );
}
