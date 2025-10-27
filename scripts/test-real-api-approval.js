const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRealAPIApproval() {
  try {
    console.log('🎯 Probando aprobación real a través de la API...\n');

    // 1. Crear proyecto de prueba
    console.log('1. Creando proyecto de prueba...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto API Real - Prueba',
        context: 'Este proyecto se completará usando la API real',
        objectives: 'Probar API real de aprobación',
        content: 'Contenido de prueba para API real',
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
        accountNumber: '7777777777',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-api-real.png',
        qrImageAlt: 'QR API real',
        referenceImageUrl: 'https://ejemplo.com/referencia-api-real.jpg',
        referenceImageAlt: 'Imagen de referencia API real',
        targetAmount: 1000,
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

    // 2. Crear donaciones
    console.log('\n2. Creando donaciones...');
    
    const donation1 = await prisma.donation.create({
      data: {
        donorName: 'Donante API 1',
        donorEmail: 'api1@test.com',
        donorAddress: 'Dirección API 1',
        donorPhone: '11111111',
        amount: 600,
        donationType: 'SPECIFIC_PROJECT',
        message: 'Donación API 1',
        status: 'PENDING',
        donationProjectId: donationProject.id
      }
    });

    const donation2 = await prisma.donation.create({
      data: {
        donorName: 'Donante API 2',
        donorEmail: 'api2@test.com',
        donorAddress: 'Dirección API 2',
        donorPhone: '22222222',
        amount: 400, // Esta donación completará la meta (600 + 400 = 1000)
        donationType: 'SPECIFIC_PROJECT',
        message: 'Donación API 2 - Completará la meta',
        status: 'PENDING',
        donationProjectId: donationProject.id
      }
    });

    console.log('✅ Donaciones creadas:', {
      donacion1: donation1.id,
      donacion2: donation2.id,
      monto1: donation1.amount.toString(),
      monto2: donation2.amount.toString(),
      total: (donation1.amount + donation2.amount).toString(),
      meta: donationProject.targetAmount.toString()
    });

    // 3. Probar API de aprobación
    console.log('\n3. Probando API de aprobación...');
    
    try {
      // Aprobar primera donación
      console.log('   Aprobando primera donación...');
      const response1 = await fetch('http://localhost:3000/api/donations/' + donation1.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId: donation1.id,
          status: 'APPROVED'
        })
      });

      if (response1.ok) {
        const result1 = await response1.json();
        console.log('   ✅ Primera donación aprobada vía API');
        
        // Verificar estado del proyecto
        const projectAfterFirst = await prisma.donationProject.findUnique({
          where: { id: donationProject.id }
        });
        
        console.log('   📊 Estado después de primera aprobación:', {
          currentAmount: projectAfterFirst.currentAmount.toString(),
          targetAmount: projectAfterFirst.targetAmount.toString(),
          isCompleted: projectAfterFirst.isCompleted
        });
      } else {
        console.log('   ❌ Error aprobando primera donación:', response1.status);
      }

      // Aprobar segunda donación (debería completar la meta)
      console.log('   Aprobando segunda donación...');
      const response2 = await fetch('http://localhost:3000/api/donations/' + donation2.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId: donation2.id,
          status: 'APPROVED'
        })
      });

      if (response2.ok) {
        const result2 = await response2.json();
        console.log('   ✅ Segunda donación aprobada vía API');
        
        // Verificar estado final del proyecto
        const projectAfterSecond = await prisma.donationProject.findUnique({
          where: { id: donationProject.id }
        });
        
        console.log('   📊 Estado final del proyecto:', {
          currentAmount: projectAfterSecond.currentAmount.toString(),
          targetAmount: projectAfterSecond.targetAmount.toString(),
          isCompleted: projectAfterSecond.isCompleted,
          porcentaje: ((projectAfterSecond.currentAmount / projectAfterSecond.targetAmount) * 100).toFixed(1) + '%'
        });

        if (projectAfterSecond.isCompleted) {
          console.log('   🎯 ¡Proyecto marcado como completado automáticamente!');
        } else {
          console.log('   ❌ Proyecto NO se marcó como completado automáticamente');
        }
      } else {
        console.log('   ❌ Error aprobando segunda donación:', response2.status);
      }

    } catch (error) {
      console.log('   ⚠️ Error en API (servidor no corriendo):', error.message);
    }

    // 4. Limpiar datos de prueba
    console.log('\n4. Limpiando datos de prueba...');
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
    console.log('\n🎉 ¡Prueba de API completada!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRealAPIApproval();
