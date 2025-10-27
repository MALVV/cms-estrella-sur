import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDonationTotals() {
  try {
    console.log('🔍 Verificando totales de donaciones...\n');
    
    // Obtener proyectos de donación
    const donationProjects = await prisma.donationProject.findMany({
      select: {
        id: true,
        title: true,
        currentAmount: true,
        targetAmount: true,
        donations: {
          where: { status: 'APPROVED' },
          select: { amount: true }
        }
      }
    });
    
    console.log('📊 PROYECTOS DE DONACIÓN:');
    console.log('========================');
    
    let totalFromProjects = 0;
    donationProjects.forEach(project => {
      const donationsSum = project.donations.reduce((sum, d) => sum + Number(d.amount), 0);
      console.log(`• ${project.title}`);
      console.log(`  - Monto actual en BD: $${project.currentAmount}`);
      console.log(`  - Suma de donaciones aprobadas: $${donationsSum}`);
      console.log(`  - Meta: $${project.targetAmount || 'Sin meta'}`);
      console.log(`  - ✅ Coinciden: ${project.currentAmount === donationsSum ? 'SÍ' : 'NO'}`);
      console.log('');
      
      totalFromProjects += Number(project.currentAmount);
    });
    
    console.log(`💰 Total de proyectos: $${totalFromProjects}\n`);
    
    // Obtener donaciones generales
    const generalDonations = await prisma.donation.findMany({
      where: {
        donationType: 'GENERAL',
        status: 'APPROVED'
      },
      select: {
        id: true,
        donorName: true,
        amount: true
      }
    });
    
    console.log('🎯 DONACIONES GENERALES:');
    console.log('========================');
    
    let totalFromGeneral = 0;
    generalDonations.forEach(donation => {
      console.log(`• ${donation.donorName}: $${donation.amount}`);
      totalFromGeneral += Number(donation.amount);
    });
    
    console.log(`\n💰 Total donaciones generales: $${totalFromGeneral}\n`);
    
    // Total final
    const grandTotal = totalFromProjects + totalFromGeneral;
    
    console.log('🎉 RESUMEN FINAL:');
    console.log('================');
    console.log(`Total de proyectos: $${totalFromProjects}`);
    console.log(`Total donaciones generales: $${totalFromGeneral}`);
    console.log(`TOTAL RECAUDADO: $${grandTotal}`);
    
  } catch (error) {
    console.error('❌ Error al verificar totales:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDonationTotals();
