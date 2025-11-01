# 🚀 Guía de Despliegue en la Nube - Medicod

Esta guía te ayudará a desplegar tu aplicación Medicod en la nube con una URL pública.

## 🌐 Opciones de Despliegue

### 1. 🚄 Railway (Recomendado)
- ✅ **Gratis** para proyectos pequeños
- ✅ **Muy fácil** de configurar
- ✅ **Soporte completo** para Docker
- ✅ **Base de datos MySQL incluida**
- ✅ **Despliegue automático** desde GitHub

### 2. 🎯 Render
- ✅ **Plan gratuito** disponible
- ✅ **Excelente** para aplicaciones Spring Boot
- ✅ **Base de datos PostgreSQL**

### 3. ⚡ Heroku
- ✅ **Plan gratuito** limitado
- ✅ **Muy popular** y estable
- ✅ **Base de datos PostgreSQL**

---

## 🚄 Despliegue en Railway (Paso a Paso)

### Paso 1: Preparar el Repositorio

1. **Sube tu código a GitHub** (si no lo has hecho):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/medicod.git
   git push -u origin main
   ```

### Paso 2: Configurar Railway

1. **Ve a [Railway.app](https://railway.app)**
2. **Inicia sesión** con tu cuenta de GitHub
3. **Haz clic en "New Project"**
4. **Selecciona "Deploy from GitHub repo"**
5. **Elige tu repositorio** `medicod`

### Paso 3: Configurar la Base de Datos

1. **En tu proyecto de Railway**, haz clic en **"+ New"**
2. **Selecciona "Database"**
3. **Elige "MySQL"**
4. **Railway creará automáticamente** la base de datos

### Paso 4: Configurar Variables de Entorno

En la configuración de tu servicio backend:

```bash
SPRING_PROFILES_ACTIVE=railway
PORT=8080
```

Railway automáticamente proporcionará:
- `DATABASE_URL` - URL de conexión a MySQL
- `PORT` - Puerto donde ejecutar la aplicación

### Paso 5: Desplegar

1. **Railway detectará automáticamente** el Dockerfile
2. **Construirá y desplegará** tu aplicación
3. **Te dará una URL pública** como: `https://medicod-production.up.railway.app`

---

## 🎯 Despliegue en Render

### Paso 1: Preparar para Render

1. **Crea un archivo `render.yaml`**:
```yaml
services:
  - type: web
    name: medicod-backend
    env: java
    buildCommand: ./gradlew build
    startCommand: java -jar build/libs/medicod-server-1.0-SNAPSHOT.jar
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: render
      - key: DATABASE_URL
        fromDatabase:
          name: medicod-db
          property: connectionString

databases:
  - name: medicod-db
    databaseName: medicod
    user: medicod
```

### Paso 2: Desplegar en Render

1. **Ve a [Render.com](https://render.com)**
2. **Conecta tu repositorio de GitHub**
3. **Selecciona "New Web Service"**
4. **Elige tu repositorio**
5. **Render detectará** la configuración automáticamente

---

## ⚡ Despliegue en Heroku

### Paso 1: Preparar para Heroku

1. **Crea un `Procfile`**:
```
web: java -jar build/libs/medicod-server-1.0-SNAPSHOT.jar
```

2. **Crea un `system.properties`**:
```
java.runtime.version=21
```

### Paso 2: Desplegar en Heroku

1. **Instala Heroku CLI**
2. **Crea la aplicación**:
   ```bash
   heroku create medicod-app
   ```
3. **Añade la base de datos**:
   ```bash
   heroku addons:create cleardb:ignite
   ```
4. **Despliega**:
   ```bash
   git push heroku main
   ```

---

## 🔧 Configuración del Frontend

Una vez que tengas tu backend desplegado, actualiza la configuración del frontend:

### Para Railway:
```javascript
// En client/api/axiosConfig.js
const API_BASE_URL = 'https://tu-app.up.railway.app';
```

### Para Render:
```javascript
const API_BASE_URL = 'https://medicod-backend.onrender.com';
```

### Para Heroku:
```javascript
const API_BASE_URL = 'https://medicod-app.herokuapp.com';
```

---

## 📊 Monitoreo y Logs

### Railway:
- **Dashboard**: Ve a tu proyecto en Railway
- **Logs**: Clic en "Deployments" → "View Logs"

### Render:
- **Dashboard**: Ve a tu servicio en Render
- **Logs**: Clic en "Logs" tab

### Heroku:
```bash
heroku logs --tail
```

---

## 🚨 Troubleshooting

### Error de conexión a base de datos:
- Verifica que `DATABASE_URL` esté configurado
- Asegúrate de que la base de datos esté creada

### Error de puerto:
- Railway usa `PORT` automáticamente
- Render usa puerto 10000 por defecto
- Heroku usa `PORT` automáticamente

### Error de memoria:
- Railway: Plan gratuito tiene límite de memoria
- Render: Plan gratuito tiene límite de memoria
- Heroku: Plan gratuito tiene límite de memoria

---

## 💰 Costos

### Railway:
- **Gratis**: $5 de crédito mensual
- **Pro**: $5/mes por servicio

### Render:
- **Gratis**: Limitado pero funcional
- **Starter**: $7/mes

### Heroku:
- **Gratis**: Limitado (se suspende después de inactividad)
- **Basic**: $7/mes

---

## 🎯 Recomendación

**Para tu proyecto, recomiendo Railway** porque:
- Es la más fácil de configurar
- Soporte completo para Docker
- Base de datos MySQL incluida
- Despliegue automático desde GitHub
- Excelente para proyectos académicos

¿Quieres que te ayude a configurar Railway paso a paso?
