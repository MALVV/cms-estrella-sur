const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getRealDonationData() {
  try {
    console.log('🔍 Obteniendo datos reales de donaciones...');
    
    // Obtener todas las donaciones con detalles
    const donations = await prisma.donation.findMany({
      select: {
        id: true,
        donorName: true,
        donorEmail: true,
        amount: true,
        status: true,
        donationType: true,
        createdAt: true,
        donationProject: {
          select: {
            title: true,
            id: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n💰 Donaciones encontradas (${donations.length}):`);
    donations.forEach((donation, index) => {
      console.log(`${index + 1}. ${donation.donorName}`);
      console.log(`   📧 Email: ${donation.donorEmail}`);
      console.log(`   💵 Monto: Bs. ${Number(donation.amount).toLocaleString()}`);
      console.log(`   📊 Estado: ${donation.status}`);
      console.log(`   🏷️  Tipo: ${donation.donationType}`);
      console.log(`   📅 Fecha: ${donation.createdAt.toLocaleDateString('es-ES')}`);
      console.log(`   🎯 Proyecto: ${donation.donationProject?.title || 'Donación General'}`);
      console.log('');
    });

    // Obtener proyectos de donación
    const projects = await prisma.donationProject.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        targetAmount: true,
        currentAmount: true,
        isActive: true,
        isCompleted: true,
        isFeatured: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n🎯 Proyectos de donación (${projects.length}):`);
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   📝 Descripción: ${project.description.substring(0, 100)}...`);
      console.log(`   💰 Meta: Bs. ${Number(project.targetAmount || 0).toLocaleString()}`);
      console.log(`   📊 Actual: Bs. ${Number(project.currentAmount).toLocaleString()}`);
      console.log(`   ✅ Activo: ${project.isActive ? 'Sí' : 'No'}`);
      console.log(`   🏁 Completado: ${project.isCompleted ? 'Sí' : 'No'}`);
      console.log(`   ⭐ Destacado: ${project.isFeatured ? 'Sí' : 'No'}`);
      console.log(`   📅 Creado: ${project.createdAt.toLocaleDateString('es-ES')}`);
      console.log('');
    });

    // Obtener metas anuales
    const goals = await prisma.annualGoal.findMany({
      orderBy: { year: 'desc' }
    });

    console.log(`\n📅 Metas anuales (${goals.length}):`);
    goals.forEach((goal, index) => {
      console.log(`${index + 1}. Meta ${goal.year}`);
      console.log(`   💰 Meta: Bs. ${Number(goal.targetAmount).toLocaleString()}`);
      console.log(`   📊 Actual: Bs. ${Number(goal.currentAmount).toLocaleString()}`);
      console.log(`   📝 Descripción: ${goal.description || 'Sin descripción'}`);
      console.log(`   ✅ Activa: ${goal.isActive ? 'Sí' : 'No'}`);
      console.log(`   ⭐ Destacada: ${goal.isFeatured ? 'Sí' : 'No'}`);
      console.log('');
    });

    // Calcular estadísticas
    const totalDonations = donations.length;
    const totalAmount = donations
      .filter(d => d.status === 'APPROVED')
      .reduce((sum, d) => sum + Number(d.amount), 0);
    
    const pendingCount = donations.filter(d => d.status === 'PENDING').length;
    const approvedCount = donations.filter(d => d.status === 'APPROVED').length;
    const rejectedCount = donations.filter(d => d.status === 'REJECTED').length;

    const activeProjects = projects.filter(p => p.isActive && !p.isCompleted).length;
    const completedProjects = projects.filter(p => p.isCompleted).length;

    console.log('\n📊 Estadísticas calculadas:');
    console.log(`   💰 Total recaudado: Bs. ${totalAmount.toLocaleString()}`);
    console.log(`   📈 Total donaciones: ${totalDonations}`);
    console.log(`   ⏳ Pendientes: ${pendingCount}`);
    console.log(`   ✅ Aprobadas: ${approvedCount}`);
    console.log(`   ❌ Rechazadas: ${rejectedCount}`);
    console.log(`   🎯 Proyectos activos: ${activeProjects}`);
    console.log(`   🏁 Proyectos completados: ${completedProjects}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getRealDonationData().catch(console.error);


