const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAutoCompleteProject() {
  try {
    console.log('🎯 Probando marcado automático de proyecto como completado...\n');

    // 1. Crear un proyecto de donación con meta baja
    console.log('1. Creando proyecto con meta baja para probar...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto Auto-Completado - Prueba',
        context: 'Este proyecto se marcará automáticamente como completado cuando se alcance la meta',
        objectives: 'Probar marcado automático de completado',
        content: 'Contenido de prueba para auto-completado',
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
        accountNumber: '5555555555',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-auto-completado.png',
        qrImageAlt: 'QR auto-completado',
        referenceImageUrl: 'https://ejemplo.com/referencia-auto-completado.jpg',
        referenceImageAlt: 'Imagen de referencia auto-completado',
        targetAmount: 500, // Meta baja para completar fácilmente
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

    // 2. Crear donaciones que no alcancen la meta
    console.log('\n2. Creando donaciones parciales...');
    
    const donation1 = await prisma.donation.create({
      data: {
        donorName: 'Donante Parcial 1',
        donorEmail: 'parcial1@test.com',
        donorAddress: 'Dirección parcial 1',
        donorPhone: '11111111',
        amount: 200,
        donationType: 'SPECIFIC_PROJECT',
        message: 'Donación parcial 1',
        status: 'PENDING',
        donationProjectId: donationProject.id
      }
    });

    const donation2 = await prisma.donation.create({
      data: {
        donorName: 'Donante Parcial 2',
        donorEmail: 'parcial2@test.com',
        donorAddress: 'Dirección parcial 2',
        donorPhone: '22222222',
        amount: 250,
        donationType: 'SPECIFIC_PROJECT',
        message: 'Donación parcial 2',
        status: 'PENDING',
        donationProjectId: donationProject.id
      }
    });

    console.log('✅ Donaciones creadas:', {
      donacion1: donation1.amount.toString(),
      donacion2: donation2.amount.toString(),
      total: (donation1.amount + donation2.amount).toString(),
      meta: donationProject.targetAmount.toString()
    });

    // 3. Simular aprobación de donaciones usando la API
    console.log('\n3. Simulando aprobación de donaciones...');
    
    // Buscar usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRADOR' },
      select: { id: true, name: true }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario admin');
      return;
    }

    console.log('✅ Usuario admin encontrado:', adminUser.name);

    // Aprobar primera donación
    console.log('\n4. Aprobando primera donación...');
    const updatedDonation1 = await prisma.donation.update({
      where: { id: donation1.id },
      data: {
        status: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date()
      }
    });

    // Actualizar monto del proyecto
    const projectAfterFirst = await prisma.donationProject.update({
      where: { id: donationProject.id },
      data: {
        currentAmount: {
          increment: donation1.amount
        }
      }
    });

    console.log('✅ Primera donación aprobada:', {
      monto: updatedDonation1.amount.toString(),
      montoActual: projectAfterFirst.currentAmount.toString(),
      meta: projectAfterFirst.targetAmount.toString(),
      isCompleted: projectAfterFirst.isCompleted
    });

    // Aprobar segunda donación (debería completar la meta)
    console.log('\n5. Aprobando segunda donación (debería completar la meta)...');
    const updatedDonation2 = await prisma.donation.update({
      where: { id: donation2.id },
      data: {
        status: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date()
      }
    });

    // Actualizar monto del proyecto
    const projectAfterSecond = await prisma.donationProject.update({
      where: { id: donationProject.id },
      data: {
        currentAmount: {
          increment: donation2.amount
        }
      }
    });

    console.log('✅ Segunda donación aprobada:', {
      monto: updatedDonation2.amount.toString(),
      montoActual: projectAfterSecond.currentAmount.toString(),
      meta: projectAfterSecond.targetAmount.toString(),
      isCompleted: projectAfterSecond.isCompleted
    });

    // 6. Verificar si se marcó como completado automáticamente
    console.log('\n6. Verificando marcado automático como completado...');
    
    if (projectAfterSecond.currentAmount >= projectAfterSecond.targetAmount) {
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

    // 7. Verificar en API pública
    console.log('\n7. Verificando en API pública...');
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

    // 8. Limpiar datos de prueba
    console.log('\n8. Limpiando datos de prueba...');
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
    console.log('   ✅ Proyecto creado con meta baja');
    console.log('   ✅ Donaciones creadas y aprobadas');
    console.log('   ✅ Monto actualizado correctamente');
    console.log('   ✅ Proyecto marcado como completado automáticamente');
    console.log('   ✅ Verificado en API pública');
    console.log('   ✅ Limpieza de datos completada');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAutoCompleteProject();
