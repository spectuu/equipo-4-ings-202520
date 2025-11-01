# Script de inicio rápido para Medicod Backend con Docker (PowerShell)

Write-Host "🚀 Iniciando Medicod Backend con Docker..." -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker esté instalado
try {
    docker --version | Out-Null
    Write-Host "✅ Docker está instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está instalado. Por favor instala Docker primero." -ForegroundColor Red
    exit 1
}

# Verificar que Docker Compose esté instalado
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose está instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero." -ForegroundColor Red
    exit 1
}

# Verificar que Docker Desktop esté ejecutándose
Write-Host "🔍 Verificando que Docker Desktop esté ejecutándose..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker Desktop está ejecutándose correctamente" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ Docker Desktop no está ejecutándose o no está disponible." -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Soluciones posibles:" -ForegroundColor Yellow
    Write-Host "   1. Busca 'Docker Desktop' en el menú de inicio de Windows" -ForegroundColor White
    Write-Host "   2. Inicia Docker Desktop" -ForegroundColor White
    Write-Host "   3. Espera a que termine de cargar completamente" -ForegroundColor White
    Write-Host "   4. Reinicia Docker Desktop si es necesario" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Una vez que Docker Desktop esté ejecutándose, vuelve a ejecutar este script." -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "🔧 Construyendo e iniciando contenedores..." -ForegroundColor Yellow
Write-Host ""

# Construir y ejecutar los contenedores
try {
    docker-compose up --build
} catch {
    Write-Host "❌ Error al ejecutar docker-compose" -ForegroundColor Red
    Write-Host "Ejecuta: .\diagnose.ps1 para más información" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 ¡Medicod Backend está ejecutándose!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Información de conexión:" -ForegroundColor Cyan
Write-Host "   Backend: http://localhost:8080/medicod/dev" -ForegroundColor White
Write-Host "   MySQL: localhost:3306" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para ejecutar en segundo plano, usa: docker-compose up -d --build" -ForegroundColor Yellow
Write-Host "💡 Para detener los servicios, usa: docker-compose down" -ForegroundColor Yellow
Write-Host "💡 Para ver logs, usa: docker-compose logs -f" -ForegroundColor Yellow
