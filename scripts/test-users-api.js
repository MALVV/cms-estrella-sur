const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUsersAPI() {
  try {
    console.log('🔍 Probando API de usuarios...');
    
    // Verificar usuarios en la base de datos
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    console.log(`\n📋 Usuarios encontrados (${users.length}):`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'Sin nombre'}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🎭 Rol: ${user.role}`);
      console.log(`   ✅ Activo: ${user.isActive ? 'Sí' : 'No'}`);
      console.log(`   📅 Creado: ${user.createdAt.toLocaleDateString('es-ES')}`);
      console.log(`   🔐 Último login: ${user.lastLoginAt ? user.lastLoginAt.toLocaleDateString('es-ES') : 'Nunca'}`);
      console.log('');
    });

    // Verificar roles disponibles
    console.log('🎭 Roles disponibles:');
    const roles = [...new Set(users.map(u => u.role))];
    roles.forEach(role => {
      const count = users.filter(u => u.role === role).length;
      console.log(`   - ${role}: ${count} usuario(s)`);
    });

    // Verificar usuarios activos vs inactivos
    const activeUsers = users.filter(u => u.isActive);
    const inactiveUsers = users.filter(u => !u.isActive);
    
    console.log(`\n📊 Estadísticas:`);
    console.log(`   - Total: ${users.length}`);
    console.log(`   - Activos: ${activeUsers.length}`);
    console.log(`   - Inactivos: ${inactiveUsers.length}`);

    // Probar consulta con filtros
    console.log('\n🔍 Probando filtros...');
    
    // Filtro por rol ASESOR
    const asesorUsers = await prisma.user.findMany({
      where: { role: 'ASESOR' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });
    
    console.log(`   - Usuarios ASESOR: ${asesorUsers.length}`);
    asesorUsers.forEach(user => {
      console.log(`     * ${user.name || 'Sin nombre'} (${user.email})`);
    });

    // Filtro por usuarios activos
    const activeUsersQuery = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });
    
    console.log(`   - Usuarios activos: ${activeUsersQuery.length}`);

    // Probar búsqueda por nombre/email
    const searchUsers = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: 'asesor', mode: 'insensitive' } },
          { email: { contains: 'asesor', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });
    
    console.log(`   - Búsqueda "asesor": ${searchUsers.length}`);
    searchUsers.forEach(user => {
      console.log(`     * ${user.name || 'Sin nombre'} (${user.email})`);
    });

    console.log('\n✅ Prueba completada exitosamente');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUsersAPI().catch(console.error);
