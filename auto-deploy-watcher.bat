@echo off
REM Lanzador del watcher PowerShell. Para uso visible (debug).
REM Para uso silencioso usar auto-deploy-hidden.vbs.
title GH Cars - Auto Deploy Watcher
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0auto-deploy-watcher.ps1"
