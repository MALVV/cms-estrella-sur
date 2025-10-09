const http = require('http');

function testProgramsData() {
  console.log('🔍 Verificando datos de programas en el frontend...\n');
  
  // Primero verificar la API
  const apiOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/public/programas',
    method: 'GET'
  };

  const apiReq = http.request(apiOptions, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        
        console.log(`📊 API Response:`);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Programas: ${jsonData.programas.length}`);
        
        // Verificar programas destacados con imágenes
        const featuredWithImages = jsonData.programas.filter(p => 
          p.isFeatured && p.imageUrl && p.imageUrl.trim() !== ''
        );
        
        console.log(`\n⭐ Programas destacados con imágenes: ${featuredWithImages.length}`);
        featuredWithImages.forEach((programa, index) => {
          console.log(`\n${index + 1}. ${programa.nombreSector}`);
          console.log(`   ID: ${programa.id}`);
          console.log(`   Imagen: ${programa.imageUrl.substring(0, 50)}...`);
          console.log(`   Alt: ${programa.imageAlt}`);
        });
        
        // Ahora verificar si la página está usando estos datos
        console.log(`\n🌐 Verificando página de programas...`);
        
        const pageOptions = {
          hostname: 'localhost',
          port: 3000,
          path: '/programas',
          method: 'GET'
        };

        const pageReq = http.request(pageOptions, (pageRes) => {
          let pageData = '';

          pageRes.on('data', (chunk) => {
            pageData += chunk;
          });

          pageRes.on('end', () => {
            console.log(`📄 Página Status: ${pageRes.statusCode}`);
            
            // Buscar si los IDs de los programas están en el HTML
            featuredWithImages.forEach(programa => {
              const idInHtml = pageData.includes(programa.id);
              const nameInHtml = pageData.includes(programa.nombreSector);
              console.log(`\n🔍 ${programa.nombreSector}:`);
              console.log(`   ID en HTML: ${idInHtml ? '✅ Sí' : '❌ No'}`);
              console.log(`   Nombre en HTML: ${nameInHtml ? '✅ Sí' : '❌ No'}`);
            });
            
            // Buscar si hay errores de JavaScript
            const jsErrors = pageData.match(/console\.error|Error:|TypeError|ReferenceError/g);
            if (jsErrors) {
              console.log(`\n❌ Posibles errores JS: ${jsErrors.length}`);
            }
            
            // Verificar si hay datos JSON embebidos
            const jsonMatches = pageData.match(/\{[^}]*"programas"[^}]*\}/g);
            if (jsonMatches) {
              console.log(`\n📊 Datos JSON encontrados: ${jsonMatches.length}`);
            }
            
          });
        });

        pageReq.on('error', (error) => {
          console.error('❌ Error en página:', error.message);
        });

        pageReq.end();
        
      } catch (error) {
        console.error('❌ Error parsing API response:', error.message);
      }
    });
  });

  apiReq.on('error', (error) => {
    console.error('❌ Error en API:', error.message);
  });

  apiReq.end();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testProgramsData();
}

module.exports = { testProgramsData };
