const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuthentication() {
  try {
    console.log('🔐 Probando autenticación...');
    
    // Buscar usuario ADMINISTRATOR
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRATOR' }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario ADMINISTRATOR');
      return;
    }

    console.log(`✅ Usuario ADMINISTRATOR encontrado: ${adminUser.email}`);
    console.log(`   - ID: ${adminUser.id}`);
    console.log(`   - Nombre: ${adminUser.name}`);
    console.log(`   - Rol: ${adminUser.role}`);
    console.log(`   - Activo: ${adminUser.isActive}`);

    // Probar verificación de contraseña
    const testPassword = 'admin123'; // Contraseña común para testing
    const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password);
    
    console.log(`\n🔑 Verificación de contraseña:`);
    console.log(`   - Contraseña de prueba: ${testPassword}`);
    console.log(`   - Contraseña válida: ${isPasswordValid ? 'Sí' : 'No'}`);

    if (!isPasswordValid) {
      console.log('⚠️  La contraseña no coincide. Probando con "password"...');
      const isPasswordValid2 = await bcrypt.compare('password', adminUser.password);
      console.log(`   - Contraseña "password" válida: ${isPasswordValid2 ? 'Sí' : 'No'}`);
    }

    // Verificar permisos del usuario
    console.log(`\n🎭 Verificando permisos:`);
    console.log(`   - Rol: ${adminUser.role}`);
    console.log(`   - Puede gestionar usuarios: ${adminUser.role === 'ADMINISTRATOR' ? 'Sí' : 'No'}`);

    // Simular consulta de usuarios como lo haría la API
    console.log(`\n📋 Simulando consulta de usuarios:`);
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

    console.log(`   - Total usuarios encontrados: ${users.length}`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name || 'Sin nombre'} (${user.email}) - ${user.role}`);
    });

    // Verificar si el usuario tiene permisos para ver usuarios
    const canManageUsers = adminUser.role === 'ADMINISTRATOR' || adminUser.role === 'MANAGER';
    console.log(`\n✅ El usuario ${adminUser.email} puede gestionar usuarios: ${canManageUsers ? 'Sí' : 'No'}`);

    console.log('\n🎯 Prueba de autenticación completada');

  } catch (error) {
    console.error('❌ Error en la prueba de autenticación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthentication().catch(console.error);
