const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseTables() {
  try {
    console.log('🔍 Verificando tablas en la base de datos...\n');

    // Verificar si las tablas existen
    const tables = [
      'news',
      'events', 
      'users',
      'programas',
      'methodology',
      'projects'
    ];

    for (const table of tables) {
      try {
        const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM ${table}`;
        console.log(`✅ Tabla ${table}: Existe`);
      } catch (error) {
        console.log(`❌ Tabla ${table}: NO existe - ${error.message}`);
      }
    }

    console.log('\n🔍 Verificando modelo News específicamente...');
    
    try {
      const newsCount = await prisma.news.count();
      console.log(`✅ Modelo News: Funciona correctamente (${newsCount} registros)`);
    } catch (error) {
      console.log(`❌ Modelo News: Error - ${error.message}`);
    }

    console.log('\n🔍 Verificando relaciones del modelo News...');
    
    try {
      const newsWithRelations = await prisma.news.findMany({
        include: {
          author: true,
          programa: true,
          project: true,
          methodology: true,
        },
        take: 1
      });
      console.log('✅ Relaciones del modelo News: Funcionan correctamente');
    } catch (error) {
      console.log(`❌ Relaciones del modelo News: Error - ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseTables();


