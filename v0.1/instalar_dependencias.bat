@echo off
REM Script para instalar todas las dependencias necesarias del backend SIGEA
cd src\backend
if not exist package.json npm init -y
npm install express helmet cors body-parser bcryptjs pg jsonwebtoken dotenv
cd ../..
echo Dependencias instaladas correctamente.
pause
