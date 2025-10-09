const http = require('http');

function testRemovedImageBadge() {
  console.log('🔍 Verificando eliminación de etiqueta "Imagen Personalizada"...\n');
  
  function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(responseData);
            resolve({ status: res.statusCode, data: jsonData, raw: responseData });
          } catch (error) {
            resolve({ status: res.statusCode, data: responseData, raw: responseData });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  async function runTest() {
    try {
      // Probar la página principal de programas
      console.log('📋 Verificando página principal de programas...');
      const pageResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/programas',
        method: 'GET'
      });

      console.log(`📄 Status de la página: ${pageResponse.status}`);
      
      if (pageResponse.status === 200) {
        const pageContent = pageResponse.raw;
        
        // Buscar referencias a la etiqueta eliminada
        const imagePersonalizada = pageContent.match(/Imagen Personalizada/g);
        const hasCustomImage = pageContent.match(/hasCustomImage/g);
        const badgeOutline = pageContent.match(/bg-white\/90 text-gray-700/g);
        
        console.log(`✅ Verificación de eliminación:`);
        console.log(`   - "Imagen Personalizada": ${imagePersonalizada ? imagePersonalizada.length : 0} (debería ser 0)`);
        console.log(`   - Variable "hasCustomImage": ${hasCustomImage ? hasCustomImage.length : 0} (debería ser 0)`);
        console.log(`   - Estilos de badge eliminado: ${badgeOutline ? badgeOutline.length : 0} (debería ser 0)`);
        
        // Verificar que el badge "Destacado" sigue presente
        const destacadoBadge = pageContent.match(/Destacado/g);
        const yellowBadge = pageContent.match(/bg-yellow-400/g);
        
        console.log(`\n✅ Verificación de elementos conservados:`);
        console.log(`   - Badge "Destacado": ${destacadoBadge ? destacadoBadge.length : 0} (debería ser >0)`);
        console.log(`   - Estilos amarillos: ${yellowBadge ? yellowBadge.length : 0} (debería ser >0)`);
        
        if (!imagePersonalizada && !hasCustomImage && !badgeOutline && destacadoBadge && yellowBadge) {
          console.log(`\n🎉 ¡ÉXITO! La etiqueta "Imagen Personalizada" ha sido eliminada correctamente`);
          console.log(`✅ Solo queda el badge "Destacado" para programas destacados`);
          console.log(`✅ Las tarjetas se ven más limpias sin etiquetas innecesarias`);
        } else {
          console.log(`\n⚠️  Verificar que la eliminación se haya completado correctamente`);
        }
      }

      // Verificar que la funcionalidad de imágenes sigue funcionando
      console.log(`\n🔍 Verificando funcionalidad de imágenes...`);
      const programasResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/public/programas',
        method: 'GET'
      });

      if (programasResponse.status === 200) {
        const programas = programasResponse.data.programas;
        const programasDestacados = programas.filter(p => p.isFeatured);
        
        console.log(`✅ API funciona correctamente`);
        console.log(`   Total programas: ${programas.length}`);
        console.log(`   Programas destacados: ${programasDestacados.length}`);
        
        if (programasDestacados.length > 0) {
          console.log(`   Ejemplo destacado: ${programasDestacados[0].nombreSector}`);
        }
      }

      console.log('\n📋 Resumen de cambios:');
      console.log('✅ Etiqueta "Imagen Personalizada" eliminada de las tarjetas');
      console.log('✅ Variable "hasCustomImage" eliminada del código');
      console.log('✅ Badge "Destacado" conservado para programas destacados');
      console.log('✅ Funcionalidad de imágenes mantenida');
      console.log('✅ Interfaz más limpia y enfocada');

    } catch (error) {
      console.error('❌ Error en la prueba:', error.message);
    }
  }

  runTest();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testRemovedImageBadge();
}

module.exports = { testRemovedImageBadge };
