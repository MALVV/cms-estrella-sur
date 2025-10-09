const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarImagenesDisponibles() {
  try {
    console.log('🖼️ Verificando imágenes disponibles en la base de datos...\n');

    // Verificar imágenes de programas
    const programasConImagenes = await prisma.programas.findMany({
      where: { isActive: true },
      select: {
        id: true,
        nombreSector: true,
        imageLibrary: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            imageUrl: true,
            imageAlt: true
          },
          take: 1
        }
      },
      take: 5
    });

    console.log('📋 PROGRAMAS CON IMÁGENES:');
    programasConImagenes.forEach((programa, index) => {
      console.log(`  ${index + 1}. "${programa.nombreSector}"`);
      if (programa.imageLibrary.length > 0) {
        console.log(`     ✅ Imagen: ${programa.imageLibrary[0].title}`);
        console.log(`     📷 URL: ${programa.imageLibrary[0].imageUrl}`);
      } else {
        console.log(`     ❌ Sin imágenes`);
      }
    });

    // Verificar proyectos con imágenes
    const proyectosConImagenes = await prisma.project.findMany({
      where: { 
        isActive: true,
        imageUrl: { not: null }
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        imageAlt: true
      },
      take: 5
    });

    console.log('\n🚀 PROYECTOS CON IMÁGENES:');
    proyectosConImagenes.forEach((proyecto, index) => {
      console.log(`  ${index + 1}. "${proyecto.title}"`);
      if (proyecto.imageUrl) {
        console.log(`     ✅ Imagen: ${proyecto.imageAlt || 'Sin título'}`);
        console.log(`     📷 URL: ${proyecto.imageUrl}`);
      } else {
        console.log(`     ❌ Sin imagen`);
      }
    });

    // Verificar metodologías con imágenes
    const metodologiasConImagenes = await prisma.methodology.findMany({
      where: { 
        isActive: true,
        imageUrl: { not: null }
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        imageAlt: true
      },
      take: 5
    });

    console.log('\n📚 METODOLOGÍAS CON IMÁGENES:');
    metodologiasConImagenes.forEach((metodologia, index) => {
      console.log(`  ${index + 1}. "${metodologia.title}"`);
      if (metodologia.imageUrl) {
        console.log(`     ✅ Imagen: ${metodologia.imageAlt || 'Sin título'}`);
        console.log(`     📷 URL: ${metodologia.imageUrl}`);
      } else {
        console.log(`     ❌ Sin imagen`);
      }
    });

    // Contar totales
    const totalProgramas = await prisma.programas.count({ where: { isActive: true } });
    const totalProyectos = await prisma.project.count({ where: { isActive: true } });
    const totalMetodologias = await prisma.methodology.count({ where: { isActive: true } });

    const programasConImg = await prisma.programas.count({
      where: {
        isActive: true,
        imageLibrary: {
          some: { isActive: true }
        }
      }
    });

    const proyectosConImg = await prisma.project.count({
      where: {
        isActive: true,
        imageUrl: { not: null }
      }
    });

    const metodologiasConImg = await prisma.methodology.count({
      where: {
        isActive: true,
        imageUrl: { not: null }
      }
    });

    console.log('\n📊 RESUMEN DE IMÁGENES:');
    console.log(`- Programas: ${programasConImg}/${totalProgramas} tienen imágenes`);
    console.log(`- Proyectos: ${proyectosConImg}/${totalProyectos} tienen imágenes`);
    console.log(`- Metodologías: ${metodologiasConImg}/${totalMetodologias} tienen imágenes`);

    console.log('\n🎯 RECOMENDACIONES:');
    if (programasConImg === 0) {
      console.log('⚠️  No hay programas con imágenes. Considerar agregar imágenes a la biblioteca de imágenes.');
    }
    if (proyectosConImg === 0) {
      console.log('⚠️  No hay proyectos con imágenes. Considerar agregar URLs de imagen a los proyectos.');
    }
    if (metodologiasConImg === 0) {
      console.log('⚠️  No hay metodologías con imágenes. Considerar agregar URLs de imagen a las metodologías.');
    }

  } catch (error) {
    console.error('❌ Error verificando imágenes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarImagenesDisponibles();
