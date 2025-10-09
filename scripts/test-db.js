const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test creating a simple news item
    const testNews = await prisma.news.create({
      data: {
        title: 'Test News Item',
        content: 'This is a test news item to verify the system is working.',
        excerpt: 'Test excerpt',
        category: 'NOTICIAS',
        isFeatured: false,
      }
    });
    
    console.log('✅ Test news item created:', testNews.id);
    
    // Clean up
    await prisma.news.delete({
      where: { id: testNews.id }
    });
    
    console.log('✅ Test news item deleted');
    console.log('🎉 Database is working correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
