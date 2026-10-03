import { Container } from '@/components/container';
import { BlogHero } from '@/components/blog/blog-sections';

/**
 * Blog listesi Sanity'den gelirken gösterilen iskelet.
 *
 * Yazılar derleme anında üretiliyor ama `revalidate` sonrası ya da henüz
 * üretilmemiş bir dilde istek sunucuda veri beklemek zorunda; o aralıkta
 * ziyaretçi boş beyaz sayfa yerine sayfanın şeklini görüyor.
 *
 * Başlık bölümü (`BlogHero`) iskelette de gerçek: veriye bağlı değil, yani
 * yüklenme bitince yerinden oynamıyor — düzen kaymasını önlüyor.
 */
export default function BlogLoading() {
  return (
    <>
      <BlogHero />

      {/* Öne çıkan yazının yeri */}
      <section>
        <Container asGrid>
          <div data-grid-content className="@4xl:p-12 p-6">
            <div className="bg-foreground/5 aspect-video w-full animate-pulse rounded-[10px]" />
          </div>
        </Container>
      </section>

      {/* Izgaradaki kartların yeri */}
      <section>
        <Container asGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} data-grid-content className="@4xl:p-12 space-y-4 p-6">
              <div className="bg-foreground/5 h-4 w-24 animate-pulse rounded" />
              <div className="bg-foreground/5 h-6 w-full animate-pulse rounded" />
              <div className="bg-foreground/5 h-6 w-2/3 animate-pulse rounded" />
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
