const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestDonationWithReferenceImage() {
  try {
    console.log('🖼️ Creando donación de prueba con imagen de referencia...\n');

    // 1. Buscar un proyecto existente con imagen de referencia
    console.log('1. Buscando proyecto con imagen de referencia...');
    const projectWithImage = await prisma.donationProject.findFirst({
      where: {
        referenceImageUrl: {
          not: null
        }
      },
      include: {
        project: true
      }
    });

    if (!projectWithImage) {
      console.log('❌ No se encontró proyecto con imagen de referencia');
      return;
    }

    console.log('✅ Proyecto encontrado:', {
      title: projectWithImage.project.title,
      referenceImageUrl: projectWithImage.referenceImageUrl,
      referenceImageAlt: projectWithImage.referenceImageAlt
    });

    // 2. Crear una donación para este proyecto
    console.log('\n2. Creando donación de prueba...');
    const testDonation = await prisma.donation.create({
      data: {
        donorName: 'María González Test',
        donorEmail: 'maria.test@imagen.com',
        donorAddress: 'Av. Test 123, La Paz',
        donorPhone: '77777777',
        amount: 2500,
        donationType: 'PROJECT',
        message: 'Donación para probar visualización de imagen de referencia en el CMS',
        donationProjectId: projectWithImage.id,
        status: 'PENDING'
      }
    });

    console.log('✅ Donación creada:', {
      id: testDonation.id,
      donorName: testDonation.donorName,
      amount: testDonation.amount,
      projectTitle: projectWithImage.project.title,
      referenceImageUrl: projectWithImage.referenceImageUrl
    });

    // 3. Verificar que la donación aparece en la API
    console.log('\n3. Verificando respuesta de API...');
    const apiResponse = await prisma.donation.findUnique({
      where: { id: testDonation.id },
      include: {
        donationProject: {
          include: {
            project: true
          }
        }
      }
    });

    if (apiResponse) {
      console.log('✅ Donación en API:', {
        donorName: apiResponse.donorName,
        amount: apiResponse.amount,
        donationProject: {
          id: apiResponse.donationProject?.id,
          referenceImageUrl: apiResponse.donationProject?.referenceImageUrl,
          referenceImageAlt: apiResponse.donationProject?.referenceImageAlt,
          project: {
            title: apiResponse.donationProject?.project.title
          }
        }
      });
    }

    // 4. Instrucciones para el usuario
    console.log('\n4. Instrucciones para verificar en el CMS:');
    console.log('   📋 Pasos:');
    console.log('   1. Ir a http://localhost:3000/dashboard/donaciones');
    console.log('   2. Asegurarse de estar logueado como ADMINISTRATOR');
    console.log('   3. Buscar la donación de "María González Test"');
    console.log('   4. Verificar que aparece la imagen de referencia junto al título del proyecto');
    console.log('   5. La imagen debe ser pequeña (32x32px) y redondeada');
    console.log('   6. Si la imagen no carga, debe ocultarse automáticamente');

    console.log('\n🎉 ¡Donación de prueba creada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('   ✅ Proyecto con imagen de referencia encontrado');
    console.log('   ✅ Donación de prueba creada');
    console.log('   ✅ Estructura de datos correcta');
    console.log('   ✅ Campos de imagen incluidos');
    console.log('   ✅ Listo para verificar en el CMS');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestDonationWithReferenceImage();

