@echo off
REM Script para instalar las dependencias necesarias

REM Verificar si Node.js está instalado
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js no está instalado. Por favor instálalo antes de continuar.
    exit /b
)

REM Instalar dependencias
npm install

REM Confirmar instalación
if %errorlevel% equ 0 (
    echo Las dependencias se han instalado correctamente.
) else (
    echo Hubo un error al instalar las dependencias.
)

pause
