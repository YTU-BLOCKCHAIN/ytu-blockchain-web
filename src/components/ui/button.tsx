import type { ComponentProps, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

type ButtonVariant = 'primary' | 'outline';
type ButtonSize = 'default' | 'sm';

/**
 * Site geneli buton stili. Link / <button> / <a> fark etmeksizin tek kaynak.
 * primary = yüksek kontrast dolu buton (bg-foreground / text-background) →
 * light'ta siyah, dark'ta beyaz (Tailark grid-2 header buton deseni); outline =
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
    'group inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    size === 'default' && 'px-6 py-3 text-sm',
    size === 'sm' && 'px-4 py-2 text-sm',
    variant === 'primary' &&
      'bg-foreground text-background shadow-sm hover:bg-foreground/90 active:bg-foreground/80',
    variant === 'outline' &&
      'border-border hover:bg-accent border bg-transparent hover:-translate-y-0.5 active:translate-y-0',
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
    <Link
      href={href}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {children}
      {withArrow && (
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}
