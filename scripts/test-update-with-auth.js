const http = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function makeRequest(options, data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ 
            status: res.statusCode, 
            data: parsed,
            headers: res.headers,
            cookies: res.headers['set-cookie'] || []
          });
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            data: body,
            headers: res.headers,
            cookies: res.headers['set-cookie'] || []
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (cookies) {
      req.setHeader('Cookie', cookies);
    }
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testUpdateWithAuth() {
  try {
    console.log('🔧 Probando API de actualización con autenticación...\n');

    // 1. Buscar un usuario admin
    console.log('1. Buscando usuario admin...');
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMINISTRADOR'
      }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario admin');
      return;
    }

    console.log('✅ Usuario admin encontrado:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    });

    // 2. Obtener proyectos existentes
    console.log('\n2. Obteniendo proyectos existentes...');
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
    
    if (projectsResponse.status !== 200 || !Array.isArray(projectsResponse.data) || projectsResponse.data.length === 0) {
      console.log('❌ No se pudieron obtener proyectos');
      return;
    }

    const project = projectsResponse.data[0];
    console.log('✅ Proyecto encontrado:', {
      id: project.id,
      title: project.project?.title || 'Sin título',
      accountNumber: project.accountNumber,
      recipientName: project.recipientName
    });

    // 3. Simular login para obtener cookies de sesión
    console.log('\n3. Simulando login...');
    const loginOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/signin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const loginData = {
      email: adminUser.email,
      password: 'admin123' // Asumiendo que esta es la contraseña
    };

    const loginResponse = await makeRequest(loginOptions, loginData);
    console.log('📥 Respuesta LOGIN:', {
      status: loginResponse.status,
      cookies: loginResponse.cookies
    });

    // 4. Probar actualización con cookies de sesión
    console.log('\n4. Probando actualización con autenticación...');
    const updateData = {
      accountNumber: '5555555555',
      recipientName: 'Fundación Auth Test',
      qrImageUrl: 'https://ejemplo.com/qr-auth-test.png',
      qrImageAlt: 'QR Auth Test',
      referenceImageUrl: 'https://ejemplo.com/referencia-auth-test.jpg',
      referenceImageAlt: 'Imagen de referencia auth test',
      targetAmount: '8000',
      isActive: !project.isActive
    };

    const updateOptions = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/donation-projects/${project.id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Usar cookies de la respuesta de login si las hay
    const sessionCookies = loginResponse.cookies.join('; ');
    const updateResponse = await makeRequest(updateOptions, updateData, sessionCookies);
    
    console.log('📥 Respuesta PATCH:', {
      status: updateResponse.status,
      success: updateResponse.data?.success,
      error: updateResponse.data?.error
    });

    if (updateResponse.status === 200 && updateResponse.data?.success) {
      console.log('✅ ¡Actualización exitosa con autenticación!');
      
      const updatedProject = updateResponse.data.donationProject;
      console.log('📋 Proyecto actualizado:', {
        accountNumber: updatedProject.accountNumber,
        recipientName: updatedProject.recipientName,
        referenceImageUrl: updatedProject.referenceImageUrl,
        referenceImageAlt: updatedProject.referenceImageAlt,
        targetAmount: updatedProject.targetAmount?.toString(),
        isActive: updatedProject.isActive
      });

      // Restaurar valores originales
      console.log('\n5. Restaurando valores originales...');
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

      const restoreResponse = await makeRequest(updateOptions, restoreData, sessionCookies);
      console.log('📥 Respuesta RESTORE:', {
        status: restoreResponse.status,
        success: restoreResponse.data?.success
      });

    } else {
      console.log('❌ Error en la actualización:', updateResponse.data);
    }

    console.log('\n🎉 ¡Prueba de autenticación completada!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdateWithAuth();
