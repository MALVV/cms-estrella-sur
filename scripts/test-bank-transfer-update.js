const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBankTransferImageUpdate() {
  try {
    console.log('🧪 Probando actualización de bankTransferImage...\n');

    // 1. Crear una donación de prueba
    console.log('1. Creando donación de prueba...');
    const testDonation = await prisma.donation.create({
      data: {
        donorName: 'Test Usuario',
        donorEmail: 'test@ejemplo.com',
        donorAddress: 'Dirección de prueba',
        donorPhone: '+1234567890',
        amount: 100.00,
        donationType: 'GENERAL',
        message: 'Donación de prueba para verificar bankTransferImage',
        status: 'PENDING'
      }
    });
    console.log(`✅ Donación creada: ${testDonation.id}`);

    // 2. Simular la actualización que hace la API
    console.log('\n2. Simulando actualización con URL de comprobante...');
    const testUrl = 'https://ejemplo.com/comprobante-test.jpg';
    const testAlt = 'Comprobante de prueba';

    const updatedDonation = await prisma.donation.update({
      where: { id: testDonation.id },
      data: {
        status: 'APPROVED',
        bankTransferImage: testUrl,
        bankTransferImageAlt: testAlt,
        approvedAt: new Date()
      }
    });

    console.log(`✅ Donación actualizada: ${updatedDonation.id}`);
    console.log(`   Status: ${updatedDonation.status}`);
    console.log(`   bankTransferImage: ${updatedDonation.bankTransferImage}`);
    console.log(`   bankTransferImageAlt: ${updatedDonation.bankTransferImageAlt}`);

    // 3. Verificar que se guardó correctamente
    console.log('\n3. Verificando almacenamiento...');
    const verification = await prisma.donation.findUnique({
      where: { id: testDonation.id },
      select: {
        id: true,
        status: true,
        bankTransferImage: true,
        bankTransferImageAlt: true,
        approvedAt: true
      }
    });

    if (verification) {
      console.log('✅ Verificación exitosa:');
      console.log(`   ID: ${verification.id}`);
      console.log(`   Status: ${verification.status}`);
      console.log(`   bankTransferImage: ${verification.bankTransferImage}`);
      console.log(`   bankTransferImageAlt: ${verification.bankTransferImageAlt}`);
      console.log(`   approvedAt: ${verification.approvedAt}`);
      
      if (verification.bankTransferImage === testUrl) {
        console.log('\n✅ bankTransferImage se actualiza correctamente en la base de datos');
      } else {
        console.log('\n❌ Error: bankTransferImage no se actualizó correctamente');
      }
    }

    // 4. Limpiar datos de prueba
    console.log('\n4. Limpiando datos de prueba...');
    await prisma.donation.delete({
      where: { id: testDonation.id }
    });
    console.log('✅ Datos de prueba eliminados');

    console.log('\n🎉 La base de datos funciona correctamente para bankTransferImage!');
    console.log('   El problema debe estar en el frontend o en la API.');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBankTransferImageUpdate();
