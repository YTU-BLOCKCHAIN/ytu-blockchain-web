import type { SchemaTypeDefinition } from 'sanity';

import { author } from './author';
import { blockContent } from './blockContent';
import { hackathon } from './hackathon';
import { localizedString, localizedText } from './localized';
import { post } from './post';

/**
 * Studio'nun içerik modeli. `sanity.config.ts` buradan besleniyor.
 * `translation.metadata` listede yok — onu `documentInternationalization`
 * eklentisi kendisi ekliyor.
 *
 * `localizedString` / `localizedText` doküman değil, `hackathon` alanlarının
 * kullandığı yeniden kullanılabilir nesne tipleri; kayıtlı olmaları şart,
 * yoksa şema çözümlenmez.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  author,
  hackathon,
  blockContent,
  localizedString,
  localizedText,
];
