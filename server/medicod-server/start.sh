#!/bin/bash

# Script de inicio para Railway
echo "Starting Medicod Backend..."

# Buscar el archivo JAR principal (excluyendo el JAR "plain")
JAR_FILE=$(find build/libs -name '*.jar' -not -name '*-plain.jar' | head -1)

if [ -z "$JAR_FILE" ]; then
    echo "Error: No JAR file found in build/libs/"
    echo "Available files:"
    ls -la build/libs/ || echo "build/libs directory not found"
    exit 1
fi

echo "Found JAR file: $JAR_FILE"
echo "Starting application..."

# Ejecutar la aplicación
exec java -jar "$JAR_FILE"