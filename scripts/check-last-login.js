const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkLastLogin() {
  try {
    console.log('🔍 Verificando último login de usuarios...')

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        lastLoginAt: true,
        createdAt: true
      }
    })

    console.log('\n📋 Estado de usuarios:')
    console.log('┌─────────────────────────────────────────────────────────┐')
    
    users.forEach(user => {
      const lastLogin = user.lastLoginAt 
        ? new Date(user.lastLoginAt).toLocaleString()
        : 'Nunca'
      
      console.log(`│ ${user.email.padEnd(30)} │ ${lastLogin.padEnd(20)} │`)
    })
    
    console.log('└─────────────────────────────────────────────────────────┘')
    console.log('\n💡 Para probar el último login:')
    console.log('   1. Inicia sesión con cualquier usuario')
    console.log('   2. Ejecuta este script nuevamente')
    console.log('   3. Verifica que lastLoginAt se haya actualizado')

  } catch (error) {
    console.error('❌ Error verificando último login:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkLastLogin()
