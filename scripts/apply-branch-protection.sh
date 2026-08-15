#!/usr/bin/env bash
#
# Branch protection kurallarını versiyonlanmış JSON'dan main ve dev'e uygular.
# Katkı kapısı `dev`: her şey oraya PR ile iner ve orada squash'lanır. `main` ise
# yalnızca "prod şu an burada" işaretçisi; sürümü bakımcı yerelden `git merge dev`
# ile alıp push eder. Ayrıntı: scripts/README.md.
#
# Kullanım:  bash scripts/apply-branch-protection.sh [with-ci|no-ci]
#   with-ci  → `verify` required status check AÇIK (hedef durum).
#   no-ci    → required status check yok (mevcut geçici durum).
#
# Önkoşul:   gh CLI kurulu + `gh auth login` yapılmış + repo/org admin yetkisi.
#
# ⚠️  DİKKAT: `with-ci` yalnızca CI push/pull_request üzerinde OTOMATİK çalışıyorsa
#     uygulanmalı. Aksi halde required check hiç oluşmaz ve PR'lar merge edilemez
#     (deadlock). Ayrıntı: scripts/README.md.
#
set -euo pipefail

REPO="${REPO:-YTU-BLOCKCHAIN/ytu-blockchain-web}"
MODE="${1:-with-ci}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG="${SCRIPT_DIR}/branch-protection/${MODE}.json"

if [[ ! -f "$CONFIG" ]]; then
  echo "Hata: geçersiz mod '${MODE}'. Kullanım: $0 [with-ci|no-ci]" >&2
  exit 1
fi

if [[ "$MODE" == "with-ci" ]]; then
  echo "⚠️  with-ci: CI otomatik tetiklenmiyorsa PR'lar deadlock'a girer. Devam ediliyor..." >&2
fi

# Dal başına gövdeyi üretir. `dev` JSON'u olduğu gibi alır. `main` üç noktada
# gevşer — üçü de aynı sebebe dayanıyor: `main` bir işbirliği yüzeyi değil, sürüm
# işaretçisi. İnceleme `dev`'e inen PR'da zaten yapılmış oluyor.
#
#   required_linear_history: false → sürüm `dev`'den merge commit ile alınır.
#     Açık bırakılırsa GitHub merge commit'i reddeder; squash'a mecbur kalınır ve
#     `main` ile `dev` SHA olarak ayrışır. O ayrışma her sürümde `dev -> main`
#     PR'ının İÇERİK FARKI OLMADAN çakışmasına yol açıyordu (PR #58, PR #84).
#
#   required_pull_request_reviews: null → sürüm için PR şartı yok. Bakımcı
#     yerelde `git switch main && git merge dev && git push` yapar. Kendi kendine
#     onayladığın (review=0) bir PR'ın kattığı değer, açtığı çakışma sorunundan
#     azdı.
#
#   enforce_admins: false → bakımcı tıkanınca kuralı devre dışı bırakmadan
#     ilerleyebilsin.
#
# Force-push ve dal silme koruması İKİ DALDA DA açık kalır: bunlar sürtünme
# yaratmıyor ama geri dönülmez hataları engelliyor.
#
# Override JSON'u ayrı bir dosyaya kopyalamak yerine burada üretiliyor: tek kaynak
# kalsın, iki dosya zamanla birbirinden kaymasın. jq her yerde yok; node zaten
# deponun ön koşulu.
render_config() {
  if [[ "$1" == "main" ]]; then
    node -e '
      const fs = require("node:fs");
      const config = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      config.required_linear_history = false;
      config.required_pull_request_reviews = null;
      config.enforce_admins = false;
      process.stdout.write(JSON.stringify(config, null, 2));
    ' "$CONFIG"
  else
    cat "$CONFIG"
  fi
}

echo "Repo: ${REPO}  ·  Mod: ${MODE}"
for branch in main dev; do
  echo "→ ${branch} koruması uygulanıyor..."
  render_config "$branch" |
    gh api -X PUT "repos/${REPO}/branches/${branch}/protection" --input - >/dev/null
  echo "  ✓ ${branch}"
done
echo "Bitti."
