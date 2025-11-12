# 🍵 Cream & Roast - Sistema POS

> **Versión 0.1** | Sistema Point of Sale completo para cafeterías  
> **Stack**: React + TypeScript + Node.js + PostgreSQL (Supabase)

![GitHub repo size](https://img.shields.io/github/repo-size/luisdev-dark/CreamyRoast)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)

---

## 🎯 Descripción del Proyecto

Sistema POS (Point of Sale) completo para la cafetería **Cream & Roast**. Maneja ventas, inventario, productos y reportes con múltiples roles de usuario y autenticación segura.

### ✨ Características Principales

- 🔐 **Sistema de Login Completo**: Autenticación segura con JWT y localStorage
- 🛒 **Punto de Venta**: Interface rápida para cajeros con grid de productos
- 📊 **Dashboard Administrativo**: Gestión completa de productos, ventas e inventario
- 🖨️ **Comprobantes**: Generación e impresión en formato térmico 80mm
- 👥 **Roles y Permisos**: Cajero, Empleado, Administrador con accesos diferenciados
- 💰 **Múltiples Pagos**: Efectivo, tarjeta, Yape
- 📱 **Responsive**: Interface adaptable a tablets y móviles
- 🔒 **Autenticación JWT**: Seguridad con tokens y RLS de Supabase
- 💾 **Sesión Persistente**: Recordar credenciales y mantener sesión activa

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│         FRONTEND (React + TypeScript)   │
│  - Context API + useReducer             │
│  - Tailwind CSS + shadcn/ui             │
│  - React Router v6                      │
│  - Custom hooks para estado             │
└─────────────────────────────────────────┘
                 ↕ (HTTP REST)
┌─────────────────────────────────────────┐
│    BACKEND (Node.js + Express + TS)     │
│  - JWT Authentication                   │
│  - Rate Limiting                        │
│  - Thermal Printer Support              │
│  - Supabase Integration                 │
└─────────────────────────────────────────┘
                 ↕ (SQL + RLS)
┌─────────────────────────────────────────┐
│   DATABASE (PostgreSQL via Supabase)    │
│  - Row Level Security                   │
│  - Realtime Subscriptions               │
│  - Storage para archivos                │
└─────────────────────────────────────────┘
```

---

## 📦 Estructura del Proyecto

```
CreamyRoast/
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/        # Gestión administrativa
│   │   │   ├── Common/       # Componentes reutilizables
│   │   │   ├── Landing/      # Página pública
│   │   │   ├── Layout/       # Layout y navegación
│   │   │   └── POS/          # Punto de venta
│   │   ├── context/          # Context API
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Páginas principales
│   │   ├── services/         # API calls
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Utilidades
│   └── package.json
├── backend/                  # Node.js + Express
│   ├── src/
│   │   ├── controllers/      # Controladores de API
│   │   ├── routes/           # Definición de rutas
│   │   ├── middleware/       # Middleware personalizado
│   │   ├── services/         # Lógica de negocio
│   │   └── app.ts           # Servidor principal
│   ├── package.json
│   └── tsconfig.json
└── database/                 # PostgreSQL
    └── migrations/          # Esquemas y migraciones
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn
- PostgreSQL (Supabase recomendado)
- Cuenta Supabase

### 1. Clonar el Repositorio

```bash
git clone https://github.com/luisdev-dark/CreamyRoast.git
cd CreamyRoast
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Compilar TypeScript
npm run build

# Ejecutar en desarrollo
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Ejecutar en desarrollo
npm run dev
```

### 4. Database Setup

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar las migraciones en `database/migrations/`
3. Configurar RLS policies

---

## 📋 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión con JWT
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/refresh` - Refrescar token JWT
- `POST /api/auth/logout` - Cerrar sesión

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Ventas
- `GET /api/sales` - Listar ventas
- `POST /api/sales` - Crear venta
- `DELETE /api/sales/:id` - Cancelar venta

---

## 👤 Roles de Usuario

| Rol | Funciones |
|-----|-----------|
| **Administrador** | CRUD completo, reportes, gestión usuarios |
| **Cajero** | Registrar ventas, ver productos, alertas inventario |
| **Empleado** | Ver productos, consultar información |

---

## 🎛️ Tecnologías Utilizadas

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **TypeScript** - Type Safety
- **JWT** - Autenticación
- **Supabase** - Database + Auth

### Database
- **PostgreSQL** - Base de datos
- **Row Level Security** - Seguridad
- **Realtime** - Sincronización

---

## 📈 Roadmap

### v0.01 ✅ MVP Base
- [x] Estructura frontend React
- [x] API básica backend
- [x] Autenticación mock
- [x] Schema de BD

### v0.1 ✅ Sistema de Login Completo
- [ ] Autenticación real con Supabase
- [ ] CRUD productos
- [ ] Registro de ventas funcional
- [ ] Comprobantes básicos

### v0.2 📦 Fase 2
- [ ] Control de inventario
- [ ] Alertas de stock
- [ ] Reportes básicos

### v0.3 🚀 Fase 3
- [ ] Cancelación de ventas
- [ ] Devoluciones
- [ ] Reportes avanzados

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---

## 📞 Contacto

- **GitHub**: [@luisdev-dark](https://github.com/luisdev-dark)
- **Email**: contact@creamroast.pe

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com) - UI Components
- [Tailwind CSS](https://tailwindcss.com) - Styling Framework

---

**⭐ Si te gusta el proyecto, no olvides darle una estrella en GitHub!**