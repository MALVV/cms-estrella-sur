import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de administradores para Estrella Sur...');

  try {
    // Verificar si la tabla existe antes de limpiar
    console.log('🔍 Verificando conexión con la base de datos...');
    
    // Intentar limpiar usuarios existentes (solo si la tabla existe)
    try {
      console.log('🧹 Limpiando usuarios existentes...');
      await prisma.user.deleteMany();
      console.log('✅ Usuarios existentes eliminados');
    } catch (error: any) {
      // Si el error es que la tabla no existe, informar al usuario
      if (error.code === 'P2021') {
        console.error('❌ Error: Las tablas no existen en la base de datos.');
        console.error('💡 Por favor, ejecuta primero las migraciones:');
        console.error('   npx prisma migrate deploy');
        console.error('   o');
        console.error('   npx prisma db push');
        throw new Error('Las migraciones no se han ejecutado. Ejecuta las migraciones primero.');
      }
      throw error;
    }

    // ==========================================
    // USUARIOS ADMINISTRADORES
    // ==========================================
    console.log('👥 Creando usuarios administradores...');
    
    const adminPassword1 = await bcrypt.hash('Admin123!', 12);
    const adminPassword2 = await bcrypt.hash('Admin456!', 12);
    const adminPassword3 = await bcrypt.hash('Admin789!', 12);

    const admin1 = await prisma.user.create({
      data: {
        email: 'admin@estrellasur.org',
        name: 'Administrador Principal',
        password: adminPassword1,
        role: 'ADMINISTRATOR',
        isActive: true,
        mustChangePassword: false,
        emailVerified: new Date(),
      },
    });

    const admin2 = await prisma.user.create({
      data: {
        email: 'admin2@estrellasur.org',
        name: 'Administrador Secundario',
        password: adminPassword2,
        role: 'ADMINISTRATOR',
        isActive: true,
        mustChangePassword: false,
        emailVerified: new Date(),
      },
    });

    const admin3 = await prisma.user.create({
      data: {
        email: 'admin3@estrellasur.org',
        name: 'Administrador de Respaldo',
        password: adminPassword3,
        role: 'ADMINISTRATOR',
        isActive: true,
        mustChangePassword: false,
        emailVerified: new Date(),
      },
    });

    console.log('✅ Usuarios administradores creados');

    // ==========================================
    // RESUMEN FINAL
    // ==========================================
    console.log('\n🎉 ¡Seed de administradores completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log('👥 Usuarios administradores: 3');
    console.log('\n🔑 Credenciales de administrador:');
    console.log('1. admin@estrellasur.org / Admin123!');
    console.log('2. admin2@estrellasur.org / Admin456!');
    console.log('3. admin3@estrellasur.org / Admin789!');
    console.log('\n✨ Base de datos poblada solo con usuarios administradores');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  });

