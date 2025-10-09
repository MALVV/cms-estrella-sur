const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarDatosCreados() {
  try {
    console.log('🔍 Verificando datos creados...\n');

    // Contar programas
    const totalProgramas = await prisma.programas.count();
    const programasDestacados = await prisma.programas.count({
      where: { isFeatured: true }
    });
    
    console.log('📊 PROGRAMAS:');
    console.log(`   Total: ${totalProgramas}`);
    console.log(`   Destacados: ${programasDestacados}`);

    // Contar noticias
    const totalNoticias = await prisma.news.count();
    const noticiasConPrograma = await prisma.news.count({
      where: { programaId: { not: null } }
    });
    const noticiasDestacadas = await prisma.news.count({
      where: { isFeatured: true }
    });
    
    console.log('\n📰 NOTICIAS:');
    console.log(`   Total: ${totalNoticias}`);
    console.log(`   Con programa asociado: ${noticiasConPrograma}`);
    console.log(`   Destacadas: ${noticiasDestacadas}`);

    // Contar imágenes
    const totalImagenes = await prisma.imageLibrary.count();
    const imagenesConPrograma = await prisma.imageLibrary.count({
      where: { programaId: { not: null } }
    });
    const imagenesDestacadas = await prisma.imageLibrary.count({
      where: { isFeatured: true }
    });
    
    console.log('\n🖼️ IMÁGENES:');
    console.log(`   Total: ${totalImagenes}`);
    console.log(`   Con programa asociado: ${imagenesConPrograma}`);
    console.log(`   Destacadas: ${imagenesDestacadas}`);

    // Mostrar programas con sus estadísticas
    console.log('\n📋 DETALLE POR PROGRAMA:');
    const programas = await prisma.programas.findMany({
      include: {
        _count: {
          select: {
            news: true,
            imageLibrary: true
          }
        }
      },
      orderBy: { nombreSector: 'asc' }
    });

    programas.forEach(programa => {
      console.log(`\n   🎯 ${programa.nombreSector}`);
      console.log(`      Noticias: ${programa._count.news}`);
      console.log(`      Imágenes: ${programa._count.imageLibrary}`);
      console.log(`      Destacado: ${programa.isFeatured ? 'Sí' : 'No'}`);
    });

    // Mostrar algunas noticias de ejemplo
    console.log('\n📰 NOTICIAS DE EJEMPLO:');
    const noticiasEjemplo = await prisma.news.findMany({
      take: 3,
      include: {
        programa: {
          select: { nombreSector: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    noticiasEjemplo.forEach(noticia => {
      console.log(`\n   📄 ${noticia.title}`);
      console.log(`      Programa: ${noticia.programa?.nombreSector || 'Sin programa'}`);
      console.log(`      Destacada: ${noticia.isFeatured ? 'Sí' : 'No'}`);
    });

    // Mostrar algunas imágenes de ejemplo
    console.log('\n🖼️ IMÁGENES DE EJEMPLO:');
    const imagenesEjemplo = await prisma.imageLibrary.findMany({
      take: 3,
      include: {
        programa: {
          select: { nombreSector: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    imagenesEjemplo.forEach(imagen => {
      console.log(`\n   🖼️ ${imagen.title}`);
      console.log(`      Programa: ${imagen.programa?.nombreSector || 'Sin programa'}`);
      console.log(`      Destacada: ${imagen.isFeatured ? 'Sí' : 'No'}`);
    });

    console.log('\n✅ ¡Verificación completada exitosamente!');
    console.log('\n🎉 Los programas ficticios están listos para usar:');
    console.log('   • Ve a /dashboard/programas para gestionar programas');
    console.log('   • Ve a /dashboard/image-library para gestionar imágenes');
    console.log('   • Ve a /programas para ver la página pública');
    console.log('   • Cada programa tiene noticias e imágenes asociadas');

  } catch (error) {
    console.error('❌ Error verificando datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
verificarDatosCreados();
