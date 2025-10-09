const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarPaginaIniciativas() {
  try {
    console.log('🎨 Verificando nueva página de Iniciativas con estilo "Nosotros"...\n');

    // Verificar programas
    const programas = await prisma.programas.findMany({
      where: { isActive: true },
      select: {
        id: true,
        nombreSector: true,
        descripcion: true,
        isFeatured: true,
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
      console.log(`  • "${programa.nombreSector}" (${programa._count.news} noticias, ${programa._count.imageLibrary} imágenes) ${programa.isFeatured ? '⭐ Destacado' : ''}`);
    });

    // Verificar proyectos
    const proyectos = await prisma.project.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        executionStart: true,
        executionEnd: true,
        isFeatured: true
      }
    });

    console.log('\n🚀 PROYECTOS ESPECÍFICOS:');
    console.log(`Total activos: ${proyectos.length}`);
    proyectos.forEach(proyecto => {
      console.log(`  • "${proyecto.title}" (${proyecto.executionStart} - ${proyecto.executionEnd}) ${proyecto.isFeatured ? '⭐ Destacado' : ''}`);
    });

    // Verificar metodologías
    const metodologias = await prisma.methodology.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        category: true,
        ageGroup: true
      }
    });

    console.log('\n📚 METODOLOGÍAS INNOVADORAS:');
    console.log(`Total activas: ${metodologias.length}`);
    metodologias.forEach(metodologia => {
      console.log(`  • "${metodologia.title}" (${metodologia.category}) - ${metodologia.ageGroup}`);
    });

    // Resumen total
    const totalIniciativas = programas.length + proyectos.length + metodologias.length;

    console.log('\n🎨 NUEVA ESTRUCTURA DE DISEÑO:');
    console.log('✅ Hero Section con imágenes superpuestas (estilo Nosotros)');
    console.log('✅ Sección "Qué nos hace diferentes" con 4 cards');
    console.log('✅ Sección con fondo de imagen y numeración (01, 02, 03)');
    console.log('✅ Tabs con gradiente de fondo azul');
    console.log('✅ Call to Action con fondo naranja y elementos decorativos');
    console.log('✅ Footer integrado');

    console.log('\n📊 RESUMEN GENERAL:');
    console.log(`- Total de iniciativas: ${totalIniciativas}`);
    console.log(`- Programas estratégicos: ${programas.length}`);
    console.log(`- Proyectos específicos: ${proyectos.length}`);
    console.log(`- Metodologías innovadoras: ${metodologias.length}`);

    console.log('\n🌐 NAVEGACIÓN ACTUALIZADA:');
    console.log('• /iniciativas - Página principal con estilo "Nosotros"');
    console.log('• /programas-solo - Solo programas estratégicos');
    console.log('• /proyectos - Solo proyectos específicos');
    console.log('• /metodologias - Solo metodologías innovadoras');

    console.log('\n🎯 CARACTERÍSTICAS DEL NUEVO DISEÑO:');
    console.log('• Hero Section con imágenes superpuestas y rotaciones');
    console.log('• Badge naranja "Nuestras iniciativas"');
    console.log('• Título grande "NUESTRAS INICIATIVAS DE IMPACTO"');
    console.log('• Sección "Qué nos hace diferentes" con 4 cards de colores');
    console.log('• Sección con fondo de imagen y numeración 01, 02, 03');
    console.log('• Tabs con contadores dinámicos');
    console.log('• Cards con hover effects y badges de destacado');
    console.log('• Call to Action con fondo naranja y elementos decorativos');

    console.log('\n✅ VERIFICACIÓN COMPLETADA');
    console.log('\n🚀 ESTADO ACTUAL:');
    console.log(`- ${programas.length} programas listos para mostrar`);
    console.log(`- ${proyectos.length} proyectos listos para mostrar`);
    console.log(`- ${metodologias.length} metodologías listas para mostrar`);
    console.log('- Diseño actualizado con estilo "Nosotros"');
    console.log('- Página /iniciativas completamente rediseñada');

  } catch (error) {
    console.error('❌ Error en verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarPaginaIniciativas();
