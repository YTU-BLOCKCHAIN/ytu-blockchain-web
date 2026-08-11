import type { SchemaTypeDefinition } from 'sanity';

import { author } from './author';
import { blockContent } from './blockContent';
import { post } from './post';

/**
 * Studio'nun içerik modeli. `sanity.config.ts` buradan besleniyor.
 * `translation.metadata` listede yok — onu `documentInternationalization`
 * eklentisi kendisi ekliyor.
 */
export const schemaTypes: SchemaTypeDefinition[] = [post, author, blockContent];
