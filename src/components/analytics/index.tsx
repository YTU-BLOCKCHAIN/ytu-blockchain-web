import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { ConsentBanner } from '@/components/analytics/consent-banner';
import { consentDefaultScript, gaMeasurementId } from '@/lib/analytics';

/**
 * Ölçümün tek giriş noktası: Consent Mode varsayılanı + onay çubuğu (+ kabul
 * edilirse GA etiketi). Her kök layout'a ayrı ayrı ekleniyor, çünkü bu projede
 * ortak bir `app/layout.tsx` yok — `[locale]`, `links` ve `studio` üç ayrı kök.
 * `studio` bilerek dışarıda: orası ziyaretçi değil, editör arayüzü.
 *
 * Ölçüm kimliği tanımsızken hiçbir şey basılmaz; çubuk da çıkmaz. Ölçüm
 * yapılmayan bir sitede çerez onayı istemek anlamsız olurdu.
 */
export async function Analytics({ locale }: { locale: Locale }) {
  if (!gaMeasurementId) return null;

  const t = await getTranslations({ locale, namespace: 'Consent' });

  return (
    <>
      {/* gtag.js'ten önce koşması gereken blok. Kaynak sabit ve bizim;
          kullanıcı girdisi yok (aynı desen: layout'taki JSON-LD). */}
      <script
        id="consent-default"
        dangerouslySetInnerHTML={{ __html: consentDefaultScript }}
      />
      <ConsentBanner
        gaId={gaMeasurementId}
        // Dil öneki burada hazırlanıyor: çubuk `/links` kökünde de basılıyor ve
        // orada next-intl'in `Link`'i yok.
        privacyHref={`/${locale}/privacy`}
        labels={{
          title: t('title'),
          body: t('body'),
          accept: t('accept'),
          reject: t('reject'),
          privacy: t('privacy'),
        }}
      />
    </>
  );
}
