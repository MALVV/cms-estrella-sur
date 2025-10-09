const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkNews() {
  try {
    console.log('🔍 Verificando noticias en la base de datos...');
    
    const news = await prisma.news.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`📊 Total de noticias: ${news.length}`);
    
    if (news.length === 0) {
      console.log('❌ No hay noticias en la base de datos');
      console.log('💡 Necesitas crear noticias primero');
    } else {
      console.log('✅ Noticias encontradas:');
      news.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title} (${item.isActive ? 'Activa' : 'Inactiva'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error al verificar noticias:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNews();
