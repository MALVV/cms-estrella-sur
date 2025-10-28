const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateTransparencyCategories() {
  try {
    console.log('Iniciando migración de categorías de transparencia...');

    // Mapeo de valores antiguos a nuevos
    const categoryMapping = {
      'CENTRO_DOCUMENTOS': 'DOCUMENT_CENTER',
      'RENDICION_CUENTAS': 'ACCOUNTABILITY',
      'FINANCIADORES_ALIADOS': 'FINANCIERS_AND_ALLIES',
      'INFORMES_ANUALES': 'ANNUAL_REPORTS',
    };

    // Obtener todos los documentos de transparencia
    const documents = await prisma.transparencyDocument.findMany();

    console.log(`Encontrados ${documents.length} documentos`);

    let updatedCount = 0;

    for (const doc of documents) {
      // Verificar si el documento tiene una categoría antigua
      if (categoryMapping[doc.category]) {
        const newCategory = categoryMapping[doc.category];
        
        console.log(`Actualizando documento: ${doc.title}`);
        console.log(`  Categoría antigua: ${doc.category}`);
        console.log(`  Categoría nueva: ${newCategory}`);

        await prisma.transparencyDocument.update({
          where: { id: doc.id },
          data: { category: newCategory },
        });

        updatedCount++;
      }
    }

    console.log(`\n✅ Migración completada exitosamente`);
    console.log(`   Documentos actualizados: ${updatedCount}`);
    console.log(`   Documentos sin cambios: ${documents.length - updatedCount}`);
  } catch (error) {
    console.error('Error durante la migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
migrateTransparencyCategories()
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });

