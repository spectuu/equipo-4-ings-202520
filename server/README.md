# Servidor - Medicod API

## ¿Qué hace esta carpeta?

Esta carpeta contiene el **backend** del proyecto Medicod, una API REST desarrollada con **Spring Boot** que proporciona los servicios y endpoints necesarios para la aplicación. El servidor maneja:

- **Autenticación y autorización** (JWT + Spring Security)
- **Gestión de datos médicos** a través de una base de datos MySQL
- **API REST** con documentación automática (OpenAPI/Swagger)
- **Arquitectura en capas** (Controller, Service, Repository, DTO)
- **Configuración de perfiles** para diferentes entornos (desarrollo, producción)

## Tecnologías utilizadas

- **Java** (versión compatible con Spring Boot 3.x)
- **Spring Boot** - Framework principal
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **JOOQ** - Query builder y acceso a datos
- **MySQL** - Base de datos
- **JWT** - Tokens de autenticación
- **Lombok** - Reducción de código boilerplate
- **Gradle** - Gestión de dependencias y build
- **OpenAPI/Swagger** - Documentación de API

## ¿Cómo se instala esta parte del proyecto?

### Prerrequisitos

1. **Java 17 o superior**
   ```bash
   java -version
   ```

2. **MySQL 8.0 o superior**
   - Instalar MySQL Server
   - Crear la base de datos: `medicod-dev`

3. **Gradle** (opcional, se incluye wrapper)

### Pasos de instalación

1. **Navegar al directorio del servidor:**
   ```bash
   cd server/medicod-server
   ```

2. **Configurar la base de datos:**
   - Crear base de datos MySQL: `CREATE DATABASE medicod-dev;`
   - Verificar configuración en `src/main/resources/application-dev.properties`

3. **Instalar dependencias:**
   ```bash
   ./gradlew build
   ```

## ¿Cómo se corre esta parte del proyecto?

### Desarrollo

1. **Ejecutar la aplicación:**
   ```bash
   ./gradlew bootRun
   ```

2. **O usando el wrapper de Gradle:**
   ```bash
   ./gradlew.bat bootRun  # Windows
   ./gradlew bootRun      # Linux/Mac
   ```

3. **La aplicación estará disponible en:**
   - **API Base URL:** `http://localhost:8080/medicod/dev`
   - **Swagger UI:** `http://localhost:8080/medicod/dev/swagger-ui.html`

### Producción

1. **Construir el JAR:**
   ```bash
   ./gradlew build
   ```

2. **Ejecutar el JAR:**
   ```bash
   java -jar build/libs/medicod-server-1.0-SNAPSHOT.jar
   ```

## ¿Qué estándares se deben tener en cuenta en esta parte del proyecto?

### Estándares de Código

1. **Java Code Style:**
   - Seguir convenciones de Java (camelCase para variables, PascalCase para clases)
   - Usar nombres descriptivos para variables y métodos
   - Mantener métodos pequeños y con responsabilidad única

2. **Documentación:**
   - **JavaDoc** para todas las clases públicas y métodos importantes
   - Comentarios en español para explicar lógica compleja
   - README actualizado para cambios significativos

3. **Arquitectura:**
   - **Patrón MVC** (Controller → Service → Repository)
   - **DTOs** para transferencia de datos entre capas
   - **Separación de responsabilidades** por paquetes

4. **Seguridad:**
   - Validación de entrada en todos los endpoints
   - Uso de JWT para autenticación
   - Configuración de CORS apropiada

5. **Testing:**
   - Tests unitarios para servicios
   - Tests de integración para controladores
   - Cobertura de código mínima del 70%

### Estructura de Paquetes

```
src/main/java/medicod/
├── configuration/     # Configuraciones de Spring
├── controller/        # Controladores REST
├── domain/
│   ├── dto/          # Data Transfer Objects
│   ├── repository/   # Interfaces de repositorio
│   └── service/      # Lógica de negocio
├── jpa/              # Entidades JPA
├── type/             # Enums y tipos personalizados
└── utils/            # Utilidades y helpers
```

### Convenciones de Naming

- **Controladores:** `*Controller.java`
- **Servicios:** `*Service.java`
- **Repositorios:** `*Repository.java`
- **DTOs:** `*DTO.java` o `*Request.java`/`*Response.java`
- **Entidades:** `*Entity.java`

## Configuración de Base de Datos

### Desarrollo
- **URL:** `jdbc:mysql://localhost:3306/medicod-dev`
- **Usuario:** `root`
- **Contraseña:** `123abc`
- **Puerto:** `8080`

### Variables de Entorno (Recomendado para Producción)
```bash
export DB_URL=jdbc:mysql://localhost:3306/medicod-prod
export DB_USERNAME=medicod_user
export DB_PASSWORD=secure_password
export JWT_SECRET=your_jwt_secret_key
```

## Comandos Útiles

```bash
# Limpiar y construir
./gradlew clean build

# Ejecutar tests
./gradlew test

# Generar documentación
./gradlew javadoc

# Verificar dependencias
./gradlew dependencies
```
