const { PrismaClient } = require('@prisma/client');

async function testPrismaClient() {
  try {
    console.log('🔍 Probando cliente de Prisma...');
    
    const prisma = new PrismaClient();
    
    // Probar consulta simple
    const userCount = await prisma.user.count();
    console.log(`✅ Cliente de Prisma funcionando correctamente`);
    console.log(`📊 Total de usuarios: ${userCount}`);
    
    // Probar consulta con filtro por rol CONSULTANT
    const CONSULTANTUsers = await prisma.user.findMany({
      where: { role: 'CONSULTANT' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    console.log(`🎭 Usuarios con rol CONSULTANT: ${CONSULTANTUsers.length}`);
    CONSULTANTUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });
    
    // Probar consulta con filtro por rol ADMINISTRATOR
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMINISTRATOR' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    console.log(`👑 Usuarios con rol ADMINISTRATOR: ${adminUsers.length}`);
    adminUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });
    
    console.log('\n✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaClient().catch(console.error);
