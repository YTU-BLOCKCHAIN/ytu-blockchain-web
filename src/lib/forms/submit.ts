'use server';

import {
  formFields,
  type FieldErrorKey,
  type FormKind,
  type FormState,
} from './config';

/**
 * Kaba ama pratikte yeterli biçim kontrolü. Adresin gerçekten var olduğunu
 * zaten onay e-postası kanıtlıyor; buradaki amaç yazım hatasını yakalamak.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Formun açılışı ile gönderimi arasında beklenen en kısa süre. Kasıtlı olarak
 * düşük: eşik yükseldikçe hızlı dolduran gerçek kullanıcıyı yakalama riski
 * artar ve o kişi kaydı düşmediği hâlde "gönderildi" görür. Sayfa yüklendikten
 * 2 saniye içinde gelen gönderim ise insan eliyle mümkün değil.
 */
const MIN_FILL_MS = 2000;

/** Apps Script yavaşsa kullanıcı süresiz beklemesin. */
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Formu doğrular ve Apps Script Web App'ine iletir (kurulum:
 * `google-apps-script/README.md`). Uç nokta oradan Sheets'e yazar, kulübe
 * bildirim ve dolduran kişiye onay e-postası atar.
 *
 * `context` istemciden `bind` ile geliyor: Next bu değeri şifreleyip imzalıyor,
 * yani tarayıcıdan değiştirilemiyor.
 */
export async function submitForm(
  context: { kind: FormKind; locale: string },
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { kind, locale } = context;

  // Honeypot: kullanıcıya görünmeyen alan doluysa gönderen bir bot. Hata
  // döndürmek botu uyarır ve denemeye devam ettirir; sessizce "başarılı" deyip
  // kaydı atmak daha etkili.
  if (String(formData.get('website') ?? '').trim()) {
    return { status: 'success' };
  }

  // Form açılınca istemci tarafından yazılır. JS kapalıysa boş gelir → kontrol
  // atlanır, form yine de çalışır (progressive enhancement).
  const startedAt = Number(formData.get('startedAt'));
  if (startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) {
    return { status: 'success' };
  }

  const values: Record<string, string> = {};
  const fieldErrors: Record<string, FieldErrorKey> = {};

  for (const field of formFields[kind]) {
    const value = String(formData.get(field.name) ?? '').trim();
    values[field.name] = value;

    if (field.required && !value) {
      fieldErrors[field.name] = 'required';
    } else if (value.length > field.maxLength) {
      fieldErrors[field.name] = 'tooLong';
    } else if (field.type === 'email' && value && !EMAIL_PATTERN.test(value)) {
      fieldErrors[field.name] = 'invalidEmail';
    }
  }

  // Açık rıza olmadan kişisel veriyi kaydedemeyiz (KVKK m.5).
  const consent = formData.get('consent') === 'on';
  if (!consent) {
    fieldErrors.consent = 'required';
  }

  // Başarısız her dönüşle birlikte gidiyor: React action sonrası formu
  // sıfırlıyor, kullanıcı yazdıklarını kaybetmesin.
  const entered = { values, consentGiven: consent };

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'invalid', fieldErrors, ...entered };
  }

  const endpoint = process.env.FORM_ENDPOINT_URL;
  const secret = process.env.FORM_SHARED_SECRET;
  if (!endpoint || !secret) {
    console.error(
      'Form gönderimi yapılandırılmamış: FORM_ENDPOINT_URL / FORM_SHARED_SECRET eksik.',
    );
    return { status: 'error', reason: 'notConfigured', ...entered };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        form: kind,
        locale,
        data: { ...values, consent },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    // Hata ayıklarken bile form içeriği loglanmaz — kişisel veri Vercel
    // loglarında birikmesin.
    if (!response.ok) {
      console.error(`Form uç noktası ${response.status} döndü.`);
      return { status: 'error', reason: 'upstream', ...entered };
    }

    const result: unknown = await response.json();
    if (
      typeof result !== 'object' ||
      result === null ||
      (result as { ok?: unknown }).ok !== true
    ) {
      const reason = (result as { error?: unknown } | null)?.error;
      console.error(`Form uç noktası kaydı reddetti: ${String(reason)}`);
      return { status: 'error', reason: 'upstream', ...entered };
    }
  } catch (error) {
    console.error(`Form uç noktasına ulaşılamadı: ${String(error)}`);
    return { status: 'error', reason: 'upstream', ...entered };
  }

  return { status: 'success' };
}
