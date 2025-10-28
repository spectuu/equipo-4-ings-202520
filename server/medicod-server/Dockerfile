# Dockerfile optimizado para Railway
FROM gradle:8.5-jdk21 AS build

WORKDIR /app

# Copiar archivos de configuración de Gradle
COPY gradle/ gradle/
COPY build.gradle.kts settings.gradle.kts

# Copiar código fuente (incluye archivos jOOQ generados)
COPY src/ src/

# Construir la aplicación (sin generar código jOOQ)
RUN gradle build -x test -x jooq

# Imagen final optimizada
FROM openjdk:21-jdk-slim

WORKDIR /app

# Instalar curl para health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copiar el JAR construido
COPY --from=build /app/build/libs/*.jar app.jar

# Exponer puerto (Railway usa PORT environment variable)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
