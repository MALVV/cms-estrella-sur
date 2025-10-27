const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAnnualGoalAPI() {
  try {
    console.log('🧪 Probando funcionalidad de meta anual...\n');

    // 1. Verificar que el modelo existe
    console.log('1. Verificando modelo AnnualGoal...');
    const currentYear = new Date().getFullYear();
    
    // Intentar crear una meta de prueba
    try {
      const testGoal = await prisma.annualGoal.create({
        data: {
          year: currentYear + 1, // Usar año siguiente para evitar conflictos
          targetAmount: 100000,
          currentAmount: 0,
          description: 'Meta de prueba',
          isActive: true
        }
      });
      console.log('✅ Modelo AnnualGoal funciona correctamente');
      console.log(`   Meta creada: ${testGoal.year} - Bs. ${testGoal.targetAmount}`);

      // Eliminar la meta de prueba
      await prisma.annualGoal.delete({
        where: { id: testGoal.id }
      });
      console.log('✅ Meta de prueba eliminada\n');

    } catch (error) {
      console.log('❌ Error con el modelo AnnualGoal:', error.message);
      return;
    }

    // 2. Verificar meta actual
    console.log('2. Verificando meta actual...');
    const currentGoal = await prisma.annualGoal.findUnique({
      where: { year: currentYear }
    });

    if (currentGoal) {
      console.log('✅ Meta actual encontrada:');
      console.log(`   Año: ${currentGoal.year}`);
      console.log(`   Meta: Bs. ${currentGoal.targetAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`);
      console.log(`   Actual: Bs. ${currentGoal.currentAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`);
      console.log(`   Progreso: ${Math.round((currentGoal.currentAmount / currentGoal.targetAmount) * 100)}%`);
    } else {
      console.log('⚠️ No se encontró meta para el año actual');
    }

    console.log('\n🎉 Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAnnualGoalAPI();
