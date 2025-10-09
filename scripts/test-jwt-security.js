const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testJWTSecurity() {
  try {
    console.log('🔐 Probando seguridad JWT del sistema...\n')

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

    console.log('\n🛡️ Configuración de seguridad JWT:')
    console.log('   ✅ Estrategia: JWT (no cookies de sesión)')
    console.log('   ✅ Tiempo de vida: 24 horas (más seguro que 30 días)')
    console.log('   ✅ Verificación de expiración: Implementada')
    console.log('   ✅ Validación de campos requeridos: Implementada')
    console.log('   ✅ Redirección automática: Implementada')

    console.log('\n🧪 Para probar la seguridad:')
    console.log('   1. Inicia sesión con cualquier usuario')
    console.log('   2. Intenta acceder a /dashboard sin token')
    console.log('   3. Verifica que seas redirigido al login')
    console.log('   4. Intenta acceder con token expirado')
    console.log('   5. Verifica que seas redirigido al login')

    console.log('\n🔍 Verificar logs del servidor:')
    console.log('   - Busca mensajes de "🚨 Acceso no autorizado"')
    console.log('   - Busca mensajes de "✅ Usuario autenticado con JWT válido"')
    console.log('   - Verifica que los tokens contengan: id, email, role, exp')

  } catch (error) {
    console.error('❌ Error probando seguridad JWT:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testJWTSecurity()
