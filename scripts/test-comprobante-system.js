const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testComprobanteSystem() {
  try {
    console.log('🧪 Probando sistema de comprobantes de pago...\n');

    // 1. Crear una donación de prueba
    console.log('1. Creando donación de prueba...');
    const testDonation = await prisma.donation.create({
      data: {
        donorName: 'Juan Pérez',
        donorEmail: 'juan@ejemplo.com',
        donorAddress: 'Calle 123, Ciudad',
        donorPhone: '+1234567890',
        amount: 100.00,
        donationType: 'GENERAL',
        message: 'Donación de prueba para comprobante',
        status: 'PENDING'
      }
    });
    console.log(`✅ Donación creada: ${testDonation.id}`);

    // 2. Simular aprobación con comprobante
    console.log('\n2. Simulando aprobación con comprobante...');
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRADOR' }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario administrador');
      return;
    }

    const approvedDonation = await prisma.donation.update({
      where: { id: testDonation.id },
      data: {
        status: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        bankTransferImage: 'https://ejemplo.com/comprobante-pago.jpg',
        bankTransferImageAlt: 'Comprobante de transferencia bancaria'
      },
      include: {
        approver: {
          select: { name: true, email: true }
        }
      }
    });

    console.log(`✅ Donación aprobada: ${approvedDonation.id}`);
    console.log(`   Comprobante: ${approvedDonation.bankTransferImage}`);
    console.log(`   Aprobada por: ${approvedDonation.approver?.name || approvedDonation.approver?.email}`);

    // 3. Verificar que los campos se guardaron correctamente
    console.log('\n3. Verificando campos de comprobante...');
    const verificationDonation = await prisma.donation.findUnique({
      where: { id: testDonation.id },
      select: {
        id: true,
        status: true,
        bankTransferImage: true,
        bankTransferImageAlt: true,
        approvedAt: true
      }
    });

    if (verificationDonation?.bankTransferImage && verificationDonation?.bankTransferImageAlt) {
      console.log('✅ Campos de comprobante guardados correctamente');
      console.log(`   URL: ${verificationDonation.bankTransferImage}`);
      console.log(`   Alt: ${verificationDonation.bankTransferImageAlt}`);
    } else {
      console.log('❌ Error: Campos de comprobante no se guardaron');
    }

    // 4. Probar consulta de donaciones con comprobantes
    console.log('\n4. Probando consulta de donaciones con comprobantes...');
    const donationsWithProofs = await prisma.donation.findMany({
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
      take: 5
    });

    console.log(`✅ Encontradas ${donationsWithProofs.length} donaciones con comprobantes:`);
    donationsWithProofs.forEach(donation => {
      console.log(`   - ${donation.donorName}: $${donation.amount} (${donation.bankTransferImage})`);
    });

    // 5. Limpiar datos de prueba
    console.log('\n5. Limpiando datos de prueba...');
    await prisma.donation.delete({
      where: { id: testDonation.id }
    });
    console.log('✅ Datos de prueba eliminados');

    console.log('\n🎉 Sistema de comprobantes de pago funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testComprobanteSystem();
