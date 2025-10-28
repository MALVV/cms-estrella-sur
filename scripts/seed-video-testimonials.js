const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const videoTestimonials = [
  {
    title: "Transformando Vidas en la Comunidad",
    description: "María nos cuenta cómo nuestro programa de educación le cambió la vida completamente. Desde aprender a leer hasta convertirse en líder comunitaria.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 180,
    isActive: true,
    isFeatured: true
  },
  {
    title: "Historia de Superación y Esperanza",
    description: "Carlos comparte su experiencia de cómo superó las dificultades económicas gracias a nuestros programas de capacitación laboral.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 240,
    isActive: true,
    isFeatured: true
  },
  {
    title: "Construyendo un Futuro Mejor",
    description: "Ana relata cómo nuestro proyecto de construcción de viviendas dignas transformó su familia y su comunidad.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 200,
    isActive: true,
    isFeatured: false
  },
  {
    title: "Educación que Cambia Destinos",
    description: "Roberto explica cómo nuestros programas educativos le permitieron acceder a mejores oportunidades laborales y mejorar su calidad de vida.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 220,
    isActive: true,
    isFeatured: false
  },
  {
    title: "Salud y Bienestar para Todos",
    description: "Isabel comparte su testimonio sobre cómo nuestros programas de salud comunitaria mejoraron la calidad de vida de su familia.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 190,
    isActive: true,
    isFeatured: true
  },
  {
    title: "Empoderamiento Femenino",
    description: "Lucía nos cuenta cómo nuestros talleres de empoderamiento femenino la ayudaron a convertirse en una líder en su comunidad.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 210,
    isActive: true,
    isFeatured: false
  },
  {
    title: "Jóvenes Construyendo el Futuro",
    description: "Diego y sus amigos comparten cómo nuestros programas juveniles les dieron las herramientas para ser agentes de cambio positivo.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 250,
    isActive: true,
    isFeatured: true
  },
  {
    title: "Sostenibilidad y Medio Ambiente",
    description: "Carmen explica cómo nuestros proyectos ambientales están ayudando a proteger el planeta para las futuras generaciones.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 195,
    isActive: true,
    isFeatured: false
  }
]

async function seedVideoTestimonials() {
  try {
    console.log('🌱 Iniciando seed de videos testimoniales...')

    // Obtener el primer usuario admin para asignar como creador
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRATOR' }
    })

    if (!adminUser) {
      console.log('❌ No se encontró usuario ADMINISTRATOR. Creando videos sin creador asignado.')
    }

    // Crear videos testimoniales
    for (const videoData of videoTestimonials) {
      const video = await prisma.videoTestimonial.create({
        data: {
          ...videoData,
          createdBy: adminUser?.id
        }
      })
      console.log(`✅ Video testimonial creado: "${video.title}"`)
    }

    console.log(`🎉 Se crearon ${videoTestimonials.length} videos testimoniales exitosamente!`)
    
    // Mostrar estadísticas
    const totalVideos = await prisma.videoTestimonial.count()
    const activeVideos = await prisma.videoTestimonial.count({ where: { isActive: true } })
    const featuredVideos = await prisma.videoTestimonial.count({ where: { isFeatured: true } })
    
    console.log('\n📊 Estadísticas:')
    console.log(`- Total de videos: ${totalVideos}`)
    console.log(`- Videos activos: ${activeVideos}`)
    console.log(`- Videos destacados: ${featuredVideos}`)

  } catch (error) {
    console.error('❌ Error al crear videos testimoniales:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el seed
seedVideoTestimonials()
