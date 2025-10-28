# Dockerfile optimizado para Railway
FROM gradle:8.5-jdk21 AS build

WORKDIR /app

# Copiar archivos de configuración de Gradle (versiones Groovy)
COPY gradle/ gradle/
COPY build.gradle settings.gradle
COPY gradlew gradlew.bat
COPY gradle-wrapper.jar gradle-wrapper.properties

# Dar permisos de ejecución al wrapper de Gradle
RUN chmod +x gradlew

# Copiar código fuente (incluye archivos jOOQ generados)
COPY src/ src/

# Construir la aplicación usando el wrapper
RUN ./gradlew build -x test

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
