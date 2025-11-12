#!/bin/bash

# Script de Deploy para Cream & Roast POS
echo "🚀 Iniciando deploy de Cream & Roast POS..."

# Verificar si estamos en la rama main
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
    echo "❌ Error: Debes estar en la rama main para hacer deploy"
    exit 1
fi

# Limpiar puertos antes del deploy
echo "🧹 Limpiando puertos..."
npx kill-port 3001 5173 5174 5175 5176 2>/dev/null

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd ../frontend
npm install

# Construir frontend para producción
echo "🏗️ Construyendo frontend para producción..."
npm run build

# Volver al directorio raíz
cd ..

# Mostrar instrucciones de deploy
echo "✅ Build completado!"
echo ""
echo "🌐 Para deploy en producción:"
echo "   Backend: cd backend && npm start"
echo "   Frontend: Usar los archivos en frontend/dist"
echo ""
echo "🔐 Credenciales de prueba:"
echo "   Admin: admin@creamroast.com / admin123"
echo "   Cajero: cashier / cashier123"
echo "   Empleado: waiter / waiter123"
echo ""
echo "📝 Recuerda configurar las variables de entorno en producción:"
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET=tu-secreto-produccion"
echo "   - SUPABASE_URL=tu-url-supabase"
echo "   - SUPABASE_ANON_KEY=tu-key-supabase"