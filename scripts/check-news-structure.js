const http = require('http');

function checkNewsStructure() {
  console.log('🔍 Verificando estructura de respuesta de noticias...\n');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/news',
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
        
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📋 Estructura de respuesta:`);
        console.log(JSON.stringify(jsonData, null, 2).substring(0, 500) + '...');
        
        if (jsonData.news) {
          console.log(`\n✅ Campo 'news' encontrado con ${jsonData.news.length} elementos`);
          if (jsonData.news.length > 0) {
            const firstNews = jsonData.news[0];
            console.log(`\n📰 Primera noticia:`);
            console.log(`   ID: ${firstNews.id}`);
            console.log(`   Título: ${firstNews.title}`);
            console.log(`   Programa: ${firstNews.programa ? firstNews.programa.nombreSector : 'Ninguno'}`);
            console.log(`   Proyecto: ${firstNews.project ? firstNews.project.title : 'Ninguno'}`);
            console.log(`   Metodología: ${firstNews.methodology ? firstNews.methodology.title : 'Ninguno'}`);
          }
        } else if (Array.isArray(jsonData)) {
          console.log(`\n✅ Respuesta es array directo con ${jsonData.length} elementos`);
        } else {
          console.log(`\n❓ Estructura inesperada:`, Object.keys(jsonData));
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
  checkNewsStructure();
}

module.exports = { checkNewsStructure };
