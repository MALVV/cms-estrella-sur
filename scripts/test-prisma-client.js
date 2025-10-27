const { PrismaClient } = require('@prisma/client');

async function testPrismaClient() {
  try {
    console.log('🔍 Probando cliente de Prisma...');
    
    const prisma = new PrismaClient();
    
    // Probar consulta simple
    const userCount = await prisma.user.count();
    console.log(`✅ Cliente de Prisma funcionando correctamente`);
    console.log(`📊 Total de usuarios: ${userCount}`);
    
    // Probar consulta con filtro por rol ASESOR
    const asesorUsers = await prisma.user.findMany({
      where: { role: 'ASESOR' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    console.log(`🎭 Usuarios con rol ASESOR: ${asesorUsers.length}`);
    asesorUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });
    
    // Probar consulta con filtro por rol ADMINISTRADOR
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMINISTRADOR' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    console.log(`👑 Usuarios con rol ADMINISTRADOR: ${adminUsers.length}`);
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
