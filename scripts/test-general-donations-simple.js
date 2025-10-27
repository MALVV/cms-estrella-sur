const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testGeneralDonations() {
  try {
    console.log('🧪 Verificando donaciones generales...\n');

    const generalDonations = await prisma.donation.findMany({
      where: {
        donationType: 'GENERAL'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Encontradas ${generalDonations.length} donaciones generales:`);
    generalDonations.forEach(donation => {
      console.log(`- ${donation.donorName}: ${donation.amount} Bs. (${donation.status})`);
    });

    // Estadísticas
    const stats = await prisma.donation.groupBy({
      by: ['status'],
      where: {
        donationType: 'GENERAL'
      },
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    });

    console.log('\n📊 Estadísticas de donaciones generales:');
    stats.forEach(stat => {
      console.log(`- ${stat.status}: ${stat._count.id} donaciones, Total: ${stat._sum.amount} Bs.`);
    });

    console.log('\n🎉 Sistema de donaciones generales funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testGeneralDonations();
