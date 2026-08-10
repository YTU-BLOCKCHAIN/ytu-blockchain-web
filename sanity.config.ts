'use client';

import { documentInternationalization } from '@sanity/document-internationalization';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from './src/sanity/env';
import { sanityLanguages } from './src/sanity/languages';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

/**
 * Gömülü Sanity Studio'nun yapılandırması.
 *
 * `'use client'` zorunlu: Studio baştan sona istemcide çalışan bir React
 * uygulaması. `basePath` ile `src/app/studio/[[...tool]]/page.tsx` rotasına
 * bağlanır — ikisi aynı yolu göstermek zorunda.
 *
 * `documentInternationalization` yalnızca `post` için açık: yazılar dile göre
 * ayrı dokümanlar, yazarlar ise tek ve dilden bağımsız.
 */
export default defineConfig({
  basePath: '/studio',
  projectId: sanityProjectId,
  dataset: sanityDataset,
  plugins: [
    structureTool({ structure }),
    documentInternationalization({
      supportedLanguages: sanityLanguages,
      schemaTypes: ['post'],
      apiVersion: sanityApiVersion,
    }),
  ],
  schema: { types: schemaTypes },
});
