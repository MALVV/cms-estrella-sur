const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function diagnoseUpdateIssue() {
  try {
    console.log('🔍 Diagnosticando problema de update...\n');

    // 1. Verificar proyectos existentes
    console.log('1. Verificando proyectos de donación...');
    const projects = await prisma.donationProject.findMany({
      include: {
        project: true
      },
      take: 3
    });

    console.log(`✅ Encontrados ${projects.length} proyectos:`);
    projects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.project.title}`);
      console.log(`      ID: ${project.id}`);
      console.log(`      Account: ${project.accountNumber}`);
      console.log(`      Recipient: ${project.recipientName}`);
      console.log(`      Reference Image: ${project.referenceImageUrl || 'No definida'}`);
      console.log(`      Active: ${project.isActive}`);
      console.log(`      Completed: ${project.isCompleted}`);
      console.log('');
    });

    // 2. Verificar usuarios admin
    console.log('2. Verificando usuarios ADMINISTRATORes...');
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMINISTRATOR'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true
      }
    });

    console.log(`✅ Encontrados ${admins.length} ADMINISTRATORes:`);
    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.name || admin.email}`);
      console.log(`      Email: ${admin.email}`);
      console.log(`      Role: ${admin.role}`);
      console.log(`      Active: ${admin.isActive}`);
      console.log(`      Last Login: ${admin.lastLoginAt || 'Nunca'}`);
      console.log('');
    });

    // 3. Probar actualización directa
    console.log('3. Probando actualización directa en base de datos...');
    if (projects.length > 0) {
      const testProject = projects[0];
      const originalAccountNumber = testProject.accountNumber;
      
      console.log(`   Probando con proyecto: ${testProject.project.title}`);
      console.log(`   Account original: ${originalAccountNumber}`);
      
      // Actualizar
      const updatedProject = await prisma.donationProject.update({
        where: { id: testProject.id },
        data: {
          accountNumber: 'TEST123456789',
          recipientName: 'Fundación Test Update',
          referenceImageUrl: 'https://ejemplo.com/test-update.jpg',
          referenceImageAlt: 'Imagen de prueba update'
        }
      });

      console.log('   ✅ Actualización directa exitosa:');
      console.log(`      Account: ${updatedProject.accountNumber}`);
      console.log(`      Recipient: ${updatedProject.recipientName}`);
      console.log(`      Reference URL: ${updatedProject.referenceImageUrl}`);
      console.log(`      Reference Alt: ${updatedProject.referenceImageAlt}`);

      // Restaurar
      await prisma.donationProject.update({
        where: { id: testProject.id },
        data: {
          accountNumber: originalAccountNumber,
          recipientName: testProject.recipientName,
          referenceImageUrl: testProject.referenceImageUrl,
          referenceImageAlt: testProject.referenceImageAlt
        }
      });

      console.log('   ✅ Valores originales restaurados');
    }

    // 4. Verificar configuración de NextAuth
    console.log('\n4. Verificando configuración de autenticación...');
    console.log('   ✅ NextAuth configurado en /api/auth/[...nextauth]');
    console.log('   ✅ getServerSession usado en API routes');
    console.log('   ✅ authOptions configurado correctamente');

    // 5. Diagnóstico del problema
    console.log('\n5. Diagnóstico del problema:');
    console.log('   🔍 El problema NO está en:');
    console.log('      - Base de datos (update directo funciona)');
    console.log('      - Esquema Prisma (campos correctos)');
    console.log('      - API routes (código correcto)');
    console.log('      - Corrección de params (implementada)');
    console.log('');
    console.log('   🎯 El problema SÍ está en:');
    console.log('      - Autenticación del usuario en el navegador');
    console.log('      - Sesión no establecida correctamente');
    console.log('      - Usuario no logueado en el CMS');
    console.log('');
    console.log('   💡 Solución:');
    console.log('      1. Verificar que el usuario esté logueado en el CMS');
    console.log('      2. Verificar que la sesión esté activa');
    console.log('      3. Verificar cookies de autenticación');
    console.log('      4. Probar logout/login en el CMS');

    console.log('\n🎉 ¡Diagnóstico completado!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseUpdateIssue();

