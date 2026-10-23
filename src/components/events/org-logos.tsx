'use client';

import { ArrowUpRight } from 'lucide-react';
import { HoverCard } from 'radix-ui';
import type { ReactNode } from 'react';

import type { EventOrg } from '@/lib/events';
import { cn } from '@/lib/utils';

/** Logo dairesi — beyaz zemin, koyu ve şeffaf logolar iki temada da okunsun. */
export function OrgMark({
  org,
  className,
}: {
  org: EventOrg;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'ring-foreground/10 inline-flex shrink-0 items-center justify-center overflow-hidden bg-white ring-1',
        className,
      )}
    >
      {/* Küçük, önceden boyutlanmış CDN görseli; `next/image`in iş yükü gereksiz. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={org.logoUrl} alt="" className="size-full object-contain" />
    </span>
  );
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Bir kurumun logosu ve üzerine gelince açılan bilgi kutusu: ad, tek cümlelik
 * açıklama, site bağlantısı.
 *
 * Tetikleyici kendisi de bağlantı: dokunmatik ekranda hover olmadığı için
 * dokunmak doğrudan kurumun sitesine götürür. `relative z-10` kartın tamamını
 * kaplayan tıklama katmanının üstüne çıkarıyor (bkz. `EventCard`).
 */
export function OrgHover({
  org,
  children,
}: {
  org: EventOrg;
  children: ReactNode;
}) {
  const trigger = org.url ? (
    <a
      href={org.url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={org.name}
      className="relative z-10 inline-flex"
    >
      {children}
    </a>
  ) : (
    <span
      tabIndex={0}
      aria-label={org.name}
      className="relative z-10 inline-flex"
    >
      {children}
    </span>
  );

  return (
    <HoverCard.Root openDelay={150} closeDelay={100}>
      <HoverCard.Trigger asChild>{trigger}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="top"
          sideOffset={8}
          collisionPadding={16}
          className="bg-background text-foreground ring-foreground/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50 w-64 p-4 ring-1"
        >
          <div className="flex items-center gap-3">
            <OrgMark org={org} className="size-10" />
            <p className="font-semibold leading-tight">{org.name}</p>
          </div>
          {org.description ? (
            <p className="text-muted-foreground mt-3 text-sm leading-snug">
              {org.description}
            </p>
          ) : null}
          {org.url ? (
            <a
              href={org.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary mt-3 inline-flex items-center gap-1 text-sm hover:underline"
            >
              {hostname(org.url)}
              <ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          ) : null}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

/**
 * Kartın altındaki logo şeridi. Kart dar; `max` kadar logo, fazlası "+N".
 */
export function OrgLogos({
  orgs,
  max = 5,
}: {
  orgs: EventOrg[];
  max?: number;
}) {
  if (orgs.length === 0) return null;
  const shown = orgs.slice(0, max);
  const rest = orgs.length - shown.length;

  return (
    <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
      {shown.map((org) => (
        <OrgHover key={org.id} org={org}>
          <OrgMark org={org} className="size-6" />
        </OrgHover>
      ))}
      {rest > 0 ? (
        <span className="text-muted-foreground text-xs">+{rest}</span>
      ) : null}
    </div>
  );
}

/**
 * Etkinlik sayfasındaki ad + logo etiketi. Logosu olmayan kurum düz metin
 * (varsa bağlantı) olarak kalıyor.
 */
export function OrgChip({ org }: { org: EventOrg }) {
  return (
    <OrgHover org={org}>
      <span className="bg-foreground/5 hover:bg-foreground/10 inline-flex items-center gap-1.5 py-0.5 pl-0.5 pr-2.5 text-sm duration-150">
        <OrgMark org={org} className="size-5" />
        {org.name}
      </span>
    </OrgHover>
  );
}
