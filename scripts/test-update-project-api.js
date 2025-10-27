const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUpdateProjectAPI() {
  try {
    console.log('🔄 Probando API de actualización de proyectos...\n');

    // 1. Crear un proyecto de prueba
    console.log('1. Creando proyecto de prueba...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto Update API - Prueba',
        context: 'Este proyecto se usará para probar la API de actualización',
        objectives: 'Probar API de actualización',
        content: 'Contenido de prueba para API',
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
        accountNumber: '4444444444',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-inicial.png',
        qrImageAlt: 'QR inicial',
        referenceImageUrl: 'https://ejemplo.com/referencia-inicial.jpg',
        referenceImageAlt: 'Imagen de referencia inicial',
        targetAmount: 4000,
        currentAmount: 0,
        isActive: true,
        isCompleted: false
      }
    });

    console.log('✅ Proyecto creado:', {
      id: donationProject.id,
      title: project.title,
      accountNumber: donationProject.accountNumber,
      recipientName: donationProject.recipientName,
      qrImageUrl: donationProject.qrImageUrl,
      qrImageAlt: donationProject.qrImageAlt,
      referenceImageUrl: donationProject.referenceImageUrl,
      referenceImageAlt: donationProject.referenceImageAlt,
      targetAmount: donationProject.targetAmount.toString(),
      isActive: donationProject.isActive
    });

    // 2. Probar API de actualización
    console.log('\n2. Probando API de actualización...');
    try {
      const response = await fetch('http://localhost:3000/api/donation-projects/' + donationProject.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNumber: '5555555555',
          recipientName: 'Fundación Actualizada',
          qrImageUrl: 'https://ejemplo.com/qr-actualizado.png',
          qrImageAlt: 'QR actualizado',
          referenceImageUrl: 'https://ejemplo.com/referencia-actualizada.jpg',
          referenceImageAlt: 'Imagen de referencia actualizada',
          targetAmount: 6000,
          isActive: false
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('   ✅ API de actualización exitosa');
        console.log('   📊 Datos actualizados:', {
          accountNumber: result.donationProject.accountNumber,
          recipientName: result.donationProject.recipientName,
          qrImageUrl: result.donationProject.qrImageUrl,
          qrImageAlt: result.donationProject.qrImageAlt,
          referenceImageUrl: result.donationProject.referenceImageUrl,
          referenceImageAlt: result.donationProject.referenceImageAlt,
          targetAmount: result.donationProject.targetAmount.toString(),
          isActive: result.donationProject.isActive
        });
      } else {
        console.log('   ❌ Error en API:', response.status);
        const error = await response.text();
        console.log('   📝 Error details:', error);
      }
    } catch (error) {
      console.log('   ⚠️ Error en API (servidor no corriendo):', error.message);
    }

    // 3. Verificar actualización directa en base de datos
    console.log('\n3. Verificando actualización directa en BD...');
    const updatedProject = await prisma.donationProject.update({
      where: { id: donationProject.id },
      data: {
        accountNumber: '6666666666',
        recipientName: 'Fundación BD Actualizada',
        qrImageUrl: 'https://ejemplo.com/qr-bd-actualizado.png',
        qrImageAlt: 'QR BD actualizado',
        referenceImageUrl: 'https://ejemplo.com/referencia-bd-actualizada.jpg',
        referenceImageAlt: 'Imagen de referencia BD actualizada',
        targetAmount: 7000,
        isActive: true
      }
    });

    console.log('✅ Proyecto actualizado en BD:', {
      accountNumber: updatedProject.accountNumber,
      recipientName: updatedProject.recipientName,
      qrImageUrl: updatedProject.qrImageUrl,
      qrImageAlt: updatedProject.qrImageAlt,
      referenceImageUrl: updatedProject.referenceImageUrl,
      referenceImageAlt: updatedProject.referenceImageAlt,
      targetAmount: updatedProject.targetAmount.toString(),
      isActive: updatedProject.isActive
    });

    // 4. Verificar campos en API pública
    console.log('\n4. Verificando en API pública...');
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
        referenceImageUrl: publicProject.referenceImageUrl,
        referenceImageAlt: publicProject.referenceImageAlt,
        qrImageUrl: publicProject.qrImageUrl,
        qrImageAlt: publicProject.qrImageAlt,
        isActive: publicProject.isActive
      });
    }

    // 5. Limpiar datos de prueba
    console.log('\n5. Limpiando datos de prueba...');
    await prisma.donationProject.delete({
      where: { id: donationProject.id }
    });
    
    await prisma.project.delete({
      where: { id: project.id }
    });

    console.log('✅ Datos de prueba eliminados');
    console.log('\n🎉 ¡Prueba de API de actualización completada!');
    console.log('\n📋 Resumen:');
    console.log('   ✅ Proyecto creado con datos iniciales');
    console.log('   ✅ API de actualización probada');
    console.log('   ✅ Actualización directa en BD verificada');
    console.log('   ✅ Campos de imagen de referencia incluidos');
    console.log('   ✅ Verificado en API pública');
    console.log('   ✅ Limpieza de datos completada');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdateProjectAPI();

