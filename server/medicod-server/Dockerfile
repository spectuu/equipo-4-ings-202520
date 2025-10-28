# Usar imagen base con Gradle más reciente
FROM gradle:8.5-jdk21 AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de Gradle
COPY gradle/ gradle/
COPY build.gradle.kts settings.gradle.kts

# Copiar código fuente
COPY src/ src/

# Construir la aplicación
RUN gradle build -x test

# Imagen final más ligera
FROM openjdk:21-jdk-slim

WORKDIR /app

# Copiar el JAR construido desde la etapa de build
COPY --from=build /app/build/libs/*.jar app.jar

# Exponer puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
