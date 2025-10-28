#!/bin/bash

# Script de inicio rápido para Medicod Backend con Docker

echo "🚀 Iniciando Medicod Backend con Docker..."
echo ""

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Verificar que Docker Desktop esté ejecutándose
echo "🔍 Verificando que Docker Desktop esté ejecutándose..."
if ! docker info &> /dev/null; then
    echo ""
    echo "❌ Docker Desktop no está ejecutándose o no está disponible."
    echo ""
    echo "📋 Soluciones posibles:"
    echo "   1. Inicia Docker Desktop desde el menú de inicio"
    echo "   2. Espera a que Docker Desktop termine de cargar completamente"
    echo "   3. Reinicia Docker Desktop si es necesario"
    echo ""
    echo "💡 Una vez que Docker Desktop esté ejecutándose, vuelve a ejecutar este script."
    exit 1
fi

echo "✅ Docker y Docker Compose están instalados y ejecutándose"
echo ""

# Dar permisos de ejecución al script de inicialización
chmod +x init-db.sh

echo "🔧 Construyendo e iniciando contenedores..."
echo ""

# Construir y ejecutar los contenedores
docker-compose up --build

echo ""
echo "🎉 ¡Medicod Backend está ejecutándose!"
echo ""
echo "📋 Información de conexión:"
echo "   Backend: http://localhost:8080/medicod/dev"
echo "   MySQL: localhost:3306"
echo ""
echo "💡 Para ejecutar en segundo plano, usa: docker-compose up -d --build"
echo "💡 Para detener los servicios, usa: docker-compose down"
echo "💡 Para ver logs, usa: docker-compose logs -f"
