const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFeaturedGoals() {
  try {
    console.log('🧪 Probando funcionalidad de metas destacadas...\n');

    // 1. Verificar metas existentes
    console.log('1. Verificando metas existentes...');
    const goals = await prisma.annualGoal.findMany();
    console.log(`   📊 Total: ${goals.length} metas`);
    
    goals.forEach(goal => {
      console.log(`   - ${goal.year}: Meta Bs. ${goal.targetAmount}, Destacada: ${goal.isFeatured ? 'Sí' : 'No'}`);
    });

    // 2. Crear meta para 2026 si no existe
    console.log('\n2. Creando meta para 2026...');
    let goal2026 = await prisma.annualGoal.findUnique({
      where: { year: 2026 }
    });

    if (!goal2026) {
      goal2026 = await prisma.annualGoal.create({
        data: {
          year: 2026,
          targetAmount: 100000,
          currentAmount: 0,
          description: 'Meta de recaudación para el año 2026',
          isActive: true,
          isFeatured: false
        }
      });
      console.log(`   ✅ Meta 2026 creada: Bs. ${goal2026.targetAmount}`);
    } else {
      console.log(`   ℹ️ Meta 2026 ya existe: Bs. ${goal2026.targetAmount}`);
    }

    // 3. Destacar meta 2026
    console.log('\n3. Destacando meta 2026...');
    const updatedGoal = await prisma.annualGoal.update({
      where: { id: goal2026.id },
      data: { isFeatured: true }
    });
    console.log(`   ✅ Meta ${updatedGoal.year} destacada`);

    // 4. Verificar que solo hay una meta destacada
    console.log('\n4. Verificando metas destacadas...');
    const featuredGoals = await prisma.annualGoal.findMany({
      where: { isFeatured: true }
    });
    console.log(`   📊 Metas destacadas: ${featuredGoals.length}`);
    featuredGoals.forEach(goal => {
      console.log(`   - ${goal.year}: Bs. ${goal.targetAmount}`);
    });

    // 5. Probar consulta para página pública
    console.log('\n5. Probando consulta para página pública...');
    const publicGoal = await prisma.annualGoal.findFirst({
      where: { 
        isFeatured: true,
        isActive: true 
      }
    });
    
    if (publicGoal) {
      console.log(`   ✅ Página pública mostrará meta ${publicGoal.year}: Bs. ${publicGoal.targetAmount}`);
    } else {
      console.log(`   ⚠️ No hay meta destacada`);
    }

    console.log('\n🎉 Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFeaturedGoals();
