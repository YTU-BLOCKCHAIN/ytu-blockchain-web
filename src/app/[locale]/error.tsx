'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Link } from '@/i18n/navigation';

/**
 * Sayfa gövdesinde bir hata fırlarsa çizilen ekran.
 *
 * Bu dosya olmadan Next'in **biçimsiz öntanımlı hata sayfası** çıkıyordu:
 * header/footer yok, marka yok, dil yok. Sitedeki veri yollarının çoğu (blog,
 * yazı sayfaları, hackathon karuseli) Sanity'ye bağlı olduğu için bu yalnızca
 * teorik bir durum değil — sorgu çalışmazsa ziyaretçinin gördüğü ekran burası.
 *
 * `[locale]` segmentinde duruyor, yani layout'un İÇİNDE kalıyor: ziyaretçi
 * hata anında da header, footer ve kendi dilini görüyor. Kök layout'un kendisi
 * patlarsa devreye `app/global-error.tsx` giriyor.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');

  useEffect(() => {
    // Sunucudaki hata zaten Vercel loglarında; buradaki satır tarayıcıda olanı
    // konsola düşürüyor ki hata ayıklarken `digest` ile eşleştirilebilsin.
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-primary font-display text-6xl">500</span>
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="text-foreground/60">{t('description')}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="border-foreground/20 hover:bg-foreground/5 cursor-pointer rounded-full border px-5 py-2 text-sm transition-colors"
        >
          {t('retry')}
        </button>
        <Link
          href="/"
          className="text-foreground/60 hover:text-foreground px-2 py-2 text-sm transition-colors"
        >
          {t('back')}
        </Link>
      </div>
    </section>
  );
}
