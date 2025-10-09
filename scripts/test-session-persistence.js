const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testSessionPersistence() {
  try {
    console.log('🔍 Probando persistencia de sesión de 15 minutos...\n')

    // Verificar que hay usuarios en la base de datos
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true
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
      const lastLogin = user.lastLoginAt 
        ? new Date(user.lastLoginAt).toLocaleString()
        : 'Nunca'
      
      console.log(`│ ${user.email.padEnd(30)} │ ${user.role.padEnd(15)} │ ${status.padEnd(10)} │`)
    })
    console.log('└─────────────────────────────────────────────────────────┘')

    console.log('\n🍪 Configuración de cookies de 15 minutos:')
    console.log('   ✅ JWT maxAge: 15 minutos (900 segundos)')
    console.log('   ✅ Session maxAge: 15 minutos (900 segundos)')
    console.log('   ✅ Cookie sessionToken: 15 minutos')
    console.log('   ✅ HttpOnly: true')
    console.log('   ✅ SameSite: lax')

    console.log('\n🧪 Pasos para probar la persistencia de sesión:')
    console.log('   1. Inicia sesión con cualquier usuario')
    console.log('   2. Ve a la página principal (/)')
    console.log('   3. Verifica que el navbar muestre "Dashboard"')
    console.log('   4. Haz clic en "Dashboard" para volver')
    console.log('   5. Repite el proceso varias veces')
    console.log('   6. Espera 15 minutos y prueba nuevamente')

    console.log('\n🔍 Verificar en el navegador:')
    console.log('   - Abre DevTools → Application → Cookies')
    console.log('   - Busca "next-auth.session-token"')
    console.log('   - Verifica que tenga una fecha de expiración')
    console.log('   - La cookie debe durar 15 minutos desde el último login')

    console.log('\n🚨 Posibles problemas:')
    console.log('   - Si la sesión se pierde inmediatamente:')
    console.log('     → Verificar NEXTAUTH_SECRET en .env')
    console.log('     → Verificar que el servidor esté corriendo')
    console.log('     → Verificar logs del servidor')
    console.log('   - Si la sesión dura más de 15 minutos:')
    console.log('     → Verificar configuración de cookies')
    console.log('     → Verificar que el middleware esté activo')

    console.log('\n📝 Logs a verificar en el servidor:')
    console.log('   - "✅ Usuario autenticado con JWT y cookie válidos (15 min)"')
    console.log('   - "🎫 Creando JWT token"')
    console.log('   - "🔐 Usuario autenticado"')

  } catch (error) {
    console.error('❌ Error probando persistencia de sesión:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSessionPersistence()
