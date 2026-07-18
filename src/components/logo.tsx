import { cn } from '@/lib/utils';

/**
 * Geçici metin wordmark. Gerçek logo Figma'dan gelince bu bileşen güncellenecek.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-mono text-sm font-bold tracking-tight whitespace-nowrap',
        className,
      )}
    >
      YTÜ<span className="text-primary">::</span>BLOCKCHAIN
    </span>
  );
}
