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

Bu depo, kulübün web sitesinin ön yüzünü barındırır. Blog içeriği ayrı bir depoda
([`ytu-blockchain-sanity`](https://github.com/YTU-BLOCKCHAIN)) Sanity CMS ile yönetilir.
Site iki dillidir (TR/EN) ve içerik hazır olmayan bölümler "çok yakında" şablonuyla yayınlanır.

### Teknoloji

| Katman    | Seçim                                |
| --------- | ------------------------------------ |
| Framework | Next.js 16 (App Router)              |
| Dil       | TypeScript (strict)                  |
| Stil      | Tailwind CSS v4                      |
| i18n      | next-intl (`/tr`, `/en`)             |
| Blog/CMS  | Sanity.io (yalnızca blog, ayrı depo) |
| Deploy    | Vercel                               |

### Başlangıç

Gereksinim: **Node.js 20.9+** ve **npm**.

```bash
npm install      # bağımlılıkları kur (husky hook'larını da devreye alır)
npm run dev      # geliştirme sunucusu → http://localhost:3000
```

Tarayıcıda `/` adresi otomatik olarak `/tr` diline yönlenir.

### Komutlar

| Komut                  | Açıklama                                                       |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Geliştirme sunucusu                                            |
| `npm run build`        | Production derlemesi (Vercel'in çalıştırdığı)                  |
| `npm run start`        | Derlenmiş uygulamayı sunar                                     |
| `npm run typecheck`    | Tip kontrolü (`tsc --noEmit`)                                  |
| `npm run lint`         | ESLint                                                         |
| `npm run format`       | Prettier ile biçimlendir                                       |
| `npm run format:check` | Biçim kontrolü                                                 |
| **`npm run verify`**   | **typecheck + lint + format:check + build** (push kapısı & CI) |

> `npm run verify` yeşilse Vercel de yeşildir. Bu komut hem `pre-push` hook'unda hem CI'da koşar.

### Proje Yapısı

```text
src/
  app/
    [locale]/            # /tr ve /en altındaki tüm rotalar
      layout.tsx         # Header + Footer + i18n sağlayıcı
      page.tsx           # Anasayfa
      not-found.tsx      # 404
      about/ projects/ blog/ community/ sponsors/ contact/ join/
    globals.css
  components/            # Header, Footer, LocaleSwitcher, StatusBanner, ComingSoon
  i18n/                  # routing, request, navigation
  proxy.ts              # next-intl ara katmanı (Next 16'da "proxy")
  global.d.ts           # next-intl tip genişletmesi
messages/               # tr.json, en.json (tüm metinler burada)
.github/workflows/      # CI
```

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

This repository holds the front-end of the club's website. Blog content is managed with Sanity CMS
in a separate repository ([`ytu-blockchain-sanity`](https://github.com/YTU-BLOCKCHAIN)). The site is
bilingual (TR/EN); sections without content yet ship with a "coming soon" template.

### Tech Stack

| Layer     | Choice                               |
| --------- | ------------------------------------ |
| Framework | Next.js 16 (App Router)              |
| Language  | TypeScript (strict)                  |
| Styling   | Tailwind CSS v4                      |
| i18n      | next-intl (`/tr`, `/en`)             |
| Blog/CMS  | Sanity.io (blog only, separate repo) |
| Deploy    | Vercel                               |

### Getting Started

Requires **Node.js 20.9+** and **npm**.

```bash
npm install      # install dependencies (also activates husky hooks)
npm run dev      # dev server → http://localhost:3000
```

Visiting `/` redirects to the default locale `/tr`.

### Scripts

| Command                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev`          | Development server                                         |
| `npm run build`        | Production build (the one Vercel runs)                     |
| `npm run start`        | Serves the built app                                       |
| `npm run typecheck`    | Type checking (`tsc --noEmit`)                             |
| `npm run lint`         | ESLint                                                     |
| `npm run format`       | Format with Prettier                                       |
| `npm run format:check` | Check formatting                                           |
| **`npm run verify`**   | **typecheck + lint + format:check + build** (push gate/CI) |

> If `npm run verify` is green, Vercel is green too. It runs in both the `pre-push` hook and CI.

### Project Structure

```text
src/
  app/
    [locale]/            # all routes under /tr and /en
      layout.tsx         # Header + Footer + i18n provider
      page.tsx           # Landing
      not-found.tsx      # 404
      about/ projects/ blog/ community/ sponsors/ contact/ join/
    globals.css
  components/            # Header, Footer, LocaleSwitcher, StatusBanner, ComingSoon
  i18n/                  # routing, request, navigation
  proxy.ts              # next-intl middleware (called "proxy" in Next 16)
  global.d.ts           # next-intl type augmentation
messages/               # tr.json, en.json (all copy lives here)
.github/workflows/      # CI
```

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
