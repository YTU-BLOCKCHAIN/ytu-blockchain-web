'use client';

import type { FormEvent } from 'react';

import { buttonClasses } from '@/components/ui/button';

export type MailtoField = {
  /** Form alanı adı (mailto gövdesinde etiketle birlikte kullanılır). */
  name: string;
  /** Görünen etiket. */
  label: string;
  type?: 'text' | 'email';
  /** Çok satırlı (textarea) alan — genelde mesaj gövdesi. */
  multiline?: boolean;
  required?: boolean;
  autoComplete?: string;
};

const FIELD_CLASS =
  'border-border bg-background focus-visible:ring-primary/40 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none';

/**
 * Backend'siz iletişim/başvuru formu. Gönderimde kullanıcının e-posta
 * uygulamasında hazır bir `mailto:` mesajı açar (roadmap 1.D form backend'i
 * kesinleşene kadarki geçici çözüm). Alanlar `fields` ile yapılandırılır;
 * çok satırlı alan gövdenin sonuna, diğerleri "Etiket: değer" olarak eklenir.
 */
export function MailtoForm({
  fields,
  recipient,
  subject,
  submitLabel,
}: {
  fields: MailtoField[];
  recipient: string;
  subject: string;
  submitLabel: string;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (name: string) => String(data.get(name) ?? '').trim();

    const details = fields
      .filter((field) => !field.multiline)
      .map((field) => `${field.label}: ${get(field.name)}`);
    const messageField = fields.find((field) => field.multiline);
    const message = messageField ? get(messageField.name) : '';
    const body = [...details, '', message].join('\n');

    const name = get('name');
    const href = `mailto:${recipient}?subject=${encodeURIComponent(
      name ? `${subject} — ${name}` : subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <label
            htmlFor={field.name}
            className="text-foreground text-sm font-medium"
          >
            {field.label}
          </label>
          {field.multiline ? (
            <textarea
              id={field.name}
              name={field.name}
              rows={4}
              required={field.required}
              className={FIELD_CLASS}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? 'text'}
              required={field.required}
              autoComplete={field.autoComplete}
              className={FIELD_CLASS}
            />
          )}
        </div>
      ))}

      <button type="submit" className={buttonClasses()}>
        {submitLabel}
      </button>
    </form>
  );
}
