import { useTranslations } from 'next-intl';

type ComingSoonProps = {
  title: string;
};

export default function ComingSoon({ title }: ComingSoonProps) {
  const t = useTranslations('Common');

  return (
    <section className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <span className="font-mono text-xs tracking-widest text-emerald-500 uppercase">
        {'//'} {t('comingSoon')}
      </span>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-md text-foreground/60">{t('comingSoonBody')}</p>
    </section>
  );
}
