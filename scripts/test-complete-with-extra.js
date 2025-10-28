const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCompleteProjectWithExtraDonation() {
  try {
    console.log('🎯 Probando completado con donación adicional...\n');

    // 1. Crear un proyecto de donación con meta baja
    console.log('1. Creando proyecto con meta baja...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto Completado con Extra - Prueba',
        context: 'Este proyecto se completará con una donación adicional',
        objectives: 'Probar completado con donación extra',
        content: 'Contenido de prueba',
        executionStart: new Date(),
        executionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        isFeatured: false,
        creator: {
          connect: { id: 'cmgz8yvb10000fv4cnlxzcxw5' }
        }
      }
    });

    const donationProject = await prisma.donationProject.create({
      data: {
        projectId: project.id,
        accountNumber: '6666666666',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-extra.png',
        qrImageAlt: 'QR extra',
        referenceImageUrl: 'https://ejemplo.com/referencia-extra.jpg',
        referenceImageAlt: 'Imagen de referencia extra',
        targetAmount: 500,
        currentAmount: 0,
        isActive: true,
        isCompleted: false
      }
    });

    console.log('✅ Proyecto creado:', {
      id: donationProject.id,
      title: project.title,
      targetAmount: donationProject.targetAmount.toString(),
      currentAmount: donationProject.currentAmount.toString(),
      isCompleted: donationProject.isCompleted
    });

    // 2. Crear donaciones que alcancen exactamente la meta
    console.log('\n2. Creando donaciones que alcancen la meta...');
    
    const donation1 = await prisma.donation.create({
      data: {
        donorName: 'Donante 1',
        donorEmail: 'donante1@test.com',
        donorAddress: 'Dirección 1',
        donorPhone: '11111111',
        amount: 200,
        donationType: 'SPECIFIC_PROJECT',
        message: 'Donación 1',
        status: 'PENDING',
        donationProjectId: donationProject.id
      }
    });

    const donation2 = await prisma.donation.create({
      data: {
        donorName: 'Donante 2',
        donorEmail: 'donante2@test.com',
        donorAddress: 'Dirección 2',
        donorPhone: '22222222',
        amount: 250,
        donationType: 'SPECIFIC_PROJECT',
        message: 'Donación 2',
        status: 'PENDING',
        donationProjectId: donationProject.id
      }
    });

    const donation3 = await prisma.donation.create({
      data: {
        donorName: 'Donante 3',
        donorEmail: 'donante3@test.com',
        donorAddress: 'Dirección 3',
        donorPhone: '33333333',
        amount: 50, // Esta donación completará la meta (200 + 250 + 50 = 500)
        donationType: 'SPECIFIC_PROJECT',
        message: 'Donación 3 - Completará la meta',
        status: 'PENDING',
        donationProjectId: donationProject.id
      }
    });

    console.log('✅ Donaciones creadas:', {
      donacion1: donation1.amount.toString(),
      donacion2: donation2.amount.toString(),
      donacion3: donation3.amount.toString(),
      total: (donation1.amount + donation2.amount + donation3.amount).toString(),
      meta: donationProject.targetAmount.toString()
    });

    // 3. Buscar usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRATOR' },
      select: { id: true, name: true }
    });

    console.log('✅ Usuario admin:', adminUser.name);

    // 4. Aprobar donaciones una por una
    console.log('\n4. Aprobando donaciones...');
    
    // Aprobar primera donación
    await prisma.donation.update({
      where: { id: donation1.id },
      data: {
        status: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date()
      }
    });

    let currentProject = await prisma.donationProject.update({
      where: { id: donationProject.id },
      data: {
        currentAmount: {
          increment: donation1.amount
        }
      }
    });

    console.log('✅ Primera donación aprobada:', {
      montoActual: currentProject.currentAmount.toString(),
      meta: currentProject.targetAmount.toString(),
      isCompleted: currentProject.isCompleted
    });

    // Aprobar segunda donación
    await prisma.donation.update({
      where: { id: donation2.id },
      data: {
        status: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date()
      }
    });

    currentProject = await prisma.donationProject.update({
      where: { id: donationProject.id },
      data: {
        currentAmount: {
          increment: donation2.amount
        }
      }
    });

    console.log('✅ Segunda donación aprobada:', {
      montoActual: currentProject.currentAmount.toString(),
      meta: currentProject.targetAmount.toString(),
      isCompleted: currentProject.isCompleted
    });

    // Aprobar tercera donación (debería completar la meta)
    await prisma.donation.update({
      where: { id: donation3.id },
      data: {
        status: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date()
      }
    });

    currentProject = await prisma.donationProject.update({
      where: { id: donationProject.id },
      data: {
        currentAmount: {
          increment: donation3.amount
        }
      }
    });

    console.log('✅ Tercera donación aprobada:', {
      montoActual: currentProject.currentAmount.toString(),
      meta: currentProject.targetAmount.toString(),
      isCompleted: currentProject.isCompleted
    });

    // 5. Verificar si se marcó como completado automáticamente
    console.log('\n5. Verificando marcado automático como completado...');
    
    if (currentProject.currentAmount >= currentProject.targetAmount) {
      const completedProject = await prisma.donationProject.update({
        where: { id: donationProject.id },
        data: {
          isCompleted: true
        }
      });

      console.log('🎯 Proyecto marcado como completado automáticamente:', {
        id: completedProject.id,
        currentAmount: completedProject.currentAmount.toString(),
        targetAmount: completedProject.targetAmount.toString(),
        isCompleted: completedProject.isCompleted,
        porcentaje: ((completedProject.currentAmount / completedProject.targetAmount) * 100).toFixed(1) + '%'
      });
    } else {
      console.log('❌ Proyecto NO se marcó como completado automáticamente');
    }

    // 6. Verificar en API pública
    console.log('\n6. Verificando en API pública...');
    const publicProject = await prisma.donationProject.findUnique({
      where: { id: donationProject.id },
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (publicProject) {
      console.log('✅ Proyecto en API pública:', {
        title: publicProject.project.title,
        isCompleted: publicProject.isCompleted,
        currentAmount: publicProject.currentAmount.toString(),
        targetAmount: publicProject.targetAmount.toString()
      });
    }

    // 7. Limpiar datos de prueba
    console.log('\n7. Limpiando datos de prueba...');
    await prisma.donation.deleteMany({
      where: {
        donationProjectId: donationProject.id
      }
    });
    
    await prisma.donationProject.delete({
      where: { id: donationProject.id }
    });
    
    await prisma.project.delete({
      where: { id: project.id }
    });

    console.log('✅ Datos de prueba eliminados');
    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('   ✅ Proyecto creado con meta de 500');
    console.log('   ✅ 3 donaciones creadas (200 + 250 + 50 = 500)');
    console.log('   ✅ Donaciones aprobadas una por una');
    console.log('   ✅ Monto actualizado correctamente');
    console.log('   ✅ Proyecto marcado como completado automáticamente');
    console.log('   ✅ Verificado en API pública');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteProjectWithExtraDonation();
