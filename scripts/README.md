# scripts/

Depo kurulum ve ops işleri için tekrarlanabilir, idempotent script'ler. Kurulum/init
adımları ad-hoc komut yerine burada toplanır (reproducibility + ekip onboarding).

## `setup.sh` / `setup.ps1`

Katılımcı kurulumu: bağımlılıkları kurar (`npm ci`) ve kalite kapısını (`npm run verify`)
çalıştırır. Depoyu klonladıktan sonra ilk çalıştırılacak script.

```bash
# Linux / macOS / Git Bash
bash scripts/setup.sh
```

```powershell
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
```

## `apply-branch-protection.sh`

`main` ve `dev` için branch protection kurallarını `branch-protection/*.json`'dan uygular.
Kurallar kod içinde versiyonlanır; GitHub arayüzünden elle tıklamaya gerek kalmaz.

```bash
bash scripts/apply-branch-protection.sh with-ci   # verify required AÇIK (hedef)
bash scripts/apply-branch-protection.sh no-ci      # required check yok (mevcut geçici durum)
```

**Önkoşul:** `gh` CLI kurulu + `gh auth login` + repo/org admin yetkisi.

### ⚠️ `with-ci` ne zaman uygulanmalı?

CI workflow'u şu an **yalnızca manuel** (`workflow_dispatch`) tetikleniyor; `push` ve
`pull_request` olayları org-seviye Actions politikası nedeniyle workflow'u çalıştırmıyor.
Bu düzelmeden `with-ci` uygulanırsa `verify` required check'i hiçbir PR'da oluşmaz ve
PR'lar **merge edilemez** (deadlock). Bu yüzden repo şu an `no-ci` modunda.

**Sıra:** (1) Org → Settings → Actions → General'dan push/PR tetiklemesi açılır →
(2) bir PR'da `verify` check'inin otomatik koştuğu doğrulanır →
(3) `bash scripts/apply-branch-protection.sh with-ci` çalıştırılır.

### `branch-protection/*.json`

GitHub Branch Protection API'sinin `PUT .../branches/{branch}/protection` gövdeleridir:

- `no-ci.json` — mevcut geçici durum (required status check yok).
- `with-ci.json` — hedef durum (`verify` required + strict / branch güncel olmalı).

Ortak kurallar: PR zorunlu (review=0), `enforce_admins`, linear history, force-push ve
silme kapalı.
