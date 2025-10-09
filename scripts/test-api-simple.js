const http = require('http');

function testApiResponse() {
  console.log('🔍 Probando respuesta de la API...\n');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/public/programas',
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
        
        console.log(`📊 Total programas: ${jsonData.programas.length}`);
        
        if (jsonData.programas.length > 0) {
          const firstProgram = jsonData.programas[0];
          console.log('\n📋 Campos del primer programa:');
          console.log(Object.keys(firstProgram));
          
          console.log('\n🖼️  Campos de imagen:');
          console.log(`imageUrl: ${firstProgram.imageUrl ? '✅ Presente' : '❌ Ausente'}`);
          console.log(`imageAlt: ${firstProgram.imageAlt ? '✅ Presente' : '❌ Ausente'}`);
          
          if (firstProgram.imageUrl) {
            console.log(`\n🔗 URL de imagen: ${firstProgram.imageUrl.substring(0, 50)}...`);
          }
        }
        
        // Verificar programas destacados
        const featuredPrograms = jsonData.programas.filter(p => p.isFeatured);
        console.log(`\n⭐ Programas destacados: ${featuredPrograms.length}`);
        
        featuredPrograms.forEach((programa, index) => {
          console.log(`\n${index + 1}. ${programa.nombreSector}`);
          console.log(`   Destacado: ${programa.isFeatured ? '✅ Sí' : '❌ No'}`);
          console.log(`   Imagen: ${programa.imageUrl ? '✅ Configurada' : '❌ Sin imagen'}`);
          console.log(`   Alt: ${programa.imageAlt ? '✅ Configurado' : '❌ Sin alt text'}`);
        });
        
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
  testApiResponse();
}

module.exports = { testApiResponse };
