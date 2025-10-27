const fetch = require('node-fetch');

async function testUpdateAPI() {
  try {
    console.log('🔧 Probando API de actualización directamente...\n');

    // 1. Obtener proyectos existentes
    console.log('1. Obteniendo proyectos existentes...');
    const response = await fetch('http://localhost:3000/api/donation-projects');
    const projects = await response.json();
    
    if (!projects || projects.length === 0) {
      console.log('❌ No se encontraron proyectos');
      return;
    }

    const project = projects[0];
    console.log('✅ Proyecto encontrado:', {
      id: project.id,
      title: project.project.title,
      accountNumber: project.accountNumber,
      recipientName: project.recipientName,
      referenceImageUrl: project.referenceImageUrl,
      referenceImageAlt: project.referenceImageAlt,
      isActive: project.isActive
    });

    // 2. Probar actualización via API
    console.log('\n2. Probando actualización via API...');
    const updateData = {
      accountNumber: '8888888888',
      recipientName: 'Fundación API Test',
      qrImageUrl: 'https://ejemplo.com/qr-api-test.png',
      qrImageAlt: 'QR API Test',
      referenceImageUrl: 'https://ejemplo.com/referencia-api-test.jpg',
      referenceImageAlt: 'Imagen de referencia API test',
      targetAmount: '12000',
      isActive: !project.isActive
    };

    console.log('📤 Enviando datos de actualización:', updateData);

    const updateResponse = await fetch(`http://localhost:3000/api/donation-projects/${project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    console.log('📥 Respuesta de la API:', {
      status: updateResponse.status,
      statusText: updateResponse.statusText
    });

    if (updateResponse.ok) {
      const updatedProject = await updateResponse.json();
      console.log('✅ Proyecto actualizado via API:', {
        success: updatedProject.success,
        accountNumber: updatedProject.donationProject.accountNumber,
        recipientName: updatedProject.donationProject.recipientName,
        qrImageUrl: updatedProject.donationProject.qrImageUrl,
        qrImageAlt: updatedProject.donationProject.qrImageAlt,
        referenceImageUrl: updatedProject.donationProject.referenceImageUrl,
        referenceImageAlt: updatedProject.donationProject.referenceImageAlt,
        targetAmount: updatedProject.donationProject.targetAmount?.toString(),
        isActive: updatedProject.donationProject.isActive
      });

      // 3. Verificar cambios
      console.log('\n3. Verificando cambios...');
      const verifyResponse = await fetch(`http://localhost:3000/api/donation-projects/${project.id}`);
      const verifyProject = await verifyResponse.json();
      
      console.log('✅ Proyecto verificado:', {
        accountNumber: verifyProject.accountNumber,
        recipientName: verifyProject.recipientName,
        referenceImageUrl: verifyProject.referenceImageUrl,
        referenceImageAlt: verifyProject.referenceImageAlt,
        targetAmount: verifyProject.targetAmount?.toString(),
        isActive: verifyProject.isActive
      });

      // 4. Restaurar valores originales
      console.log('\n4. Restaurando valores originales...');
      const restoreData = {
        accountNumber: project.accountNumber,
        recipientName: project.recipientName,
        qrImageUrl: project.qrImageUrl,
        qrImageAlt: project.qrImageAlt,
        referenceImageUrl: project.referenceImageUrl,
        referenceImageAlt: project.referenceImageAlt,
        targetAmount: project.targetAmount?.toString(),
        isActive: project.isActive
      };

      const restoreResponse = await fetch(`http://localhost:3000/api/donation-projects/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restoreData)
      });

      if (restoreResponse.ok) {
        console.log('✅ Valores originales restaurados');
      } else {
        console.log('❌ Error al restaurar valores originales');
      }

    } else {
      const error = await updateResponse.text();
      console.log('❌ Error en la API:', error);
    }

    console.log('\n🎉 ¡Prueba de API de actualización completada!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testUpdateAPI();

