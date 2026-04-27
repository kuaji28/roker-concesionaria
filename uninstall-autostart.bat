@echo off
title GH Cars - Desinstalar auto-arranque
echo.
echo Borrando acceso directo del Startup...
powershell -NoProfile -Command "Remove-Item ([Environment]::GetFolderPath('Startup') + '\GH Cars Auto Deploy.lnk') -ErrorAction SilentlyContinue; Write-Host 'OK' -ForegroundColor Green"
echo.
echo Matando watcher en ejecucion...
powershell -NoProfile -Command "Get-WmiObject Win32_Process -Filter \"Name='powershell.exe'\" | ? { $_.CommandLine -match 'auto-deploy-watcher' } | % { Stop-Process -Id $_.ProcessId -Force; Write-Host ('Killed PID ' + $_.ProcessId) -ForegroundColor Yellow }"
echo.
echo Listo.
pause
