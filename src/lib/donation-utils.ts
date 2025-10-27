import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Verifica y actualiza automáticamente el estado de completado de un proyecto de donación
 * @param donationProjectId - ID del proyecto de donación
 * @returns Promise<boolean> - true si se marcó como completado, false si no
 */
export async function checkAndUpdateProjectCompletion(donationProjectId: string): Promise<boolean> {
  try {
    const donationProject = await prisma.donationProject.findUnique({
      where: { id: donationProjectId },
      include: {
        donations: {
          where: { status: 'APPROVED' }
        }
      }
    });

    if (!donationProject) {
      console.error(`Proyecto de donación ${donationProjectId} no encontrado`);
      return false;
    }

    // Calcular el monto total recaudado
    const totalRaised = donationProject.donations.reduce((sum, donation) => sum + Number(donation.amount), 0);

    // Verificar si se alcanzó la meta
    if (donationProject.targetAmount && totalRaised >= Number(donationProject.targetAmount)) {
      // Solo actualizar si no está ya marcado como completado
      if (!donationProject.isCompleted) {
        await prisma.donationProject.update({
          where: { id: donationProjectId },
          data: {
            isCompleted: true,
            currentAmount: totalRaised // Asegurar que el monto actual esté sincronizado
          }
        });

        console.log(`🎯 Proyecto ${donationProjectId} marcado como completado automáticamente. Meta alcanzada: ${totalRaised} >= ${donationProject.targetAmount}`);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error al verificar completado del proyecto:', error);
    return false;
  }
}

/**
 * Verifica y actualiza todos los proyectos de donación que puedan haber alcanzado su meta
 * @returns Promise<number> - Número de proyectos marcados como completados
 */
export async function checkAllProjectsCompletion(): Promise<number> {
  try {
    const donationProjects = await prisma.donationProject.findMany({
      where: {
        isCompleted: false,
        isActive: true,
        targetAmount: { not: null }
      },
      include: {
        donations: {
          where: { status: 'APPROVED' }
        }
      }
    });

    let completedCount = 0;

    for (const project of donationProjects) {
      const totalRaised = project.donations.reduce((sum, donation) => sum + Number(donation.amount), 0);
      
      if (totalRaised >= Number(project.targetAmount)) {
        await prisma.donationProject.update({
          where: { id: project.id },
          data: {
            isCompleted: true,
            currentAmount: totalRaised
          }
        });

        console.log(`🎯 Proyecto ${project.id} marcado como completado automáticamente. Meta alcanzada: ${totalRaised} >= ${project.targetAmount}`);
        completedCount++;
      }
    }

    return completedCount;
  } catch (error) {
    console.error('Error al verificar completado de todos los proyectos:', error);
    return 0;
  }
}
