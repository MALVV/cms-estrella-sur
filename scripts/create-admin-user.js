const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('👤 Creando usuario administrador...\n');

    // Verificar si ya existe un usuario
    const existingUser = await prisma.user.findFirst();
    if (existingUser) {
      console.log('ℹ️ Ya existe al menos un usuario en la base de datos');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Rol: ${existingUser.role}`);
      return;
    }

    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@estrellasur.com',
        name: 'Administrador',
        password: hashedPassword,
        role: 'ADMINISTRADOR',
        isActive: true,
        mustChangePassword: false
      }
    });

    console.log('✅ Usuario administrador creado exitosamente:');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Nombre: ${adminUser.name}`);
    console.log(`   Rol: ${adminUser.role}`);
    console.log(`   Contraseña: admin123`);
    console.log('\n🔐 Puedes iniciar sesión con:');
    console.log('   Email: admin@estrellasur.com');
    console.log('   Contraseña: admin123');

  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();


