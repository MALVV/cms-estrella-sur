const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function markProjectAsFeatured() {
  try {
    console.log('🌟 Marcando proyecto como destacado...\n');

    // Buscar el proyecto que no está destacado
    const nonFeaturedProject = await prisma.donationProject.findFirst({
      where: {
        project: {
          isFeatured: false
        }
      },
      include: {
        project: true
      }
    });

    if (nonFeaturedProject) {
      console.log('📋 Proyecto encontrado:', {
        id: nonFeaturedProject.id,
        title: nonFeaturedProject.project.title,
        isFeatured: nonFeaturedProject.project.isFeatured
      });

      // Marcar como destacado
      const updatedProject = await prisma.project.update({
        where: { id: nonFeaturedProject.projectId },
        data: {
          isFeatured: true
        }
      });

      console.log('✅ Proyecto marcado como destacado:', {
        id: updatedProject.id,
        title: updatedProject.title,
        isFeatured: updatedProject.isFeatured
      });

      // Verificar que ahora aparece en la API pública
      console.log('\n🔍 Verificando API pública...');
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

      console.log('🌟 Proyectos destacados ahora:', featuredProjects.length);
      featuredProjects.forEach((dp, index) => {
        console.log(`   ${index + 1}. ${dp.project.title} (${dp.id})`);
      });

    } else {
      console.log('❌ No se encontraron proyectos sin destacar');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

markProjectAsFeatured();
