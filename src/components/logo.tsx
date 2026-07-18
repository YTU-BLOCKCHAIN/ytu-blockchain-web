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

function MaskPart({ src, className }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('bg-current shrink-0', className)}
      style={maskStyle(src)}
    />
  );
}

/** Kulüp logosu (Figma): dairesel amblem + "YTU BLOCKCHAIN" wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'text-foreground inline-flex items-center gap-2',
        className,
      )}
    >
      <MaskPart src="/logo/mark.svg" className="size-7" />
      <span className="inline-flex items-center gap-1.5">
        <MaskPart src="/logo/ytu.svg" className="h-4 w-[31px]" />
        <MaskPart src="/logo/blockchain.svg" className="h-4 w-[104px]" />
      </span>
    </span>
  );
}
