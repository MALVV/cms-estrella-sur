// Script para verificar metodologías en la base de datos
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMethodologies() {
  try {
    console.log('🔍 Verificando metodologías en la base de datos...');
    
    // Obtener todas las metodologías (activas e inactivas)
    const allMethodologies = await prisma.methodology.findMany({
      select: {
        id: true,
        title: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Total de metodologías encontradas: ${allMethodologies.length}`);
    
    if (allMethodologies.length > 0) {
      console.log('📋 Lista de metodologías:');
      allMethodologies.forEach((methodology, index) => {
        console.log(`${index + 1}. ID: ${methodology.id}`);
        console.log(`   Título: ${methodology.title}`);
        console.log(`   Activa: ${methodology.isActive ? '✅' : '❌'}`);
        console.log(`   Creada: ${methodology.createdAt}`);
        console.log('---');
      });
    } else {
      console.log('⚠️ No se encontraron metodologías en la base de datos');
    }

    // Verificar metodologías activas específicamente
    const activeMethodologies = await prisma.methodology.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
      },
    });

    console.log(`✅ Metodologías activas: ${activeMethodologies.length}`);
    
  } catch (error) {
    console.error('❌ Error al verificar metodologías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMethodologies();