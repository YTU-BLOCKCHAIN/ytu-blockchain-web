import { useLocale, useTranslations } from 'next-intl';

import { Container } from '@/components/container';
import { getMembers } from '@/lib/content';
import { localize } from '@/lib/localized';

/** Ada Yıldız → "AY" gibi baş harfler (foto yoksa monogram olarak kullanılır). */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TeamSection() {
  const t = useTranslations('About.team');
  const locale = useLocale();
  const members = getMembers();

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="@3xl:grid-cols-3 col-span-full grid grid-cols-2 gap-px sm:col-span-8">
            <div data-grid-content className="@4xl:p-12 col-span-full p-6">
              <h2 className="text-muted-foreground text-balance">
                {t('heading')}
              </h2>
              <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                {t('intro')}
              </p>
            </div>

            {members.map((member) => (
              <div
                key={member.slug}
                data-grid-content
                className="@4xl:p-12 p-6"
              >
                <div className="before:border-foreground/6.5 relative flex aspect-5/6 w-24 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-indigo-400/30 via-sky-400/20 to-emerald-400/30 shadow-md shadow-black/3 before:absolute before:inset-0 before:rounded-2xl before:border">
                  <span className="text-foreground/80 font-mono text-2xl font-semibold">
                    {initials(member.name)}
                  </span>
                </div>
                <div className="space-y-0.5 pt-3">
                  <p className="text-foreground font-medium">{member.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {localize(member.role, locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
