const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixNewsCategories() {
  try {
    console.log('🔍 Verificando categorías de noticias con SQL directo...');
    
    // Usar SQL directo para verificar categorías
    const result = await prisma.$queryRaw`
      SELECT category, COUNT(*) as count 
      FROM news 
      GROUP BY category
    `;
    
    console.log('📊 Categorías encontradas:');
    console.log(result);
    
    // Verificar si hay categorías inválidas
    const invalidCategories = await prisma.$queryRaw`
      SELECT * FROM news 
      WHERE category NOT IN ('NOTICIAS', 'FUNDRAISING', 'SIN_CATEGORIA')
    `;
    
    if (invalidCategories.length > 0) {
      console.log('❌ Categorías inválidas encontradas:');
      console.log(invalidCategories);
      
      console.log('🔧 Corrigiendo categorías inválidas...');
      
      // Actualizar categorías inválidas a NOTICIAS
      const updateResult = await prisma.$executeRaw`
        UPDATE news 
        SET category = 'NOTICIAS' 
        WHERE category NOT IN ('NOTICIAS', 'FUNDRAISING', 'SIN_CATEGORIA')
      `;
      
      console.log(`✅ Actualizadas ${updateResult} noticias`);
    } else {
      console.log('✅ Todas las categorías son válidas');
    }
    
    // Verificar total de noticias
    const totalNews = await prisma.news.count();
    console.log(`📊 Total de noticias: ${totalNews}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixNewsCategories();
