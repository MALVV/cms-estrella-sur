const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

console.log('Available models:', Object.keys(prisma));

prisma.$disconnect();
