@echo off
setlocal
echo.
echo  =====================================================
echo   GH Cars - Deploy fix de Specs IA (frontend + backend)
echo  =====================================================
echo.
echo  Este script va a:
echo    1) Pushear la branch claude/nifty-visvesvaraya-af9826 a GitHub
echo    2) Mergear esa branch en main (sin fast-forward)
echo    3) Pushear main a GitHub
echo    4) Deploy del frontend a Vercel (subtree split + push force)
echo    5) Deploy del backend a Fly.io (flyctl deploy)
echo.
set /p CONFIRM=Continuar? (S/N):
if /i not "%CONFIRM%"=="S" (
    echo Cancelado por el usuario.
    pause
    exit /b 0
)

echo.
echo [1/5] Pusheando branch del worktree a origin...
cd /d "C:\Users\kuaji\Documents\roker_nexus\.claude\worktrees\nifty-visvesvaraya-af9826"
git push -u origin claude/nifty-visvesvaraya-af9826
if errorlevel 1 (
    echo ERROR: Fallo el push de la branch. Abortando.
    pause
    exit /b 1
)

echo.
echo [2/5] Cambiando a repo principal y mergeando a main...
cd /d "C:\Users\kuaji\Documents\roker_nexus"
git checkout main
if errorlevel 1 (
    echo ERROR: No se pudo cambiar a main. Verificar que no haya cambios sin commitear.
    pause
    exit /b 1
)
git pull origin main
git merge --no-ff claude/nifty-visvesvaraya-af9826 -m "merge: fix specs IA + delete vehiculo + dashboard KPIs (sprint 3)"
if errorlevel 1 (
    echo ERROR: Conflicto de merge. Resolver manualmente y reintentar.
    pause
    exit /b 1
)

echo.
echo [3/5] Pusheando main a GitHub...
git push origin main
if errorlevel 1 (
    echo ERROR: Fallo el push de main.
    pause
    exit /b 1
)

echo.
echo [4/5] Deploy frontend a Vercel via subtree...
git branch -D concesionaria-deploy 2>nul
git subtree split --prefix=sistemas/concesionaria/gh-cars-web -b concesionaria-deploy
if errorlevel 1 (
    echo ERROR: Fallo el subtree split.
    pause
    exit /b 1
)
git push concesionaria concesionaria-deploy:main --force
if errorlevel 1 (
    echo ERROR: Fallo el push a Vercel. Verificar remote 'concesionaria'.
    pause
    exit /b 1
)

echo.
echo [5/5] Deploy backend a Fly.io...
cd /d "C:\Users\kuaji\Documents\roker_nexus\sistemas\concesionaria\gh-cars-api"
where flyctl >nul 2>&1
if errorlevel 1 (
    echo ADVERTENCIA: flyctl no esta en PATH. Salteo deploy backend.
    echo Si ya esta instalado, ejecutar manual: cd gh-cars-api ^&^& flyctl deploy
    goto FIN
)
flyctl deploy
if errorlevel 1 (
    echo ERROR: Fallo flyctl deploy.
    pause
    exit /b 1
)

:FIN
echo.
echo  =====================================================
echo   Deploy completo. Esperar ~1 min y recargar:
echo     Frontend: https://gh-cars-web.vercel.app
echo     Backend:  https://gh-cars-api.fly.dev/docs
echo  =====================================================
echo.
echo  Probar: ingresar nuevo vehiculo, escanear cedula,
echo  pasar a pestana Specs y verificar que se completen
echo  los campos automaticamente.
echo.
pause
endlocal
