const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarAPIs() {
  try {
    console.log('🔍 Verificando APIs públicas...\n');

    // Verificar metodologías
    console.log('📚 METODOLOGÍAS:');
    const methodologies = await prisma.methodology.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        category: true,
        ageGroup: true,
        isActive: true
      }
    });
    
    console.log(`Total activas: ${methodologies.length}`);
    methodologies.forEach(m => {
      console.log(`  • "${m.title}" (${m.category}) - ${m.ageGroup}`);
    });

    // Verificar proyectos
    console.log('\n🚀 PROYECTOS:');
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        executionStart: true,
        executionEnd: true,
        isActive: true
      }
    });
    
    console.log(`Total activos: ${projects.length}`);
    projects.forEach(p => {
      console.log(`  • "${p.title}" (${p.executionStart} - ${p.executionEnd})`);
    });

    // Verificar programas
    console.log('\n📋 PROGRAMAS:');
    const programas = await prisma.programas.findMany({
      where: { isActive: true },
      select: {
        id: true,
        nombreSector: true,
        isActive: true
      }
    });
    
    console.log(`Total activos: ${programas.length}`);
    programas.forEach(p => {
      console.log(`  • "${p.nombreSector}"`);
    });

    console.log('\n✅ Verificación completada');
    console.log('\n🔧 DIAGNÓSTICO:');
    
    if (methodologies.length === 0) {
      console.log('❌ No hay metodologías activas en la base de datos');
    } else {
      console.log('✅ Metodologías encontradas en la base de datos');
    }
    
    if (projects.length === 0) {
      console.log('❌ No hay proyectos activos en la base de datos');
    } else {
      console.log('✅ Proyectos encontrados en la base de datos');
    }
    
    if (programas.length === 0) {
      console.log('❌ No hay programas activos en la base de datos');
    } else {
      console.log('✅ Programas encontrados en la base de datos');
    }

  } catch (error) {
    console.error('❌ Error en verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarAPIs();
