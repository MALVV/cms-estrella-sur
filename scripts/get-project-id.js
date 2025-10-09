const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getFirstProjectId() {
  try {
    const project = await prisma.project.findFirst();
    if (project) {
      console.log('ID del primer proyecto:', project.id);
    } else {
      console.log('No hay proyectos en la base de datos');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getFirstProjectId();
