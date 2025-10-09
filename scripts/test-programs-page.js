const http = require('http');

function testProgramsPage() {
  console.log('🔍 Probando página de programas...\n');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/programas',
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📏 Content Length: ${data.length}`);
      
      // Buscar referencias a imágenes en el HTML
      const imageMatches = data.match(/src="[^"]*"/g);
      if (imageMatches) {
        console.log(`\n🖼️  Imágenes encontradas en la página:`);
        imageMatches.forEach((match, index) => {
          console.log(`${index + 1}. ${match}`);
        });
      }
      
      // Buscar referencias a programas destacados
      const featuredMatches = data.match(/Destacado/g);
      if (featuredMatches) {
        console.log(`\n⭐ Referencias a "Destacado": ${featuredMatches.length}`);
      }
      
      // Buscar referencias a imageUrl
      const imageUrlMatches = data.match(/imageUrl/g);
      if (imageUrlMatches) {
        console.log(`\n🔗 Referencias a "imageUrl": ${imageUrlMatches.length}`);
      }
      
      // Verificar si hay errores JavaScript
      const errorMatches = data.match(/error|Error|ERROR/g);
      if (errorMatches) {
        console.log(`\n❌ Posibles errores encontrados: ${errorMatches.length}`);
      }
      
      // Mostrar una muestra del HTML
      console.log(`\n📄 Muestra del HTML (primeros 500 caracteres):`);
      console.log(data.substring(0, 500) + '...');
      
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
  });

  req.end();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testProgramsPage();
}

module.exports = { testProgramsPage };
