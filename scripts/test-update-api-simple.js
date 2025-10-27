const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testUpdateAPI() {
  try {
    console.log('🔧 Probando API de actualización directamente...\n');

    // 1. Obtener proyectos existentes
    console.log('1. Obteniendo proyectos existentes...');
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/donation-projects',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const projectsResponse = await makeRequest(getOptions);
    console.log('📥 Respuesta GET:', {
      status: projectsResponse.status,
      dataLength: Array.isArray(projectsResponse.data) ? projectsResponse.data.length : 'No es array'
    });

    if (projectsResponse.status !== 200 || !Array.isArray(projectsResponse.data) || projectsResponse.data.length === 0) {
      console.log('❌ No se pudieron obtener proyectos');
      return;
    }

    const project = projectsResponse.data[0];
    console.log('✅ Proyecto encontrado:', {
      id: project.id,
      title: project.project?.title || 'Sin título',
      accountNumber: project.accountNumber,
      recipientName: project.recipientName,
      referenceImageUrl: project.referenceImageUrl,
      referenceImageAlt: project.referenceImageAlt,
      isActive: project.isActive
    });

    // 2. Probar actualización via API
    console.log('\n2. Probando actualización via API...');
    const updateData = {
      accountNumber: '7777777777',
      recipientName: 'Fundación API Test',
      qrImageUrl: 'https://ejemplo.com/qr-api-test.png',
      qrImageAlt: 'QR API Test',
      referenceImageUrl: 'https://ejemplo.com/referencia-api-test.jpg',
      referenceImageAlt: 'Imagen de referencia API test',
      targetAmount: '12000',
      isActive: !project.isActive
    };

    console.log('📤 Enviando datos de actualización:', updateData);

    const updateOptions = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/donation-projects/${project.id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const updateResponse = await makeRequest(updateOptions, updateData);
    console.log('📥 Respuesta PATCH:', {
      status: updateResponse.status,
      success: updateResponse.data?.success
    });

    if (updateResponse.status === 200 && updateResponse.data?.success) {
      const updatedProject = updateResponse.data.donationProject;
      console.log('✅ Proyecto actualizado via API:', {
        accountNumber: updatedProject.accountNumber,
        recipientName: updatedProject.recipientName,
        qrImageUrl: updatedProject.qrImageUrl,
        qrImageAlt: updatedProject.qrImageAlt,
        referenceImageUrl: updatedProject.referenceImageUrl,
        referenceImageAlt: updatedProject.referenceImageAlt,
        targetAmount: updatedProject.targetAmount?.toString(),
        isActive: updatedProject.isActive
      });

      // 3. Verificar cambios
      console.log('\n3. Verificando cambios...');
      const verifyOptions = {
        hostname: 'localhost',
        port: 3000,
        path: `/api/donation-projects/${project.id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const verifyResponse = await makeRequest(verifyOptions);
      console.log('📥 Respuesta GET:', {
        status: verifyResponse.status
      });

      if (verifyResponse.status === 200) {
        const verifyProject = verifyResponse.data;
        console.log('✅ Proyecto verificado:', {
          accountNumber: verifyProject.accountNumber,
          recipientName: verifyProject.recipientName,
          referenceImageUrl: verifyProject.referenceImageUrl,
          referenceImageAlt: verifyProject.referenceImageAlt,
          targetAmount: verifyProject.targetAmount?.toString(),
          isActive: verifyProject.isActive
        });
      }

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

      const restoreResponse = await makeRequest(updateOptions, restoreData);
      console.log('📥 Respuesta RESTORE:', {
        status: restoreResponse.status,
        success: restoreResponse.data?.success
      });

      if (restoreResponse.status === 200) {
        console.log('✅ Valores originales restaurados');
      } else {
        console.log('❌ Error al restaurar valores originales');
      }

    } else {
      console.log('❌ Error en la API:', updateResponse.data);
    }

    console.log('\n🎉 ¡Prueba de API de actualización completada!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testUpdateAPI();

