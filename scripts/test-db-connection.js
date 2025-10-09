const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar conexión básica
    await prisma.$connect();
    console.log('✅ Conexión exitosa');
    
    // Probar una consulta simple usando $queryRaw
    const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users`;
    console.log('👥 Usuarios en la base de datos:', result[0].count);
    
    const storiesResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM stories`;
    console.log('📖 Historias en la base de datos:', storiesResult[0].count);
    
    const alliesResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM allies`;
    console.log('🤝 Aliados en la base de datos:', alliesResult[0].count);
    
    const newsResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM news`;
    console.log('📰 Noticias en la base de datos:', newsResult[0].count);
    
    const eventsResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM events`;
    console.log('📅 Eventos en la base de datos:', eventsResult[0].count);
    
    const projectsResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM projects`;
    console.log('🏗️ Proyectos en la base de datos:', projectsResult[0].count);
    
    const methodologiesResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM methodologies`;
    console.log('📚 Metodologías en la base de datos:', methodologiesResult[0].count);
    
    const postsResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM posts`;
    console.log('📝 Posts en la base de datos:', postsResult[0].count);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();