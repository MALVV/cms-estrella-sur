const fetch = require('node-fetch');

async function testEndpoint() {
  try {
    console.log('🔍 Probando endpoint de videos testimoniales...');
    
    const response = await fetch('http://localhost:3000/api/public/video-testimonials');
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n📊 Datos recibidos:');
      console.log('Total videos:', data.videos?.length || 0);
      console.log('Paginación:', data.pagination);
      
      if (data.videos && data.videos.length > 0) {
        console.log('\n🎬 Primer video:');
        console.log('- ID:', data.videos[0].id);
        console.log('- Título:', data.videos[0].title);
        console.log('- Activo:', data.videos[0].isActive);
        console.log('- Destacado:', data.videos[0].isFeatured);
        console.log('- URL YouTube:', data.videos[0].youtubeUrl);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testEndpoint();
