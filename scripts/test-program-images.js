const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testProgramImages() {
  try {
    console.log('🔍 Verificando campos de imagen en programas...\n');

    // Verificar que los campos existen en la base de datos
    const programas = await prisma.programas.findMany({
      select: {
        id: true,
        nombreSector: true,
        imageUrl: true,
        imageAlt: true,
        isFeatured: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log('📊 Programas encontrados:');
    programas.forEach((programa, index) => {
      console.log(`\n${index + 1}. ${programa.nombreSector}`);
      console.log(`   ID: ${programa.id}`);
      console.log(`   Destacado: ${programa.isFeatured ? '✅ Sí' : '❌ No'}`);
      console.log(`   Imagen URL: ${programa.imageUrl || '❌ No definida'}`);
      console.log(`   Alt Text: ${programa.imageAlt || '❌ No definido'}`);
      console.log(`   Creado: ${programa.createdAt.toLocaleDateString()}`);
    });

    // Verificar programas destacados
    const featuredPrograms = await prisma.programas.findMany({
      where: { isFeatured: true },
      select: {
        id: true,
        nombreSector: true,
        imageUrl: true,
        imageAlt: true
      }
    });

    console.log(`\n⭐ Programas destacados: ${featuredPrograms.length}`);
    featuredPrograms.forEach((programa, index) => {
      console.log(`\n${index + 1}. ${programa.nombreSector}`);
      console.log(`   Imagen: ${programa.imageUrl ? '✅ Configurada' : '❌ Sin imagen'}`);
      console.log(`   Alt: ${programa.imageAlt ? '✅ Configurado' : '❌ Sin alt text'}`);
    });

    // Verificar API pública
    console.log('\n🌐 Probando API pública...');
    const apiResponse = await fetch('http://localhost:3000/api/public/programas');
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log(`✅ API responde correctamente`);
      console.log(`📊 Programas en API: ${data.programas.length}`);
      
      // Verificar que los campos de imagen estén presentes
      const hasImageFields = data.programas.every(p => 
        'imageUrl' in p && 'imageAlt' in p
      );
      console.log(`🖼️  Campos de imagen: ${hasImageFields ? '✅ Presentes' : '❌ Faltantes'}`);
    } else {
      console.log('❌ Error en API pública:', apiResponse.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testProgramImages();
}

module.exports = { testProgramImages };
