<div align="center">

# YTÜ Blockchain — Web

Yıldız Teknik Üniversitesi Blockchain Kulübü'nün resmî web sitesi.
_Official website of the Yıldız Technical University Blockchain Club._

[![CI](https://github.com/YTU-BLOCKCHAIN/ytu-blockchain-web/actions/workflows/ci.yml/badge.svg)](https://github.com/YTU-BLOCKCHAIN/ytu-blockchain-web/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-22C55E.svg)

[Türkçe](#türkçe) · [English](#english)

</div>

---

## Türkçe

### Hakkında

Bu depo, kulübün web sitesinin ön yüzünü **ve** blog içerik yönetimini barındırır:
Sanity Studio siteye gömülüdür, `/studio` adresinden açılır. Site iki dillidir (TR/EN) ve
içerik hazır olmayan bölümler "çok yakında" şablonuyla yayınlanır.

### Teknoloji

| Katman    | Seçim                                |
| --------- | ------------------------------------ |
| Framework | Next.js 16 (App Router)              |
| Dil       | TypeScript (strict)                  |
| Stil      | Tailwind CSS v4                      |
| i18n      | next-intl (`/tr`, `/en`)             |
| Blog/CMS  | Sanity.io (Studio gömülü, `/studio`) |
| Deploy    | Vercel                               |

### Başlangıç

Gereksinim: **Node.js 22.12+** ve **npm**. (Sanity Studio v6 bu sürümü şart koşuyor;
depodaki `.nvmrc` de 22'yi sabitler.)

```bash
npm install      # bağımlılıkları kur (husky hook'larını da devreye alır)
npm run dev      # geliştirme sunucusu → http://localhost:3000
```

Tarayıcıda `/` adresi otomatik olarak `/tr` diline yönlenir.

### Komutlar

| Komut                   | Açıklama                                                        |
| ----------------------- | --------------------------------------------------------------- |
| `npm run dev`           | Geliştirme sunucusu                                             |
| `npm run build`         | Production derlemesi (Vercel'in çalıştırdığı)                   |
| `npm run start`         | Derlenmiş uygulamayı sunar                                      |
| `npm run typecheck`     | Tip kontrolü (`tsc --noEmit`)                                   |
| `npm run lint`          | ESLint                                                          |
| `npm run format`        | Prettier ile biçimlendir                                        |
| `npm run format:check`  | Biçim kontrolü                                                  |
| `npm run content:types` | Sanity şemasından TypeScript tipleri üretir (`sanity.types.ts`) |
| **`npm run verify`**    | **typecheck + lint + format:check + build** (push kapısı & CI)  |

> `npm run verify` yeşilse Vercel de yeşildir. Bu komut hem `pre-push` hook'unda hem CI'da koşar.

### Proje Yapısı

```text
src/
  app/
    [locale]/            # /tr ve /en altındaki tüm rotalar
      layout.tsx         # Header + Footer + i18n sağlayıcı
      page.tsx           # Anasayfa
      not-found.tsx      # 404
      about/ projects/ blog/ community/ contact/ join/ privacy/
    studio/[[...tool]]/  # gömülü Sanity Studio (kendi kök layout'u var)
    api/revalidate/      # Sanity webhook'u → sayfaları tazeler
    globals.css
  components/            # Header, Footer, LocaleSwitcher, StatusBanner, ComingSoon
  components/blog/       # liste kartları, yazı düzeni, Portable Text eşlemesi
  i18n/                  # routing, request, navigation
  lib/blog.ts            # blog sorguları + cache etiketi
  lib/forms/            # form alanları + gönderim Server Action'ı
  sanity/                # şemalar, GROQ sorguları, istemci, Studio menüsü
  proxy.ts              # next-intl ara katmanı (Next 16'da "proxy")
  global.d.ts           # next-intl tip genişletmesi
messages/               # tr.json, en.json (tüm metinler burada)
docs/blog.md            # editörler için: blog yazısı nasıl yazılır
google-apps-script/     # form arka ucu (Sheets + e-posta)
sanity.config.ts        # Studio yapılandırması
sanity.types.ts         # şemadan üretilen tipler (elle düzenlenmez)
.github/workflows/      # CI
```

### Formlar

İletişim ve üyelik başvurusu formları bir Server Action üzerinden Google Apps Script
Web App'ine gider; oradan kayıt Google Sheets'e düşer, kulübe bildirim ve formu
dolduran kişiye onay e-postası çıkar.

```text
Tarayıcı ──▶ Server Action ──▶ Apps Script ──┬─▶ Sheets
             (doğrulama, spam)               ├─▶ kulübe bildirim
                                             └─▶ dolduran kişiye onay
```

Kurulum ve deploy adımları: **[`google-apps-script/README.md`](google-apps-script/README.md)**.
Gereken ortam değişkenleri (`FORM_ENDPOINT_URL`, `FORM_SHARED_SECRET`) için
[`.env.example`](.env.example) dosyasına bakın; ikisi tanımlı değilse formlar
"şu an devre dışı" hatası verir.

### Blog (Sanity)

Yazılar Sanity'de saklanır, editörler siteye gömülü Studio'dan yazar
(`/studio`). Yayınlanan yazı bir webhook'la siteyi tazeler; okuyucu tarafı
`/tr/blog` ve `/tr/blog/<adres>` sayfalarıdır.

```text
Studio (/studio) ──▶ Sanity Content Lake ──┬─▶ /blog sayfaları (GROQ ile okunur)
                                            └─▶ webhook ──▶ /api/revalidate
```

**Yazı yazacaksan:** kod bilmeye gerek yok, **[`docs/blog.md`](docs/blog.md)** yeter.

**Geliştirici notları:**

- Dil **doküman seviyesinde**: her dil ayrı bir `post` dokümanı, bağ
  `@sanity/document-internationalization` eklentisinin `translation.metadata`
  dokümanıyla kurulur. Bir yazının çevirisi olmak zorunda değildir.
- Şemayı değiştirdikten sonra **`npm run content:types`** çalıştır ve üretilen
  `sanity.types.ts` dosyasını commit'le — CI'da Sanity ortam değişkenleri
  olmadığı için orada üretilemez.
- Gövde biçimleri `src/sanity/schemaTypes/blockContent.ts` ile
  `src/components/blog/post-body.tsx` arasında **bire bir** yürümek zorundadır;
  şemaya eklenip render'a eklenmeyen bir biçim sitede sessizce kaybolur.
- Proje kimliği ve dataset adı gizli değildir (Studio istemcide çalışır) ve
  `src/sanity/env.ts` içinde yedek değerleri vardır; `SANITY_REVALIDATE_SECRET`
  ise gizlidir, [`.env.example`](.env.example) dosyasına bakın.

### Uluslararasılaştırma (i18n)

Tüm kullanıcı metinleri `messages/tr.json` ve `messages/en.json` sözlüklerinden gelir;
kodda sabit metin (hardcoded string) bulunmaz. Yeni bir metin eklerken **her iki dosyaya da**
aynı anahtarı ekleyin.

### Katkı ve İş Akışı

Branch modeli, commit kuralları ve PR süreci için **[CONTRIBUTING.md](CONTRIBUTING.md)** dosyasına bakın.
Özetle: `feat/*` → PR → `dev` → PR → `main`; commit'ler Conventional Commits; `main`'e doğrudan push yok.

### Ekip

| Kişi  | Sorumluluk                                         |
| ----- | -------------------------------------------------- |
| Erdem | Kurulum, branch/CI, sayfa iskeletleri, entegrasyon |
| Samet | Projeler sayfası verisi                            |
| Doğu  | Üye başvuru formu                                  |

### Lisans

[MIT](LICENSE) © 2026 YTÜ Blockchain Kulübü.

---

## English

### About

This repository holds the front-end of the club's website **and** its blog content management:
Sanity Studio is embedded in the site and opens at `/studio`. The site is bilingual (TR/EN);
sections without content yet ship with a "coming soon" template.

### Tech Stack

| Layer     | Choice                                 |
| --------- | -------------------------------------- |
| Framework | Next.js 16 (App Router)                |
| Language  | TypeScript (strict)                    |
| Styling   | Tailwind CSS v4                        |
| i18n      | next-intl (`/tr`, `/en`)               |
| Blog/CMS  | Sanity.io (Studio embedded, `/studio`) |
| Deploy    | Vercel                                 |

### Getting Started

Requires **Node.js 22.12+** and **npm**. (Sanity Studio v6 mandates it; the repo's
`.nvmrc` pins 22 as well.)

```bash
npm install      # install dependencies (also activates husky hooks)
npm run dev      # dev server → http://localhost:3000
```

Visiting `/` redirects to the default locale `/tr`.

### Scripts

| Command                 | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `npm run dev`           | Development server                                                    |
| `npm run build`         | Production build (the one Vercel runs)                                |
| `npm run start`         | Serves the built app                                                  |
| `npm run typecheck`     | Type checking (`tsc --noEmit`)                                        |
| `npm run lint`          | ESLint                                                                |
| `npm run format`        | Format with Prettier                                                  |
| `npm run format:check`  | Check formatting                                                      |
| `npm run content:types` | Generates TypeScript types from the Sanity schema (`sanity.types.ts`) |
| **`npm run verify`**    | **typecheck + lint + format:check + build** (push gate/CI)            |

> If `npm run verify` is green, Vercel is green too. It runs in both the `pre-push` hook and CI.

### Project Structure

```text
src/
  app/
    [locale]/            # all routes under /tr and /en
      layout.tsx         # Header + Footer + i18n provider
      page.tsx           # Landing
      not-found.tsx      # 404
      about/ projects/ blog/ community/ contact/ join/ privacy/
    studio/[[...tool]]/  # embedded Sanity Studio (has its own root layout)
    api/revalidate/      # Sanity webhook → refreshes the pages
    globals.css
  components/            # Header, Footer, LocaleSwitcher, StatusBanner, ComingSoon
  components/blog/       # list cards, post layout, Portable Text mapping
  i18n/                  # routing, request, navigation
  lib/blog.ts            # blog queries + cache tag
  lib/forms/            # form fields + submission Server Action
  sanity/                # schemas, GROQ queries, client, Studio structure
  proxy.ts              # next-intl middleware (called "proxy" in Next 16)
  global.d.ts           # next-intl type augmentation
messages/               # tr.json, en.json (all copy lives here)
docs/blog.md            # for editors: how to write a blog post (Turkish)
google-apps-script/     # form backend (Sheets + email)
sanity.config.ts        # Studio configuration
sanity.types.ts         # types generated from the schema (never edited by hand)
.github/workflows/      # CI
```

### Forms

The contact and membership application forms post through a Server Action to a
Google Apps Script Web App, which appends the record to Google Sheets, notifies
the club and sends a confirmation email to the person who submitted it.

```text
Browser ──▶ Server Action ──▶ Apps Script ──┬─▶ Sheets
            (validation, spam)              ├─▶ club notification
                                            └─▶ submitter confirmation
```

Setup and deployment steps: **[`google-apps-script/README.md`](google-apps-script/README.md)**.
See [`.env.example`](.env.example) for the required environment variables
(`FORM_ENDPOINT_URL`, `FORM_SHARED_SECRET`); without them the forms report that
submission is currently unavailable.

### Blog (Sanity)

Posts live in Sanity and editors write them in the Studio embedded in the site
(`/studio`). Publishing a post triggers a webhook that refreshes the site; the
reader-facing pages are `/tr/blog` and `/tr/blog/<slug>`.

```text
Studio (/studio) ──▶ Sanity Content Lake ──┬─▶ /blog pages (read via GROQ)
                                            └─▶ webhook ──▶ /api/revalidate
```

**Writing a post** needs no code — see **[`docs/blog.md`](docs/blog.md)** (Turkish).

**Developer notes:**

- Translation is **document-level**: each language is a separate `post`
  document, tied together by the `translation.metadata` document from
  `@sanity/document-internationalization`. A post need not exist in every language.
- After changing the schema run **`npm run content:types`** and commit the
  generated `sanity.types.ts` — CI has no Sanity environment variables, so it
  cannot generate them there.
- The body formats in `src/sanity/schemaTypes/blockContent.ts` and
  `src/components/blog/post-body.tsx` must stay **in lockstep**; a format added
  to the schema but not to the renderer disappears silently on the site.
- Project id and dataset are not secret (the Studio runs client-side) and have
  fallbacks in `src/sanity/env.ts`; `SANITY_REVALIDATE_SECRET` is secret — see
  [`.env.example`](.env.example).

### Internationalization (i18n)

All user-facing copy comes from the `messages/tr.json` and `messages/en.json` dictionaries; there are
no hardcoded strings in components. When adding new copy, add the same key to **both** files.

### Contributing & Workflow

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the branch model, commit rules and PR process. In short:
`feat/*` → PR → `dev` → PR → `main`; Conventional Commits; no direct pushes to `main`.

### Team

| Person | Responsibility                                  |
| ------ | ----------------------------------------------- |
| Erdem  | Setup, branch/CI, page scaffolding, integration |
| Samet  | Projects page data                              |
| Doğu   | Membership application form                     |

### License

[MIT](LICENSE) © 2026 YTÜ Blockchain Club.
