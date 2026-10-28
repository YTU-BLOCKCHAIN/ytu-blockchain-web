'use client';

import React from 'react';

/** "15+" → 15 ve "+"; sayı ile başlamayan değer olduğu gibi yazılır. */
function parse(value: number | string) {
  const match = /^(\d+)(.*)$/.exec(String(value));
  return match ? { n: Number(match[1]), suffix: match[2] ?? '' } : null;
}

const DURATION = 1200;

/**
 * Rakam bandındaki sayı: ekrana girince sıfırdan sayarak yerine oturuyor.
 *
 * Sunucu GERÇEK değeri basıyor; JS yoksa, hareket azaltma açıksa ya da sayı
 * sayfa açıldığında zaten görünürdeyse hiçbir şey değişmiyor. Yalnız ekran
 * dışındaki sayı hidrasyonda sıfırlanıp görünür olunca sayıyor (görünmeyen
 * bir öğenin sıfırlanması titreme yaratmıyor). Ekran okuyucu ara değerleri
 * değil, yalnız son değeri okuyor.
 */
export function CountUp({ value }: { value: number | string }) {
  const parsed = parse(value);
  const ref = React.useRef<HTMLSpanElement>(null);
  const [shown, setShown] = React.useState<number | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setShown(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION, 1);
          // easeOutCubic: başta hızlı, son rakamlarda yavaşlayıp oturuyor.
          setShown(Math.round(parsed.n * (1 - (1 - t) ** 3)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
    // `parsed` her render'da yeni nesne; değer değişmedikçe yeniden kurulmasın.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!parsed) return <>{value}</>;

  return (
    <span ref={ref}>
      <span aria-hidden>
        {shown ?? parsed.n}
        {parsed.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
