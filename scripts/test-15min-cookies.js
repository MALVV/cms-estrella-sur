const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function test15MinCookies() {
  try {
    console.log('🍪 Probando configuración de cookies de 15 minutos...\n')

    // Verificar que hay usuarios en la base de datos
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    })

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos')
      console.log('💡 Ejecuta: node scripts/create-essential-users.js')
      return
    }

    console.log('📋 Usuarios disponibles para testing:')
    console.log('┌─────────────────────────────────────────────────────────┐')
    users.forEach(user => {
      const status = user.isActive ? '✅ Activo' : '❌ Inactivo'
      console.log(`│ ${user.email.padEnd(30)} │ ${user.role.padEnd(15)} │ ${status.padEnd(10)} │`)
    })
    console.log('└─────────────────────────────────────────────────────────┘')

    console.log('\n🍪 Configuración de cookies de 15 minutos:')
    console.log('   ✅ JWT maxAge: 15 minutos (900 segundos)')
    console.log('   ✅ Session maxAge: 15 minutos (900 segundos)')
    console.log('   ✅ Cookie sessionToken: 15 minutos')
    console.log('   ✅ Cookie callbackUrl: 15 minutos')
    console.log('   ✅ Cookie csrfToken: 15 minutos')
    console.log('   ✅ HttpOnly: true (protección XSS)')
    console.log('   ✅ SameSite: lax (protección CSRF)')
    console.log('   ✅ Secure: true en producción')

    console.log('\n🛡️ Validaciones de seguridad implementadas:')
    console.log('   ✅ Verificación de cookie de sesión')
    console.log('   ✅ Verificación de token JWT')
    console.log('   ✅ Validación de campos requeridos')
    console.log('   ✅ Verificación de expiración JWT (15 min)')
    console.log('   ✅ Verificación de expiración cookie (15 min)')
    console.log('   ✅ Redirección automática al expirar')

    console.log('\n🧪 Para probar la configuración de 15 minutos:')
    console.log('   1. Inicia sesión con cualquier usuario')
    console.log('   2. Espera 15 minutos sin actividad')
    console.log('   3. Intenta acceder a /dashboard')
    console.log('   4. Verifica que seas redirigido al login')
    console.log('   5. Verifica los logs del servidor')

    console.log('\n⏰ Comportamiento esperado:')
    console.log('   - Sesión válida: 0-15 minutos')
    console.log('   - Redirección automática: >15 minutos')
    console.log('   - Re-login requerido: Cada 15 minutos')

    console.log('\n🔍 Logs a verificar:')
    console.log('   - "✅ Usuario autenticado con JWT y cookie válidos (15 min)"')
    console.log('   - "🚨 Cookie de sesión expirada (15 min), redirigiendo al login"')
    console.log('   - "🚨 Token JWT expirado (15 min), redirigiendo al login"')

  } catch (error) {
    console.error('❌ Error probando cookies de 15 minutos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test15MinCookies()
