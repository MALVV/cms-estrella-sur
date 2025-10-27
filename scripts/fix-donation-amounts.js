import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDonationAmounts() {
  try {
    console.log('🔧 Corrigiendo montos de proyectos de donación...\n');
    
    // Obtener todos los proyectos de donación
    const donationProjects = await prisma.donationProject.findMany({
      include: {
        donations: {
          where: { status: 'APPROVED' },
          select: { amount: true }
        }
      }
    });
    
    for (const project of donationProjects) {
      // Calcular el monto real de donaciones aprobadas
      const realAmount = project.donations.reduce((sum, donation) => sum + Number(donation.amount), 0);
      
      console.log(`📊 ${project.title}:`);
      console.log(`  - Monto actual en BD: $${project.currentAmount}`);
      console.log(`  - Monto real calculado: $${realAmount}`);
      
      if (project.currentAmount !== realAmount) {
        // Actualizar el monto actual
        await prisma.donationProject.update({
          where: { id: project.id },
          data: { currentAmount: realAmount }
        });
        
        console.log(`  ✅ Corregido a: $${realAmount}`);
        
        // Verificar si se alcanzó la meta
        if (project.targetAmount && realAmount >= Number(project.targetAmount)) {
          await prisma.donationProject.update({
            where: { id: project.id },
            data: { isCompleted: true }
          });
          console.log(`  🎯 Proyecto marcado como completado`);
        } else if (project.isCompleted && project.targetAmount && realAmount < Number(project.targetAmount)) {
          await prisma.donationProject.update({
            where: { id: project.id },
            data: { isCompleted: false }
          });
          console.log(`  🔄 Proyecto marcado como no completado`);
        }
      } else {
        console.log(`  ✅ Ya está correcto`);
      }
      console.log('');
    }
    
    console.log('🎉 Corrección completada!');
    
  } catch (error) {
    console.error('❌ Error al corregir montos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDonationAmounts();
