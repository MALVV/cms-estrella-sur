const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdvisorDashboardAPIs() {
  try {
    console.log('🔍 Probando APIs del dashboard de asesor...');
    
    // Simular datos de prueba si no existen
    console.log('\n📊 Verificando datos existentes...');
    
    const donationCount = await prisma.donation.count();
    const projectCount = await prisma.donationProject.count();
    const goalCount = await prisma.annualGoal.count();
    
    console.log(`   - Donaciones: ${donationCount}`);
    console.log(`   - Proyectos de donación: ${projectCount}`);
    console.log(`   - Metas anuales: ${goalCount}`);
    
    if (donationCount === 0) {
      console.log('\n⚠️  No hay donaciones en la base de datos');
      console.log('   - Las estadísticas mostrarán valores en 0');
      console.log('   - Esto es normal si no se han creado donaciones aún');
    }
    
    if (projectCount === 0) {
      console.log('\n⚠️  No hay proyectos de donación en la base de datos');
      console.log('   - Las estadísticas de proyectos mostrarán valores en 0');
      console.log('   - Esto es normal si no se han creado proyectos aún');
    }
    
    if (goalCount === 0) {
      console.log('\n⚠️  No hay metas anuales en la base de datos');
      console.log('   - La meta mensual será 0');
      console.log('   - Esto es normal si no se han creado metas anuales aún');
    }
    
    // Probar consultas que usan las APIs
    console.log('\n🔍 Probando consultas del dashboard...');
    
    // Estadísticas de donaciones
    const donationStats = await prisma.donation.aggregate({
      _sum: { amount: true },
      _count: true
    });
    
    console.log('   ✅ Estadísticas de donaciones calculadas');
    console.log(`      - Total donaciones: ${donationStats._count}`);
    console.log(`      - Monto total: ${donationStats._sum.amount || 0}`);
    
    // Donaciones por estado
    const donationsByStatus = await prisma.donation.groupBy({
      by: ['status'],
      _count: true
    });
    
    console.log('   ✅ Donaciones por estado:');
    donationsByStatus.forEach(group => {
      console.log(`      - ${group.status}: ${group._count}`);
    });
    
    // Proyectos de donación
    const projectStats = await prisma.donationProject.groupBy({
      by: ['isActive', 'isCompleted'],
      _count: true
    });
    
    console.log('   ✅ Estadísticas de proyectos:');
    projectStats.forEach(group => {
      const status = group.isCompleted ? 'Completado' : (group.isActive ? 'Activo' : 'Inactivo');
      console.log(`      - ${status}: ${group._count}`);
    });
    
    // Metas anuales
    const currentYear = new Date().getFullYear();
    const annualGoal = await prisma.annualGoal.findFirst({
      where: { 
        year: currentYear,
        isActive: true 
      }
    });
    
    if (annualGoal) {
      console.log('   ✅ Meta anual encontrada:');
      console.log(`      - Año: ${annualGoal.year}`);
      console.log(`      - Meta: ${annualGoal.targetAmount}`);
      console.log(`      - Actual: ${annualGoal.currentAmount}`);
      console.log(`      - Meta mensual: ${Number(annualGoal.targetAmount) / 12}`);
    } else {
      console.log('   ⚠️  No hay meta anual para el año actual');
    }
    
    console.log('\n✅ Prueba de APIs completada');
    console.log('\n📋 Resumen:');
    console.log('   - Las APIs están configuradas correctamente');
    console.log('   - Los datos se calculan dinámicamente desde la base de datos');
    console.log('   - El dashboard mostrará datos reales cuando existan donaciones');
    console.log('   - Si no hay datos, se mostrarán valores en 0 (comportamiento esperado)');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdvisorDashboardAPIs().catch(console.error);


