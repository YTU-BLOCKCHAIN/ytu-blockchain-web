import { ArrowUpRight } from 'lucide-react';
import type { ComponentProps, ComponentType } from 'react';

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
 * Arkadaki nokta dokusu etkinliklerdeki yer tutucu kapakla aynı dil.
 */
export function EmptyState({
  Icon,
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: {
  Icon: ComponentType<{ className?: string }>;
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
            className="@4xl:p-16 relative flex flex-col items-center overflow-hidden px-6 py-14 text-center"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-foreground)_1px,transparent_1px)] bg-[length:16px_16px] opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
            />
            <span className="bg-primary/10 text-primary ring-primary/20 relative flex size-14 items-center justify-center ring-1">
              <Icon className="size-6" />
            </span>
            <span className="text-primary font-display relative mt-6 text-xs tracking-widest uppercase">
              {'//'} {eyebrow}
            </span>
            <h2 className="text-foreground relative mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
            <p className="text-muted-foreground relative mt-4 max-w-md text-balance">
              {body}
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <ActionButton action={primary} variant="primary" />
              {secondary ? (
                <ActionButton action={secondary} variant="outline" />
              ) : null}
            </div>
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
