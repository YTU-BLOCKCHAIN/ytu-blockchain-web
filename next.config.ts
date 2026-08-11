import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { sanityDataset, sanityProjectId } from './src/sanity/env';

const nextConfig: NextConfig = {
  images: {
    // Blog görselleri Sanity'nin görsel CDN'inden geliyor. Desen kulübün kendi
    // projesi ve dataset'iyle sınırlı: `cdn.sanity.io` herkese açık olduğundan
    // yol kısıtlanmazsa optimizasyon uç noktamız başkasının görsellerini de
    // servis eder hâle gelirdi.
    //
    // `search` BİLEREK tanımsız (= her sorgu dizesi serbest). Sanity ölçek ve
    // kırpmayı sorgu parametreleriyle yapıyor (`?w=800&h=450&fit=crop&...`),
    // yani sorgu dizesi her görselde farklı. Kısa `new URL(...)` biçimi
    // kullanılamaz: o biçim `search`'ü boş kabul edip sorgulu adresleri
    // reddediyor. Protokol, alan adı ve yol sabitlendiği için serbest bırakılan
    // tek şey kendi görsellerimizin dönüşüm parametreleri.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: `/images/${sanityProjectId}/${sanityDataset}/**`,
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
