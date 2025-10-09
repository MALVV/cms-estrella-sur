const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleImagesToGallery() {
  try {
    console.log('🖼️  Agregando imágenes de muestra a la galería de programas...\n');

    // Obtener un usuario válido para usar como createdBy
    const user = await prisma.user.findFirst({
      where: { isActive: true },
      select: { id: true, email: true }
    });

    if (!user) {
      throw new Error('No se encontró un usuario válido en la base de datos');
    }

    console.log(`👤 Usuario encontrado: ${user.email} (${user.id})`);

    // Obtener programas que tienen pocas imágenes
    const programas = await prisma.programas.findMany({
      where: {
        isActive: true,
        imageLibrary: {
          some: {
            isActive: true
          }
        }
      },
      include: {
        imageLibrary: {
          where: { isActive: true },
          select: { id: true, title: true }
        }
      }
    });

    console.log(`📋 Programas encontrados: ${programas.length}`);

    // Imágenes de muestra por categoría de programa
    const sampleImages = {
      'Empoderamiento de Mujeres': [
        {
          title: 'Taller de liderazgo femenino',
          description: 'Mujeres participando en taller de desarrollo de liderazgo',
          imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
          imageAlt: 'Mujeres en taller de liderazgo'
        },
        {
          title: 'Emprendimiento femenino',
          description: 'Mujeres emprendedoras presentando sus proyectos',
          imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0c29c6d0b3e?w=800',
          imageAlt: 'Mujeres emprendedoras'
        },
        {
          title: 'Red de apoyo comunitario',
          description: 'Red de mujeres apoyándose mutuamente en la comunidad',
          imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
          imageAlt: 'Red de apoyo comunitario'
        }
      ],
      'Salud Comunitaria': [
        {
          title: 'Consulta médica comunitaria',
          description: 'Profesional de salud atendiendo a miembros de la comunidad',
          imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
          imageAlt: 'Consulta médica comunitaria'
        },
        {
          title: 'Campamento de salud',
          description: 'Campamento de salud preventiva en la comunidad',
          imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
          imageAlt: 'Campamento de salud'
        },
        {
          title: 'Educación en salud',
          description: 'Taller educativo sobre prevención de enfermedades',
          imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800',
          imageAlt: 'Educación en salud'
        }
      ],
      'Educación Infantil': [
        {
          title: 'Aula de aprendizaje',
          description: 'Niños participando en actividades educativas',
          imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
          imageAlt: 'Aula de aprendizaje infantil'
        },
        {
          title: 'Actividades recreativas',
          description: 'Niños disfrutando de actividades recreativas educativas',
          imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
          imageAlt: 'Actividades recreativas infantiles'
        },
        {
          title: 'Biblioteca infantil',
          description: 'Espacio de lectura y aprendizaje para niños',
          imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
          imageAlt: 'Biblioteca infantil'
        }
      ],
      'Protección Infantil': [
        {
          title: 'Taller de derechos infantiles',
          description: 'Niños aprendiendo sobre sus derechos fundamentales',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          imageAlt: 'Taller de derechos infantiles'
        },
        {
          title: 'Espacio seguro para niños',
          description: 'Área protegida donde los niños pueden jugar y aprender',
          imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
          imageAlt: 'Espacio seguro infantil'
        },
        {
          title: 'Apoyo psicológico',
          description: 'Profesional brindando apoyo psicológico a niños',
          imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800',
          imageAlt: 'Apoyo psicológico infantil'
        }
      ],
      'Desarrollo Rural Sostenible': [
        {
          title: 'Agricultura sostenible',
          description: 'Campesinos implementando técnicas agrícolas sostenibles',
          imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
          imageAlt: 'Agricultura sostenible'
        },
        {
          title: 'Tecnología rural',
          description: 'Implementación de tecnología para mejorar la producción rural',
          imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=800',
          imageAlt: 'Tecnología rural'
        },
        {
          title: 'Comunidad rural',
          description: 'Comunidad trabajando junta en proyectos de desarrollo',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          imageAlt: 'Comunidad rural'
        }
      ],
      'Desarrollo Económico Juvenil': [
        {
          title: 'Taller de habilidades',
          description: 'Jóvenes desarrollando habilidades para el empleo',
          imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
          imageAlt: 'Taller de habilidades juveniles'
        },
        {
          title: 'Emprendimiento juvenil',
          description: 'Jóvenes presentando sus ideas de negocio',
          imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
          imageAlt: 'Emprendimiento juvenil'
        },
        {
          title: 'Networking profesional',
          description: 'Jóvenes conectándose con profesionales del sector',
          imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
          imageAlt: 'Networking profesional juvenil'
        }
      ],
      'Agua y Saneamiento': [
        {
          title: 'Sistema de agua potable',
          description: 'Instalación de sistema de agua potable en la comunidad',
          imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
          imageAlt: 'Sistema de agua potable'
        },
        {
          title: 'Educación en higiene',
          description: 'Taller educativo sobre higiene y saneamiento',
          imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
          imageAlt: 'Educación en higiene'
        },
        {
          title: 'Infraestructura sanitaria',
          description: 'Construcción de infraestructura de saneamiento',
          imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
          imageAlt: 'Infraestructura sanitaria'
        }
      ]
    };

    let totalAdded = 0;

    for (const programa of programas) {
      const currentImageCount = programa.imageLibrary.length;
      const programaImages = sampleImages[programa.nombreSector] || [];
      
      console.log(`\n📋 ${programa.nombreSector}:`);
      console.log(`   Imágenes actuales: ${currentImageCount}`);
      
      if (currentImageCount < 6 && programaImages.length > 0) {
        const imagesToAdd = programaImages.slice(0, 6 - currentImageCount);
        
        for (const imageData of imagesToAdd) {
          try {
            await prisma.imageLibrary.create({
              data: {
                title: imageData.title,
                description: imageData.description,
                imageUrl: imageData.imageUrl,
                imageAlt: imageData.imageAlt,
                programaId: programa.id,
                isActive: true,
                isFeatured: false,
                createdBy: user.id
              }
            });
            
            console.log(`   ✅ Agregada: ${imageData.title}`);
            totalAdded++;
          } catch (error) {
            console.log(`   ❌ Error agregando ${imageData.title}: ${error.message}`);
          }
        }
      } else {
        console.log(`   ⏭️  Ya tiene suficientes imágenes o no hay imágenes de muestra`);
      }
    }

    console.log(`\n🎉 Proceso completado!`);
    console.log(`📊 Total de imágenes agregadas: ${totalAdded}`);

    // Verificar resultados
    console.log(`\n🔍 Verificando resultados...`);
    const updatedProgramas = await prisma.programas.findMany({
      where: { isActive: true },
      include: {
        imageLibrary: {
          where: { isActive: true },
          select: { id: true, title: true }
        }
      }
    });

    updatedProgramas.forEach(programa => {
      console.log(`   ${programa.nombreSector}: ${programa.imageLibrary.length} imágenes`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  addSampleImagesToGallery();
}

module.exports = { addSampleImagesToGallery };
