'use client';

import { CONSENT_REOPEN_EVENT, gaMeasurementId } from '@/lib/analytics';

/**
 * Footer'daki "Çerez tercihleri" bağlantısı — çubuğu yeniden açar.
 *
 * KVKK'da rızayı geri çekmek, vermek kadar kolay olmalı; çubuk bir kez
 * kapandıktan sonra kararı değiştirmenin başka yolu kalmıyor. Ölçüm kimliği
 * tanımsızken hiç basılmaz: ortada geri çekilecek bir rıza yok.
 */
export function ConsentPreferencesButton({ label }: { label: string }) {
  if (!gaMeasurementId) return null;

  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new CustomEvent(CONSENT_REOPEN_EVENT))
      }
      className="hover:text-primary cursor-pointer duration-150"
    >
      {label}
    </button>
  );
}
