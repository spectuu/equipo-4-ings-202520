# Medicod - Web Client (Next.js)

## What does this folder do?
This `client/` directory contains the web client of Medicod built with Next.js 14 and React 18. It provides the user interface for:
- Authentication (login/register)
- Viewing, searching, creating and editing the user's medication inventory
- Basic summaries for expirations and low-stock items

The client communicates with the backend over HTTP using Axios. Auth is handled with JWT stored in `localStorage` and sent via an Axios interceptor as a Bearer token.

## How do I install this part of the project?
Prerequisites:
- Node.js 18+ (recommended LTS)
- npm 9+ (ships with Node 18) or pnpm/yarn if you prefer

Install dependencies:
```bash
cd client
npm install
```

## How do I run this part of the project?
Create a `.env.local` if you need to override defaults (optional). By default Axios base URL is configured in `api/axiosConfig.js` to `http://localhost:8080/medicod/dev`.

Start the dev server:
```bash
npm run dev
```
Then open the app at `http://localhost:3000`.

Build and run in production mode:
```bash
npm run build
npm start
```

## What standards should be followed here?
- Code style: follow the existing ESLint config (`eslint-config-next`). Run `npm run lint` to check.
- Components: prefer small, readable React components; keep state local and descriptive names.
- API layer: centralize HTTP calls in `client/api/` modules. Always return normalized data and human-readable errors.
- Types/Docs: when adding shared utilities, include concise JSDoc for function signatures and non-obvious behavior.
- UX consistency: reuse existing CSS utility classes from `styles/globals.css` (buttons, inputs, modals, tables) to keep a cohesive design.
- Security: use the Axios interceptor to inject the JWT; do not read or modify `localStorage` directly outside `api/token.js`.

## Which JavaScript/TypeScript version is used?
- Runtime: React 18 on Next.js 14 (Node.js 18+).
- Tooling includes TypeScript 5 (even if most files are JS today, TS is available).

## What do I need for the database?
The web client does not run a database itself. It expects a running backend API that exposes endpoints under the base path configured in `api/axiosConfig.js`.

For local development you need the backend server up and reachable (defaults used in this repo: `http://localhost:8080/medicod/dev`). Make sure:
- Auth endpoints (`/auth/login`, `/auth/register`) return a JWT in the `data.token` field of the standard response envelope
- Inventory endpoints (`/inventory`, `/inventory/add`, `/inventory/{id}`, `/inventory/mine`, `/inventory/search`) follow the documented contract and return a JSON envelope with `{ code, message, display, data }`.

No additional client-side DB setup is required beyond pointing the Axios base URL at your backend.

## Useful scripts
- `npm run dev` – start Next.js in development mode
- `npm run build` – production build
- `npm start` – run the production server
- `npm run lint` – run ESLint checks

## Configuration reference
- API Axios base URL: `client/api/axiosConfig.js`
- Auth token helpers: `client/api/token.js`
- Inventory API methods: `client/api/inventoryApi.js`
- Main pages/components: `client/pages/*`, `client/components/*`

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
