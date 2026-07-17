#!/usr/bin/env bash
#
# Katılımcı kurulumu (idempotent): bağımlılıkları kurar ve kalite kapısını çalıştırır.
# Kullanım:  bash scripts/setup.sh
# Önkoşul:   Node.js (.nvmrc ile uyumlu major), npm.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Node major sürümü .nvmrc ile uyumlu mu? (uyarı — zorlama değil)
if [[ -f .nvmrc ]]; then
  want="$(tr -d 'v[:space:]' < .nvmrc)"
  have="$(node -v 2>/dev/null | tr -d 'v')" || have=""
  if [[ -n "$have" && "$want" =~ ^[0-9] && "${have%%.*}" != "${want%%.*}" ]]; then
    echo "Uyarı: Node ${have} kullanılıyor; .nvmrc major ${want%%.*} istiyor." >&2
  fi
fi

echo "→ Bağımlılıklar kuruluyor (npm ci)..."
npm ci

echo "→ Kalite kapısı çalıştırılıyor (npm run verify)..."
npm run verify

echo "✓ Kurulum tamam. 'npm run dev' ile geliştirmeye başlayabilirsin."
