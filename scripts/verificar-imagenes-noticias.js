const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarImagenesNoticias() {
  try {
    console.log('📰 Verificando imágenes en noticias...\n');

    // Verificar noticias con imágenes
    const noticiasConImagenes = await prisma.news.findMany({
      where: { 
        isActive: true,
        imageUrl: { not: null }
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        imageAlt: true,
        category: true,
        isFeatured: true,
        publishedAt: true
      },
      take: 10
    });

    console.log('📋 NOTICIAS CON IMÁGENES:');
    noticiasConImagenes.forEach((noticia, index) => {
      console.log(`  ${index + 1}. "${noticia.title}"`);
      console.log(`     🏷️ Categoría: ${noticia.category}`);
      console.log(`     ⭐ Destacada: ${noticia.isFeatured ? 'Sí' : 'No'}`);
      console.log(`     📅 Publicada: ${noticia.publishedAt}`);
      console.log(`     🎯 Imagen: ${noticia.imageAlt || 'Sin título'}`);
      console.log(`     📷 URL: ${noticia.imageUrl}`);
      console.log('');
    });

    // Verificar totales
    const totalNoticias = await prisma.news.count({ where: { isActive: true } });
    const noticiasConImg = await prisma.news.count({
      where: {
        isActive: true,
        imageUrl: { not: null }
      }
    });

    console.log('📊 RESUMEN:');
    console.log(`- Total de noticias activas: ${totalNoticias}`);
    console.log(`- Noticias con imágenes: ${noticiasConImg}`);
    console.log(`- Porcentaje con imágenes: ${totalNoticias > 0 ? Math.round((noticiasConImg / totalNoticias) * 100) : 0}%`);

    if (noticiasConImg === 0) {
      console.log('\n⚠️  PROBLEMA IDENTIFICADO:');
      console.log('No hay noticias con imágenes en la base de datos.');
      console.log('Esto explica por qué no se muestran imágenes en la página de detalle.');
    } else {
      console.log('\n✅ Las noticias tienen imágenes disponibles.');
      console.log('El problema podría estar en:');
      console.log('1. La API pública de noticias');
      console.log('2. El componente Image de Next.js');
      console.log('3. Las URLs de las imágenes');
    }

  } catch (error) {
    console.error('❌ Error verificando imágenes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarImagenesNoticias();
