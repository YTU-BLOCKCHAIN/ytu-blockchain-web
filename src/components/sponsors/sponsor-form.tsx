'use client';

import type { FormEvent } from 'react';

export type SponsorFormLabels = {
  name: string;
  organization: string;
  email: string;
  message: string;
  submit: string;
};

const FIELD_CLASS =
  'border-border bg-background focus-visible:ring-primary/40 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none';

/**
 * Sponsorluk başvuru formu. Backend yok: gönderimde kullanıcının e-posta
 * uygulamasında hazır bir `mailto:` mesajı açar (roadmap 1.D form backend'i
 * kesinleşene kadarki geçici çözüm).
 */
export function SponsorForm({
  labels,
  recipient,
  subject,
}: {
  labels: SponsorFormLabels;
  recipient: string;
  subject: string;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const organization = String(data.get('organization') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const body = [
      `${labels.name}: ${name}`,
      `${labels.organization}: ${organization}`,
      `${labels.email}: ${email}`,
      '',
      message,
    ].join('\n');

    const href = `mailto:${recipient}?subject=${encodeURIComponent(
      name ? `${subject} — ${name}` : subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-foreground text-sm font-medium">
          {labels.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={FIELD_CLASS}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="organization"
          className="text-foreground text-sm font-medium"
        >
          {labels.organization}
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          autoComplete="organization"
          className={FIELD_CLASS}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-foreground text-sm font-medium">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={FIELD_CLASS}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="text-foreground text-sm font-medium"
        >
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className={FIELD_CLASS}
        />
      </div>

      <button
        type="submit"
        className="bg-primary text-primary-foreground rounded-md px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
      >
        {labels.submit}
      </button>
    </form>
  );
}
