const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuarios en la base de datos...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });

    console.log(`📊 Total de usuarios: ${users.length}\n`);

    if (users.length === 0) {
      console.log('⚠️ No hay usuarios en la base de datos');
      console.log('💡 Necesitas crear al menos un usuario ADMINISTRATOR');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nombre: ${user.name || 'Sin nombre'}`);
        console.log(`   Rol: ${user.role}`);
        console.log(`   Activo: ${user.isActive ? 'Sí' : 'No'}`);
        console.log('');
      });
    }

    // Verificar donaciones pendientes
    console.log('🔍 Verificando donaciones pendientes...\n');
    const pendingDonations = await prisma.donation.findMany({
      where: { status: 'PENDING' },
      select: {
        id: true,
        donorName: true,
        amount: true,
        status: true,
        createdAt: true
      }
    });

    console.log(`📊 Donaciones pendientes: ${pendingDonations.length}\n`);

    if (pendingDonations.length > 0) {
      pendingDonations.forEach((donation, index) => {
        console.log(`${index + 1}. ID: ${donation.id}`);
        console.log(`   Donante: ${donation.donorName}`);
        console.log(`   Monto: Bs. ${donation.amount}`);
        console.log(`   Estado: ${donation.status}`);
        console.log(`   Fecha: ${donation.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }

    console.log('🎉 Verificación completada!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();


