const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCreateDonationProject() {
  try {
    console.log('🧪 Probando creación de proyecto de donación...\n');

    // 1. Crear un proyecto base primero
    console.log('1. Creando proyecto base...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto de Prueba API',
        context: 'Contexto de prueba para verificar API',
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

    // 2. Crear proyecto de donación
    console.log('\n2. Creando proyecto de donación...');
    const donationProject = await prisma.donationProject.create({
      data: {
        projectId: project.id,
        accountNumber: '1234567890',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-test.png',
        qrImageAlt: 'QR de prueba',
        referenceImageUrl: 'https://ejemplo.com/referencia-test.jpg',
        referenceImageAlt: 'Imagen de referencia de prueba',
        targetAmount: 1000,
        currentAmount: 0,
        isActive: true,
        isCompleted: false
      }
    });

    console.log('✅ Proyecto de donación creado:', {
      id: donationProject.id,
      projectId: donationProject.projectId,
      accountNumber: donationProject.accountNumber,
      referenceImageUrl: donationProject.referenceImageUrl,
      isCompleted: donationProject.isCompleted
    });

    // 3. Limpiar datos de prueba
    console.log('\n3. Limpiando datos de prueba...');
    await prisma.donationProject.delete({
      where: { id: donationProject.id }
    });
    
    await prisma.project.delete({
      where: { id: project.id }
    });

    console.log('✅ Datos de prueba eliminados');
    console.log('\n🎉 ¡Prueba de creación exitosa!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testCreateDonationProject();
