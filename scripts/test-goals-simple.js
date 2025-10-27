const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testGoals() {
  try {
    console.log('🧪 Probando metas anuales...\n');

    // 1. Verificar metas existentes
    console.log('1. Verificando metas existentes...');
    const goals = await prisma.annualGoal.findMany();
    console.log(`   📊 Total: ${goals.length} metas`);
    
    if (goals.length === 0) {
      console.log('   ⚠️ No hay metas, creando una por defecto...');
      
      const currentYear = new Date().getFullYear();
      const newGoal = await prisma.annualGoal.create({
        data: {
          year: currentYear,
          targetAmount: 75000,
          currentAmount: 45250,
          description: `Meta de recaudación para el año ${currentYear}`,
          isActive: true
        }
      });
      
      console.log(`   ✅ Meta creada: ${newGoal.year} - Bs. ${newGoal.targetAmount}`);
    } else {
      goals.forEach(goal => {
        console.log(`   - ${goal.year}: Meta Bs. ${goal.targetAmount}, Actual Bs. ${goal.currentAmount}`);
      });
    }

    // 2. Probar consulta para dashboard
    console.log('\n2. Probando consulta para dashboard...');
    const allGoals = await prisma.annualGoal.findMany({
      orderBy: { year: 'desc' }
    });
    console.log(`   📊 Dashboard verá ${allGoals.length} metas`);

    // 3. Probar consulta para página pública
    console.log('\n3. Probando consulta para página pública...');
    const currentYear = new Date().getFullYear();
    const currentGoal = await prisma.annualGoal.findUnique({
      where: { year: currentYear }
    });
    
    if (currentGoal) {
      console.log(`   ✅ Página pública verá meta ${currentGoal.year}: Bs. ${currentGoal.targetAmount}`);
    } else {
      console.log(`   ⚠️ No hay meta para ${currentYear}`);
    }

    console.log('\n🎉 Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testGoals();
