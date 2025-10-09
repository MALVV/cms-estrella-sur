const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function probarNoticiaConImagen() {
  try {
    console.log('🔍 Probando noticia específica con imagen...\n');

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
        isFeatured: true,
        publishedAt: true,
        content: true,
        excerpt: true
      }
    });

    if (!noticia) {
      console.log('❌ No se encontró ninguna noticia con imagen');
      return;
    }

    console.log('📰 NOTICIA SELECCIONADA:');
    console.log(`ID: ${noticia.id}`);
    console.log(`Título: ${noticia.title}`);
    console.log(`Categoría: ${noticia.category}`);
    console.log(`Destacada: ${noticia.isFeatured ? 'Sí' : 'No'}`);
    console.log(`Imagen URL: ${noticia.imageUrl}`);
    console.log(`Imagen Alt: ${noticia.imageAlt}`);
    console.log(`Contenido (primeros 100 chars): ${noticia.content.substring(0, 100)}...`);

    // Probar la API directamente
    console.log('\n🌐 PROBANDO API:');
    const apiUrl = `http://localhost:3000/api/public/news/${noticia.id}`;
    console.log(`URL: ${apiUrl}`);

    try {
      const response = await fetch(apiUrl);
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API responde correctamente');
        console.log(`Título en API: ${data.title}`);
        console.log(`Imagen URL en API: ${data.imageUrl}`);
        console.log(`Imagen Alt en API: ${data.imageAlt}`);
        
        if (data.imageUrl) {
          console.log('\n🖼️ VERIFICANDO IMAGEN:');
          console.log(`URL de imagen: ${data.imageUrl}`);
          
          // Verificar si la URL es válida
          if (data.imageUrl.startsWith('http')) {
            console.log('✅ URL de imagen es válida (HTTP/HTTPS)');
          } else {
            console.log('❌ URL de imagen no es válida');
          }
        } else {
          console.log('❌ No hay imageUrl en la respuesta de la API');
        }
      } else {
        console.log(`❌ Error en API: ${response.status}`);
        const errorText = await response.text();
        console.log(`Error: ${errorText}`);
      }
    } catch (fetchError) {
      console.log(`❌ Error al hacer fetch: ${fetchError.message}`);
      console.log('💡 Sugerencia: Asegúrate de que el servidor esté corriendo en localhost:3000');
    }

    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verificar que el servidor esté corriendo');
    console.log('2. Verificar la configuración de Next.js Image');
    console.log('3. Verificar que las URLs de Unsplash sean accesibles');
    console.log('4. Verificar la consola del navegador para errores');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

probarNoticiaConImagen();
