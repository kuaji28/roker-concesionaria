@echo off
REM Instala el watcher para que arranque solo al iniciar Windows (oculto).
REM Doble click una sola vez y queda configurado.
title GH Cars - Instalar auto-arranque
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-autostart.ps1"
pause
