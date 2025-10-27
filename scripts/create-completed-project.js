const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createCompletedProject() {
  try {
    console.log('🎯 Creando proyecto completado para probar...\n');

    // 1. Crear proyecto base
    console.log('1. Creando proyecto base...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto Completado - Prueba',
        context: 'Este es un proyecto de donación que ha alcanzado su meta y está completado',
        objectives: 'Probar visualización de proyectos completados',
        content: 'Contenido de prueba para proyecto completado',
        executionStart: new Date(),
        executionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        isFeatured: false,
        creator: {
          connect: { id: 'cmgz8yvb10000fv4cnlxzcxw5' }
        }
      }
    });

    console.log('✅ Proyecto base creado:', {
      id: project.id,
      title: project.title
    });

    // 2. Crear proyecto de donación con meta alcanzada
    console.log('\n2. Creando proyecto de donación completado...');
    const donationProject = await prisma.donationProject.create({
      data: {
        projectId: project.id,
        accountNumber: '1111111111',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-completado.png',
        qrImageAlt: 'QR proyecto completado',
        referenceImageUrl: 'https://ejemplo.com/referencia-completado.jpg',
        referenceImageAlt: 'Imagen de referencia completado',
        targetAmount: 1000, // Meta baja para completar fácilmente
        currentAmount: 1000, // Meta alcanzada
        isActive: true,
        isCompleted: true // Marcado como completado
      }
    });

    console.log('✅ Proyecto de donación completado creado:', {
      id: donationProject.id,
      projectId: donationProject.projectId,
      title: project.title,
      targetAmount: donationProject.targetAmount?.toString(),
      currentAmount: donationProject.currentAmount.toString(),
      isCompleted: donationProject.isCompleted,
      progressPercentage: ((donationProject.currentAmount / donationProject.targetAmount) * 100).toFixed(1) + '%'
    });

    // 3. Verificar que aparece en la API pública
    console.log('\n3. Verificando API pública...');
    const publicProjects = await prisma.donationProject.findMany({
      where: {
        isActive: true,
        project: {
          isActive: true
        }
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            isFeatured: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log('📋 Todos los proyectos en API pública:', publicProjects.length);
    publicProjects.forEach((dp, index) => {
      const status = dp.isCompleted ? '🎯 COMPLETADO' : '🔄 EN PROGRESO';
      const featuredStatus = dp.project.isFeatured ? '🌟 DESTACADO' : '📌 NORMAL';
      console.log(`   ${index + 1}. ${dp.project.title} - ${status} - ${featuredStatus}`);
    });

    const completedProject = publicProjects.find(dp => dp.id === donationProject.id);
    if (completedProject) {
      console.log('\n✅ Proyecto completado encontrado en API pública:', {
        title: completedProject.project.title,
        isCompleted: completedProject.isCompleted,
        currentAmount: completedProject.currentAmount.toString(),
        targetAmount: completedProject.targetAmount?.toString()
      });
    } else {
      console.log('❌ Proyecto completado NO encontrado en API pública');
    }

    console.log('\n🎉 ¡Proyecto completado creado exitosamente!');
    console.log('📋 Resumen:');
    console.log('   ✅ Proyecto base creado');
    console.log('   ✅ Proyecto de donación con meta alcanzada');
    console.log('   ✅ Marcado como completado (isCompleted: true)');
    console.log('   ✅ Verificado en API pública');
    console.log('   ✅ Listo para probar en la página pública');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCompletedProject();
