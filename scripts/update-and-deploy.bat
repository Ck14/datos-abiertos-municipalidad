@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0.."

echo === Actualizar presupuesto y desplegar ===

git status --porcelain > "%TEMP%\gitstatus.tmp"
for /f %%A in ("%TEMP%\gitstatus.tmp") do set STATUS_SIZE=%%~zA
del "%TEMP%\gitstatus.tmp"
if not "%STATUS_SIZE%"=="0" (
    echo ERROR: hay cambios sin commitear en el repo. Commitea o guarda en stash antes de correr este script.
    git status --short
    exit /b 1
)

git checkout develop
if errorlevel 1 goto :error

git pull origin develop
if errorlevel 1 goto :error

node scripts\fetch-budget.mjs
if errorlevel 1 goto :error

git add src\data\chimaltenango_presupuesto_*.json src\data\config.json

git diff --cached --quiet
if not errorlevel 1 (
    echo No hay cambios en los datos de presupuesto. Nada que desplegar.
    goto :end
)

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set TODAY=%%i

git commit -m "data: actualizar presupuesto %TODAY%"
if errorlevel 1 goto :error

git push origin develop
if errorlevel 1 goto :error

git checkout main
if errorlevel 1 goto :error

git pull origin main
if errorlevel 1 goto :error

git merge develop --no-edit
if errorlevel 1 goto :error

git push origin main
if errorlevel 1 goto :error

git checkout develop
if errorlevel 1 goto :error

echo === Listo: push a main completado, el deploy debe dispararse automaticamente ===
goto :end

:error
echo ERROR: el proceso fallo, revisa el mensaje anterior. Puede que quedes en una rama distinta a develop.
exit /b 1

:end
endlocal
