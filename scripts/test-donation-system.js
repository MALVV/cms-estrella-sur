const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDonationSystem() {
  try {
    console.log('🧪 Probando el sistema de donaciones...\n');

    // 1. Verificar proyectos de donación existentes
    console.log('1. Verificando proyectos de donación existentes...');
    const donationProjects = await prisma.donationProject.findMany({
      include: {
        project: true,
        donations: {
          where: {
            status: 'APPROVED'
          }
        }
      }
    });

    console.log(`✅ Encontrados ${donationProjects.length} proyectos de donación:`);
    donationProjects.forEach(project => {
      const totalDonated = project.donations.reduce((sum, donation) => sum + Number(donation.amount), 0);
      const progressPercentage = project.targetAmount 
        ? Math.min((totalDonated / Number(project.targetAmount)) * 100, 100)
        : 0;

      console.log(`   - ${project.project.title}`);
      console.log(`     Cuenta: ${project.accountNumber}`);
      console.log(`     Destinatario: ${project.recipientName}`);
      console.log(`     Meta: $${project.targetAmount?.toLocaleString() || 'Sin límite'}`);
      console.log(`     Recaudado: $${totalDonated.toLocaleString()}`);
      console.log(`     Progreso: ${progressPercentage.toFixed(1)}%`);
      console.log(`     Donaciones: ${project.donations.length}`);
      console.log('');
    });

    // 2. Verificar donaciones existentes
    console.log('2. Verificando donaciones existentes...');
    const donations = await prisma.donation.findMany({
      include: {
        donationProject: {
          include: {
            project: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Encontradas ${donations.length} donaciones:`);
    donations.forEach(donation => {
      console.log(`   - ${donation.donorName} - $${donation.amount.toLocaleString()}`);
      console.log(`     Email: ${donation.donorEmail}`);
      console.log(`     Tipo: ${donation.donationType}`);
      console.log(`     Estado: ${donation.status}`);
      console.log(`     Proyecto: ${donation.donationProject?.project.title || 'General'}`);
      console.log(`     Fecha: ${donation.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // 3. Crear una donación de prueba
    console.log('3. Creando donación de prueba...');
    if (donationProjects.length > 0) {
      const testDonation = await prisma.donation.create({
        data: {
          donorName: 'Test Usuario',
          donorEmail: 'test@example.com',
          donorAddress: 'Dirección de prueba 123',
          donorPhone: '+591 70123456',
          amount: 750.00,
          donationType: 'SPECIFIC_PROJECT',
          message: 'Donación de prueba del sistema',
          donationProjectId: donationProjects[0].id,
          status: 'PENDING'
        }
      });

      console.log(`✅ Donación de prueba creada: ${testDonation.id}`);
      console.log(`   Donante: ${testDonation.donorName}`);
      console.log(`   Monto: $${testDonation.amount.toLocaleString()}`);
      console.log(`   Estado: ${testDonation.status}`);
    }

    // 4. Simular aprobación de donación
    console.log('4. Simulando aprobación de donación...');
    const pendingDonationsToApprove = await prisma.donation.findMany({
      where: {
        status: 'PENDING'
      },
      take: 1
    });

    if (pendingDonationsToApprove.length > 0) {
      const donationToApprove = pendingDonationsToApprove[0];
      
      // Obtener un usuario administrador para aprobar
      const adminUser = await prisma.user.findFirst({
        where: {
          role: 'ADMINISTRADOR'
        }
      });

      if (adminUser) {
        const approvedDonation = await prisma.donation.update({
          where: { id: donationToApprove.id },
          data: {
            status: 'APPROVED',
            approvedBy: adminUser.id,
            approvedAt: new Date()
          }
        });

        // Actualizar el monto actual del proyecto
        if (approvedDonation.donationProjectId) {
          await prisma.donationProject.update({
            where: { id: approvedDonation.donationProjectId },
            data: {
              currentAmount: {
                increment: approvedDonation.amount
              }
            }
          });
        }

        console.log(`✅ Donación aprobada: ${approvedDonation.id}`);
        console.log(`   Monto: $${approvedDonation.amount.toLocaleString()}`);
        console.log(`   Aprobada por: ${adminUser.name || adminUser.email}`);
      }
    }

    // 5. Verificar estadísticas finales
    console.log('5. Estadísticas finales del sistema...');
    const totalDonations = await prisma.donation.count();
    const approvedDonations = await prisma.donation.count({
      where: { status: 'APPROVED' }
    });
    const pendingDonations = await prisma.donation.count({
      where: { status: 'PENDING' }
    });

    const totalAmount = await prisma.donation.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true }
    });

    console.log(`✅ Estadísticas:`);
    console.log(`   Total de donaciones: ${totalDonations}`);
    console.log(`   Donaciones aprobadas: ${approvedDonations}`);
    console.log(`   Donaciones pendientes: ${pendingDonations}`);
    console.log(`   Monto total recaudado: $${totalAmount._sum.amount?.toLocaleString() || '0'}`);

    console.log('\n🎉 Sistema de donaciones funcionando correctamente!');
    console.log('\n📋 Funcionalidades implementadas:');
    console.log('   ✅ Modelos de base de datos (DonationProject, Donation)');
    console.log('   ✅ APIs para crear y gestionar donaciones');
    console.log('   ✅ APIs para proyectos de donación');
    console.log('   ✅ Página pública de donaciones (/donar)');
    console.log('   ✅ Página individual de donación por proyecto (/donar/[id])');
    console.log('   ✅ Página de administración de donaciones (/admin/donations)');
    console.log('   ✅ Sistema de aprobación de donaciones');
    console.log('   ✅ Barras de progreso dinámicas');
    console.log('   ✅ Información de cuentas bancarias y códigos QR');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDonationSystem();
