import type { SchemaTypeDefinition } from 'sanity';

import { author } from './author';
import { blockContent } from './blockContent';
import { event } from './event';
import { hackathon } from './hackathon';
import {
  localizedBlockContent,
  localizedString,
  localizedText,
} from './localized';
import { partner } from './partner';
import { post } from './post';

/**
 * Studio'nun içerik modeli. `sanity.config.ts` buradan besleniyor.
 * `translation.metadata` listede yok — onu `documentInternationalization`
 * eklentisi kendisi ekliyor.
 *
 * `localizedString` / `localizedText` / `localizedBlockContent` doküman değil,
 * `hackathon` ve `event` alanlarının kullandığı yeniden kullanılabilir nesne
 * tipleri; kayıtlı olmaları şart, yoksa şema çözümlenmez.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  author,
  hackathon,
  event,
  partner,
  blockContent,
  localizedString,
  localizedText,
  localizedBlockContent,
];
