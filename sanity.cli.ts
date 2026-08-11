import { defineCliConfig } from 'sanity/cli';

import { sanityDataset, sanityProjectId } from './src/sanity/env';

/**
 * `npx sanity <komut>` çağrılarının hangi projeye/dataset'e bağlanacağı.
 * Studio'nun kendisi `sanity.config.ts`ten okunur; bu dosya yalnızca CLI için.
 */
export default defineCliConfig({
  api: {
    projectId: sanityProjectId,
    dataset: sanityDataset,
  },
});
