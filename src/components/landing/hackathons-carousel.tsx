'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Container } from '@/components/container';
import { buttonClasses } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Veri boşken çizilecek yer tutucu kare sayısı (sponsor slotları gibi). */
const PLACEHOLDER_SLIDES = 3;

/**
 * Karuselin çizmek için ihtiyaç duyduğu düz veri. Dile indirgeme ve Sanity
 * görsel adresi üretimi sunucu tarafında bitmiş oluyor (bkz.
 * `landing-hackathons.tsx`) — burada Sanity'ye dair hiçbir şey bilinmiyor.
 */
export type HackathonSlide = {
  key: string;
  event?: string;
  award?: string;
  year?: number;
  detail?: string;
  image?: string;
  url?: string;
};

/**
 * "Kazandığımız hackathonlar" karuseli.
 *
 * Bağımlılık yok: yatay `scroll-snap` şeridi + oklar/noktalar. Dokunmatikte
 * doğal kaydırma, klavyede ok tuşları, `prefers-reduced-motion` açıkken
 * yumuşak kaydırma kapalı. Kareler grid çerçevesinin hücreleridir
 * (`data-grid-content`), yani sitedeki diğer bölümlerle aynı hairline
 * çizgileri ve `bg-card` yüzeyini paylaşır.
 *
 * İstemci bileşeni: kaydırma durumu (aktif kare, baştayız/sondayız) tarayıcıda
 * tutuluyor; metinler `NextIntlClientProvider` üzerinden geliyor. Veriyi
 * kendisi çekemeyeceği için props ile alıyor.
 */
export function HackathonsCarousel({ items }: { items: HackathonSlide[] }) {
  const t = useTranslations('Landing.hackathons');

  // Hiç kayıt yoksa bölümü gizlemek yerine yer tutucu kareler çiziliyor:
  // bölüm ana sayfanın iskeletinde duruyor, "yakında" hissi veriyor.
  const slides: HackathonSlide[] =
    items.length > 0
      ? items
      : Array.from({ length: PLACEHOLDER_SLIDES }, (_, i) => ({
          key: `placeholder-${i}`,
        }));

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /** Kaydırma konumundan aktif kareyi ve uç durumlarını türetir. */
  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    // 1px tolerans: tarayıcılar kesirli kaydırma değerleri üretebiliyor.
    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft >= scrollWidth - clientWidth - 1);

    const items = Array.from(track.children) as HTMLElement[];
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    items.forEach((item, i) => {
      const distance = Math.abs(item.offsetLeft - scrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    sync();
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      track.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  /**
   * Şeridi verilen kareye kaydırır. Şerit `relative` olduğu için karelerin
   * `offsetLeft` değeri doğrudan hedef `scrollLeft`tir.
   */
  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.children) as HTMLElement[];
    const target = items[Math.min(Math.max(index, 0), items.length - 1)];
    if (!target) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    track.scrollTo({
      left: target.offsetLeft,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
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

          <div className="col-span-full grid gap-px sm:col-span-8">
            <div
              data-grid-content
              className="@4xl:p-12 flex flex-wrap items-end justify-between gap-6 p-6"
            >
              <div>
                <h2 className="text-muted-foreground text-balance">
                  {t('heading')}
                </h2>
                <p className="text-foreground mt-6 max-w-2xl text-balance text-xl font-medium">
                  {t('intro')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={t('previous')}
                  aria-controls="hackathon-carousel"
                  disabled={atStart}
                  onClick={() => goTo(active - 1)}
                  className={arrowClasses}
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={t('next')}
                  aria-controls="hackathon-carousel"
                  disabled={atEnd}
                  onClick={() => goTo(active + 1)}
                  className={arrowClasses}
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Kaydırılabilir şerit. `tabIndex` klavye kullanıcısının şeride
                odaklanıp ok tuşlarıyla gezinebilmesi için; scrollbar gizli,
                gezinme oklar/noktalar ve dokunmatik kaydırma ile. */}
            <div
              id="hackathon-carousel"
              ref={trackRef}
              role="group"
              aria-roledescription={t('roleDescription')}
              aria-label={t('heading')}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault();
                  goTo(active + 1);
                } else if (event.key === 'ArrowLeft') {
                  event.preventDefault();
                  goTo(active - 1);
                }
              }}
              className="relative flex snap-x snap-mandatory gap-px overflow-x-auto outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {slides.map((slide) => (
                <div key={slide.key} className="w-full shrink-0 snap-start">
                  <article
                    data-grid-content
                    className="@2xl:flex-row flex h-full flex-col overflow-hidden"
                  >
                    {/* Görsel alanı. Zemin `bg-muted` DEĞİL: koyu temada
                        `--muted` (zinc-800) kartın kendi tonuyla neredeyse
                        aynı ve yer tutucu düz bir boşluk gibi görünüyordu.
                        `bg-foreground/5` her iki temada da kartın üstünde
                        görünür bir yüzey bırakır. */}
                    <div className="bg-foreground/5 @2xl:aspect-auto @2xl:min-h-96 @2xl:basis-3/5 relative aspect-[16/10] shrink-0">
                      {slide.image ? (
                        <Image
                          src={slide.image}
                          alt={
                            slide.event
                              ? `${slide.event}${slide.award ? ` — ${slide.award}` : ''}`
                              : ''
                          }
                          fill
                          sizes="(max-width: 672px) 100vw, 55vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground/60 absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <Trophy className="size-8" />
                          <span className="font-mono text-xs tracking-widest lowercase">
                            {t('placeholder')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="@4xl:p-12 flex flex-1 flex-col justify-center gap-4 p-6">
                      <span className="text-primary font-mono text-xs tracking-widest lowercase">
                        {slide.year
                          ? `${'//'} ${slide.year}`
                          : `${'//'} hackathon`}
                      </span>

                      <h3 className="text-foreground text-balance text-2xl font-semibold">
                        {slide.event ?? t('placeholderTitle')}
                      </h3>

                      {/* Derece rozeti. Metin rengi `text-primary` DEĞİL: rozet
                          zaten mavi bir zemine (`bg-primary/10`) oturuyor,
                          üstüne aynı tondaki metin gelince 12px mono yazı
                          zeminde eriyordu — açık temada 5.8:1, koyuda 4.8:1,
                          yani AA eşiğini ancak sıyırıyordu. Tonu temaya göre
                          koyultup açmak yazıyı zeminden ayırıyor; renk yine aynı
                          mavi ailesinden, rozetin kimliği bozulmuyor. */}
                      {slide.award && (
                        <span className="bg-primary/10 w-fit rounded-full px-3 py-1 font-mono text-xs text-blue-800 dark:text-blue-300">
                          {slide.award}
                        </span>
                      )}

                      <p className="text-muted-foreground leading-relaxed">
                        {slide.detail ?? t('placeholderNote')}
                      </p>

                      {slide.url && (
                        <a
                          href={slide.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-primary mt-2 text-sm font-medium"
                        >
                          {t('link')}
                        </a>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>

            <div
              data-grid-content
              className="flex items-center justify-center gap-2 p-4"
            >
              {slides.map((slide, i) => (
                <button
                  key={slide.key}
                  type="button"
                  aria-label={t('slideLabel', { index: i + 1 })}
                  aria-current={i === active}
                  aria-controls="hackathon-carousel"
                  onClick={() => goTo(i)}
                  className={cn(
                    'focus-visible:ring-ring focus-visible:ring-offset-background h-1.5 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    i === active
                      ? 'bg-foreground w-6'
                      : 'bg-foreground/20 hover:bg-foreground/40 w-1.5',
                  )}
                />
              ))}
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
