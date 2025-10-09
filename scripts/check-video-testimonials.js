const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkVideos() {
  try {
    const videos = await prisma.videoTestimonial.findMany({
      select: {
        id: true,
        title: true,
        isActive: true,
        isFeatured: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('📹 Videos testimoniales en la base de datos:')
    console.log('=' .repeat(50))
    
    videos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}`)
      console.log(`   ID: ${video.id}`)
      console.log(`   Estado: ${video.isActive ? '✅ Activo' : '❌ Inactivo'}`)
      console.log(`   Destacado: ${video.isFeatured ? '⭐ Sí' : '📄 No'}`)
      console.log(`   Creado: ${video.createdAt.toLocaleDateString()}`)
      console.log('')
    })

    console.log(`Total: ${videos.length} videos testimoniales`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVideos()
