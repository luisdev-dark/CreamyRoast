# 🚀 Deploy de Cream & Roast POS

## 📋 Requisitos Previos

- Node.js 18+
- Git
- Cuenta en Supabase (opcional para producción)

## 🔄 Subir a GitHub

```bash
# Agregar cambios
git add .

# Hacer commit
git commit -m "Tu mensaje descriptivo"

# Subir a GitHub
git push origin main
```

## 🏗️ Deploy Local

### Opción 1: Usar Script Automático
```bash
# Dar permisos al script
chmod +x deploy.sh

# Ejecutar deploy
./deploy.sh
```

### Opción 2: Manual

#### Backend
```bash
cd backend
npm install
npm run dev  # Desarrollo
npm start   # Producción
```

#### Frontend
```bash
cd frontend
npm install
npm run dev  # Desarrollo
npm run build # Producción
```

## 🌐 Deploy en Producción

### Variables de Entorno
Crear `.env` en backend con:
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=tu-secreto-muy-seguro
DATABASE_TYPE=supabase
SUPABASE_URL=tu-url-de-supabase
SUPABASE_ANON_KEY=tu-key-anon-de-supabase
SUPABASE_SERVICE_ROLE_KEY=tu-key-service-de-supabase
CORS_ORIGIN=https://tu-dominio.com
```

### Servidor
```bash
# Backend
cd backend
npm start

# Frontend (nginx/apache)
# Servir archivos de frontend/dist
```

## 🔐 Credenciales de Prueba

| Rol | Usuario | Contraseña | Email |
|-----|---------|-----------|-------|
| Administrador | `admin@creamroast.com` | `admin123` | admin@creamroast.com |
| Cajero | `cashier` | `cashier123` | cashier@creamroast.com |
| Empleado | `waiter` | `waiter123` | waiter@creamroast.com |

## 🛠️ Solución de Problemas

### Limpiar Puertos
```bash
npx kill-port 3001 5173 5174 5175 5176
```

### Verificar Servicios
```bash
# Backend
curl http://localhost:3001/api/auth/login

# Frontend
curl http://localhost:5173
```

### Logs
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd frontend && npm run dev
```

## 📦 Estructura de Producción

```
/
├── backend/
│   ├── dist/
│   ├── node_modules/
│   └── .env
├── frontend/
│   ├── dist/
│   └── node_modules/
└── database/
    └── migrations/
```

## 🔗 URLs de Acceso

- **Frontend:** `http://localhost:5173` (dev) / `https://tu-dominio.com` (prod)
- **Backend API:** `http://localhost:3001` (dev) / `https://api.tu-dominio.com` (prod)
- **API Docs:** `http://localhost:3001/api` (dev)

## 🎯 Checklist de Deploy

- [ ] Variables de entorno configuradas
- [ ] Base de datos inicializada
- [ ] Certificados SSL instalados
- [ ] Firewall configurado
- [ ] Backup automático configurado
- [ ] Monitoreo implementado

## 🚨 Soporte

Si tienes problemas:
1. Verifica los logs del servidor
2. Limpia los puertos con `npx kill-port`
3. Revisa las variables de entorno
4. Verifica la conexión a la base de datos

---

**© 2025 Cream & Roast - Sistema POS para Cafeterías**