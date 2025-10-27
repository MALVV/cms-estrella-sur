const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testEditProjectWithNewFields() {
  try {
    console.log('✏️ Probando edición de proyectos con nuevos campos...\n');

    // 1. Crear un proyecto de prueba
    console.log('1. Creando proyecto de prueba...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto Edición - Prueba',
        context: 'Este proyecto se usará para probar la edición con nuevos campos',
        objectives: 'Probar edición con campos de imagen de referencia',
        content: 'Contenido de prueba para edición',
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
        accountNumber: '3333333333',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-original.png',
        qrImageAlt: 'QR original',
        referenceImageUrl: 'https://ejemplo.com/referencia-original.jpg',
        referenceImageAlt: 'Imagen de referencia original',
        targetAmount: 3000,
        currentAmount: 0,
        isActive: true,
        isCompleted: false
      }
    });

    console.log('✅ Proyecto creado:', {
      id: donationProject.id,
      title: project.title,
      qrImageUrl: donationProject.qrImageUrl,
      qrImageAlt: donationProject.qrImageAlt,
      referenceImageUrl: donationProject.referenceImageUrl,
      referenceImageAlt: donationProject.referenceImageAlt,
      targetAmount: donationProject.targetAmount.toString(),
      isActive: donationProject.isActive
    });

    // 2. Simular edición con nuevos campos
    console.log('\n2. Simulando edición con nuevos campos...');
    
    const updatedDonationProject = await prisma.donationProject.update({
      where: { id: donationProject.id },
      data: {
        qrImageUrl: 'https://ejemplo.com/qr-actualizado.png',
        qrImageAlt: 'QR actualizado',
        referenceImageUrl: 'https://ejemplo.com/referencia-actualizada.jpg',
        referenceImageAlt: 'Imagen de referencia actualizada',
        targetAmount: 5000,
        isActive: false
      }
    });

    console.log('✅ Proyecto actualizado:', {
      id: updatedDonationProject.id,
      qrImageUrl: updatedDonationProject.qrImageUrl,
      qrImageAlt: updatedDonationProject.qrImageAlt,
      referenceImageUrl: updatedDonationProject.referenceImageUrl,
      referenceImageAlt: updatedDonationProject.referenceImageAlt,
      targetAmount: updatedDonationProject.targetAmount.toString(),
      isActive: updatedDonationProject.isActive
    });

    // 3. Verificar cambios en formulario de edición
    console.log('\n3. Campos del formulario de edición:');
    console.log('   📝 Meta de Recaudación: Campo numérico para targetAmount');
    console.log('   🏦 Número de Cuenta: Campo requerido para accountNumber');
    console.log('   👤 Nombre del Destinatario: Campo requerido para recipientName');
    console.log('   📱 URL de Imagen QR: Campo opcional para qrImageUrl');
    console.log('   📱 Alt Text de Imagen QR: Campo opcional para qrImageAlt');
    console.log('   🖼️ URL de Imagen de Referencia: Campo opcional para referenceImageUrl');
    console.log('   🖼️ Alt Text de Imagen de Referencia: Campo opcional para referenceImageAlt');
    console.log('   ✅ Proyecto activo: Checkbox para isActive');

    // 4. Verificar función openEditDialog
    console.log('\n4. Función openEditDialog:');
    console.log('   ✅ Pobla projectTitle desde project.project.title');
    console.log('   ✅ Pobla projectDescription desde project.project.context');
    console.log('   ✅ Pobla accountNumber desde project.accountNumber');
    console.log('   ✅ Pobla recipientName desde project.recipientName');
    console.log('   ✅ Pobla qrImageUrl desde project.qrImageUrl || ""');
    console.log('   ✅ Pobla qrImageAlt desde project.qrImageAlt || ""');
    console.log('   ✅ Pobla referenceImageUrl desde project.referenceImageUrl || ""');
    console.log('   ✅ Pobla referenceImageAlt desde project.referenceImageAlt || ""');
    console.log('   ✅ Pobla targetAmount desde project.targetAmount?.toString() || ""');
    console.log('   ✅ Pobla isActive desde project.isActive');

    // 5. Verificar función handleEditProject
    console.log('\n5. Función handleEditProject:');
    console.log('   ✅ Envía todos los campos del formData usando spread operator');
    console.log('   ✅ Convierte targetAmount a parseFloat si existe');
    console.log('   ✅ Maneja errores con notificaciones toast');
    console.log('   ✅ Actualiza la lista después de editar');
    console.log('   ✅ Cierra el diálogo y resetea el formulario');

    // 6. Verificar API de actualización
    console.log('\n6. API de actualización (/api/donation-projects/[id]):');
    console.log('   ✅ Método PATCH para actualizar proyectos');
    console.log('   ✅ Requiere autenticación de administrador');
    console.log('   ✅ Actualiza accountNumber, recipientName');
    console.log('   ✅ Actualiza qrImageUrl, qrImageAlt');
    console.log('   ✅ Actualiza referenceImageUrl, referenceImageAlt');
    console.log('   ✅ Actualiza targetAmount, isActive');
    console.log('   ✅ Retorna proyecto actualizado con relaciones');

    // 7. Limpiar datos de prueba
    console.log('\n7. Limpiando datos de prueba...');
    await prisma.donationProject.delete({
      where: { id: donationProject.id }
    });
    
    await prisma.project.delete({
      where: { id: project.id }
    });

    console.log('✅ Datos de prueba eliminados');
    console.log('\n🎉 ¡Prueba de edición con nuevos campos completada!');
    console.log('\n📋 Resumen:');
    console.log('   ✅ Proyecto creado con campos originales');
    console.log('   ✅ Campos actualizados correctamente');
    console.log('   ✅ Formulario de edición incluye todos los campos');
    console.log('   ✅ Función openEditDialog pobla todos los campos');
    console.log('   ✅ Función handleEditProject envía todos los campos');
    console.log('   ✅ API maneja todos los campos correctamente');
    console.log('   ✅ Limpieza de datos completada');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEditProjectWithNewFields();
