import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider, type Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Analytics } from '@/components/analytics';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { bodyFont, displayFont } from '@/fonts';
import { routing } from '@/i18n/routing';
import { ogLocales, siteConfig, xHandle } from '@/lib/site';

import '../globals.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t('defaultTitle'),
      template: `%s · ${siteConfig.name}`,
    },
    description: t('defaultDescription'),
    applicationName: siteConfig.name,
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: ogLocales[locale],
      title: t('defaultTitle'),
      description: t('defaultDescription'),
    },
    // Bu blok yalnızca `buildMetadata` kullanmayan sayfalar için geçerli:
    // sayfa kendi `twitter` nesnesini verdiğinde bu tamamen değişiyor, alanlar
    // birleşmiyor. `site` bu yüzden `buildMetadata` içinde de tekrarlanıyor.
    twitter: { card: 'summary_large_image', site: xHandle },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Meta' });
  const tNav = await getTranslations({ locale, namespace: 'Nav' });

  return (
    <html
      lang={locale}
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Kulübün makine okunur kimlik kartı (schema.org / JSON-LD). Arama
            motorları adı, logoyu ve resmî hesapları buradan okur; sitenin
            hangi kurumun olduğunu metinden tahmin etmeye çalışmazlar.
            `@id` sabit: başka sayfalardan bu kimliğe referans verilebilsin
            (blog yazılarındaki `BlogPosting.publisher` buna bağlanıyor).
            `WebSite` siteyi kurumdan ayrı bir varlık olarak tanıtır — adı ve
            yayıncısı buradan okunur. Değerler `siteConfig`ten geliyor —
            ikinci bir kopya eskirdi. */}
        <script
          type="application/ld+json"
          // Kaynak sabit ve bizim; kullanıcı girdisi yok.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${siteConfig.url}/#organization`,
                  name: siteConfig.name,
                  alternateName: t('defaultTitle'),
                  url: siteConfig.url,
                  logo: `${siteConfig.url}/logo/mark.svg`,
                  email: siteConfig.contactEmail,
                  parentOrganization: {
                    '@type': 'CollegeOrUniversity',
                    name: 'Yıldız Teknik Üniversitesi',
                  },
                  sameAs: Object.values(siteConfig.social),
                },
                {
                  '@type': 'WebSite',
                  '@id': `${siteConfig.url}/#website`,
                  name: siteConfig.name,
                  url: siteConfig.url,
                  inLanguage: locale,
                  publisher: { '@id': `${siteConfig.url}/#organization` },
                },
              ],
            }),
          }}
        />
        {/* Klavyeyle gezenin header'ı atlamasını sağlayan ilk odak hedefi.
            Normalde görünmez; yalnızca odaklanınca sol üstte beliriyor.
            Sayfadaki İLK odaklanabilir öğe olmak zorunda, bu yüzden Header'ın
            da üstünde. */}
        <a
          href="#main"
          className="bg-background text-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:px-4 focus:py-2 focus:ring-2 focus:outline-none"
        >
          {tNav('skipToContent')}
        </a>
        <NextIntlClientProvider>
          <Header />
          {/* Zemin = grid çizgi rengi → çerçeve (yan raylar + hücre araları)
              header'dan sayfa gövdesine kesintisiz ve tek tonda devam eder. */}
          <main id="main" tabIndex={-1} className="bg-grid-line flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        {/* Ölçüm ve çerez onay çubuğu. Sağlayıcının DIŞINDA: metnini prop
            olarak alıyor, `/links` köküyle aynı bileşeni paylaşabilsin diye. */}
        <Analytics locale={locale} />
      </body>
    </html>
  );
}
