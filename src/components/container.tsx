import { cn } from '@/lib/utils';

/*
  Tüm yüzeyler (grid hücreleri, yan raylar, separator) opak `bg-card`, tüm
  çizgiler ise opak `bg-grid-line` kullanır. Yarı saydam olurlarsa arkalarındaki
  katmanla karışır; footer'da `body` (zinc-950), `main` içinde ise kendi zemini
  var — aynı sınıf sayfanın farklı yerlerinde farklı gri üretiyordu. Opak
  kalmaları tek ton garantiler.
*/
export const Container = ({
  className,
  children,
  asGrid = false,
  decorators = 2,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  asGrid?: boolean;
  decorators?: number;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) => {
  /*
    Masaüstünde orta sütun `minmax(0,69rem)`: 69rem (=1104px) ÜST sınır, alt
    sınır 0. Eskiden `auto` track + çocukta `lg:min-w-276` vardı; min-width alt
    sınır olduğu için 1024px'lik pencerede bile 1104px dayatıp sayfayı 95px
    yatay kaydırıyordu. minmax ile geniş ekranda ölçü aynı, dar ekranda sütun
    küçülüp yan raylar (1fr) sıfırlanıyor.
  */
  return (
    <div
      {...props}
      className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]"
    >
      {/* `overflow-hidden`: ray sıfır genişliğe indiğinde Decorator'ın
          `p-[0.5px]` dolgusu border-box'ta 1px'lik bir taban yaratıp sayfayı
          1px kaydırıyor. Ray tamamen dekoratif, kırpılması sorunsuz. */}
      <div
        className="grid overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${decorators / 2}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: decorators / 2 }).map((_, i) => (
          <Decorator key={i} className="w-full" />
        ))}
      </div>
      <div className={cn('max-w-276 mx-auto w-full', !asGrid && 'p-[0.5px]')}>
        {asGrid ? (
          <div
            className={cn(
              'bg-grid-line **:data-grid-content:bg-card **:data-grid-content:h-full **:data-grid-content:rounded grid *:p-[0.5px]',
              className,
            )}
          >
            {children}
          </div>
        ) : (
          <div
            data-slot="content"
            className={cn('bg-card h-full rounded', className)}
          >
            {children}
          </div>
        )}
      </div>
      {/* `overflow-hidden`: ray sıfır genişliğe indiğinde Decorator'ın
          `p-[0.5px]` dolgusu border-box'ta 1px'lik bir taban yaratıp sayfayı
          1px kaydırıyor. Ray tamamen dekoratif, kırpılması sorunsuz. */}
      <div
        className="grid overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${decorators / 2}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: decorators / 2 }).map((_, i) => (
          <Decorator key={i} />
        ))}
      </div>
    </div>
  );
};

export const Separator = ({
  className,
  decorators = 2,
}: {
  className?: string;
  decorators?: number;
}) => {
  return (
    <Container aria-hidden decorators={decorators}>
      <div className={cn('h-16', className)} />
    </Container>
  );
};

const Decorator = ({ className }: { className?: string }) => {
  return (
    <div aria-hidden className={cn('p-[0.5px]', className)}>
      <div className="bg-card h-full w-2 rounded md:w-6 lg:w-full" />
    </div>
  );
};
