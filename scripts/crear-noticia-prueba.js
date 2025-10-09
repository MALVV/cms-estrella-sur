const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function crearNoticiaPrueba() {
  try {
    console.log('🧪 Creando noticia de prueba con imagen...\n');

    // Crear una noticia de prueba con imagen
    const noticiaPrueba = await prisma.news.create({
      data: {
        title: 'Noticia de Prueba - Verificación de Imagen',
        content: 'Esta es una noticia de prueba para verificar que las imágenes se muestren correctamente en la página de detalle.',
        excerpt: 'Noticia de prueba para verificar imágenes.',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
        imageAlt: 'Imagen de prueba - Personas trabajando',
        category: 'NOTICIAS',
        isFeatured: true,
        isActive: true,
        publishedAt: new Date(),
        createdBy: 'admin'
      }
    });

    console.log('✅ Noticia de prueba creada:');
    console.log(`ID: ${noticiaPrueba.id}`);
    console.log(`Título: ${noticiaPrueba.title}`);
    console.log(`Imagen URL: ${noticiaPrueba.imageUrl}`);
    console.log(`Imagen Alt: ${noticiaPrueba.imageAlt}`);

    console.log('\n🌐 URL para probar:');
    console.log(`http://localhost:3000/news/${noticiaPrueba.id}`);

    console.log('\n🔧 INSTRUCCIONES:');
    console.log('1. Asegúrate de que el servidor esté corriendo');
    console.log('2. Ve a la URL de arriba en tu navegador');
    console.log('3. Abre la consola del navegador (F12)');
    console.log('4. Verifica que aparezcan los logs de debug');
    console.log('5. Verifica que la imagen se cargue correctamente');

    return noticiaPrueba.id;

  } catch (error) {
    console.error('❌ Error creando noticia de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crearNoticiaPrueba();
