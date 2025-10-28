#!/bin/bash

# Script de diagnóstico para Docker y Medicod Backend

echo "🔍 Diagnóstico de Docker y Medicod Backend"
echo "=========================================="
echo ""

# Verificar Docker
echo "📦 Verificando Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker está instalado"
    docker --version
else
    echo "❌ Docker no está instalado"
fi
echo ""

# Verificar Docker Compose
echo "📦 Verificando Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose está instalado"
    docker-compose --version
else
    echo "❌ Docker Compose no está instalado"
fi
echo ""

# Verificar estado de Docker
echo "🔍 Verificando estado de Docker..."
if docker info &> /dev/null; then
    echo "✅ Docker está ejecutándose correctamente"
    echo "📊 Información del sistema Docker:"
    docker system info | head -10
else
    echo "❌ Docker no está ejecutándose o hay un problema de conexión"
    echo ""
    echo "🔧 Soluciones:"
    echo "   1. Inicia Docker Desktop"
    echo "   2. Espera a que termine de cargar"
    echo "   3. Reinicia Docker Desktop si es necesario"
fi
echo ""

# Verificar archivos necesarios
echo "📁 Verificando archivos de configuración..."
files=("Dockerfile" "docker-compose.yml" "application-docker.properties" "init-db.sh")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file no existe"
    fi
done
echo ""

# Verificar permisos
echo "🔐 Verificando permisos..."
if [ -f "init-db.sh" ]; then
    if [ -x "init-db.sh" ]; then
        echo "✅ init-db.sh tiene permisos de ejecución"
    else
        echo "⚠️  init-db.sh no tiene permisos de ejecución"
        echo "   Ejecuta: chmod +x init-db.sh"
    fi
fi

if [ -f "start.sh" ]; then
    if [ -x "start.sh" ]; then
        echo "✅ start.sh tiene permisos de ejecución"
    else
        echo "⚠️  start.sh no tiene permisos de ejecución"
        echo "   Ejecuta: chmod +x start.sh"
    fi
fi
echo ""

# Verificar puertos
echo "🌐 Verificando puertos..."
if netstat -an | grep -q ":3306"; then
    echo "⚠️  Puerto 3306 está en uso (MySQL)"
fi
if netstat -an | grep -q ":8080"; then
    echo "⚠️  Puerto 8080 está en uso (Backend)"
fi
echo ""

echo "🎯 Próximos pasos:"
echo "   1. Si Docker no está ejecutándose, inicia Docker Desktop"
echo "   2. Ejecuta: ./start.sh"
echo "   3. O ejecuta: docker-compose up --build"
