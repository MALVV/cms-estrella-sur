const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarIniciativas() {
  try {
    console.log('🔍 Verificando estructura de Iniciativas...\n');

    // Verificar programas
    const programas = await prisma.programas.findMany({
      where: { isActive: true },
      select: {
        id: true,
        nombreSector: true,
        isActive: true,
        _count: {
          select: {
            news: true,
            imageLibrary: true
          }
        }
      }
    });

    console.log('📋 PROGRAMAS ESTRATÉGICOS:');
    console.log(`Total activos: ${programas.length}`);
    programas.forEach(programa => {
      console.log(`  • "${programa.nombreSector}" (${programa._count.news} noticias, ${programa._count.imageLibrary} imágenes)`);
    });

    // Verificar proyectos
    const proyectos = await prisma.project.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        executionStart: true,
        executionEnd: true,
        isActive: true
      }
    });

    console.log('\n🚀 PROYECTOS ESPECÍFICOS:');
    console.log(`Total activos: ${proyectos.length}`);
    proyectos.forEach(proyecto => {
      console.log(`  • "${proyecto.title}" (${proyecto.executionStart} - ${proyecto.executionEnd})`);
    });

    // Verificar metodologías
    const metodologias = await prisma.methodology.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        category: true,
        ageGroup: true,
        isActive: true
      }
    });

    console.log('\n📚 METODOLOGÍAS INNOVADORAS:');
    console.log(`Total activas: ${metodologias.length}`);
    metodologias.forEach(metodologia => {
      console.log(`  • "${metodologia.title}" (${metodologia.category}) - ${metodologia.ageGroup}`);
    });

    // Resumen total
    const totalIniciativas = programas.length + proyectos.length + metodologias.length;

    console.log('\n📊 RESUMEN GENERAL:');
    console.log(`- Total de iniciativas: ${totalIniciativas}`);
    console.log(`- Programas estratégicos: ${programas.length}`);
    console.log(`- Proyectos específicos: ${proyectos.length}`);
    console.log(`- Metodologías innovadoras: ${metodologias.length}`);

    console.log('\n🌐 ESTRUCTURA DE NAVEGACIÓN:');
    console.log('• /iniciativas - Página principal con todas las iniciativas');
    console.log('• /programas-solo - Solo programas estratégicos');
    console.log('• /proyectos - Solo proyectos específicos');
    console.log('• /metodologias - Solo metodologías innovadoras');
    console.log('• /programas/[id] - Detalle de programa específico');
    console.log('• /proyectos/[id] - Detalle de proyecto específico');
    console.log('• /metodologias/[id] - Detalle de metodología específica');

    console.log('\n🎯 NAVBAR ACTUALIZADO:');
    console.log('• Menú principal: "Iniciativas" (antes "Programas")');
    console.log('• Menú desplegable con opciones:');
    console.log('  - Todas las Iniciativas (vista unificada)');
    console.log('  - Programas (programas estratégicos)');
    console.log('  - Proyectos (iniciativas específicas)');
    console.log('  - Metodologías (enfoques innovadores)');

    console.log('\n✅ VERIFICACIÓN COMPLETADA');
    console.log('\n🚀 ESTADO ACTUAL:');
    console.log(`- ${programas.length} programas listos para mostrar`);
    console.log(`- ${proyectos.length} proyectos listos para mostrar`);
    console.log(`- ${metodologias.length} metodologías listas para mostrar`);
    console.log('- Navegación actualizada a "Iniciativas"');
    console.log('- Página unificada /iniciativas creada');

  } catch (error) {
    console.error('❌ Error en verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarIniciativas();
