const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDonationProjects() {
  try {
    console.log('Creando proyectos de donación...');

    // Obtener algunos proyectos existentes
    const projects = await prisma.project.findMany({
      where: {
        isActive: true
      },
      take: 3
    });

    if (projects.length === 0) {
      console.log('No hay proyectos activos para crear proyectos de donación');
      return;
    }

    const donationProjectsData = [
      {
        projectId: projects[0].id,
        accountNumber: '1234567890123456',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        qrImageAlt: 'Código QR para donaciones',
        targetAmount: 50000.00
      },
      {
        projectId: projects[1]?.id,
        accountNumber: '9876543210987654',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        qrImageAlt: 'Código QR para donaciones',
        targetAmount: 30000.00
      },
      {
        projectId: projects[2]?.id,
        accountNumber: '5555666677778888',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        qrImageAlt: 'Código QR para donaciones',
        targetAmount: 75000.00
      }
    ];

    for (const data of donationProjectsData) {
      if (data.projectId) {
        try {
          const donationProject = await prisma.donationProject.create({
            data: {
              projectId: data.projectId,
              accountNumber: data.accountNumber,
              recipientName: data.recipientName,
              qrImageUrl: data.qrImageUrl,
              qrImageAlt: data.qrImageAlt,
              targetAmount: data.targetAmount,
              currentAmount: 0
            },
            include: {
              project: true
            }
          });

          console.log(`✅ Proyecto de donación creado: ${donationProject.project.title}`);
        } catch (error) {
          console.log(`⚠️ Error al crear proyecto de donación para ${data.projectId}:`, error.message);
        }
      }
    }

    // Crear algunas donaciones de ejemplo
    console.log('\nCreando donaciones de ejemplo...');
    
    const donationProjects = await prisma.donationProject.findMany({
      include: {
        project: true
      }
    });

    const sampleDonations = [
      {
        donorName: 'María González',
        donorEmail: 'maria.gonzalez@email.com',
        donorAddress: 'Av. Principal 123, La Paz',
        donorPhone: '+591 70123456',
        amount: 500.00,
        donationType: 'GENERAL',
        message: 'Gracias por su trabajo en la comunidad',
        donationProjectId: donationProjects[0]?.id
      },
      {
        donorName: 'Carlos Rodríguez',
        donorEmail: 'carlos.rodriguez@email.com',
        donorAddress: 'Calle Libertad 456, Santa Cruz',
        donorPhone: '+591 70987654',
        amount: 1000.00,
        donationType: 'SPECIFIC_PROJECT',
        message: 'Apoyo para el proyecto educativo',
        donationProjectId: donationProjects[0]?.id
      },
      {
        donorName: 'Ana Martínez',
        donorEmail: 'ana.martinez@email.com',
        donorAddress: 'Plaza Central 789, Cochabamba',
        donorPhone: '+591 70555666',
        amount: 250.00,
        donationType: 'EMERGENCY',
        message: 'Para el fondo de emergencia',
        donationProjectId: donationProjects[1]?.id
      }
    ];

    for (const donationData of sampleDonations) {
      if (donationData.donationProjectId) {
        try {
          const donation = await prisma.donation.create({
            data: {
              ...donationData,
              status: 'APPROVED',
              approvedAt: new Date()
            }
          });

          // Actualizar el monto actual del proyecto
          await prisma.donationProject.update({
            where: { id: donationData.donationProjectId },
            data: {
              currentAmount: {
                increment: donationData.amount
              }
            }
          });

          console.log(`✅ Donación creada: ${donation.donorName} - $${donation.amount}`);
        } catch (error) {
          console.log(`⚠️ Error al crear donación:`, error.message);
        }
      }
    }

    console.log('\n🎉 Proyectos de donación y donaciones de ejemplo creados exitosamente!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDonationProjects();
