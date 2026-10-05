@echo off
chcp 65001 >nul
title Perbaikan PostgreSQL

net session >nul 2>&1
if errorlevel 1 (
    echo [INFO] Membutuhkan izin Administrator...
    echo [INFO] Membuka jendela konfirmasi Windows UAC (silakan klik 'Yes' / 'Ya')...
    powershell -NoProfile -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

echo ========================================================
echo        MEMPERBAIKI POSTGRESQL / PGADMIN
echo ========================================================
echo.

echo [1/4] Menghentikan proses postgres yang macet (hung)...
taskkill /F /IM postgres.exe >nul 2>&1
timeout /t 2 /nobreak >nul

set "PID_FILE=C:\Program Files\PostgreSQL\18\data\postmaster.pid"
if exist "%PID_FILE%" (
    echo [2/4] Menghapus postmaster.pid lama...
    del /f /q "%PID_FILE%" >nul 2>&1
)

echo [3/4] Menjalankan kembali Service PostgreSQL 18...
net start postgresql-x64-18

echo.
echo [4/4] Memeriksa status koneksi PostgreSQL...
timeout /t 2 /nobreak >nul
"C:\Program Files\PostgreSQL\18\bin\pg_isready.exe" -h localhost -p 5432

echo.
echo ========================================================
echo   BERHASIL! PostgreSQL sudah aktif normal kembali.
echo   Sekarang Anda bisa membuka pgAdmin 4 / database lagi.
echo ========================================================
echo.
pause
