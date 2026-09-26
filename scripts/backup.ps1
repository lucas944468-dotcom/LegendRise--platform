# LegendRise Postgres backup routine (IMPLEMENTATION_PLAN Phase 10 — data gate).
# Requires: local PostgreSQL client tools (pg_dump) + DATABASE_URL in .env
# Usage (PowerShell, from repo root):  .\scripts\backup.ps1
# Restores with: pg_restore --dbname=$DATABASE_URL --clean <dumpfile>

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$backupDir = Join-Path $root "backups"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$out = Join-Path $backupDir ("legendrise-" + $stamp + ".dump")

if (-not $env:DATABASE_URL) {
  # Fall back to .env file when the variable is not exported in the shell.
  $envLine = Get-Content (Join-Path $root ".env") -ErrorAction SilentlyContinue |
    Where-Object { $_ -match "^DATABASE_URL=" } | Select-Object -First 1
  if ($envLine) { $env:DATABASE_URL = ($envLine -split "=", 2)[1].Trim('"') }
}
if (-not $env:DATABASE_URL) { throw "DATABASE_URL is not set (shell or .env)." }

& pg_dump --format=custom --file=$out --dbname=$env:DATABASE_URL
Write-Output ("Backup written: {0}" -f $out)

# Retention: keep the newest 14 dumps, delete older ones.
Get-ChildItem (Join-Path $backupDir "legendrise-*.dump") |
  Sort-Object LastWriteTime -Descending |
  Select-Object -Skip 14 |
  Remove-Item -Force
Write-Output "Retention applied (newest 14 kept)."
