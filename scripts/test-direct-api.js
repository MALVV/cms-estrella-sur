const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDirectAPI() {
  try {
    console.log('🧪 Probando funcionalidad directa de meta anual...\n');

    const currentYear = new Date().getFullYear();
    
    // Simular la lógica de la API GET
    console.log('1. Simulando GET /api/annual-goals...');
    
    let annualGoal = await prisma.annualGoal.findUnique({
      where: { year: currentYear }
    });

    if (!annualGoal) {
      console.log('   ➕ Creando meta por defecto...');
      annualGoal = await prisma.annualGoal.create({
        data: {
          year: currentYear,
          targetAmount: 75000,
          currentAmount: 45250,
          description: `Meta de recaudación para el año ${currentYear}`,
          isActive: true
        }
      });
    }

    console.log('✅ Respuesta simulada:');
    console.log(JSON.stringify(annualGoal, null, 2));

    // Simular la lógica de la API POST
    console.log('\n2. Simulando POST /api/annual-goals...');
    
    const newGoal = await prisma.annualGoal.create({
      data: {
        year: currentYear + 2,
        targetAmount: 100000,
        currentAmount: 0,
        description: 'Meta de prueba',
        isActive: true
      }
    });

    console.log('✅ Meta creada:');
    console.log(JSON.stringify(newGoal, null, 2));

    // Limpiar
    await prisma.annualGoal.delete({
      where: { id: newGoal.id }
    });
    console.log('✅ Meta de prueba eliminada');

    console.log('\n🎉 Todas las pruebas pasaron exitosamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDirectAPI();
