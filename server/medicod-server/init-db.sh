#!/bin/bash

# Script de inicialización de la base de datos Medicod
# Este script se ejecuta automáticamente cuando se inicia el contenedor MySQL

echo "Iniciando configuración de la base de datos Medicod..."

# Esperar a que MySQL esté completamente iniciado
while ! mysqladmin ping -h"localhost" --silent; do
    echo "Esperando que MySQL esté listo..."
    sleep 2
done

echo "MySQL está listo. Configurando base de datos..."

# Crear la base de datos si no existe
mysql -u root -p123abc -e "CREATE DATABASE IF NOT EXISTS medicod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Ejecutar el script SQL de inicialización
mysql -u root -p123abc medicod < /docker-entrypoint-initdb.d/init.sql

echo "Base de datos Medicod configurada exitosamente!"
