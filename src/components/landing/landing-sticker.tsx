'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Container } from '@/components/container';
import { buttonClasses } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { STICKERS } from './sticker/list';
import type { StickerScene } from './sticker/scene';

/**
 * Landing'in en altındaki interaktif sticker'lar. WebGL sahnesi (`three`
 * dahil) ayrı bir chunk olarak yalnızca istemcide yüklenir; canvas yer
 * tutucusu SSR'da çizildiği için yüklenirken sayfa kaymaz. Oklar ve
 * noktalar sticker'lar arasında geçiş yapar.
 */
export function LandingSticker() {
  const t = useTranslations('Landing.sticker');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<StickerScene | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    import('./sticker/scene')
      .then(({ createStickerScene }) =>
        createStickerScene(canvas, { reducedMotion, onChange: setActive }),
      )
      .then((scene) => {
        if (cancelled) scene.dispose();
        else {
          sceneRef.current = scene;
          setReady(true);
        }
      })
      // WebGL yoksa bölüm sessizce boş kalır
      .catch(() => {});

    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  const arrowClasses = buttonClasses({
    variant: 'outline',
    size: 'sm',
    className:
      'size-10 shrink-0 p-0 disabled:pointer-events-none disabled:opacity-40 hover:translate-y-0',
  });

  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full sm:col-span-8">
            <div
              data-grid-content
              className="flex flex-col items-center gap-4 overflow-hidden px-6 py-8"
            >
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={t('label')}
                // touch-none: sticker'ın üstündeki sürükleme sayfayı kaydırmak
                // yerine soyma/çevirme yapsın
                className={cn(
                  'aspect-square w-full max-w-80 cursor-grab touch-none transition-opacity duration-700 sm:max-w-96',
                  ready ? 'opacity-100' : 'opacity-0',
                )}
              />

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label={t('previous')}
                  disabled={!ready}
                  onClick={() => sceneRef.current?.go(-1)}
                  className={arrowClasses}
                >
                  <ChevronLeft className="size-4" />
                </button>

                <div className="flex items-center gap-2">
                  {STICKERS.map((sticker, i) => (
                    <button
                      key={sticker.id}
                      type="button"
                      aria-label={t('slideLabel', { index: i + 1 })}
                      aria-current={i === active}
                      disabled={!ready}
                      onClick={() => sceneRef.current?.goTo(i)}
                      className={cn(
                        'focus-visible:ring-ring focus-visible:ring-offset-background h-1.5 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                        i === active
                          ? 'bg-foreground w-6'
                          : 'bg-foreground/20 hover:bg-foreground/40 w-1.5',
                      )}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label={t('next')}
                  disabled={!ready}
                  onClick={() => sceneRef.current?.go(1)}
                  className={arrowClasses}
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              <p className="text-muted-foreground text-sm">{t('hint')}</p>
            </div>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
