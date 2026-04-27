# =====================================================
#  GH Cars - Auto-deploy watcher
#  Vigila cambios en gh-cars-web/src y gh-cars-api/
#  del REPO PRINCIPAL (no worktrees).
#  Cuando detecta cambios: commit (si los hay) + subtree split + deploy
#  Debounce: 30 segundos sin cambios antes de deployar
# =====================================================

$ErrorActionPreference = "Continue"
$REPO_ROOT  = "C:\Users\kuaji\Documents\roker_nexus"
$WEB_DIR    = "$REPO_ROOT\sistemas\concesionaria\gh-cars-web"
$API_DIR    = "$REPO_ROOT\sistemas\concesionaria\gh-cars-api"
$WATCH_WEB  = "$WEB_DIR\src"
$WATCH_API  = $API_DIR
$DEBOUNCE_S = 30

Write-Host ""
Write-Host " =====================================================" -ForegroundColor Cyan
Write-Host "  GH Cars - Auto-deploy watcher" -ForegroundColor Cyan
Write-Host " =====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " Monitoreando (repo principal):" -ForegroundColor White
Write-Host "   FRONT: $WATCH_WEB" -ForegroundColor Gray
Write-Host "   API:   $WATCH_API" -ForegroundColor Gray
Write-Host " Debounce: $DEBOUNCE_S segundos sin cambios antes de deployar" -ForegroundColor White
Write-Host ""
Write-Host " Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

$global:lastChange  = [datetime]::MinValue
$global:webChanged  = $false
$global:apiChanged  = $false
$global:deploying   = $false

function Should-Ignore($path) {
    if ($path -match "\\node_modules\\") { return $true }
    if ($path -match "\\dist\\")          { return $true }
    if ($path -match "\\\.git\\")         { return $true }
    if ($path -match "\\__pycache__\\")   { return $true }
    if ($path -match "\.pyc$")            { return $true }
    if ($path -match "\.swp$")            { return $true }
    if ($path -match "~$")                { return $true }
    return $false
}

function Run-Deploy {
    if ($global:deploying) { return }
    $global:deploying = $true

    $ts = Get-Date -Format "HH:mm:ss"
    Write-Host ""
    Write-Host "[$ts] === DEPLOY DISPARADO ===" -ForegroundColor Green
    Write-Host "  web cambio: $global:webChanged | api cambio: $global:apiChanged"

    try {
        Set-Location $REPO_ROOT

        # 1) Commit pendiente en main (si los hay)
        $status = git status --porcelain 2>$null
        if ($status) {
            Write-Host "[$ts] Commit auto en main..." -ForegroundColor Yellow
            git add -A 2>&1 | Out-Null
            $msg = "auto: deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
            git commit -m $msg 2>&1 | Out-Null
        }

        # 2) Deploy frontend (subtree split + push a Vercel via concesionaria remote)
        if ($global:webChanged) {
            Write-Host "[$ts] Deploy frontend Vercel (subtree split)..." -ForegroundColor Yellow
            git branch -D concesionaria-deploy 2>&1 | Out-Null
            git subtree split --prefix=sistemas/concesionaria/gh-cars-web -b concesionaria-deploy 2>&1 | Out-Host
            if ($LASTEXITCODE -eq 0) {
                git push concesionaria concesionaria-deploy:main --force 2>&1 | Out-Host
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "[$ts] Frontend deplorado OK" -ForegroundColor Green
                } else {
                    Write-Host "[$ts] git push a concesionaria fallo" -ForegroundColor Red
                }
            } else {
                Write-Host "[$ts] subtree split fallo" -ForegroundColor Red
            }
        }

        # 3) Deploy backend Fly.io (solo si cambio gh-cars-api)
        if ($global:apiChanged) {
            $flyctl = Get-Command flyctl -ErrorAction SilentlyContinue
            if ($flyctl) {
                Write-Host "[$ts] Deploy backend Fly.io..." -ForegroundColor Yellow
                Set-Location $API_DIR
                flyctl deploy 2>&1 | Out-Host
            } else {
                Write-Host "[$ts] flyctl no esta en PATH - salteando backend" -ForegroundColor DarkYellow
            }
        }

        Write-Host "[$ts] === DEPLOY OK ===" -ForegroundColor Green
        Write-Host "  Frontend: https://gh-cars-web.vercel.app" -ForegroundColor Cyan
        Write-Host "  Backend:  https://gh-cars-api.fly.dev/docs" -ForegroundColor Cyan
        Write-Host ""

    } catch {
        Write-Host "[$ts] ERROR: $_" -ForegroundColor Red
    } finally {
        Set-Location $REPO_ROOT
        $global:webChanged = $false
        $global:apiChanged = $false
        $global:deploying  = $false
    }
}

# Configurar watchers
$watchers = @()

function New-Watcher($path) {
    $w = New-Object System.IO.FileSystemWatcher
    $w.Path = $path
    $w.IncludeSubdirectories = $true
    $w.EnableRaisingEvents = $true
    $w.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName -bor [System.IO.NotifyFilters]::DirectoryName
    return $w
}

if (Test-Path $WATCH_WEB) {
    $wWeb = New-Watcher $WATCH_WEB
    $watchers += $wWeb
    Register-ObjectEvent -InputObject $wWeb -EventName Changed -Action {
        if (-not (Should-Ignore $Event.SourceEventArgs.FullPath)) {
            $global:lastChange = Get-Date
            $global:webChanged = $true
            Write-Host "  [WEB] $(Split-Path $Event.SourceEventArgs.FullPath -Leaf)" -ForegroundColor DarkGray
        }
    } | Out-Null
    Register-ObjectEvent -InputObject $wWeb -EventName Created -Action {
        if (-not (Should-Ignore $Event.SourceEventArgs.FullPath)) {
            $global:lastChange = Get-Date
            $global:webChanged = $true
        }
    } | Out-Null
    Write-Host "[INIT] Watcher WEB activo: $WATCH_WEB" -ForegroundColor Green
} else {
    Write-Host "[WARN] Directorio WEB no encontrado: $WATCH_WEB" -ForegroundColor Yellow
}

if (Test-Path $WATCH_API) {
    $wApi = New-Watcher $WATCH_API
    $watchers += $wApi
    Register-ObjectEvent -InputObject $wApi -EventName Changed -Action {
        $p = $Event.SourceEventArgs.FullPath
        if (-not (Should-Ignore $p) -and ($p -match "\.py$" -or $p -match "\.toml$")) {
            $global:lastChange = Get-Date
            $global:apiChanged = $true
            Write-Host "  [API] $(Split-Path $p -Leaf)" -ForegroundColor DarkGray
        }
    } | Out-Null
    Write-Host "[INIT] Watcher API activo: $WATCH_API" -ForegroundColor Green
}

Write-Host "[INIT] Esperando cambios..." -ForegroundColor Green
Write-Host ""

try {
    while ($true) {
        Start-Sleep -Seconds 5
        if ($global:lastChange -ne [datetime]::MinValue) {
            $elapsed = (Get-Date) - $global:lastChange
            if ($elapsed.TotalSeconds -ge $DEBOUNCE_S -and -not $global:deploying) {
                $global:lastChange = [datetime]::MinValue
                Run-Deploy
            }
        }
    }
} finally {
    Write-Host ""
    Write-Host "[STOP] Limpiando watchers..." -ForegroundColor Yellow
    Get-EventSubscriber | Unregister-Event
    foreach ($w in $watchers) { $w.EnableRaisingEvents = $false; $w.Dispose() }
    Write-Host "[STOP] Detenido." -ForegroundColor Yellow
}
