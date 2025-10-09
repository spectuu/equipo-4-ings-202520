# Medicod Client - Sistema de Gestión de Medicamentos

Esta es la aplicación frontend completa para el sistema Medicod, desarrollada con Next.js para gestión de medicamentos y recordatorios.

## Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos para ejecutar la aplicación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   La aplicación se abrirá automáticamente en `http://localhost:3000`

### Otros comandos disponibles

- **Construir para producción:**
  ```bash
  npm run build
  ```

- **Ejecutar en producción:**
  ```bash
  npm run start
  ```

- **Ejecutar linter:**
  ```bash
  npm run lint
  ```

## Estructura del Proyecto

```
client/
├── pages/
│   ├── _app.js                # Configuración global de la app
│   ├── index.js               # Página de inicio/landing
│   └── signup.js              # Página de registro
├── components/
│   └── SignupForm.js          # Componente del formulario de registro
├── styles/
│   └── globals.css            # Estilos globales
├── public/                    # Archivos estáticos
├── package.json              # Dependencias y scripts
├── next.config.js            # Configuración de Next.js
└── README.md                 # Este archivo
```

##Características

- **Framework Next.js** con SSR y optimizaciones SEO
- **Múltiples páginas** (Home, Registro, Login, etc.)
- **Diseño responsivo** que se adapta a diferentes tamaños de pantalla
- **Formulario de registro** con validación de campos
- **Navegación entre páginas** con Next.js Router
- **Estilos modernos** con CSS global y componentes
- **Preparado para backend** con API routes de Next.js

##Tecnologías Utilizadas

- **Next.js 14** - Framework de React con SSR/SSG
- **React 18** - Biblioteca de UI
- **CSS3** - Estilos personalizados
- **JavaScript ES6+** - JavaScript moderno

##Páginas Disponibles

- `/` - Landing page principal
- `/signup` - Formulario de registro

##Próximas Funcionalidades

- Página de dashboard principal
- Gestión de medicamentos
- Sistema de recordatorios
- Perfil de usuario
- API routes para backend
- Integración con base de datos
