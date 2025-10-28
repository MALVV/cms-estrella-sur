const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function assignCONSULTANTRole() {
  try {
    console.log('🔍 Buscando usuarios para asignar rol CONSULTANT...');
    
    // Listar todos los usuarios existentes
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    console.log('\n📋 Usuarios existentes:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'Sin nombre'} (${user.email}) - Rol: ${user.role}`);
    });

    console.log('\n❓ ¿Deseas asignar el rol CONSULTANT a algún usuario?');
    console.log('Para asignar el rol, ejecuta el script con el email del usuario:');
    console.log('node scripts/assign-CONSULTANT-role.js <email>');
    
    // Si se proporciona un email como argumento
    const email = process.argv[2];
    if (email) {
      console.log(`\n🎯 Asignando rol CONSULTANT a: ${email}`);
      
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        console.error(`❌ Usuario con email ${email} no encontrado`);
        return;
      }

      if (user.role === 'CONSULTANT') {
        console.log(`ℹ️  El usuario ${email} ya tiene el rol CONSULTANT`);
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'CONSULTANT' }
      });

      console.log(`✅ Rol CONSULTANT asignado exitosamente a ${updatedUser.name || updatedUser.email}`);
      console.log(`📧 Email: ${updatedUser.email}`);
      console.log(`👤 Nombre: ${updatedUser.name || 'Sin nombre'}`);
      console.log(`🎭 Rol anterior: ${user.role}`);
      console.log(`🎭 Rol nuevo: ${updatedUser.role}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para crear un usuario CONSULTANT de ejemplo
async function createExampleCONSULTANT() {
  try {
    console.log('👤 Creando usuario CONSULTANT de ejemplo...');
    
    const CONSULTANTEmail = 'CONSULTANT@estrella-sur.org';
    
    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: CONSULTANTEmail }
    });

    if (existingUser) {
      console.log(`ℹ️  El usuario ${CONSULTANTEmail} ya existe`);
      return;
    }

    const CONSULTANT = await prisma.user.create({
      data: {
        email: CONSULTANTEmail,
        name: 'CONSULTANT de Donaciones',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'CONSULTANT',
        isActive: true,
        mustChangePassword: true
      }
    });

    console.log('✅ Usuario CONSULTANT creado exitosamente:');
    console.log(`📧 Email: ${CONSULTANT.email}`);
    console.log(`👤 Nombre: ${CONSULTANT.name}`);
    console.log(`🎭 Rol: ${CONSULTANT.role}`);
    console.log(`🔑 Contraseña temporal: password`);
    console.log(`⚠️  El usuario debe cambiar la contraseña en el primer inicio de sesión`);

  } catch (error) {
    console.error('❌ Error creando usuario CONSULTANT:', error);
  }
}

// Función para listar usuarios con rol CONSULTANT
async function listCONSULTANTUsers() {
  try {
    console.log('🔍 Buscando usuarios con rol CONSULTANT...');
    
    const CONSULTANTUsers = await prisma.user.findMany({
      where: { role: 'CONSULTANT' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    if (CONSULTANTUsers.length === 0) {
      console.log('ℹ️  No se encontraron usuarios con rol CONSULTANT');
      return;
    }

    console.log(`\n📋 Usuarios con rol CONSULTANT (${CONSULTANTUsers.length}):`);
    CONSULTANTUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'Sin nombre'}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🎭 Rol: ${user.role}`);
      console.log(`   ✅ Activo: ${user.isActive ? 'Sí' : 'No'}`);
      console.log(`   📅 Creado: ${user.createdAt.toLocaleDateString('es-ES')}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Función principal
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'create-example':
      await createExampleCONSULTANT();
      break;
    case 'list':
      await listCONSULTANTUsers();
      break;
    default:
      await assignCONSULTANTRole();
      break;
  }
}

main().catch(console.error);
