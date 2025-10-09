const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function obtenerNoticiaParaProbar() {
  try {
    console.log('🔍 Obteniendo noticia existente para probar...\n');

    // Obtener una noticia con imagen
    const noticia = await prisma.news.findFirst({
      where: { 
        isActive: true,
        imageUrl: { not: null }
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        imageAlt: true,
        category: true,
        isFeatured: true
      }
    });

    if (!noticia) {
      console.log('❌ No se encontró ninguna noticia con imagen');
      return;
    }

    console.log('📰 NOTICIA PARA PROBAR:');
    console.log(`ID: ${noticia.id}`);
    console.log(`Título: ${noticia.title}`);
    console.log(`Categoría: ${noticia.category}`);
    console.log(`Destacada: ${noticia.isFeatured ? 'Sí' : 'No'}`);
    console.log(`Imagen URL: ${noticia.imageUrl}`);
    console.log(`Imagen Alt: ${noticia.imageAlt}`);

    console.log('\n🌐 URL PARA PROBAR:');
    console.log(`http://localhost:3000/news/${noticia.id}`);

    console.log('\n🔧 PASOS PARA VERIFICAR:');
    console.log('1. Asegúrate de que el servidor esté corriendo (npm run dev)');
    console.log('2. Ve a la URL de arriba en tu navegador');
    console.log('3. Abre la consola del navegador (F12)');
    console.log('4. Busca los logs de debug que muestran:');
    console.log('   - "Noticia cargada:" con la información de la imagen');
    console.log('   - "Imagen cargada exitosamente:" si la imagen se carga');
    console.log('   - "Error cargando imagen:" si hay problemas');
    console.log('5. Verifica visualmente que la imagen aparezca en la página');

    console.log('\n🐛 SI LA IMAGEN NO APARECE:');
    console.log('- Revisa la consola del navegador para errores');
    console.log('- Verifica que la URL de la imagen sea accesible');
    console.log('- Verifica que no haya bloqueos de CORS');
    console.log('- Verifica que el servidor esté corriendo correctamente');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

obtenerNoticiaParaProbar();
