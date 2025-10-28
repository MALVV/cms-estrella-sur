const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createEssentialUsers() {
  try {
    console.log('🔧 Creando usuarios esenciales del sistema...')

    // Limpiar todos los usuarios existentes
    await prisma.user.deleteMany({})
    console.log('✅ Usuarios existentes eliminados')

    // Crear usuarios esenciales
    const users = [
      {
        email: 'admin@estrellasur.com',
        name: 'ADMINISTRATOR Principal',
        password: 'Admin123!',
        role: 'ADMINISTRATOR',
        mustChangePassword: true
      },
      {
        email: 'supervisor@estrellasur.com',
        name: 'Supervisor de Contenido',
        password: 'Supervisor123!',
        role: 'SUPERVISOR',
        mustChangePassword: true
      },
      {
        email: 'tecnico@estrellasur.com',
        name: 'Técnico de Soporte',
        password: 'Tecnico123!',
        role: 'TECNICO',
        mustChangePassword: true
      }
    ]

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: userData.role,
          isActive: true,
          mustChangePassword: userData.mustChangePassword
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          mustChangePassword: true
        }
      })

      console.log(`✅ ${userData.role} creado:`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Nombre: ${user.name}`)
      console.log(`   Contraseña: ${userData.password}`)
      console.log(`   Debe cambiar contraseña: ${user.mustChangePassword}`)
      console.log('')
    }

    console.log('🎯 Usuarios esenciales creados exitosamente!')
    console.log('\n📋 Credenciales de acceso:')
    console.log('┌─────────────────────────────────────────────────────────┐')
    console.log('│ ADMINISTRATOR                                           │')
    console.log('│ Email: admin@estrellasur.com                           │')
    console.log('│ Contraseña: Admin123!                                  │')
    console.log('│                                                         │')
    console.log('│ SUPERVISOR                                              │')
    console.log('│ Email: supervisor@estrellasur.com                      │')
    console.log('│ Contraseña: Supervisor123!                             │')
    console.log('│                                                         │')
    console.log('│ TÉCNICO                                                 │')
    console.log('│ Email: tecnico@estrellasur.com                        │')
    console.log('│ Contraseña: Tecnico123!                                │')
    console.log('└─────────────────────────────────────────────────────────┘')
    console.log('\n⚠️  IMPORTANTE: Todos los usuarios deben cambiar su contraseña en el primer login')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createEssentialUsers()
