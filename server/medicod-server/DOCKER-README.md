# Medicod Backend - Docker Setup

Este directorio contiene la configuración Docker para ejecutar el backend de Medicod con MySQL.

## Requisitos

- Docker
- Docker Compose

## Configuración

### Estructura de archivos creados:

- `Dockerfile`: Configuración para construir la imagen del backend Spring Boot
- `docker-compose.yml`: Orquestación de MySQL y Spring Boot
- `application-docker.properties`: Configuración específica para el entorno Docker
- `init-db.sh`: Script de inicialización de la base de datos

## Uso

### 0. Diagnóstico (opcional pero recomendado)

```bash
# Ejecutar diagnóstico completo
chmod +x diagnose.sh
./diagnose.sh
```

### 1. Construir y ejecutar los contenedores

```bash
# Opción A: Script de inicio rápido
chmod +x start.sh
./start.sh

# Opción B: Comando manual
docker-compose up --build
```

### 2. Ejecutar en segundo plano

```bash
docker-compose up -d --build
```

### 3. Ver logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f medicod-backend
docker-compose logs -f mysql
```

### 4. Detener los servicios

```bash
docker-compose down
```

### 5. Detener y eliminar volúmenes (elimina la base de datos)

```bash
docker-compose down -v
```

## Servicios

### MySQL
- **Puerto**: 3306
- **Base de datos**: medicod
- **Usuario root**: root / 123abc
- **Usuario aplicación**: medicod / medicod123

### Spring Boot Backend
- **Puerto**: 8080
- **Context path**: /medicod/dev
- **URL completa**: http://localhost:8080/medicod/dev

## Inicialización de la base de datos

La base de datos se inicializa automáticamente con:
- Estructura de tablas desde `examify database.sql`
- Datos de prueba incluidos
- Configuración de usuarios y medicamentos

## Desarrollo Frontend

Una vez que el backend esté ejecutándose, puedes iniciar el frontend desde el directorio `client/`:

```bash
cd ../../client
npm install
npm run dev
```

El frontend se conectará automáticamente al backend en `http://localhost:8080/medicod/dev`.

## Troubleshooting

### Error: "unable to get image" o "The system cannot find the file specified"
Este error indica que Docker Desktop no está ejecutándose:

1. **Inicia Docker Desktop** desde el menú de inicio de Windows
2. **Espera** a que Docker Desktop termine de cargar completamente (verás el ícono en la bandeja del sistema)
3. **Verifica** que Docker esté funcionando: `docker info`
4. **Ejecuta el diagnóstico**: `./diagnose.sh`

### Error: "the attribute `version` is obsolete"
Este es solo una advertencia. El archivo ya está actualizado para usar la sintaxis moderna de Docker Compose.

### El backend no puede conectarse a MySQL
- Verifica que MySQL esté completamente iniciado: `docker-compose logs mysql`
- El backend espera hasta que MySQL esté saludable antes de iniciar

### Error de permisos en el script de inicialización
```bash
chmod +x init-db.sh
```

### Reconstruir desde cero
```bash
docker-compose down -v
docker-compose up --build
```

### Verificar estado de los contenedores
```bash
docker-compose ps
```

## Configuración de red

Los servicios están en la red `medicod-network` y se comunican usando los nombres de servicio:
- Backend → MySQL: `mysql:3306`
- Frontend → Backend: `localhost:8080`
