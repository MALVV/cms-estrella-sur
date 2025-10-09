const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseFields() {
  try {
    console.log('🔍 Verificando campos en la base de datos...\n');

    // Verificar estructura de la tabla programas
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'programas' 
      ORDER BY ordinal_position;
    `;

    console.log('📋 Estructura de la tabla programas:');
    result.forEach((column, index) => {
      console.log(`${index + 1}. ${column.column_name} (${column.data_type}) - ${column.is_nullable === 'YES' ? 'Nullable' : 'Not Null'}`);
    });

    // Verificar si existen los campos de imagen
    const hasImageUrl = result.some(col => col.column_name === 'imageUrl');
    const hasImageAlt = result.some(col => col.column_name === 'imageAlt');

    console.log(`\n🖼️  Campos de imagen:`);
    console.log(`imageUrl: ${hasImageUrl ? '✅ Existe' : '❌ No existe'}`);
    console.log(`imageAlt: ${hasImageAlt ? '✅ Existe' : '❌ No existe'}`);

    if (!hasImageUrl || !hasImageAlt) {
      console.log('\n⚠️  Los campos de imagen no existen en la base de datos.');
      console.log('Necesitamos ejecutar la migración nuevamente.');
    } else {
      console.log('\n✅ Los campos de imagen existen en la base de datos.');
      
      // Verificar datos de ejemplo
      const sampleData = await prisma.$queryRaw`
        SELECT id, "nombreSector", "imageUrl", "imageAlt", "isFeatured"
        FROM programas 
        WHERE "isFeatured" = true 
        LIMIT 3;
      `;

      console.log('\n📊 Datos de ejemplo (programas destacados):');
      sampleData.forEach((programa, index) => {
        console.log(`\n${index + 1}. ${programa.nombreSector}`);
        console.log(`   ID: ${programa.id}`);
        console.log(`   Destacado: ${programa.isFeatured ? '✅ Sí' : '❌ No'}`);
        console.log(`   Imagen URL: ${programa.imageUrl || '❌ Vacío'}`);
        console.log(`   Alt Text: ${programa.imageAlt || '❌ Vacío'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  checkDatabaseFields();
}

module.exports = { checkDatabaseFields };
