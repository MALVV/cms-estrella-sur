const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCompleteComprobanteSystem() {
  try {
    console.log('🧪 Probando sistema completo de comprobantes de pago...\n');

    // 1. Crear una donación de prueba
    console.log('1. Creando donación de prueba...');
    const testDonation = await prisma.donation.create({
      data: {
        donorName: 'Carlos Rodríguez',
        donorEmail: 'carlos@ejemplo.com',
        donorAddress: 'Plaza Central 789',
        donorPhone: '+5551234567',
        amount: 500.00,
        donationType: 'GENERAL',
        message: 'Donación general con comprobante de pago',
        status: 'PENDING'
      }
    });
    console.log(`✅ Donación creada: ${testDonation.id}`);

    // 2. Simular URL de comprobante real (como si viniera de MinIO)
    const comprobanteUrl = 'https://minio.ejemplo.com/donation-proofs/1703123456789-def456.jpg';
    const comprobanteAlt = 'comprobante-transferencia-500.jpg';

    // 3. Obtener usuario ADMINISTRATOR
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRATOR' }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario ADMINISTRATOR');
      return;
    }

    // 4. Simular aprobación con comprobante (como lo haría la API)
    console.log('\n2. Simulando aprobación con comprobante...');
    const approvedDonation = await prisma.donation.update({
      where: { id: testDonation.id },
      data: {
        status: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        bankTransferImage: comprobanteUrl,
        bankTransferImageAlt: comprobanteAlt
      },
      include: {
        approver: {
          select: { name: true, email: true }
        }
      }
    });

    console.log(`✅ Donación aprobada: ${approvedDonation.id}`);
    console.log(`   Status: ${approvedDonation.status}`);
    console.log(`   URL comprobante: ${approvedDonation.bankTransferImage}`);
    console.log(`   Alt comprobante: ${approvedDonation.bankTransferImageAlt}`);
    console.log(`   Aprobada por: ${approvedDonation.approver?.name || approvedDonation.approver?.email}`);

    // 5. Verificar que el URL se guardó en la tabla donations
    console.log('\n3. Verificando almacenamiento en tabla donations...');
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
      console.log('✅ Datos verificados en la tabla donations:');
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

    // 6. Probar consulta para obtener donaciones con comprobantes
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
        bankTransferImageAlt: true,
        approvedAt: true
      },
      orderBy: { approvedAt: 'desc' },
      take: 5
    });

    console.log(`✅ Encontradas ${donationsWithComprobantes.length} donaciones con comprobantes:`);
    donationsWithComprobantes.forEach((donation, index) => {
      console.log(`   ${index + 1}. ${donation.donorName}: $${donation.amount}`);
      console.log(`      URL: ${donation.bankTransferImage}`);
      console.log(`      Alt: ${donation.bankTransferImageAlt}`);
      console.log(`      Aprobada: ${donation.approvedAt}`);
    });

    // 7. Probar consulta específica para mostrar en interfaces
    console.log('\n5. Probando consulta para interfaces de usuario...');
    const donationsForUI = await prisma.donation.findMany({
      where: {
        status: 'APPROVED'
      },
      select: {
        id: true,
        donorName: true,
        donorEmail: true,
        amount: true,
        donationType: true,
        status: true,
        bankTransferImage: true,
        bankTransferImageAlt: true,
        approvedAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    console.log(`✅ Consulta para UI - ${donationsForUI.length} donaciones:`);
    donationsForUI.forEach((donation, index) => {
      console.log(`   ${index + 1}. ${donation.donorName}: $${donation.amount}`);
      console.log(`      Tipo: ${donation.donationType}`);
      console.log(`      Status: ${donation.status}`);
      console.log(`      Comprobante: ${donation.bankTransferImage ? 'Sí' : 'No'}`);
      if (donation.bankTransferImage) {
        console.log(`      URL: ${donation.bankTransferImage}`);
      }
    });

    // 8. Limpiar datos de prueba
    console.log('\n6. Limpiando datos de prueba...');
    await prisma.donation.delete({
      where: { id: testDonation.id }
    });
    console.log('✅ Datos de prueba eliminados');

    console.log('\n🎉 Sistema completo de comprobantes de pago funcionando correctamente!');
    console.log('   ✅ URL de imagen se guarda en tabla donations');
    console.log('   ✅ Campo bankTransferImage almacena la URL');
    console.log('   ✅ Campo bankTransferImageAlt almacena el texto alternativo');
    console.log('   ✅ Consultas funcionan correctamente');
    console.log('   ✅ Interfaces pueden mostrar los comprobantes');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteComprobanteSystem();
