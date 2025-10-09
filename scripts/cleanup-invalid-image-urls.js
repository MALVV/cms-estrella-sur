const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Función para validar URLs de imágenes (copiada de image-utils.ts)
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    
    // Verificar que sea HTTP o HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) return false;
    
    // Verificar que tenga una extensión de imagen común
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'];
    const hasImageExtension = imageExtensions.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext)
    );
    
    // Servicios conocidos de imágenes
    const knownImageServices = [
      'images.unsplash.com',
      'images.pexels.com',
      'picsum.photos',
      'via.placeholder.com',
      'lh3.googleusercontent.com',
      'cdn.pixabay.com',
      'source.unsplash.com',
      'picsum.photos',
      'placehold.co',
      'placeholder.com'
    ];
    
    const isKnownService = knownImageServices.some(service => 
      urlObj.hostname.includes(service)
    );
    
    // URLs base64 (data:image/...)
    const isBase64Image = url.startsWith('data:image/');
    
    return hasImageExtension || isKnownService || isBase64Image;
  } catch {
    return false;
  }
};

async function cleanupInvalidImageUrls() {
  try {
    console.log('🧹 Iniciando limpieza de URLs de imágenes inválidas...\n');

    // 1. Limpiar noticias
    console.log('1. Verificando noticias...');
    const news = await prisma.news.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true
      }
    });

    let newsUpdated = 0;
    for (const item of news) {
      if (item.imageUrl && !isValidImageUrl(item.imageUrl)) {
        console.log(`   ❌ URL inválida en noticia "${item.title}": ${item.imageUrl}`);
        await prisma.news.update({
          where: { id: item.id },
          data: { imageUrl: null }
        });
        newsUpdated++;
      }
    }

    // 2. Limpiar eventos
    console.log('\n2. Verificando eventos...');
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true
      }
    });

    let eventsUpdated = 0;
    for (const item of events) {
      if (item.imageUrl && !isValidImageUrl(item.imageUrl)) {
        console.log(`   ❌ URL inválida en evento "${item.title}": ${item.imageUrl}`);
        await prisma.event.update({
          where: { id: item.id },
          data: { imageUrl: null }
        });
        eventsUpdated++;
      }
    }

    // 3. Limpiar historias
    console.log('\n3. Verificando historias...');
    const stories = await prisma.stories.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true
      }
    });

    let storiesUpdated = 0;
    for (const item of stories) {
      if (item.imageUrl && !isValidImageUrl(item.imageUrl)) {
        console.log(`   ❌ URL inválida en historia "${item.title}": ${item.imageUrl}`);
        await prisma.stories.update({
          where: { id: item.id },
          data: { imageUrl: null }
        });
        storiesUpdated++;
      }
    }

    // 4. Limpiar proyectos
    console.log('\n4. Verificando proyectos...');
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true
      }
    });

    let projectsUpdated = 0;
    for (const item of projects) {
      if (item.imageUrl && !isValidImageUrl(item.imageUrl)) {
        console.log(`   ❌ URL inválida en proyecto "${item.title}": ${item.imageUrl}`);
        await prisma.project.update({
          where: { id: item.id },
          data: { imageUrl: null }
        });
        projectsUpdated++;
      }
    }

    // Resumen
    console.log('\n📊 Resumen de limpieza:');
    console.log(`   Noticias actualizadas: ${newsUpdated}`);
    console.log(`   Eventos actualizados: ${eventsUpdated}`);
    console.log(`   Historias actualizadas: ${storiesUpdated}`);
    console.log(`   Proyectos actualizados: ${projectsUpdated}`);
    console.log(`   Total actualizados: ${newsUpdated + eventsUpdated + storiesUpdated + projectsUpdated}`);

    console.log('\n✅ Limpieza completada exitosamente.');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupInvalidImageUrls();
