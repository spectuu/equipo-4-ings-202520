# Script de diagnóstico para Docker en PowerShell (Windows)

Write-Host "🔍 Diagnóstico de Docker y Medicod Backend" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "📦 Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker está instalado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está instalado" -ForegroundColor Red
}
Write-Host ""

# Verificar Docker Compose
Write-Host "📦 Verificando Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose está instalado: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose no está instalado" -ForegroundColor Red
}
Write-Host ""

# Verificar estado de Docker
Write-Host "🔍 Verificando estado de Docker..." -ForegroundColor Yellow
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker está ejecutándose correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker Desktop no está ejecutándose" -ForegroundColor Red
        Write-Host ""
        Write-Host "🔧 Soluciones:" -ForegroundColor Yellow
        Write-Host "   1. Busca 'Docker Desktop' en el menú de inicio de Windows" -ForegroundColor White
        Write-Host "   2. Inicia Docker Desktop" -ForegroundColor White
        Write-Host "   3. Espera a que termine de cargar (verás el ícono en la bandeja del sistema)" -ForegroundColor White
        Write-Host "   4. Reinicia Docker Desktop si es necesario" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error al verificar Docker" -ForegroundColor Red
}
Write-Host ""

# Verificar archivos necesarios
Write-Host "📁 Verificando archivos de configuración..." -ForegroundColor Yellow
$files = @("Dockerfile", "docker-compose.yml", "application-docker.properties", "init-db.sh")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file existe" -ForegroundColor Green
    } else {
        Write-Host "❌ $file no existe" -ForegroundColor Red
    }
}
Write-Host ""

# Verificar puertos
Write-Host "🌐 Verificando puertos..." -ForegroundColor Yellow
$port3306 = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if ($port3306) {
    Write-Host "⚠️  Puerto 3306 está en uso (MySQL)" -ForegroundColor Yellow
}
if ($port8080) {
    Write-Host "⚠️  Puerto 8080 está en uso (Backend)" -ForegroundColor Yellow
}
if (-not $port3306 -and -not $port8080) {
    Write-Host "✅ Los puertos 3306 y 8080 están disponibles" -ForegroundColor Green
}
Write-Host ""

Write-Host "🎯 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Si Docker Desktop no está ejecutándose, inícialo desde el menú de inicio" -ForegroundColor White
Write-Host "   2. Ejecuta: docker-compose up --build" -ForegroundColor White
Write-Host "   3. O ejecuta: .\start.ps1" -ForegroundColor White
