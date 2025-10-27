const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function assignAsesorRole() {
  try {
    console.log('🔍 Buscando usuarios para asignar rol ASESOR...');
    
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

    console.log('\n❓ ¿Deseas asignar el rol ASESOR a algún usuario?');
    console.log('Para asignar el rol, ejecuta el script con el email del usuario:');
    console.log('node scripts/assign-asesor-role.js <email>');
    
    // Si se proporciona un email como argumento
    const email = process.argv[2];
    if (email) {
      console.log(`\n🎯 Asignando rol ASESOR a: ${email}`);
      
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        console.error(`❌ Usuario con email ${email} no encontrado`);
        return;
      }

      if (user.role === 'ASESOR') {
        console.log(`ℹ️  El usuario ${email} ya tiene el rol ASESOR`);
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'ASESOR' }
      });

      console.log(`✅ Rol ASESOR asignado exitosamente a ${updatedUser.name || updatedUser.email}`);
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

// Función para crear un usuario asesor de ejemplo
async function createExampleAsesor() {
  try {
    console.log('👤 Creando usuario asesor de ejemplo...');
    
    const asesorEmail = 'asesor@estrella-sur.org';
    
    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: asesorEmail }
    });

    if (existingUser) {
      console.log(`ℹ️  El usuario ${asesorEmail} ya existe`);
      return;
    }

    const asesor = await prisma.user.create({
      data: {
        email: asesorEmail,
        name: 'Asesor de Donaciones',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'ASESOR',
        isActive: true,
        mustChangePassword: true
      }
    });

    console.log('✅ Usuario asesor creado exitosamente:');
    console.log(`📧 Email: ${asesor.email}`);
    console.log(`👤 Nombre: ${asesor.name}`);
    console.log(`🎭 Rol: ${asesor.role}`);
    console.log(`🔑 Contraseña temporal: password`);
    console.log(`⚠️  El usuario debe cambiar la contraseña en el primer inicio de sesión`);

  } catch (error) {
    console.error('❌ Error creando usuario asesor:', error);
  }
}

// Función para listar usuarios con rol ASESOR
async function listAsesorUsers() {
  try {
    console.log('🔍 Buscando usuarios con rol ASESOR...');
    
    const asesorUsers = await prisma.user.findMany({
      where: { role: 'ASESOR' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    if (asesorUsers.length === 0) {
      console.log('ℹ️  No se encontraron usuarios con rol ASESOR');
      return;
    }

    console.log(`\n📋 Usuarios con rol ASESOR (${asesorUsers.length}):`);
    asesorUsers.forEach((user, index) => {
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
      await createExampleAsesor();
      break;
    case 'list':
      await listAsesorUsers();
      break;
    default:
      await assignAsesorRole();
      break;
  }
}

main().catch(console.error);
