'use client';

import { useActionState, useEffect, useMemo, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { buttonClasses } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import {
  formFields,
  initialFormState,
  type FormKind,
} from '@/lib/forms/config';
import { submitForm } from '@/lib/forms/submit';
import { siteConfig } from '@/lib/site';

/**
 * Mobilde `text-base` (16px) ŞART: iOS Safari, 16px'ten küçük yazı tipli bir
 * alana odaklanınca sayfayı otomatik yakınlaştırır ve düzen kayar. Aynı sebeple
 * dolgu da mobilde biraz yüksek — alan 46px'e çıkıp parmak hedefi oluyor.
 * sm ve üstünde masaüstündeki ölçüler (14px / py-2) aynen geri geliyor.
 */
const FIELD_CLASS =
  'border-border bg-background focus-visible:ring-primary/40 aria-invalid:border-destructive w-full rounded-md border px-3 py-2.5 text-base focus-visible:ring-2 focus-visible:outline-none sm:py-2 sm:text-sm';

/**
 * İletişim ve başvuru formlarının ortak gövdesi. Gönderim, `submitForm` Server
 * Action'ı üzerinden Apps Script uç noktasına gidiyor (bkz.
 * `google-apps-script/README.md`): kayıt Sheets'e düşüyor, kulübe bildirim ve
 * dolduran kişiye onay e-postası çıkıyor.
 *
 * Alanların hangileri olduğu `formFields`'tan geliyor — sunucu da aynı listeden
 * doğruluyor. Etiketler sayfanın kendi çeviri alanından `labels` ile veriliyor.
 */
export function SiteForm({
  kind,
  labels,
  submitLabel,
}: {
  kind: FormKind;
  /** Alan adı → görünen etiket. */
  labels: Record<string, string>;
  submitLabel: string;
}) {
  const t = useTranslations('Forms');
  const locale = useLocale();

  const action = useMemo(
    () => submitForm.bind(null, { kind, locale }),
    [kind, locale],
  );
  const [state, formAction, pending] = useActionState(action, initialFormState);

  // Formun açılış anı. Sunucuda üretilen değer işe yaramaz — sayfa statik
  // olduğu için build zamanını taşır — bu yüzden istemcideki ilk render'da
  // saptanıp gizli alana effect ile yazılıyor.
  const startedAt = useRef(0);
  const startedAtInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // `state` bağımlılığı şart: React, action bitince formu sıfırlıyor ve gizli
    // alan boşalıyor. Her sonuçtan sonra aynı açılış anı geri yazılıyor —
    // yenisi yazılsaydı kullanıcı hemen tekrar denediğinde bot sanılırdı.
    if (startedAt.current === 0) {
      startedAt.current = Date.now();
    }
    if (startedAtInput.current) {
      startedAtInput.current.value = String(startedAt.current);
    }
  }, [state]);

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="border-border bg-background rounded-md border p-6"
      >
        <CheckCircle2 className="size-5 fill-emerald-400/25 text-emerald-600 dark:text-emerald-500" />
        <h3 className="text-foreground mt-4 font-medium">
          {t(`success.${kind}.heading`)}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          {t(`success.${kind}.body`)}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'error' && (
        <p
          role="alert"
          className="border-destructive/40 text-destructive rounded-md border px-3 py-2.5 text-sm"
        >
          {t(`failure.${state.reason ?? 'upstream'}`, {
            email: siteConfig.contactEmail,
          })}
        </p>
      )}

      {formFields[kind].map((field) => {
        const error = state.fieldErrors?.[field.name];
        const errorId = `${field.name}-error`;

        return (
          <div key={field.name} className="space-y-1.5">
            <label
              htmlFor={field.name}
              className="text-foreground text-sm font-medium"
            >
              {labels[field.name]}
            </label>
            {field.multiline ? (
              <textarea
                id={field.name}
                name={field.name}
                rows={4}
                required={field.required}
                maxLength={field.maxLength}
                defaultValue={state.values?.[field.name]}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={FIELD_CLASS}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type ?? 'text'}
                required={field.required}
                maxLength={field.maxLength}
                autoComplete={field.autoComplete}
                defaultValue={state.values?.[field.name]}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={FIELD_CLASS}
              />
            )}
            {error && (
              <p id={errorId} className="text-destructive text-sm">
                {t(`errors.${error}`)}
              </p>
            )}
          </div>
        );
      })}

      {/* KVKK açık rızası — işaretlenmeden sunucu kaydı reddediyor. */}
      <div className="space-y-1.5 pt-2">
        <label className="text-muted-foreground flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={state.consentGiven}
            aria-invalid={state.fieldErrors?.consent ? true : undefined}
            aria-describedby={
              state.fieldErrors?.consent ? 'consent-error' : undefined
            }
            className="border-border accent-primary mt-0.5 size-4 shrink-0 rounded"
          />
          <span>
            {t.rich('consent', {
              link: (chunks) => (
                <Link
                  href="/privacy"
                  className="text-foreground hover:decoration-primary font-medium underline underline-offset-2"
                >
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {state.fieldErrors?.consent && (
          <p id="consent-error" className="text-destructive text-sm">
            {t('errors.consentRequired')}
          </p>
        )}
      </div>

      {/* Bot tuzağı: gerçek kullanıcı bu alanı görmez ve odaklanamaz; dolu
          gelirse sunucu kaydı sessizce atıyor. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
      />
      <input
        ref={startedAtInput}
        type="hidden"
        name="startedAt"
        defaultValue=""
      />

      {/* Telefonda tam genişlik — dar ekranda yarım kalan buton hem küçük bir
          hedef hem de formu bitmemiş gösteriyor. sm'den itibaren içerik kadar. */}
      <button
        type="submit"
        disabled={pending}
        className={buttonClasses({
          className: 'max-sm:w-full disabled:opacity-60',
        })}
      >
        {pending ? t('submitting') : submitLabel}
      </button>
    </form>
  );
}
