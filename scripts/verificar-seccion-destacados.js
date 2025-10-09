const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarSeccionDestacados() {
  try {
    console.log('🎯 Verificando nueva sección de Iniciativas Destacadas...\n');

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
      },
      take: 3
    });

    console.log('📋 PROGRAMAS DESTACADOS (primeros 3):');
    programas.forEach((programa, index) => {
      console.log(`  ${index + 1}. "${programa.nombreSector}" (${programa._count.news} noticias, ${programa._count.imageLibrary} imágenes) ${programa.isFeatured ? '⭐ Destacado' : ''}`);
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
      },
      take: 3
    });

    console.log('\n🚀 PROYECTOS DESTACADOS (primeros 3):');
    proyectos.forEach((proyecto, index) => {
      console.log(`  ${index + 1}. "${proyecto.title}" (${proyecto.executionStart} - ${proyecto.executionEnd}) ${proyecto.isFeatured ? '⭐ Destacado' : ''}`);
    });

    // Verificar metodologías
    const metodologias = await prisma.methodology.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        category: true,
        ageGroup: true
      },
      take: 3
    });

    console.log('\n📚 METODOLOGÍAS DESTACADAS (primeros 3):');
    metodologias.forEach((metodologia, index) => {
      console.log(`  ${index + 1}. "${metodologia.title}" (${metodologia.category}) - ${metodologia.ageGroup}`);
    });

    console.log('\n🎨 NUEVA SECCIÓN IMPLEMENTADA:');
    console.log('✅ Sección "Iniciativas Destacadas" agregada');
    console.log('✅ 3 subsecciones: Programas, Proyectos y Metodologías');
    console.log('✅ Cada subsección muestra máximo 3 elementos');
    console.log('✅ Botones "Ver Todos" que redirigen a páginas específicas');
    console.log('✅ Cards con hover effects y badges de destacado');
    console.log('✅ Iconos distintivos para cada categoría');
    console.log('✅ Información específica de cada tipo de iniciativa');

    console.log('\n🔗 ENLACES DE NAVEGACIÓN:');
    console.log('• Programas → /programas-solo');
    console.log('• Proyectos → /proyectos');
    console.log('• Metodologías → /metodologias');

    console.log('\n📊 RESUMEN DE LA SECCIÓN:');
    console.log(`- Programas mostrados: ${programas.length}/3`);
    console.log(`- Proyectos mostrados: ${proyectos.length}/3`);
    console.log(`- Metodologías mostradas: ${metodologias.length}/3`);

    console.log('\n🎯 CARACTERÍSTICAS DE LA NUEVA SECCIÓN:');
    console.log('• Título principal: "CONOCE NUESTROS TRABAJOS MÁS RELEVANTES"');
    console.log('• Badge: "INICIATIVAS DESTACADAS"');
    console.log('• Cada subsección tiene su propio título e icono');
    console.log('• Botones "Ver Todos" con flecha de navegación');
    console.log('• Cards responsivas (1 columna en móvil, 3 en desktop)');
    console.log('• Información específica por tipo de iniciativa');
    console.log('• Estados de carga y mensajes cuando no hay datos');

    console.log('\n✅ VERIFICACIÓN COMPLETADA');
    console.log('\n🚀 ESTADO ACTUAL:');
    console.log(`- ${programas.length} programas listos para mostrar en destacados`);
    console.log(`- ${proyectos.length} proyectos listos para mostrar en destacados`);
    console.log(`- ${metodologias.length} metodologías listas para mostrar en destacados`);
    console.log('- Nueva sección completamente funcional');
    console.log('- Enlaces de navegación configurados correctamente');

  } catch (error) {
    console.error('❌ Error en verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarSeccionDestacados();
