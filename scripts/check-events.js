const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkEvents() {
  try {
    const totalEvents = await prisma.event.count();
    const activeEvents = await prisma.event.count({
      where: { isActive: true }
    });
    
    console.log(`Total eventos: ${totalEvents}`);
    console.log(`Eventos activos: ${activeEvents}`);
    
    const events = await prisma.event.findMany({
      where: { isActive: true },
      select: { id: true, title: true, eventDate: true }
    });
    
    console.log('\nEventos activos:');
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - ${event.eventDate}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEvents();
