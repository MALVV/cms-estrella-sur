const http = require('http');

function testSpecificProgram() {
  console.log('🔍 Probando programa específico con imagen...\n');
  
  // Usar un ID de programa destacado que sabemos que tiene imagen
  const programId = 'cmgfbz7tu000dfvicz97jebvs'; // Empoderamiento de Mujeres
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/public/programas/${programId}`,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const programa = JSON.parse(data);
        
        console.log(`📊 Programa: ${programa.nombreSector}`);
        console.log(`ID: ${programa.id}`);
        console.log(`Destacado: ${programa.isFeatured ? '✅ Sí' : '❌ No'}`);
        
        console.log('\n🖼️  Campos de imagen:');
        console.log(`imageUrl: ${programa.imageUrl ? '✅ Presente' : '❌ Ausente'}`);
        console.log(`imageAlt: ${programa.imageAlt ? '✅ Presente' : '❌ Ausente'}`);
        
        if (programa.imageUrl) {
          console.log(`\n🔗 URL de imagen: ${programa.imageUrl}`);
          console.log(`📝 Alt text: ${programa.imageAlt}`);
          
          // Verificar si la URL es válida
          const isValidUrl = programa.imageUrl.startsWith('http');
          console.log(`✅ URL válida: ${isValidUrl ? 'Sí' : 'No'}`);
        }
        
        // Verificar campos disponibles
        console.log('\n📋 Todos los campos disponibles:');
        Object.keys(programa).forEach(key => {
          const value = programa[key];
          if (typeof value === 'string' && value.length > 0) {
            console.log(`  ${key}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
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
  testSpecificProgram();
}

module.exports = { testSpecificProgram };
