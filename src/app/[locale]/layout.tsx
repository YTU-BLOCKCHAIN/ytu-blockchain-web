import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { hasLocale, NextIntlClientProvider, type Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { routing } from '@/i18n/routing';
import { ogLocales, siteConfig } from '@/lib/site';

import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    twitter: { card: 'summary_large_image' },
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

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
