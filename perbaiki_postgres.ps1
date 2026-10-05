# Cek Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[INFO] Membutuhkan izin Administrator..." -ForegroundColor Yellow
    Write-Host "[INFO] Membuka jendela konfirmasi Windows UAC (silakan klik 'Yes')..." -ForegroundColor Yellow
    Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "            MEMPERBAIKI POSTGRESQL / PGADMIN            " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Menghentikan proses postgres yang macet..." -ForegroundColor Yellow
taskkill /F /IM postgres.exe 2>$null
Start-Sleep -Seconds 2

$pidFile = "C:\Program Files\PostgreSQL\18\data\postmaster.pid"
if (Test-Path $pidFile) {
    Write-Host "[2/4] Membersihkan postmaster.pid..." -ForegroundColor Yellow
    Remove-Item -Force $pidFile -ErrorAction SilentlyContinue
} else {
    Write-Host "[2/4] File postmaster.pid sudah bersih." -ForegroundColor Yellow
}

Write-Host "[3/4] Menyalakan service PostgreSQL 18..." -ForegroundColor Yellow
Start-Service postgresql-x64-18
Start-Sleep -Seconds 2

Write-Host "[4/4] Memeriksa status koneksi PostgreSQL..." -ForegroundColor Yellow
& "C:\Program Files\PostgreSQL\18\bin\pg_isready.exe" -h localhost -p 5432

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  BERHASIL! PostgreSQL sudah aktif dan normal kembali.  " -ForegroundColor Green
Write-Host "  Silakan buka kembali pgAdmin 4 atau jalankan prisma!  " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tekan Enter untuk menutup jendela ini..."
Read-Host
