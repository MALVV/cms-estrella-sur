const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleStories = [
  {
    id: 'story_1758923020432_yhpc733na',
    title: 'Gastón Ayuda a Niños',
    description: 'Gastón es un voluntario que dedica su tiempo libre a ayudar a niños en situación de vulnerabilidad. Su historia inspira a muchos a hacer la diferencia en sus comunidades.',
    imageUrl: 'https://images.pexels.com/photos/33735069/pexels-photo-33735069.jpeg',
    imageAlt: 'Niño sonriente con un tazón de comida',
    isActive: true,
    createdBy: 'cmg1ari950000fvmchpcrb6gi'
  },
  {
    id: 'story_1758923020433_abc123def',
    title: 'María Transforma Vidas',
    description: 'María creó un programa de tutorías que ha ayudado a más de 200 niños a mejorar sus calificaciones y confianza en sí mismos.',
    imageUrl: 'https://images.pexels.com/photos/33601908/pexels-photo-33601908.jpeg',
    imageAlt: 'Niña estudiando con libros',
    isActive: true,
    createdBy: 'cmg1ari950000fvmchpcrb6gi'
  },
  {
    id: 'story_1758923020434_xyz789ghi',
    title: 'El Poder de la Educación',
    description: 'Un proyecto comunitario que ha construido 5 escuelas en zonas rurales, beneficiando a más de 1,000 niños que antes no tenían acceso a educación.',
    imageUrl: 'https://images.pexels.com/photos/33601908/pexels-photo-33601908.jpeg',
    imageAlt: 'Escuela rural con niños felices',
    isActive: true,
    createdBy: 'cmg1ari950000fvmchpcrb6gi'
  }
]

async function seedStories() {
  try {
    console.log('🌱 Iniciando seed de stories...')
    
    // Obtener un usuario para usar como creador
    const user = await prisma.user.findFirst({
      where: {
        role: 'ADMINISTRADOR'
      }
    })
    
    if (!user) {
      console.error('❌ No se encontró ningún usuario administrador')
      return
    }
    
    console.log(`👤 Usando usuario: ${user.name} (${user.email})`)
    
    // Verificar si ya existen stories
    const existingStories = await prisma.stories.count()
    if (existingStories > 0) {
      console.log(`✅ Ya existen ${existingStories} stories en la base de datos`)
      return
    }

    // Crear stories con el usuario válido
    for (const story of sampleStories) {
      await prisma.stories.create({
        data: {
          ...story,
          createdBy: user.id
        }
      })
      console.log(`✅ Story creada: ${story.title}`)
    }

    console.log('🎉 Seed de stories completado exitosamente!')
  } catch (error) {
    console.error('❌ Error durante el seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedStories()