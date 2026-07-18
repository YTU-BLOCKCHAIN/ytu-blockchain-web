import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

/**
 * Tek renk (vektör) logo parçalarını CSS `mask` ile çizer; `bg-current` ile
 * boyandığı için logo metin rengini miras alır → light/dark temada otomatik
 * uyum sağlar (ayrı varyant veya JS geçişi gerekmez, flash olmaz).
 */
function maskStyle(src: string): CSSProperties {
  return {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  };
}

/** Kulüp logosu (Figma): dairesel amblem + "YTU" wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'text-foreground inline-flex items-center gap-2',
        className,
      )}
    >
      <span
        aria-hidden
        className="bg-current size-7 shrink-0"
        style={maskStyle('/logo/mark.svg')}
      />
      <span
        aria-hidden
        className="bg-current h-5 w-[38px] shrink-0"
        style={maskStyle('/logo/wordmark.svg')}
      />
    </span>
  );
}
