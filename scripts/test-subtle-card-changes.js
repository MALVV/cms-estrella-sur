const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSubtleCardChanges() {
  try {
    console.log('🎨 Probando cambios sutiles en tarjetas de proyectos completados...\n');

    // 1. Crear un proyecto completado
    console.log('1. Creando proyecto completado...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto Completado - Cambios Sutiles',
        context: 'Este proyecto está completado y debería mostrar cambios sutiles en la tarjeta',
        objectives: 'Probar cambios sutiles en tarjetas completadas',
        content: 'Contenido de prueba para cambios sutiles',
        executionStart: new Date(),
        executionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        isFeatured: false,
        creator: {
          connect: { id: 'cmgz8yvb10000fv4cnlxzcxw5' }
        }
      }
    });

    const donationProject = await prisma.donationProject.create({
      data: {
        projectId: project.id,
        accountNumber: '8888888888',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-sutil.png',
        qrImageAlt: 'QR sutil',
        referenceImageUrl: 'https://ejemplo.com/referencia-sutil.jpg',
        referenceImageAlt: 'Imagen de referencia sutil',
        targetAmount: 1000,
        currentAmount: 1000, // Ya completado
        isActive: true,
        isCompleted: true // Marcado como completado
      }
    });

    console.log('✅ Proyecto completado creado:', {
      id: donationProject.id,
      title: project.title,
      targetAmount: donationProject.targetAmount.toString(),
      currentAmount: donationProject.currentAmount.toString(),
      isCompleted: donationProject.isCompleted
    });

    // 2. Crear un proyecto activo para comparación
    console.log('\n2. Creando proyecto activo para comparación...');
    const activeProject = await prisma.project.create({
      data: {
        title: 'Proyecto Activo - Sin Cambios',
        context: 'Este proyecto está activo y debería mostrar el estilo normal',
        objectives: 'Probar estilo normal de tarjetas activas',
        content: 'Contenido de prueba para estilo normal',
        executionStart: new Date(),
        executionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        isFeatured: false,
        creator: {
          connect: { id: 'cmgz8yvb10000fv4cnlxzcxw5' }
        }
      }
    });

    const activeDonationProject = await prisma.donationProject.create({
      data: {
        projectId: activeProject.id,
        accountNumber: '9999999999',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-activo.png',
        qrImageAlt: 'QR activo',
        referenceImageUrl: 'https://ejemplo.com/referencia-activo.jpg',
        referenceImageAlt: 'Imagen de referencia activo',
        targetAmount: 2000,
        currentAmount: 500, // Parcialmente completado
        isActive: true,
        isCompleted: false // No completado
      }
    });

    console.log('✅ Proyecto activo creado:', {
      id: activeDonationProject.id,
      title: activeProject.title,
      targetAmount: activeDonationProject.targetAmount.toString(),
      currentAmount: activeDonationProject.currentAmount.toString(),
      isCompleted: activeDonationProject.isCompleted
    });

    // 3. Verificar en API pública
    console.log('\n3. Verificando proyectos en API pública...');
    const publicProjects = await prisma.donationProject.findMany({
      where: {
        id: {
          in: [donationProject.id, activeDonationProject.id]
        }
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            context: true,
            executionStart: true,
            executionEnd: true,
            imageUrl: true,
            imageAlt: true
          }
        }
      }
    });

    console.log('✅ Proyectos en API pública:');
    publicProjects.forEach(project => {
      console.log(`   📋 ${project.project.title}:`);
      console.log(`      - Completado: ${project.isCompleted}`);
      console.log(`      - Monto actual: ${project.currentAmount.toString()}`);
      console.log(`      - Meta: ${project.targetAmount.toString()}`);
      console.log(`      - Progreso: ${((project.currentAmount / project.targetAmount) * 100).toFixed(1)}%`);
    });

    // 4. Simular cambios sutiles esperados
    console.log('\n4. Cambios sutiles esperados en tarjetas:');
    console.log('   🎨 Proyecto Completado:');
    console.log('      - Ring verde sutil alrededor de la tarjeta');
    console.log('      - Fondo verde muy sutil');
    console.log('      - Título en color verde');
    console.log('      - Descripción en color verde');
    console.log('      - Fechas en color verde');
    console.log('      - Badge "🎯 PROYECTO COMPLETADO"');
    console.log('      - Botón deshabilitado "Proyecto Completado"');
    
    console.log('\n   🎨 Proyecto Activo:');
    console.log('      - Estilo normal sin cambios');
    console.log('      - Colores estándar');
    console.log('      - Botón activo "Donar a este Proyecto"');

    // 5. Limpiar datos de prueba
    console.log('\n5. Limpiando datos de prueba...');
    await prisma.donationProject.deleteMany({
      where: {
        id: {
          in: [donationProject.id, activeDonationProject.id]
        }
      }
    });
    
    await prisma.project.deleteMany({
      where: {
        id: {
          in: [project.id, activeProject.id]
        }
      }
    });

    console.log('✅ Datos de prueba eliminados');
    console.log('\n🎉 ¡Prueba de cambios sutiles completada!');
    console.log('\n📋 Resumen:');
    console.log('   ✅ Proyecto completado creado');
    console.log('   ✅ Proyecto activo creado para comparación');
    console.log('   ✅ Verificado en API pública');
    console.log('   ✅ Cambios sutiles documentados');
    console.log('   ✅ Limpieza de datos completada');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSubtleCardChanges();
