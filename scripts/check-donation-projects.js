const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDonationProjects() {
  try {
    console.log('🔍 Verificando proyectos de donación existentes...\n');

    // 1. Verificar todos los proyectos de donación
    const donationProjects = await prisma.donationProject.findMany({
      include: {
        project: {
          select: {
            id: true,
            title: true,
            context: true,
            isActive: true,
            isFeatured: true
          }
        }
      }
    });

    console.log('📋 Proyectos de donación encontrados:', donationProjects.length);
    
    donationProjects.forEach((dp, index) => {
      console.log(`\n${index + 1}. Proyecto de Donación:`);
      console.log(`   ID: ${dp.id}`);
      console.log(`   Proyecto ID: ${dp.projectId}`);
      console.log(`   Título: ${dp.project.title}`);
      console.log(`   Activo: ${dp.isActive}`);
      console.log(`   Completado: ${dp.isCompleted}`);
      console.log(`   Proyecto Activo: ${dp.project.isActive}`);
      console.log(`   Proyecto Destacado: ${dp.project.isFeatured}`);
      console.log(`   Monto Actual: ${dp.currentAmount.toString()}`);
      console.log(`   Monto Meta: ${dp.targetAmount?.toString() || 'Sin meta'}`);
    });

    // 2. Verificar proyectos destacados
    console.log('\n🌟 Proyectos destacados:');
    const featuredProjects = await prisma.donationProject.findMany({
      where: {
        project: {
          isFeatured: true
        },
        isActive: true
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

    console.log(`Encontrados: ${featuredProjects.length}`);
    featuredProjects.forEach((dp, index) => {
      console.log(`   ${index + 1}. ${dp.project.title} (${dp.id})`);
    });

    // 3. Verificar proyectos activos
    console.log('\n✅ Proyectos activos:');
    const activeProjects = await prisma.donationProject.findMany({
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
            isActive: true
          }
        }
      }
    });

    console.log(`Encontrados: ${activeProjects.length}`);
    activeProjects.forEach((dp, index) => {
      console.log(`   ${index + 1}. ${dp.project.title} (${dp.id})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDonationProjects();
