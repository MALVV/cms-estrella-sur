const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    })
    
    console.log('Usuarios disponibles:')
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Nombre: ${user.name}, Email: ${user.email}`)
    })
    
    if (users.length === 0) {
      console.log('No hay usuarios en la base de datos')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
