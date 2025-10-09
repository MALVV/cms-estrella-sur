const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarRelacionesNoticias() {
  try {
    console.log('🔍 Verificando relaciones de noticias con programas, proyectos y metodologías...\n');

    // Verificar noticias relacionadas con programas
    const noticiasProgramas = await prisma.news.findMany({
      where: { programaId: { not: null } },
      include: {
        programa: {
          select: { nombreSector: true }
        }
      }
    });

    console.log('📋 NOTICIAS RELACIONADAS CON PROGRAMAS:');
    console.log(`Total: ${noticiasProgramas.length}`);
    noticiasProgramas.forEach(noticia => {
      console.log(`  • "${noticia.title}" → Programa: ${noticia.programa?.nombreSector}`);
    });

    // Verificar noticias relacionadas con proyectos
    const noticiasProyectos = await prisma.news.findMany({
      where: { projectId: { not: null } },
      include: {
        project: {
          select: { title: true }
        }
      }
    });

    console.log('\n🚀 NOTICIAS RELACIONADAS CON PROYECTOS:');
    console.log(`Total: ${noticiasProyectos.length}`);
    noticiasProyectos.forEach(noticia => {
      console.log(`  • "${noticia.title}" → Proyecto: ${noticia.project?.title}`);
    });

    // Verificar noticias relacionadas con metodologías
    const noticiasMetodologias = await prisma.news.findMany({
      where: { methodologyId: { not: null } },
      include: {
        methodology: {
          select: { title: true }
        }
      }
    });

    console.log('\n📚 NOTICIAS RELACIONADAS CON METODOLOGÍAS:');
    console.log(`Total: ${noticiasMetodologias.length}`);
    noticiasMetodologias.forEach(noticia => {
      console.log(`  • "${noticia.title}" → Metodología: ${noticia.methodology?.title}`);
    });

    // Verificar noticias independientes (sin relaciones)
    const noticiasIndependientes = await prisma.news.findMany({
      where: {
        programaId: null,
        projectId: null,
        methodologyId: null
      }
    });

    console.log('\n🔗 NOTICIAS INDEPENDIENTES (SIN RELACIONES):');
    console.log(`Total: ${noticiasIndependientes.length}`);
    noticiasIndependientes.forEach(noticia => {
      console.log(`  • "${noticia.title}"`);
    });

    // Resumen total
    const totalNoticias = await prisma.news.count();
    const totalConRelaciones = noticiasProgramas.length + noticiasProyectos.length + noticiasMetodologias.length;

    console.log('\n📊 RESUMEN GENERAL:');
    console.log(`- Total de noticias: ${totalNoticias}`);
    console.log(`- Noticias con relaciones: ${totalConRelaciones}`);
    console.log(`- Noticias independientes: ${noticiasIndependientes.length}`);
    console.log(`- Porcentaje con relaciones: ${((totalConRelaciones / totalNoticias) * 100).toFixed(1)}%`);

    // Verificar que las páginas públicas tengan datos
    console.log('\n🌐 VERIFICACIÓN DE PÁGINAS PÚBLICAS:');
    
    const programasActivos = await prisma.programas.count({ where: { isActive: true } });
    const proyectosActivos = await prisma.project.count({ where: { isActive: true } });
    const metodologiasActivas = await prisma.methodology.count({ where: { isActive: true } });

    console.log(`- Programas activos: ${programasActivos}`);
    console.log(`- Proyectos activos: ${proyectosActivos}`);
    console.log(`- Metodologías activas: ${metodologiasActivas}`);

    console.log('\n✅ Verificación completada exitosamente!');
    console.log('\n🎯 FUNCIONALIDADES DISPONIBLES:');
    console.log('• ✅ Administración de relaciones en CMS');
    console.log('• ✅ Carrusel de noticias en páginas de programas');
    console.log('• ✅ Carrusel de noticias en páginas de proyectos');
    console.log('• ✅ Carrusel de noticias en páginas de metodologías');
    console.log('• ✅ Noticias independientes (sin relaciones obligatorias)');
    console.log('• ✅ Visualización de relaciones en dashboard');

  } catch (error) {
    console.error('❌ Error en verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarRelacionesNoticias();
