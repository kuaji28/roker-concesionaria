# GH Cars - Instalador de auto-arranque del watcher
# Crea acceso directo en la carpeta Startup de Windows del usuario actual.
# Al reiniciar Windows, el watcher arranca solo y oculto.

$ErrorActionPreference = "Stop"

$here   = Split-Path -Parent $MyInvocation.MyCommand.Path
$target = Join-Path $here "auto-deploy-hidden.vbs"

if (-not (Test-Path $target)) {
    Write-Host "ERROR: no existe $target" -ForegroundColor Red
    exit 1
}

$startup = [Environment]::GetFolderPath("Startup")
$shortcut = Join-Path $startup "GH Cars Auto Deploy.lnk"

$wsh = New-Object -ComObject WScript.Shell
$lnk = $wsh.CreateShortcut($shortcut)
$lnk.TargetPath        = "wscript.exe"
$lnk.Arguments         = "`"$target`""
$lnk.WorkingDirectory  = $here
$lnk.WindowStyle       = 7   # minimizado (igual el VBS lo hace invisible)
$lnk.Description       = "GH Cars auto-deploy watcher (oculto)"
$lnk.Save()

Write-Host ""
Write-Host " OK - Acceso directo creado en:" -ForegroundColor Green
Write-Host "   $shortcut" -ForegroundColor Gray
Write-Host ""
Write-Host " Lanzando watcher AHORA (oculto)..." -ForegroundColor Yellow
Start-Process "wscript.exe" -ArgumentList "`"$target`"" -WindowStyle Hidden

Start-Sleep -Seconds 2

# Verificar que el proceso arrancó
$procs = Get-Process -Name "powershell","wscript" -ErrorAction SilentlyContinue |
         Where-Object { $_.CommandLine -like "*auto-deploy*" -or $_.MainWindowTitle -eq "" }
$watcherActive = (Get-WmiObject Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
                  Where-Object { $_.CommandLine -like "*auto-deploy-watcher*" })

if ($watcherActive) {
    Write-Host " OK - Watcher corriendo en background (PID $($watcherActive.ProcessId))" -ForegroundColor Green
} else {
    Write-Host " AVISO: no detecto el proceso. Probá reiniciar Windows o lanzar manual:" -ForegroundColor Yellow
    Write-Host "   wscript `"$target`"" -ForegroundColor Gray
}

Write-Host ""
Write-Host " A partir de ahora el watcher arranca SOLO al iniciar Windows."
Write-Host " Para DESINSTALAR: borrar el acceso directo de la carpeta Startup,"
Write-Host " o correr: Remove-Item `"$shortcut`""
Write-Host ""
Write-Host " Para verificar que esta corriendo en cualquier momento:" -ForegroundColor Cyan
Write-Host "   Get-Process powershell | ? CommandLine -match 'auto-deploy-watcher'"
Write-Host ""
