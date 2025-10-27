const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUrlStorageInDonations() {
  try {
    console.log('🧪 Probando almacenamiento de URL en tabla donations...\n');

    // 1. Crear una donación de prueba
    console.log('1. Creando donación de prueba...');
    const testDonation = await prisma.donation.create({
      data: {
        donorName: 'María García',
        donorEmail: 'maria@ejemplo.com',
        donorAddress: 'Avenida Principal 456',
        donorPhone: '+0987654321',
        amount: 250.00,
        donationType: 'SPECIFIC_PROJECT',
        message: 'Donación para proyecto específico con comprobante',
        status: 'PENDING'
      }
    });
    console.log(`✅ Donación creada: ${testDonation.id}`);

    // 2. Simular URL de comprobante (como si viniera de MinIO)
    const comprobanteUrl = 'https://minio.ejemplo.com/donation-proofs/1703123456789-abc123.jpg';
    const comprobanteAlt = 'comprobante-transferencia-250.jpg';

    // 3. Obtener usuario administrador
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRADOR' }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario administrador');
      return;
    }

    // 4. Simular la actualización que hace la API
    console.log('\n2. Simulando actualización con URL de comprobante...');
    const updatedDonation = await prisma.donation.update({
      where: { id: testDonation.id },
      data: {
        status: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        bankTransferImage: comprobanteUrl,
        bankTransferImageAlt: comprobanteAlt
      }
    });

    console.log(`✅ Donación actualizada: ${updatedDonation.id}`);
    console.log(`   Status: ${updatedDonation.status}`);
    console.log(`   URL comprobante: ${updatedDonation.bankTransferImage}`);
    console.log(`   Alt comprobante: ${updatedDonation.bankTransferImageAlt}`);

    // 5. Verificar que el URL se guardó correctamente
    console.log('\n3. Verificando almacenamiento en base de datos...');
    const verificationQuery = await prisma.donation.findUnique({
      where: { id: testDonation.id },
      select: {
        id: true,
        donorName: true,
        amount: true,
        status: true,
        bankTransferImage: true,
        bankTransferImageAlt: true,
        approvedAt: true,
        approvedBy: true
      }
    });

    if (verificationQuery) {
      console.log('✅ Datos verificados en la base de datos:');
      console.log(`   ID: ${verificationQuery.id}`);
      console.log(`   Donante: ${verificationQuery.donorName}`);
      console.log(`   Monto: $${verificationQuery.amount}`);
      console.log(`   Status: ${verificationQuery.status}`);
      console.log(`   URL comprobante: ${verificationQuery.bankTransferImage}`);
      console.log(`   Alt comprobante: ${verificationQuery.bankTransferImageAlt}`);
      console.log(`   Aprobada en: ${verificationQuery.approvedAt}`);
      
      // Verificar que el URL no sea null
      if (verificationQuery.bankTransferImage && verificationQuery.bankTransferImageAlt) {
        console.log('\n✅ URL de comprobante guardado correctamente en la tabla donations');
      } else {
        console.log('\n❌ Error: URL de comprobante no se guardó correctamente');
      }
    }

    // 6. Probar consulta específica para donaciones con comprobantes
    console.log('\n4. Probando consulta de donaciones con comprobantes...');
    const donationsWithComprobantes = await prisma.donation.findMany({
      where: {
        status: 'APPROVED',
        bankTransferImage: { not: null }
      },
      select: {
        id: true,
        donorName: true,
        amount: true,
        bankTransferImage: true,
        bankTransferImageAlt: true
      }
    });

    console.log(`✅ Encontradas ${donationsWithComprobantes.length} donaciones con comprobantes:`);
    donationsWithComprobantes.forEach((donation, index) => {
      console.log(`   ${index + 1}. ${donation.donorName}: $${donation.amount}`);
      console.log(`      URL: ${donation.bankTransferImage}`);
      console.log(`      Alt: ${donation.bankTransferImageAlt}`);
    });

    // 7. Limpiar datos de prueba
    console.log('\n5. Limpiando datos de prueba...');
    await prisma.donation.delete({
      where: { id: testDonation.id }
    });
    console.log('✅ Datos de prueba eliminados');

    console.log('\n🎉 El URL de la imagen se guarda correctamente en la tabla donations!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUrlStorageInDonations();
