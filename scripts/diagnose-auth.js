// Script para diagnosticar problemas de NextAuth
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function diagnoseAuthIssues() {
  console.log('🔍 Diagnóstico de problemas de autenticación...\n');

  // 1. Verificar variables de entorno
  console.log('📋 Variables de entorno:');
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NO CONFIGURADO');
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'CONFIGURADO' : 'NO CONFIGURADO');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'NO CONFIGURADO');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADO' : 'NO CONFIGURADO');
  console.log('');

  // 2. Verificar conexión a la base de datos
  try {
    console.log('🗄️ Probando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');
    
    // 3. Verificar usuarios existentes
    const userCount = await prisma.user.count();
    console.log(`👥 Usuarios en la base de datos: ${userCount}`);
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLoginAt: true
        },
        take: 3
      });
      
      console.log('📋 Primeros usuarios:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - Activo: ${user.isActive}`);
      });
    } else {
      console.log('⚠️ No hay usuarios en la base de datos');
    }
    
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error.message);
  }

  // 4. Verificar configuración de NextAuth
  console.log('\n🔐 Configuración de NextAuth:');
  console.log('Ruta de API: /api/auth/[...nextauth]');
  console.log('Página de login: /sign-in');
  console.log('Estrategia de sesión: JWT');
  console.log('Duración de sesión: 15 minutos');

  // 5. Recomendaciones
  console.log('\n💡 Recomendaciones:');
  
  if (!process.env.NEXTAUTH_URL) {
    console.log('❌ NEXTAUTH_URL no está configurado. Agregar al .env:');
    console.log('   NEXTAUTH_URL=http://localhost:3000');
  }
  
  if (!process.env.NEXTAUTH_SECRET) {
    console.log('❌ NEXTAUTH_SECRET no está configurado. Agregar al .env:');
    console.log('   NEXTAUTH_SECRET=tu-clave-secreta-aqui');
  }
  
  if (process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.includes('localhost')) {
    console.log('⚠️ NEXTAUTH_URL está configurado para localhost en producción');
  }

  console.log('\n🔧 Pasos para resolver problemas comunes:');
  console.log('1. Verificar que el archivo .env existe y tiene las variables correctas');
  console.log('2. Reiniciar el servidor de desarrollo');
  console.log('3. Limpiar caché del navegador');
  console.log('4. Verificar que la base de datos esté ejecutándose');
  console.log('5. Ejecutar: npm run dev (no npm start)');

  await prisma.$disconnect();
}

diagnoseAuthIssues().catch(console.error);
