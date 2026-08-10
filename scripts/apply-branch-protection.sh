#!/usr/bin/env bash
#
# Branch protection kurallarını versiyonlanmış JSON'dan main ve dev'e uygular.
# `main` tek noktada ayrışır: linear history kapalı (sürümler merge commit ile
# alınıyor). Ayrıntı: scripts/README.md.
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

# Dal başına gövdeyi üretir. `main` tek farkla ayrışır: `required_linear_history`
# KAPALI, çünkü sürümler `dev`'den merge commit ile alınıyor (linear history açıkken
# GitHub merge commit'i reddeder). `dev` linear kalır — oraya her şey squash iner.
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
