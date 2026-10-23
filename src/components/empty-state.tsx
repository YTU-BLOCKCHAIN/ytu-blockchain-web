import { ArrowUpRight } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Caret, Terminal } from '@/components/brand';

import { Container } from '@/components/container';
import { ButtonLink, buttonClasses } from '@/components/ui/button';

type Action =
  | { label: string; href: ComponentProps<typeof ButtonLink>['href'] }
  | { label: string; external: string };

/**
 * İçeriği henüz olmayan bir sayfanın gövdesi (blog, projeler).
 *
 * Tek satırlık gri bir mesaj "sayfa bozuk" gibi duruyordu. Bunun yerine ne
 * geleceğini söyleyen bir başlık ve ziyaretçiyi boşlukta bırakmayan iki çıkış:
 * içeriğin şu an bulunduğu yer (Medium, GitHub) ve kulübe katılma.
 *
 * Görünüm postlardaki terminal kutusu (Pi Günü, Genesis): koyu blokta
 * `$ ls <klasör>` ve yanıp sönen imleçle "yakında". `folder` terminalde
 * listelenen klasör adı, ör. "projeler/".
 */
export function EmptyState({
  folder,
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: {
  folder: string;
  eyebrow: string;
  title: string;
  body: string;
  primary: Action;
  secondary?: Action;
}) {
  return (
    <section>
      <Container asGrid>
        {/* Boş sarmalayıcı: `*:p-[0.5px]` yalnız doğrudan çocuğa iner
            (gerekçe: `blog-sections.tsx`). */}
        <div>
          <div
            data-grid-content
            className="surface-void @4xl:p-16 @2xl:grid-cols-[3fr_2fr] grid items-center gap-10 px-6 py-14"
          >
            <div>
              <span className="text-primary font-display text-xs tracking-widest">
                {'//'} {eyebrow}
              </span>
              <h2 className="mt-4 text-3xl leading-[1.12] text-balance sm:text-4xl">
                {title}
              </h2>
              <p className="text-muted-foreground mt-4 max-w-md text-balance">
                {body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ActionButton action={primary} variant="primary" />
                {secondary ? (
                  <ActionButton action={secondary} variant="outline" />
                ) : null}
              </div>
            </div>
            <Terminal path="~/ytu-blockchain" className="w-full">
              <p>$ ls {folder}</p>
              <p>
                {eyebrow}
                <Caret />
              </p>
            </Terminal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ActionButton({
  action,
  variant,
}: {
  action: Action;
  variant: 'primary' | 'outline';
}) {
  if ('external' in action) {
    return (
      <a
        href={action.external}
        target="_blank"
        rel="noreferrer noopener"
        className={buttonClasses({ variant })}
      >
        {action.label}
        <ArrowUpRight aria-hidden className="size-4" />
      </a>
    );
  }
  return (
    <ButtonLink href={action.href} variant={variant} withArrow>
      {action.label}
    </ButtonLink>
  );
}
