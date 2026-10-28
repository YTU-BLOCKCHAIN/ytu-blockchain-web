'use client';

import React from 'react';

const GLYPHS = '0123456789ABCDEF#/<>_*';
const DURATION = 700;
/** Yeni kare aralığı. Her rAF'ta değil: terminal gibi kesik kesik aksın. */
const STEP = 45;

/**
 * Terminal "decode" efekti — metin ekrana girince rastgele karakterlerden
 * soldan sağa çözülerek yerine oturuyor. Eyebrow'larda (`// BAŞLIK`) kullanılıyor.
 *
 * Sunucu GERÇEK metni basıyor ve o metin hep yerinde kalıyor (saydam): yerleşimi
 * o belirliyor, ekran okuyucu onu okuyor. Karışık metin üstüne mutlak
 * konumlu, ekran okuyucudan gizli bir katman olarak çiziliyor. VHS yüzü eş
 * genişlikli değil ("I" "W"nin yarısı), karışık metin doğrudan yazılsaydı
 * satır her karede genişleyip daralırdı.
 *
 * Hareket azaltma açıksa hiç çalışmıyor; her metin bir kez çözülüyor.
 *
 * `keep`: baştaki bu kadar karakter hiç karışmıyor (Eyebrow'un `// ` öneki).
 * Önek ayrı yazılmıyor, metinle aynı kutuda: kutu `inline-block` ve dar
 * ekranda uzun etiket satıra sığmayınca önekten koparak alt satıra düşüyordu.
 */
export function Scramble({ text, keep = 0 }: { text: string; keep?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [out, setOut] = React.useState<string | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        let last = 0;
        const tick = (now: number) => {
          const t = (now - start) / DURATION;
          if (t >= 1) {
            setOut(null);
            return;
          }
          if (now - last >= STEP) {
            last = now;
            const solved = keep + Math.floor(t * (text.length - keep));
            setOut(
              Array.from(text, (ch, i) =>
                i < solved || ch === ' '
                  ? ch
                  : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
              ).join(''),
            );
          }
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [text, keep]);

  return (
    <span ref={ref} className="relative inline-block">
      <span className={out === null ? undefined : 'opacity-0'}>{text}</span>
      {out === null ? null : (
        <span aria-hidden className="absolute inset-0">
          {out}
        </span>
      )}
    </span>
  );
}
