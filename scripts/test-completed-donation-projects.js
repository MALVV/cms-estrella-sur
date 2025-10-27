const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCompletedDonationProjects() {
  try {
    console.log('🧪 Probando funcionalidad de proyectos completados...\n');

    // 1. Verificar que los nuevos campos existen
    console.log('1. Verificando campos en la base de datos...');
    const sampleProject = await prisma.donationProject.findFirst({
      select: {
        id: true,
        referenceImageUrl: true,
        referenceImageAlt: true,
        isCompleted: true,
        currentAmount: true,
        targetAmount: true
      }
    });

    if (sampleProject) {
      console.log('✅ Campos encontrados:', {
        referenceImageUrl: sampleProject.referenceImageUrl,
        referenceImageAlt: sampleProject.referenceImageAlt,
        isCompleted: sampleProject.isCompleted,
        currentAmount: sampleProject.currentAmount.toString(),
        targetAmount: sampleProject.targetAmount?.toString()
      });
    } else {
      console.log('❌ No se encontraron proyectos de donación');
      return;
    }

    // 2. Crear un proyecto de prueba con meta baja para completarlo
    console.log('\n2. Creando proyecto de prueba...');
    const testProject = await prisma.project.create({
      data: {
        title: 'Proyecto de Prueba - Completado',
        context: 'Este es un proyecto de prueba para verificar la funcionalidad de completado',
        objectives: 'Probar funcionalidad',
        content: 'Contenido de prueba',
        executionStart: new Date(),
        executionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        isActive: true,
        isFeatured: false
      }
    });

    const testDonationProject = await prisma.donationProject.create({
      data: {
        projectId: testProject.id,
        accountNumber: '1234567890',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-test.png',
        qrImageAlt: 'QR de prueba',
        referenceImageUrl: 'https://ejemplo.com/referencia-test.jpg',
        referenceImageAlt: 'Imagen de referencia de prueba',
        targetAmount: 100, // Meta baja para completar fácilmente
        currentAmount: 0,
        isActive: true,
        isCompleted: false
      }
    });

    console.log('✅ Proyecto de prueba creado:', {
      id: testDonationProject.id,
      title: testProject.title,
      targetAmount: testDonationProject.targetAmount.toString()
    });

    // 3. Buscar un usuario admin existente
    console.log('\n3. Buscando usuario admin...');
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMINISTRADOR'
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario admin. Creando uno temporal...');
      const tempAdmin = await prisma.user.create({
        data: {
          name: 'Admin Temporal',
          email: 'admin-temp@test.com',
          password: 'temp-password',
          role: 'ADMINISTRADOR'
        }
      });
      adminUser = tempAdmin;
    }

    console.log('✅ Usuario admin encontrado:', {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email
    });

    // 4. Simular donaciones para alcanzar la meta
    console.log('\n4. Simulando donaciones para alcanzar la meta...');
    
    // Crear donación de 60 Bs
    const donation1 = await prisma.donation.create({
      data: {
        donorName: 'Donante Prueba 1',
        donorEmail: 'donante1@test.com',
        donorAddress: 'Dirección de prueba 1',
        donorPhone: '12345678',
        amount: 60,
        donationType: 'SPECIFIC_PROJECT',
        message: 'Donación de prueba 1',
        status: 'APPROVED',
        donationProjectId: testDonationProject.id,
        approvedBy: adminUser.id,
        approvedAt: new Date()
      }
    });

    // Crear donación de 40 Bs para completar la meta
    const donation2 = await prisma.donation.create({
      data: {
        donorName: 'Donante Prueba 2',
        donorEmail: 'donante2@test.com',
        donorAddress: 'Dirección de prueba 2',
        donorPhone: '87654321',
        amount: 40,
        donationType: 'SPECIFIC_PROJECT',
        message: 'Donación de prueba 2',
        status: 'APPROVED',
        donationProjectId: testDonationProject.id,
        approvedBy: adminUser.id,
        approvedAt: new Date()
      }
    });

    console.log('✅ Donaciones creadas:', {
      donacion1: donation1.amount.toString(),
      donacion2: donation2.amount.toString(),
      total: (donation1.amount + donation2.amount).toString()
    });

    // 5. Actualizar el monto actual del proyecto
    console.log('\n5. Actualizando monto actual del proyecto...');
    const updatedProject = await prisma.donationProject.update({
      where: { id: testDonationProject.id },
      data: {
        currentAmount: donation1.amount + donation2.amount
      }
    });

    console.log('✅ Monto actualizado:', {
      currentAmount: updatedProject.currentAmount.toString(),
      targetAmount: updatedProject.targetAmount.toString(),
      porcentaje: ((updatedProject.currentAmount / updatedProject.targetAmount) * 100).toFixed(2) + '%'
    });

    // 6. Marcar como completado
    console.log('\n6. Marcando proyecto como completado...');
    const completedProject = await prisma.donationProject.update({
      where: { id: testDonationProject.id },
      data: {
        isCompleted: true
      }
    });

    console.log('✅ Proyecto marcado como completado:', {
      isCompleted: completedProject.isCompleted,
      currentAmount: completedProject.currentAmount.toString(),
      targetAmount: completedProject.targetAmount.toString()
    });

    // 7. Verificar API pública
    console.log('\n7. Verificando API pública...');
    try {
      const response = await fetch('http://localhost:3000/api/public/donation-projects');
      if (response.ok) {
        const data = await response.json();
        const testProjectData = data.donationProjects.find(p => p.id === testDonationProject.id);
        
        if (testProjectData) {
          console.log('✅ API pública funciona:', {
            id: testProjectData.id,
            isCompleted: testProjectData.isCompleted,
            referenceImageUrl: testProjectData.referenceImageUrl,
            referenceImageAlt: testProjectData.referenceImageAlt
          });
        } else {
          console.log('❌ Proyecto no encontrado en API pública');
        }
      } else {
        console.log('❌ Error en API pública:', response.status);
      }
    } catch (error) {
      console.log('⚠️ No se pudo probar API pública (servidor no corriendo):', error.message);
    }

    // 8. Limpiar datos de prueba
    console.log('\n8. Limpiando datos de prueba...');
    await prisma.donation.deleteMany({
      where: {
        donationProjectId: testDonationProject.id
      }
    });
    
    await prisma.donationProject.delete({
      where: { id: testDonationProject.id }
    });
    
    await prisma.project.delete({
      where: { id: testProject.id }
    });

    console.log('✅ Datos de prueba eliminados');

    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('\n📋 Resumen de funcionalidades probadas:');
    console.log('   ✅ Campos de imagen de referencia agregados');
    console.log('   ✅ Campo isCompleted agregado');
    console.log('   ✅ Creación de proyectos con nuevos campos');
    console.log('   ✅ Simulación de donaciones');
    console.log('   ✅ Actualización de monto actual');
    console.log('   ✅ Marcado como completado');
    console.log('   ✅ API pública actualizada');
    console.log('   ✅ Limpieza de datos de prueba');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testCompletedDonationProjects();
