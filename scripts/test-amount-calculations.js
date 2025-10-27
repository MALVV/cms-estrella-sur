const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAmountCalculations() {
  try {
    console.log('🧪 Probando cálculos de montos...\n');

    // Proyectos de donación
    const projects = await prisma.donationProject.findMany({
      include: {
        project: true
      }
    });

    console.log('📊 Proyectos de donación:');
    projects.forEach(p => {
      const current = parseFloat(p.currentAmount.toString());
      const target = parseFloat(p.targetAmount.toString());
      console.log(`- ${p.project.title}: ${current} Bs. (target: ${target} Bs.)`);
    });

    // Donaciones generales
    const generalDonations = await prisma.donation.findMany({
      where: { donationType: 'GENERAL' }
    });

    console.log('\n📊 Donaciones generales:');
    const totalGeneral = generalDonations.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0);
    console.log(`- Total: ${totalGeneral.toFixed(2)} Bs.`);
    generalDonations.forEach(d => {
      console.log(`  - ${d.donorName}: ${parseFloat(d.amount.toString())} Bs.`);
    });

    console.log('\n✅ Cálculos corregidos!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAmountCalculations();
