# Katkı Rehberi · Contributing Guide

> Türkçe önce, English below.

## Türkçe

Bu projeye katkıda bulunduğun için teşekkürler! Aşağıdaki kurallar, geçmişi temiz ve
Vercel deploy'unu her zaman yeşil tutmak içindir.

### Gereksinimler

- **Node.js 20.9+** ve **npm**
- Depoyu klonlayıp `npm install` çalıştır (husky hook'ları otomatik kurulur).

### Branch Modeli

```
main            → production (Vercel Production)
 └── dev        → integration (Vercel Preview)
      └── feat/* fix/* chore/* docs/* → özellik dalları
```

- `main`'e **doğrudan push yok**. Her şey `dev` üzerinden geçer.
- Özellik dalları `dev`'den açılır, iş bitince `dev`'e **PR** ile döner.
- `dev` → `main` de **PR** ile ilerler.
- Dal adı örnekleri: `feat/landing`, `fix/header-overflow`, `docs/readme`.

### Commit Kuralı — Conventional Commits

Her commit `type(scope): açıklama` biçiminde ve **tek bir mantıksal değişiklik** olmalı.
`commit-msg` hook'u (commitlint) kuralı zorunlu kılar.

İzinli tipler: `feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert`.

```
feat(blog): add sanity portable text renderer
fix(i18n): correct fallback locale handling
docs: add contributing guide
```

- "feat + fix + refactor" tek commit'te olmaz.
- 500 dosyalık tek push yok; üretilmiş dosyalar (`node_modules`, `.next`) zaten `.gitignore`'da.

### Kalite Kapıları (otomatik)

| Aşama        | Ne çalışır                        | Amaç                                    |
| ------------ | --------------------------------- | --------------------------------------- |
| `pre-commit` | `lint-staged` (eslint + prettier) | Stage'lenen dosyalar temiz olsun        |
| `commit-msg` | `commitlint`                      | Conventional commit zorunluluğu         |
| `pre-push`   | `npm run verify`                  | Tip/lint/format/build hatası → push yok |
| CI (PR)      | `npm run verify`                  | Sunucu tarafı güvenlik ağı              |

### PR Açmadan Önce

```bash
npm run verify   # typecheck + lint + format:check + build — hepsi yeşil olmalı
```

- Yeni metin eklediysen **hem `messages/tr.json` hem `messages/en.json`**'a anahtarı ekle.
- PR küçük ve odaklı olsun: bir sayfa / bir özellik = bir PR.
- PR şablonundaki kontrol listesini doldur.

## English

Thanks for contributing! These rules keep the history clean and the Vercel deploy always green.

### Requirements

- **Node.js 20.9+** and **npm**
- Clone the repo and run `npm install` (husky hooks are set up automatically).

### Branch Model

```
main            → production (Vercel Production)
 └── dev        → integration (Vercel Preview)
      └── feat/* fix/* chore/* docs/* → feature branches
```

- **No direct pushes to `main`.** Everything goes through `dev`.
- Branch off `dev` for features; open a **PR** back into `dev`.
- `dev` → `main` also happens via **PR**.

### Commit Convention — Conventional Commits

Each commit is `type(scope): description` and a **single logical change**. The `commit-msg`
hook (commitlint) enforces this.

Allowed types: `feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert`.

### Quality Gates (automated)

| Stage        | Runs                              | Purpose                                  |
| ------------ | --------------------------------- | ---------------------------------------- |
| `pre-commit` | `lint-staged` (eslint + prettier) | Keep staged files clean                  |
| `commit-msg` | `commitlint`                      | Enforce conventional commits             |
| `pre-push`   | `npm run verify`                  | No push on type/lint/format/build errors |
| CI (PR)      | `npm run verify`                  | Server-side safety net                   |

### Before Opening a PR

```bash
npm run verify   # typecheck + lint + format:check + build — all must be green
```

- If you add copy, add the key to **both `messages/tr.json` and `messages/en.json`**.
- Keep PRs small and focused: one page / one feature per PR.
- Fill in the checklist in the PR template.
