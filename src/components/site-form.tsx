'use client';

import { useActionState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Script from 'next/script';

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
 * Cloudflare Turnstile site anahtarı. Tanımsızsa widget hiç basılmaz ve sunucu
 * da doğrulamayı atlar (`lib/forms/turnstile.ts`) — anahtarlar eklenene kadar
 * formlar honeypot, zaman tuzağı ve hız sınırıyla çalışmaya devam eder.
 * `NEXT_PUBLIC_` ön eki şart: değer build sırasında istemci paketine gömülüyor
 * (site anahtarı zaten herkese açık, gizli olan `TURNSTILE_SECRET_KEY`).
 */
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Widget'ın kendi ölçüsü (300×65) — yüklenirken düzen zıplamasın. */
const TURNSTILE_MIN_HEIGHT = 'min-h-[65px]';

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

  /*
    Turnstile "explicit" modda basılıyor (`?render=explicit`). Varsayılan örtük
    modda script yüklenince sayfayı bir kez tarayıp widget'ları basar; App
    Router'da forma istemci tarafı gezinmeyle gelindiğinde o tarama çoktan
    bitmiş oluyor ve widget hiç çıkmıyor. Burada basmayı biz tetikliyoruz.
  */
  const turnstileBox = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const renderTurnstile = useCallback(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileBox.current || widgetId.current)
      return;
    widgetId.current =
      window.turnstile?.render(turnstileBox.current, {
        sitekey: TURNSTILE_SITE_KEY,
        language: locale,
        theme: 'auto',
      }) ?? null;
  }, [locale]);

  useEffect(() => {
    // Script bu formdan önce yüklendiyse (aynı oturumda ikinci form) `onReady`
    // bir daha çalışmaz; o durumu bu ilk çağrı karşılıyor.
    renderTurnstile();
    return () => {
      if (widgetId.current) {
        window.turnstile?.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [renderTurnstile]);

  useEffect(() => {
    // Jeton TEK KULLANIMLIK: başarısız gönderimden sonra sıfırlanmazsa ikinci
    // deneme harcanmış jetonla gider ve kullanıcı doğrulama hatasına takılır.
    if (
      widgetId.current &&
      (state.status === 'invalid' || state.status === 'error')
    ) {
      window.turnstile?.reset(widgetId.current);
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
          {/* Native kutu yerine sitenin kendi dili: kenarlık ve zemin form
              alanlarıyla aynı, işaretliyken primary butonun bg-foreground /
              text-background zıtlığı (light'ta siyah, dark'ta beyaz). Tik,
              `appearance-none` kutunun üzerine bindirilen ayrı bir ikon. */}
          <span className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center">
            <input
              type="checkbox"
              name="consent"
              required
              defaultChecked={state.consentGiven}
              aria-invalid={state.fieldErrors?.consent ? true : undefined}
              aria-describedby={
                state.fieldErrors?.consent ? 'consent-error' : undefined
              }
              className="peer border-border bg-background checked:border-foreground checked:bg-foreground focus-visible:ring-primary/40 aria-invalid:border-destructive size-4 appearance-none rounded border transition-colors focus-visible:ring-2 focus-visible:outline-none"
            />
            <Check
              aria-hidden
              strokeWidth={3}
              className="text-background pointer-events-none absolute size-2.5 opacity-0 transition-opacity peer-checked:opacity-100"
            />
          </span>
          <span>
            {t.rich('consent', {
              link: (chunks) => (
                <Link
                  href="/privacy"
                  className="text-foreground decoration-border hover:decoration-foreground font-medium underline underline-offset-2 transition-colors"
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

      {/* Turnstile — anahtar tanımlıysa görünür bir kutu olarak basılır ve
          çözülünce forma `cf-turnstile-response` gizli alanını bırakır. Kutunun
          kendi Cloudflare rozeti korumayı zaten belli ediyor, altına ayrıca
          açıklama satırı konmuyor. */}
      {TURNSTILE_SITE_KEY && (
        <div className="pt-1">
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={renderTurnstile}
          />
          <div ref={turnstileBox} className={TURNSTILE_MIN_HEIGHT} />
        </div>
      )}

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
