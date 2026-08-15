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

JSON gövdesi `dev`'in kurallarıdır: PR zorunlu (review=0), `enforce_admins`, linear
history, force-push ve silme kapalı. Script `main`'e uygularken üç alanı gevşetir.

### `main` neden `dev`'den gevşek?

`dev` katkı kapısıdır — inceleme, CI ve squash orada olur. `main` ise bir işbirliği
yüzeyi değil, yalnızca **"prod şu an burada"** işaretçisidir. `dev`'e inen PR'da yapılan
denetimi `main`'de tekrarlamak koruma değil, sadece tören. Bu yüzden script `main`'e
şunları uygular:

| Alan                            | `dev`   | `main`  | Neden                                               |
| ------------------------------- | ------- | ------- | --------------------------------------------------- |
| `required_linear_history`       | `true`  | `false` | Sürüm merge commit ile alınır (aşağıya bak)         |
| `required_pull_request_reviews` | PR şart | `null`  | Sürüm için PR şartı yok; bakımcı yerelden merge'ler |
| `enforce_admins`                | `true`  | `false` | Bakımcı tıkanınca korumayı sökmeden ilerleyebilsin  |
| `allow_force_pushes`            | kapalı  | kapalı  | **İkisinde de kapalı** — geri dönülmez              |
| `allow_deletions`               | kapalı  | kapalı  | **İkisinde de kapalı** — geri dönülmez              |

Sürüm alma böylece PR'sız ve çakışmasız:

```bash
git switch main && git merge dev && git push   # Vercel Production tetiklenir
```

#### Linear history neden `main`'de kapalı?

Açık bırakılırsa GitHub merge commit'i reddeder ve sürüm squash'a mecbur kalır. Squash
inen sürümün kaydı `dev`'in geçmişinde yer almadığı için iki dalın **ortak atası ilk
günlerde takılı kalır**; sonraki her sürümde `dev → main` **içerik farkı olmadan**
çakışır (bkz. kapatılan PR #58 ve PR #84 — aynı hata iki kez yaşandı). Merge commit
`dev`'i `main`'in ataları arasına soktuğu için ortak ata güncellenir ve sonraki sürümler
temiz akar.

Bedeli: `main` artık "her sürüm tek kayıt" değil, `dev`'in tüm geçmişini taşır.
