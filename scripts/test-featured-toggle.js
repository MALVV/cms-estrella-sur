const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFeaturedToggle() {
  try {
    console.log('🧪 Probando funcionalidad de toggle featured...\n');

    // 1. Obtener todos los aliados destacados
    const featuredAllies = await prisma.allies.findMany({
      where: {
        isFeatured: true,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        isFeatured: true
      }
    });

    console.log('⭐ Aliados destacados actuales:');
    featuredAllies.forEach((ally, index) => {
      console.log(`  ${index + 1}. ${ally.name} (${ally.id}) - Destacado: ${ally.isFeatured}`);
    });

    if (featuredAllies.length === 0) {
      console.log('ℹ️  No hay aliados destacados para probar');
      return;
    }

    // 2. Probar desactivar el primer aliado destacado
    const allyToTest = featuredAllies[0];
    console.log(`\n🔄 Probando desactivar destacado para: ${allyToTest.name}`);

    // Simular la actualización
    const updateResult = await prisma.allies.update({
      where: { id: allyToTest.id },
      data: { isFeatured: false },
      select: {
        id: true,
        name: true,
        isFeatured: true
      }
    });

    console.log('✅ Resultado de la actualización:');
    console.log(`  - ID: ${updateResult.id}`);
    console.log(`  - Nombre: ${updateResult.name}`);
    console.log(`  - Destacado: ${updateResult.isFeatured}`);

    // 3. Verificar que se actualizó correctamente
    const verifyAlly = await prisma.allies.findUnique({
      where: { id: allyToTest.id },
      select: {
        id: true,
        name: true,
        isFeatured: true
      }
    });

    console.log('\n🔍 Verificación:');
    console.log(`  - Destacado después de actualizar: ${verifyAlly?.isFeatured}`);

    if (verifyAlly?.isFeatured === false) {
      console.log('✅ La funcionalidad de desactivar destacado funciona correctamente');
    } else {
      console.log('❌ Problema: El aliado sigue marcado como destacado');
    }

    // 4. Restaurar el estado original
    await prisma.allies.update({
      where: { id: allyToTest.id },
      data: { isFeatured: true }
    });

    console.log('🔄 Estado original restaurado');

    // 5. Probar activar un aliado no destacado
    const nonFeaturedAlly = await prisma.allies.findFirst({
      where: {
        isFeatured: false,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        isFeatured: true
      }
    });

    if (nonFeaturedAlly) {
      console.log(`\n🔄 Probando activar destacado para: ${nonFeaturedAlly.name}`);
      
      const activateResult = await prisma.allies.update({
        where: { id: nonFeaturedAlly.id },
        data: { isFeatured: true },
        select: {
          id: true,
          name: true,
          isFeatured: true
        }
      });

      console.log('✅ Resultado de activar destacado:');
      console.log(`  - Destacado: ${activateResult.isFeatured}`);

      // Restaurar estado
      await prisma.allies.update({
        where: { id: nonFeaturedAlly.id },
        data: { isFeatured: false }
      });

      console.log('🔄 Estado original restaurado');
    }

    console.log('\n✅ Pruebas completadas');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar las pruebas
testFeaturedToggle();



