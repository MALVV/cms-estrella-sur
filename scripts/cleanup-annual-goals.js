const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupAnnualGoals() {
  try {
    console.log('🧹 Limpiando metas anuales duplicadas...\n');

    const currentYear = new Date().getFullYear();
    
    // Obtener todas las metas
    const allGoals = await prisma.annualGoal.findMany({
      orderBy: { year: 'desc' }
    });

    console.log(`📊 Metas encontradas: ${allGoals.length}`);
    allGoals.forEach(goal => {
      console.log(`   - ${goal.year}: Bs. ${goal.targetAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })} (${goal.currentAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })})`);
    });

    // Mantener solo la meta del año actual
    const currentYearGoal = allGoals.find(goal => goal.year === currentYear);
    const otherGoals = allGoals.filter(goal => goal.year !== currentYear);

    if (otherGoals.length > 0) {
      console.log(`\n🗑️ Eliminando ${otherGoals.length} metas de otros años...`);
      
      for (const goal of otherGoals) {
        await prisma.annualGoal.delete({
          where: { id: goal.id }
        });
        console.log(`   ✅ Eliminada meta ${goal.year}`);
      }
    }

    if (currentYearGoal) {
      console.log(`\n✅ Meta del año actual mantenida: ${currentYearGoal.year}`);
      console.log(`   Meta: Bs. ${currentYearGoal.targetAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`);
      console.log(`   Actual: Bs. ${currentYearGoal.currentAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`);
      console.log(`   Progreso: ${Math.round((currentYearGoal.currentAmount / currentYearGoal.targetAmount) * 100)}%`);
    } else {
      console.log(`\n⚠️ No se encontró meta para el año actual (${currentYear})`);
    }

    console.log('\n🎉 Limpieza completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupAnnualGoals();
