import type { ComponentProps, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SiteLink } from '@/components/site-link';
import type { Link } from '@/i18n/navigation';

type ButtonVariant = 'primary' | 'outline';
type ButtonSize = 'default' | 'sm';

/**
 * Site geneli buton stili. Link / <button> / <a> fark etmeksizin tek kaynak.
 * primary = dolu aksiyon (`--color-action`): void üzerinde signal mavisi,
 * `.surface-signal` içinde beyaz — postlardaki kayıt barı. outline = beyaz
 * kenarlıklı ikincil. Focus halkası ve zemin tema token'larından beslenir.
 */
export function buttonClasses({
  variant = 'primary',
  size = 'default',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    'group inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-200 focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    // Hover'da yarım adım yukarı kalkma her iki varyantta ortak: renk
    // değişimi varyanta özel (primary koyulaşır, outline zemin kazanır) ama
    // "kalkma" jesti site genelinde tek ve aynı. İstisnası olan çağıran
    // (ör. hackathon okları) `hover:translate-y-0` ile kapatır.
    'hover:-translate-y-0.5 active:translate-y-0',
    size === 'default' && 'px-6 py-3 text-sm',
    size === 'sm' && 'px-4 py-2 text-sm',
    variant === 'primary' &&
      'bg-action text-action-foreground hover:bg-action/90 active:bg-action/80',
    variant === 'outline' &&
      'border-foreground/40 hover:border-foreground hover:bg-foreground/10 border bg-transparent',
    className,
  );
}

/** i18n Link'i buton olarak çizer; opsiyonel ok ikonu hover'da hafif kayar. */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'default',
  withArrow = false,
  className,
  ...props
}: {
  href: ComponentProps<typeof Link>['href'];
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  return (
    <SiteLink
      href={href}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {children}
      {withArrow && (
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </SiteLink>
  );
}
