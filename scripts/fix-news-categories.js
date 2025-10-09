const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkNewsCategories() {
  try {
    console.log('🔍 Verificando categorías de noticias...');
    
    // Verificar noticias con categoría COMPAÑIA
    const newsWithCompania = await prisma.news.findMany({
      where: {
        category: 'COMPAÑIA'
      }
    });

    console.log(`📊 Noticias con categoría COMPAÑIA: ${newsWithCompania.length}`);
    
    if (newsWithCompania.length > 0) {
      console.log('❌ Encontradas noticias con categoría COMPAÑIA (no válida):');
      newsWithCompania.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title} - ${item.category}`);
      });
      
      console.log('🔧 Actualizando categorías...');
      
      // Actualizar todas las noticias con categoría COMPAÑIA a NOTICIAS
      const updated = await prisma.news.updateMany({
        where: {
          category: 'COMPAÑIA'
        },
        data: {
          category: 'NOTICIAS'
        }
      });
      
      console.log(`✅ Actualizadas ${updated.count} noticias`);
    } else {
      console.log('✅ No hay noticias con categoría COMPAÑIA');
    }
    
    // Verificar todas las noticias ahora
    const allNews = await prisma.news.findMany();
    console.log(`📊 Total de noticias: ${allNews.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNewsCategories();
