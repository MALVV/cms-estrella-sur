#!/bin/bash

echo "🔄 Reiniciando servidor y limpiando caché..."

# Detener procesos de Node.js si están ejecutándose
echo "🛑 Deteniendo procesos de Node.js..."
pkill -f "next" || true
pkill -f "node.*next" || true

# Limpiar caché de Next.js
echo "🧹 Limpiando caché de Next.js..."
rm -rf .next || true

# Limpiar caché de npm
echo "🧹 Limpiando caché de npm..."
npm cache clean --force || true

# Limpiar node_modules y reinstalar (opcional)
# echo "🧹 Limpiando node_modules..."
# rm -rf node_modules package-lock.json
# npm install

echo "✅ Limpieza completada"
echo "🚀 Iniciando servidor de desarrollo..."
echo "   Ejecuta: npm run dev"
echo ""
echo "📋 Para probar la autenticación:"
echo "   1. Ve a http://localhost:3000/auth-test"
echo "   2. Intenta iniciar sesión con:"
echo "      - admin@estrellasur.com"
echo "      - supervisor@estrellasur.com" 
echo "      - tecnico@estrellasur.com"
echo "   3. Contraseña: password123"
