'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { sanityDataset, sanityProjectId } from './src/sanity/env';

/**
 * Gömülü Sanity Studio'nun yapılandırması.
 *
 * `'use client'` zorunlu: Studio baştan sona istemcide çalışan bir React
 * uygulaması. `basePath` ile `src/app/studio/[[...tool]]/page.tsx` rotasına
 * bağlanır — ikisi aynı yolu göstermek zorunda.
 *
 * İçerik şemaları (blog yazısı, yazar) bir sonraki adımda eklenecek; şu an
 * Studio boş bir içerik modeliyle açılıyor.
 */
export default defineConfig({
  basePath: '/studio',
  projectId: sanityProjectId,
  dataset: sanityDataset,
  plugins: [structureTool()],
  schema: { types: [] },
});
