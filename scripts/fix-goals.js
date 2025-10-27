const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Verificando metas anuales...');
    
    const goals = await prisma.annualGoal.findMany();
    console.log(`📊 Total de metas: ${goals.length}`);
    
    goals.forEach(goal => {
      console.log(`   - Año ${goal.year}: Meta Bs. ${goal.targetAmount}, Actual Bs. ${goal.currentAmount}`);
    });
    
    // Mantener solo la meta de 2025
    const goalsToDelete = goals.filter(goal => goal.year !== 2025);
    
    if (goalsToDelete.length > 0) {
      console.log(`\n🗑️ Eliminando ${goalsToDelete.length} metas de otros años...`);
      
      for (const goal of goalsToDelete) {
        await prisma.annualGoal.delete({ where: { id: goal.id } });
        console.log(`   ✅ Eliminada meta del año ${goal.year}`);
      }
    } else {
      console.log('\n✅ Solo existe la meta de 2025, no hay duplicados');
    }
    
    console.log('\n🎉 Proceso completado!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
