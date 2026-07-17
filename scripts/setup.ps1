<#
  Katılımcı kurulumu (idempotent): bağımlılıkları kurar ve kalite kapısını çalıştırır.
  Kullanım:  powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
  Önkoşul:   Node.js (.nvmrc ile uyumlu major), npm.
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# Node major sürümü .nvmrc ile uyumlu mu? (uyarı — zorlama değil)
if (Test-Path .nvmrc) {
  $want = (Get-Content .nvmrc -Raw).Trim().TrimStart('v')
  $have = (node -v 2>$null)
  if ($have -and $want -match '^[0-9]') {
    $have = $have.TrimStart('v')
    if ($have.Split('.')[0] -ne $want.Split('.')[0]) {
      Write-Warning "Node $have kullanılıyor; .nvmrc major $($want.Split('.')[0]) istiyor."
    }
  }
}

Write-Host "-> Bağımlılıklar kuruluyor (npm ci)..."
npm ci
if ($LASTEXITCODE -ne 0) { throw "npm ci başarısız oldu." }

Write-Host "-> Kalite kapısı çalıştırılıyor (npm run verify)..."
npm run verify
if ($LASTEXITCODE -ne 0) { throw "verify başarısız oldu." }

Write-Host "✓ Kurulum tamam. 'npm run dev' ile geliştirmeye başlayabilirsin."
