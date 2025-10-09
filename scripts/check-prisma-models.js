const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

console.log('News model available:', 'news' in prisma);
console.log('Event model available:', 'event' in prisma);

// Try to access the models directly
try {
  console.log('News model type:', typeof prisma.news);
  console.log('Event model type:', typeof prisma.event);
} catch (error) {
  console.log('Error accessing models:', error.message);
}

prisma.$disconnect();
