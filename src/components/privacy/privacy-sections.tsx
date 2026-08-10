import { useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { siteConfig } from '@/lib/site';

/** Metnin bölümleri — sıra sayfada göründüğü sıradır. */
const SECTIONS = [
  'controller',
  'data',
  'purpose',
  'legal',
  'transfer',
  'retention',
  'rights',
  'contact',
] as const;

/**
 * KVKK aydınlatma metni. İçerik `messages/*.json` içindeki `Privacy` alanından
 * gelir; formdaki onay kutusu buraya bağlanır.
 */
export function PrivacySection() {
  const t = useTranslations('Privacy');

  return (
    <section>
      <Container asGrid>
        {/* Dolgu `@max-4xl:` ile: bu hücreler `Container asGrid`'in DOĞRUDAN
            çocuğu, `*:p-[0.5px]` kuralını da alıyorlar ve düz `p-6` ona
            sıralamada yeniliyor → mobilde dolgu 1px'e düşüyordu. */}
        <div data-grid-content className="@4xl:p-12 @max-4xl:p-6">
          <span className="text-primary font-mono text-xs tracking-widest lowercase">
            {'//'} {t('eyebrow')}
          </span>
          <h1 className="text-foreground mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-balance text-lg">
            {t('subtitle')}
          </p>
          <p className="text-muted-foreground mt-6 font-mono text-xs">
            {t('updated')}
          </p>
        </div>

        <div data-grid-content className="@4xl:p-12 @max-4xl:p-6">
          <div className="max-w-2xl space-y-10">
            {SECTIONS.map((key) => (
              <div key={key}>
                <h2 className="text-foreground font-medium">
                  {t(`sections.${key}.heading`)}
                </h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {t(`sections.${key}.body`, {
                    email: siteConfig.contactEmail,
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
