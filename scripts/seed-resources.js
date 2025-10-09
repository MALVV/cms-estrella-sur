const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedResources() {
  try {
    console.log('Insertando recursos multimedia de prueba...');

    const resources = [
      {
        id: 'resource_001',
        title: 'Video Educativo: Desarrollo Comunitario',
        description: 'Video explicativo sobre las metodologías de desarrollo comunitario aplicadas en nuestros proyectos',
        fileName: 'desarrollo_comunitario.mp4',
        fileUrl: 'https://example.com/videos/desarrollo_comunitario.mp4',
        fileSize: 52428800, // 50MB
        fileType: 'video/mp4',
        category: 'CENTRO_MULTIMEDIA',
        subcategory: 'VIDEOS',
        thumbnailUrl: 'https://example.com/thumbnails/desarrollo_comunitario.jpg',
        duration: 1200, // 20 minutos
        isActive: true,
        isFeatured: true,
        downloadCount: 0,
      },
      {
        id: 'resource_002',
        title: 'Podcast: Historias de Impacto',
        description: 'Serie de podcasts con testimonios de beneficiarios y sus historias de transformación',
        fileName: 'historias_impacto_podcast.mp3',
        fileUrl: 'https://example.com/audio/historias_impacto_podcast.mp3',
        fileSize: 25165824, // 24MB
        fileType: 'audio/mpeg',
        category: 'CENTRO_MULTIMEDIA',
        subcategory: 'AUDIOS',
        thumbnailUrl: 'https://example.com/thumbnails/podcast.jpg',
        duration: 1800, // 30 minutos
        isActive: true,
        isFeatured: false,
        downloadCount: 0,
      },
      {
        id: 'resource_003',
        title: 'Manual de Metodologías Educativas',
        description: 'Guía completa con metodologías educativas innovadoras para el desarrollo infantil',
        fileName: 'manual_metodologias_educativas.pdf',
        fileUrl: 'https://example.com/manuals/manual_metodologias_educativas.pdf',
        fileSize: 8388608, // 8MB
        fileType: 'application/pdf',
        category: 'PUBLICACIONES',
        subcategory: 'MANUALES',
        thumbnailUrl: 'https://example.com/thumbnails/manual_educativo.jpg',
        duration: null,
        isActive: true,
        isFeatured: true,
        downloadCount: 0,
      },
      {
        id: 'resource_004',
        title: 'Guía de Participación Comunitaria',
        description: 'Documento descargable con estrategias para fomentar la participación activa en comunidades',
        fileName: 'guia_participacion_comunitaria.pdf',
        fileUrl: 'https://example.com/guides/guia_participacion_comunitaria.pdf',
        fileSize: 4194304, // 4MB
        fileType: 'application/pdf',
        category: 'PUBLICACIONES',
        subcategory: 'GUIAS_DESCARGABLES',
        thumbnailUrl: 'https://example.com/thumbnails/guia_participacion.jpg',
        duration: null,
        isActive: true,
        isFeatured: false,
        downloadCount: 0,
      },
      {
        id: 'resource_005',
        title: 'Biblioteca Digital: Recursos Educativos',
        description: 'Colección completa de recursos educativos digitales para docentes y facilitadores',
        fileName: 'biblioteca_recursos_educativos.zip',
        fileUrl: 'https://example.com/library/biblioteca_recursos_educativos.zip',
        fileSize: 104857600, // 100MB
        fileType: 'application/zip',
        category: 'PUBLICACIONES',
        subcategory: 'BIBLIOTECA_DIGITAL',
        thumbnailUrl: 'https://example.com/thumbnails/biblioteca_digital.jpg',
        duration: null,
        isActive: true,
        isFeatured: true,
        downloadCount: 0,
      },
      {
        id: 'resource_006',
        title: 'Video Tutorial: Uso de Herramientas Digitales',
        description: 'Tutorial paso a paso para el uso de herramientas digitales en proyectos comunitarios',
        fileName: 'tutorial_herramientas_digitales.mp4',
        fileUrl: 'https://example.com/videos/tutorial_herramientas_digitales.mp4',
        fileSize: 67108864, // 64MB
        fileType: 'video/mp4',
        category: 'CENTRO_MULTIMEDIA',
        subcategory: 'VIDEOS',
        thumbnailUrl: 'https://example.com/thumbnails/tutorial_digital.jpg',
        duration: 900, // 15 minutos
        isActive: true,
        isFeatured: false,
        downloadCount: 0,
      },
      {
        id: 'resource_007',
        title: 'Audio: Meditación para Niños',
        description: 'Sesión de meditación guiada diseñada especialmente para niños y niñas',
        fileName: 'meditacion_ninos.mp3',
        fileUrl: 'https://example.com/audio/meditacion_ninos.mp3',
        fileSize: 12582912, // 12MB
        fileType: 'audio/mpeg',
        category: 'CENTRO_MULTIMEDIA',
        subcategory: 'AUDIOS',
        thumbnailUrl: 'https://example.com/thumbnails/meditacion_ninos.jpg',
        duration: 600, // 10 minutos
        isActive: true,
        isFeatured: false,
        downloadCount: 0,
      },
      {
        id: 'resource_008',
        title: 'Manual de Sostenibilidad Ambiental',
        description: 'Guía práctica para implementar proyectos de sostenibilidad ambiental en comunidades',
        fileName: 'manual_sostenibilidad_ambiental.pdf',
        fileUrl: 'https://example.com/manuals/manual_sostenibilidad_ambiental.pdf',
        fileSize: 12582912, // 12MB
        fileType: 'application/pdf',
        category: 'PUBLICACIONES',
        subcategory: 'MANUALES',
        thumbnailUrl: 'https://example.com/thumbnails/manual_ambiental.jpg',
        duration: null,
        isActive: true,
        isFeatured: false,
        downloadCount: 0,
      },
    ];

    for (const resource of resources) {
      await prisma.resource.upsert({
        where: { id: resource.id },
        update: resource,
        create: resource,
      });
      console.log(`✓ Recurso creado: ${resource.title}`);
    }

    console.log('✅ Recursos multimedia insertados exitosamente');
  } catch (error) {
    console.error('❌ Error al insertar recursos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedResources();
