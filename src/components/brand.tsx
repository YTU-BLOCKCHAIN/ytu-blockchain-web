import type { ReactNode } from 'react';

import { Scramble } from '@/components/scramble';
import { cn } from '@/lib/utils';

/*
  Kulübün sosyal medya postlarındaki parçaların site karşılıkları
  (Drive: design/sosyal-medya/<set>/kaynak/). Ölçüler postlardan geliyor,
  renkler tema değişkenlerinden: aynı bileşen beyaz zeminde, `.surface-signal`
  ve `.surface-paper` üzerinde kendiliğinden doğru tona dönüyor.

  VHS alanlarına gelen metin ÇAĞIRAN TARAFTA büyük harfle yazılmış olmalı.
  `text-transform: uppercase` lang="tr" altında BLOCKCHAIN'i "BLOCKCHAİN"
  yapıyor (bkz. globals.css başlık notu).
*/

/**
 * Köşeli etiket. `solid`: dolu aksiyon tonu — mavide postlardaki beyaz sezon
 * chip'i, beyazda mavi chip,
 * `signal`: beyaz bant üzerindeki mavi chip, `outline`: sakin etiket.
 */
export function Chip({
  children,
  tone = 'solid',
  className,
  style,
}: {
  children: ReactNode;
  tone?: 'solid' | 'signal' | 'outline';
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={style}
      className={cn(
        'font-display inline-flex h-7 items-center px-2.5 text-sm leading-none whitespace-nowrap',
        tone === 'solid' && 'bg-action text-action-foreground',
        tone === 'signal' && 'bg-signal text-white',
        tone === 'outline' && 'border-foreground/40 text-foreground border',
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Bölüm başı: `//` önekli küçük etiket. Postlardaki "01 / BLOCKCHAIN 101"
 * satırının sitedeki karşılığı. Düz metinse ekrana girince terminal gibi
 * çözülüyor (`Scramble`); `//` sabit kalıyor.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'text-primary font-display block text-xs tracking-widest',
        className,
      )}
    >
      {typeof children === 'string' ? (
        <Scramble text={`// ${children}`} keep={3} />
      ) : (
        <>
          {'//'} {children}
        </>
      )}
    </span>
  );
}

/**
 * Kademeli VHS barları — afişlerdeki tarih / saat-yer yığını. Her satır
 * bir öncekinden sağa kayıyor (postlarda 68–78px, burada 2.5–4.5rem).
 * Barlar yüzeyin tersi: mavi zeminde beyaz, beyaz bantta mavi.
 */
export function Bars({
  lines,
  className,
}: {
  lines: ReactNode[];
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-start', className)}>
      {lines.map((line, i) => (
        <span
          key={i}
          style={{ marginLeft: `calc(${i} * var(--bars-step, 2.5rem))` }}
          className="bg-action text-action-foreground font-display px-3 pt-2 pb-1.5 leading-none whitespace-nowrap"
        >
          {line}
        </span>
      ))}
    </div>
  );
}

/**
 * Terminal penceresi — Pi Günü, Genesis ve Whitepaper postlarındaki kutu:
 * void başlık çubuğu (yol + "x"), beyaz gövde, signal VHS metin.
 */
export function Terminal({
  path,
  children,
  className,
}: {
  path: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('border border-[var(--brand-void)] bg-white', className)}
    >
      <div className="font-display flex items-center justify-between bg-[var(--brand-void)] px-4 py-2 text-xs text-white">
        <span>{path}</span>
        <span aria-hidden>x</span>
      </div>
      <div className="font-display px-5 py-4 text-base leading-snug text-[var(--brand-signal)] sm:text-lg">
        {children}
      </div>
    </div>
  );
}

/** Yanıp sönen imleç — terminal satırının sonu. */
export function Caret() {
  return (
    <span
      aria-hidden
      className="motion-safe:animate-caret ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] bg-current"
    />
  );
}

/**
 * Merdiven basamaklı ayraç (kit: `.rule-block`). Düz çizgi yerine; logonun
 * harf yapısındaki basamak mantığı.
 */
export function RuleBlock({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('flex h-8 items-end gap-1', className)}>
      {['h-2', 'h-4', 'h-8', 'h-4', 'h-2'].map((h, i) => (
        <i key={i} className={cn('bg-action block w-5', h)} />
      ))}
    </div>
  );
}

/**
 * Numaralı satır — carousel'lerdeki "01 / başlık / açıklama" listesi.
 * Numara yüzeyin tersi bir chip.
 */
export function NumItem({
  n,
  title,
  children,
  className,
}: {
  n: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start gap-4', className)}>
      <span className="bg-action text-action-foreground font-display flex h-7 min-w-11 shrink-0 items-center justify-center px-2 text-sm leading-none">
        {n}
      </span>
      <div className="space-y-1.5">
        <h3 className="text-foreground font-sans text-lg leading-tight font-semibold">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

/** Kit `.stat`: dev VHS rakam + küçük VHS etiket. */
export function Stat({
  value,
  label,
  className,
}: {
  value: ReactNode;
  label: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <b className="text-primary font-display block text-6xl leading-[0.9] font-normal tabular-nums sm:text-7xl">
        {value}
      </b>
      <span className="text-muted-foreground font-display mt-3 block text-xs tracking-widest">
        {label}
      </span>
    </div>
  );
}

/**
 * Dither'lı görsel (`public/images/dither/*`, `scripts/dither.py` üretir).
 * Dosya beyaz nokta + şeffaf zemin; burada MASKE olarak kullanılıyor ve
 * noktalar `currentColor` alıyor: mavi yüzeyde beyaz, beyaz zeminde
 * `text-primary` ile signal mavisi. Dekoratif, ekran okuyucudan gizli.
 */
export function Dither({
  name,
  width,
  height,
  className,
  style,
}: {
  name: 'evolution' | 'brain' | 'whale' | 'satoshi' | 'bulut' | 'octopus';
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const url = `url(/images/dither/${name}.png)`;
  return (
    <span
      aria-hidden
      className={cn('dither block bg-current', className)}
      style={{
        aspectRatio: `${width} / ${height}`,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        ...style,
      }}
    />
  );
}

/** Etiketlerin evolution.png'deki yerleri (`scripts/dither.py` notu). */
const EVOLUTION_TAGS = [
  { label: 'web1', x: 30.94, y: 25 },
  { label: 'web2', x: 54.94, y: 6.5 },
  { label: 'web3', x: 83.59, y: 0 },
];

/**
 * Tanışma afişinin evrim dizisi: web1 → web2 → web3 → boş blok. Etiketler
 * görselden silinip HTML'de yeniden çizildi; dither'da okunmuyorlardı.
 * Dördüncü kutunun oranı üçüncü figürün yüksekliğinden (%91) geliyor.
 */
export function Evolution({ you }: { you: string }) {
  return (
    <div
      aria-hidden
      className="intro-rise flex items-end gap-[3%] [--intro-delay:300ms]"
    >
      <div className="relative flex-1">
        <Dither name="evolution" width={1600} height={865} className="w-full" />
        {EVOLUTION_TAGS.map((tag, i) => (
          <Chip
            key={tag.label}
            className="intro-pop absolute h-5 -translate-x-1/2 -translate-y-1/2 px-1.5 text-[10px] sm:h-6 sm:text-xs"
            style={
              {
                left: `${tag.x}%`,
                top: `${tag.y}%`,
                '--intro-delay': `${700 + i * 140}ms`,
              } as React.CSSProperties
            }
          >
            {tag.label}
          </Chip>
        ))}
      </div>
      <div className="border-foreground/80 relative mb-[0.5%] flex aspect-[0.46] w-[18%] items-center justify-center border-2 border-dashed">
        <span className="font-display intro-blink text-4xl [--intro-delay:1.3s] sm:text-6xl">
          ?
        </span>
        <Chip className="intro-pop absolute top-0 left-1/2 h-5 -translate-x-1/2 -translate-y-1/2 px-1.5 text-[10px] [--intro-delay:1.1s] sm:h-6 sm:text-xs">
          {you}
        </Chip>
      </div>
    </div>
  );
}
