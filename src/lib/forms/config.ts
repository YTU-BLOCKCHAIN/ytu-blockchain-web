/**
 * Form tanımları — istemci ve sunucu için tek kaynak.
 *
 * Alanların zorunluluğu ve uzunluk sınırı burada duruyor; sunucu doğrulaması
 * bu listeden okuyor. İstemciden gelen "bu alan zorunlu değildi" iddiasına
 * güvenilmez, çünkü Server Action'a UI'dan geçmeden de POST edilebilir.
 */

/** Sitedeki iki form: iletişim ve üyelik başvurusu. */
export type FormKind = 'contact' | 'join';

export type FormField = {
  /** `name` özniteliği; Sheets sütunlarıyla ve çeviri anahtarıyla eşleşir. */
  name: string;
  type?: 'text' | 'email';
  /** Çok satırlı (textarea) alan — mesaj/motivasyon gövdesi. */
  multiline?: boolean;
  required?: boolean;
  autoComplete?: string;
  /** Üst sınır: hem `maxLength` özniteliği hem sunucu kontrolü. */
  maxLength: number;
};

export const formFields = {
  contact: [
    { name: 'name', required: true, autoComplete: 'name', maxLength: 100 },
    {
      name: 'email',
      type: 'email',
      required: true,
      autoComplete: 'email',
      maxLength: 160,
    },
    { name: 'message', multiline: true, required: true, maxLength: 4000 },
  ],
  join: [
    { name: 'name', required: true, autoComplete: 'name', maxLength: 100 },
    {
      name: 'email',
      type: 'email',
      required: true,
      autoComplete: 'email',
      maxLength: 160,
    },
    { name: 'department', maxLength: 100 },
    { name: 'motivation', multiline: true, required: true, maxLength: 4000 },
  ],
} satisfies Record<FormKind, readonly FormField[]>;

/** Alan hatası — `Forms.errors.*` çeviri anahtarına karşılık gelir. */
export type FieldErrorKey = 'required' | 'invalidEmail' | 'tooLong';

/** Gönderim başarısızlığı — `Forms.failure.*` çeviri anahtarına karşılık gelir. */
export type FailureReason =
  | 'notConfigured'
  | 'upstream'
  /** Turnstile jetonu yok ya da Cloudflare reddetti. */
  | 'captcha'
  /** Aynı IP'den kısa sürede çok fazla gönderim. */
  | 'rateLimited';

/** `useActionState` durumu. */
export type FormState = {
  status: 'idle' | 'success' | 'invalid' | 'error';
  /** `status: 'invalid'` iken alan adı → hata anahtarı. */
  fieldErrors?: Record<string, FieldErrorKey>;
  /** `status: 'error'` iken başarısızlık nedeni. */
  reason?: FailureReason;
  /**
   * Girilen değerler. React, action bitince formu sıfırlıyor; başarısız
   * gönderimde alanların boşalmaması için değerler geri dönüp `defaultValue`
   * olarak yeniden basılıyor.
   */
  values?: Record<string, string>;
  /** Aynı sıfırlanma onay kutusunu da boşaltıyor — durumu geri taşınır. */
  consentGiven?: boolean;
};

export const initialFormState: FormState = { status: 'idle' };
