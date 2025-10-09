const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const imagenesAdicionales = [
  {
    title: "Taller de estimulación temprana",
    description: "Madres y niños participando en taller de estimulación temprana del programa de Educación Infantil",
    imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800",
    imageAlt: "Taller de estimulación temprana",
    programa: "Educación Infantil",
    isFeatured: true
  },
  {
    title: "Promotora de salud en consulta",
    description: "Promotora de salud realizando consulta médica comunitaria",
    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800",
    imageAlt: "Consulta médica comunitaria",
    programa: "Salud Comunitaria",
    isFeatured: false
  },
  {
    title: "Joven emprendedor en su taller",
    description: "Joven emprendedor trabajando en su taller de carpintería",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    imageAlt: "Joven emprendedor en taller",
    programa: "Desarrollo Económico Juvenil",
    isFeatured: true
  },
  {
    title: "Taller de derechos de la infancia",
    description: "Niños y adultos participando en taller sobre derechos de la infancia",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    imageAlt: "Taller de derechos infantiles",
    programa: "Protección Infantil",
    isFeatured: false
  },
  {
    title: "Construcción de letrinas ecológicas",
    description: "Comunidad construyendo letrinas ecológicas como parte del programa de Agua y Saneamiento",
    imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800",
    imageAlt: "Construcción de letrinas ecológicas",
    programa: "Agua y Saneamiento",
    isFeatured: true
  },
  {
    title: "Mujeres en reunión comunitaria",
    description: "Mujeres líderes participando en reunión de toma de decisiones comunitarias",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
    imageAlt: "Mujeres en reunión comunitaria",
    programa: "Empoderamiento de Mujeres",
    isFeatured: false
  },
  {
    title: "Seguimiento nutricional infantil",
    description: "Profesional de salud realizando seguimiento nutricional a bebé",
    imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800",
    imageAlt: "Seguimiento nutricional infantil",
    programa: "Desarrollo de la Primera Infancia",
    isFeatured: true
  },
  {
    title: "Campo de agricultura sostenible",
    description: "Agricultor trabajando en campo con prácticas agrícolas sostenibles",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    imageAlt: "Agricultura sostenible",
    programa: "Desarrollo Rural Sostenible",
    isFeatured: false
  },
  {
    title: "Biblioteca comunitaria",
    description: "Niños leyendo en la biblioteca comunitaria del programa de Educación Infantil",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    imageAlt: "Biblioteca comunitaria",
    programa: "Educación Infantil",
    isFeatured: false
  },
  {
    title: "Campaña de vacunación",
    description: "Profesional de salud administrando vacuna durante campaña comunitaria",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    imageAlt: "Campaña de vacunación",
    programa: "Salud Comunitaria",
    isFeatured: true
  }
];

async function crearImagenesAdicionales() {
  try {
    console.log('🚀 Iniciando creación de imágenes adicionales...');

    // Buscar un usuario administrador para asignar como creador
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRADOR' }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario administrador.');
      return;
    }

    // Obtener programas
    const programas = await prisma.programas.findMany();
    
    // Crear imágenes adicionales
    for (const imagenData of imagenesAdicionales) {
      const programa = programas.find(p => p.nombreSector === imagenData.programa);
      
      const imagen = await prisma.imageLibrary.create({
        data: {
          title: imagenData.title,
          description: imagenData.description,
          imageUrl: imagenData.imageUrl,
          imageAlt: imagenData.imageAlt,
          programaId: programa?.id || null,
          isFeatured: imagenData.isFeatured,
          createdBy: adminUser.id
        }
      });

      console.log(`✅ Imagen creada: ${imagen.title}`);
      if (programa) {
        console.log(`   📌 Asociada al programa: ${programa.nombreSector}`);
      }
    }

    console.log('🎉 ¡Imágenes adicionales creadas exitosamente!');
    console.log(`📊 Total de imágenes creadas: ${imagenesAdicionales.length}`);

  } catch (error) {
    console.error('❌ Error creando imágenes adicionales:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
crearImagenesAdicionales();
