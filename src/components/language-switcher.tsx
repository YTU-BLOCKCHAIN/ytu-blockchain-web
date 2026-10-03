'use client';

import { type Locale, useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * TR / EN geçişi.
 *
 * Bu düğmeler olmadan site iki dilde yazılıydı ama ziyaretçi dili
 * DEĞİŞTİREMİYORDU: dil yalnızca `Accept-Language` ile bir kez belirleniyordu,
 * yani tarayıcısı Türkçe olan biri İngilizce sürüme adres çubuğunu elle
 * düzenlemeden ulaşamıyordu.
 *
 * Aynı sayfada kalınıyor: `usePathname` dil önekinden arındırılmış yolu
 * veriyor (`/blog`), `router.replace` onu yeni dilde yeniden kuruyor.
 * `params` da geçiliyor çünkü dinamik segmentli yollarda (`/blog/[slug]`)
 * next-intl yolu yeniden kurarken segment değerlerine ihtiyaç duyuyor.
 *
 * **Blog yazıları özel bir durum:** TR ve EN sürümler ayrı Sanity dokümanları
 * ve slug'ları farklı, yani aynı slug öbür dilde 404 verir. Yazı sayfası bu
 * yüzden kendi karşılığını `translationPath` ile geçiyor (bkz.
 * `post-sections.tsx`); karşılığı yoksa blog listesine düşülüyor.
 */
export function LanguageSwitcher({
  className,
  translationPath,
}: {
  className?: string;
  /** Blog yazısı gibi, karşılığı başka bir yolda yaşayan sayfalar için. */
  translationPath?: string;
}) {
  const t = useTranslations('Nav');
  const active = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    if (locale === active) return;

    startTransition(() => {
      if (translationPath) {
        router.replace(translationPath, { locale });
        return;
      }

      /* Blog yazısı, karşılığı BİLİNMEDEN çevrilemez: TR ve EN sürümler ayrı
         dokümanlar ve slug'ları farklı, yani aynı slug'ı öbür dille kurmak
         doğrudan 404 demek. Header bu sayfanın verisini görmediği için güvenli
         tarafa düşüyoruz: ziyaretçi öbür dilin blog listesine iniyor. Yazının
         kendi karşılığına giden bağlantı sayfanın içinde (post-sections.tsx),
         orada slug gerçekten biliniyor. */
      if (/^\/blog\/.+/.test(pathname)) {
        router.replace('/blog', { locale });
        return;
      }

      // `params` olmadan dinamik segmentli yollar çözülemez.
      router.replace(
        // @ts-expect-error -- pathname dinamik segment taşıyabilir; değerler
        // `params` ile veriliyor, next-intl'in tipi bu ikiliyi birlikte
        // daraltamıyor.
        { pathname, params },
        { locale },
      );
    });
  }

  return (
    <div
      className={cn(
        'border-foreground/15 flex items-center rounded-full border p-0.5 text-xs',
        isPending && 'opacity-60',
        className,
      )}
      role="group"
      aria-label={t('languageLabel')}
    >
      {routing.locales.map((locale) => {
        const selected = locale === active;

        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            // Seçili dil `aria-current` ile duyuruluyor; düğmeler bir sayfa
            // listesi değil, bir durum göstergesi.
            aria-current={selected ? 'true' : undefined}
            aria-label={t('switchTo', { language: t(`language.${locale}`) })}
            onClick={() => switchTo(locale)}
            className={cn(
              'cursor-pointer rounded-full px-2.5 py-1 font-medium uppercase transition-colors',
              selected
                ? 'bg-foreground/10 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
