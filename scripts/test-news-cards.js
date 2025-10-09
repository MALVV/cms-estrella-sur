const http = require('http');

function testNewsCards() {
  console.log('🔍 Probando las nuevas tarjetas de noticias...\n');
  
  // Probar la API de noticias relacionadas
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/public/news/related?programaId=cmgfbz7tu000dfvicz97jebvs&limit=3',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        
        console.log(`📊 API Response:`);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Noticias: ${jsonData.news.length}`);
        
        if (jsonData.news.length > 0) {
          console.log(`\n📰 Estructura de las noticias:`);
          jsonData.news.forEach((news, index) => {
            console.log(`\n${index + 1}. ${news.title}`);
            console.log(`   ID: ${news.id}`);
            console.log(`   Imagen: ${news.imageUrl ? '✅ Presente' : '❌ Ausente'}`);
            console.log(`   Alt text: ${news.imageAlt || '❌ Sin alt text'}`);
            console.log(`   Fecha: ${news.publishedAt}`);
            console.log(`   Descripción: ${news.excerpt ? '✅ Presente' : '❌ Ausente'}`);
            console.log(`   Categoría: ${news.category}`);
          });
          
          console.log(`\n✅ Campos requeridos para las nuevas tarjetas:`);
          const requiredFields = ['id', 'title', 'imageUrl', 'imageAlt', 'publishedAt', 'excerpt'];
          requiredFields.forEach(field => {
            const hasField = jsonData.news.every(news => news[field] !== undefined);
            console.log(`   ${field}: ${hasField ? '✅ Disponible' : '❌ Faltante'}`);
          });
        } else {
          console.log(`\n⚠️  No hay noticias relacionadas con este programa`);
        }
        
      } catch (error) {
        console.error('❌ Error parsing JSON:', error.message);
        console.log('Raw response:', data.substring(0, 200) + '...');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
  });

  req.end();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testNewsCards();
}

module.exports = { testNewsCards };
