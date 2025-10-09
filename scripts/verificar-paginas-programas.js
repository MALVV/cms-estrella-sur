const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarPaginasProgramas() {
  try {
    console.log('🔍 Verificando páginas de programas, proyectos y metodologías...\n');

    // Verificar programas
    const programas = await prisma.programas.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            news: true,
            imageLibrary: true
          }
        }
      }
    });

    console.log('📋 PROGRAMAS ACTIVOS:');
    console.log(`Total: ${programas.length}`);
    programas.forEach(programa => {
      console.log(`  • "${programa.nombreSector}" (${programa._count.news} noticias, ${programa._count.imageLibrary} imágenes)`);
    });

    // Verificar proyectos
    const proyectos = await prisma.project.findMany({
      where: { isActive: true }
    });

    console.log('\n🚀 PROYECTOS ACTIVOS:');
    console.log(`Total: ${proyectos.length}`);
    proyectos.forEach(proyecto => {
      console.log(`  • "${proyecto.title}"`);
    });

    // Verificar metodologías
    const metodologias = await prisma.methodology.findMany({
      where: { isActive: true }
    });

    console.log('\n📚 METODOLOGÍAS ACTIVAS:');
    console.log(`Total: ${metodologias.length}`);
    metodologias.forEach(metodologia => {
      console.log(`  • "${metodologia.title}" (${metodologia.category})`);
    });

    // Verificar noticias relacionadas
    const noticiasConRelaciones = await prisma.news.findMany({
      where: {
        OR: [
          { programaId: { not: null } },
          { projectId: { not: null } },
          { methodologyId: { not: null } }
        ]
      },
      include: {
        programa: { select: { nombreSector: true } },
        project: { select: { title: true } },
        methodology: { select: { title: true } }
      }
    });

    console.log('\n🔗 NOTICIAS CON RELACIONES:');
    console.log(`Total: ${noticiasConRelaciones.length}`);
    noticiasConRelaciones.forEach(noticia => {
      const relaciones = [];
      if (noticia.programa) relaciones.push(`Programa: ${noticia.programa.nombreSector}`);
      if (noticia.project) relaciones.push(`Proyecto: ${noticia.project.title}`);
      if (noticia.methodology) relaciones.push(`Metodología: ${noticia.methodology.title}`);
      console.log(`  • "${noticia.title}" → ${relaciones.join(', ')}`);
    });

    console.log('\n✅ VERIFICACIÓN COMPLETADA');
    console.log('\n🌐 PÁGINAS DISPONIBLES:');
    console.log('• /programas - Vista unificada (Programas + Proyectos + Metodologías)');
    console.log('• /programas-solo - Solo programas estratégicos');
    console.log('• /proyectos - Solo proyectos específicos');
    console.log('• /metodologias - Solo metodologías innovadoras');
    console.log('• /programas/[id] - Detalle de programa específico');
    console.log('• /proyectos/[id] - Detalle de proyecto específico');
    console.log('• /metodologias/[id] - Detalle de metodología específica');

    console.log('\n🎯 FUNCIONALIDADES DEL NAVBAR:');
    console.log('• Menú desplegable "Programas" con opciones:');
    console.log('  - Todos los Programas (vista unificada)');
    console.log('  - Solo Programas (programas estratégicos)');
    console.log('  - Proyectos (iniciativas específicas)');
    console.log('  - Metodologías (enfoques innovadores)');

    console.log('\n🚀 ESTADO ACTUAL:');
    console.log(`- ${programas.length} programas listos para mostrar`);
    console.log(`- ${proyectos.length} proyectos listos para mostrar`);
    console.log(`- ${metodologias.length} metodologías listas para mostrar`);
    console.log(`- ${noticiasConRelaciones.length} noticias con relaciones para carruseles`);

  } catch (error) {
    console.error('❌ Error en verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarPaginasProgramas();
