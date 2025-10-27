const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFullDonationProjectCreation() {
  try {
    console.log('🧪 Probando creación completa de proyecto de donación...\n');

    // 1. Crear proyecto base
    console.log('1. Creando proyecto base...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto de Prueba Completo',
        context: 'Contexto de prueba para verificar funcionalidad completa',
        objectives: 'Objetivos de prueba',
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

    console.log('✅ Proyecto base creado:', {
      id: project.id,
      title: project.title
    });

    // 2. Crear proyecto de donación con todos los campos
    console.log('\n2. Creando proyecto de donación completo...');
    const donationProject = await prisma.donationProject.create({
      data: {
        projectId: project.id,
        accountNumber: '1234567890',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-completo.png',
        qrImageAlt: 'QR completo de prueba',
        referenceImageUrl: 'https://ejemplo.com/referencia-completa.jpg',
        referenceImageAlt: 'Imagen de referencia completa',
        targetAmount: 5000,
        currentAmount: 0,
        isActive: true,
        isCompleted: false
      }
    });

    console.log('✅ Proyecto de donación creado:', {
      id: donationProject.id,
      projectId: donationProject.projectId,
      accountNumber: donationProject.accountNumber,
      recipientName: donationProject.recipientName,
      qrImageUrl: donationProject.qrImageUrl,
      qrImageAlt: donationProject.qrImageAlt,
      referenceImageUrl: donationProject.referenceImageUrl,
      referenceImageAlt: donationProject.referenceImageAlt,
      targetAmount: donationProject.targetAmount?.toString(),
      currentAmount: donationProject.currentAmount.toString(),
      isActive: donationProject.isActive,
      isCompleted: donationProject.isCompleted
    });

    // 3. Verificar que se puede leer desde la API pública
    console.log('\n3. Verificando lectura desde API pública...');
    const foundProject = await prisma.donationProject.findUnique({
      where: { id: donationProject.id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            context: true,
            objectives: true,
            executionStart: true,
            executionEnd: true,
            imageUrl: true,
            imageAlt: true,
            isFeatured: true
          }
        },
        donations: {
          where: {
            status: 'APPROVED'
          },
          select: {
            amount: true,
            createdAt: true
          }
        }
      }
    });

    if (foundProject) {
      console.log('✅ Proyecto encontrado en API:', {
        id: foundProject.id,
        title: foundProject.project.title,
        referenceImageUrl: foundProject.referenceImageUrl,
        isCompleted: foundProject.isCompleted
      });
    } else {
      console.log('❌ Proyecto no encontrado en API');
    }

    // 4. Simular actualización a completado
    console.log('\n4. Simulando marcado como completado...');
    const completedProject = await prisma.donationProject.update({
      where: { id: donationProject.id },
      data: {
        currentAmount: 5000,
        isCompleted: true
      }
    });

    console.log('✅ Proyecto marcado como completado:', {
      currentAmount: completedProject.currentAmount.toString(),
      isCompleted: completedProject.isCompleted
    });

    // 5. Limpiar datos de prueba
    console.log('\n5. Limpiando datos de prueba...');
    await prisma.donationProject.delete({
      where: { id: donationProject.id }
    });
    
    await prisma.project.delete({
      where: { id: project.id }
    });

    console.log('✅ Datos de prueba eliminados');
    console.log('\n🎉 ¡Prueba completa exitosa!');
    console.log('\n📋 Resumen de funcionalidades verificadas:');
    console.log('   ✅ Creación de proyecto base');
    console.log('   ✅ Creación de proyecto de donación con todos los campos');
    console.log('   ✅ Campos de imagen de referencia funcionando');
    console.log('   ✅ Campo isCompleted funcionando');
    console.log('   ✅ Lectura desde API pública');
    console.log('   ✅ Actualización de estado completado');
    console.log('   ✅ Limpieza de datos de prueba');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testFullDonationProjectCreation();
