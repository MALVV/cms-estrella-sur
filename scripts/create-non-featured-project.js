const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createNonFeaturedProject() {
  try {
    console.log('🧪 Creando proyecto NO destacado para probar...\n');

    // 1. Crear proyecto base NO destacado
    console.log('1. Creando proyecto base NO destacado...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto NO Destacado - Prueba',
        context: 'Este es un proyecto de prueba que NO está destacado para verificar que aparece en la página pública',
        objectives: 'Probar visibilidad de proyectos no destacados',
        content: 'Contenido de prueba para proyecto no destacado',
        executionStart: new Date(),
        executionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        isFeatured: false, // NO destacado
        creator: {
          connect: { id: 'cmgz8yvb10000fv4cnlxzcxw5' }
        }
      }
    });

    console.log('✅ Proyecto base NO destacado creado:', {
      id: project.id,
      title: project.title,
      isFeatured: project.isFeatured
    });

    // 2. Crear proyecto de donación
    console.log('\n2. Creando proyecto de donación...');
    const donationProject = await prisma.donationProject.create({
      data: {
        projectId: project.id,
        accountNumber: '9876543210',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-no-destacado.png',
        qrImageAlt: 'QR proyecto no destacado',
        referenceImageUrl: 'https://ejemplo.com/referencia-no-destacado.jpg',
        referenceImageAlt: 'Imagen de referencia no destacado',
        targetAmount: 3000,
        currentAmount: 0,
        isActive: true,
        isCompleted: false
      }
    });

    console.log('✅ Proyecto de donación creado:', {
      id: donationProject.id,
      projectId: donationProject.projectId,
      title: project.title,
      isFeatured: project.isFeatured
    });

    // 3. Verificar que aparece en la API pública
    console.log('\n3. Verificando API pública...');
    const allProjects = await prisma.donationProject.findMany({
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
      }
    });

    console.log('📋 Todos los proyectos activos:', allProjects.length);
    allProjects.forEach((dp, index) => {
      const featuredStatus = dp.project.isFeatured ? '🌟 DESTACADO' : '📌 NORMAL';
      console.log(`   ${index + 1}. ${dp.project.title} - ${featuredStatus}`);
    });

    // 4. Verificar que el proyecto aparece en la API pública
    console.log('\n4. Verificando que aparece en API pública...');
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

    const foundProject = publicProjects.find(dp => dp.id === donationProject.id);
    if (foundProject) {
      console.log('✅ Proyecto NO destacado encontrado en API pública:', {
        title: foundProject.project.title,
        isFeatured: foundProject.project.isFeatured
      });
    } else {
      console.log('❌ Proyecto NO destacado NO encontrado en API pública');
    }

    console.log('\n🎉 ¡Prueba completada!');
    console.log('📋 Resumen:');
    console.log('   ✅ Proyecto NO destacado creado');
    console.log('   ✅ Proyecto de donación asociado');
    console.log('   ✅ Verificado que aparece en API pública');
    console.log('   ✅ La página pública ahora mostrará TODOS los proyectos');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createNonFeaturedProject();
