@echo off
REM Script para instalar las dependencias necesarias

REM Verificar si Node.js está instalado
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js no está instalado. Por favor instálalo antes de continuar.
    exit /b
)

REM Instalar dependencias de Node.js
npm install

REM Verificar instalación de PostgreSQL
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo PostgreSQL no está instalado. Por favor instálalo antes de continuar.
    exit /b 1
)

REM Confirmar instalación
if %errorlevel% equ 0 (
    echo Todas las dependencias han sido instaladas correctamente.
) else (
    echo Hubo un error al instalar las dependencias.
)

pause
