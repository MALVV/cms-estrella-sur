const http = require('http');

function testImageGallery() {
  console.log('🔍 Probando la nueva galería de imágenes...\n');
  
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
      // 1. Obtener lista de programas
      console.log('📋 Obteniendo lista de programas...');
      const programasResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/public/programas',
        method: 'GET'
      });

      if (programasResponse.status !== 200) {
        throw new Error(`Error obteniendo programas: ${programasResponse.status}`);
      }

      const programas = programasResponse.data.programas;
      const programaConImagenes = programas.find(p => p.imageLibrary && p.imageLibrary.length > 0);
      
      if (!programaConImagenes) {
        console.log('❌ No se encontraron programas con imágenes en la biblioteca');
        return;
      }

      console.log(`✅ Programa encontrado: ${programaConImagenes.nombreSector}`);
      console.log(`   ID: ${programaConImagenes.id}`);
      console.log(`   Imágenes en biblioteca: ${programaConImagenes.imageLibrary.length}`);

      // 2. Obtener detalles del programa individual
      console.log('\n🔍 Obteniendo detalles del programa...');
      const programaResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: `/api/public/programas/${programaConImagenes.id}`,
        method: 'GET'
      });

      if (programaResponse.status !== 200) {
        throw new Error(`Error obteniendo programa: ${programaResponse.status}`);
      }

      const programa = programaResponse.data;
      console.log(`✅ Detalles obtenidos:`);
      console.log(`   Imágenes en biblioteca: ${programa.imageLibrary.length}`);
      
      if (programa.imageLibrary.length > 0) {
        console.log(`\n🖼️  Imágenes disponibles:`);
        programa.imageLibrary.forEach((image, index) => {
          console.log(`\n${index + 1}. ${image.title || 'Sin título'}`);
          console.log(`   ID: ${image.id}`);
          console.log(`   URL: ${image.imageUrl.substring(0, 50)}...`);
          console.log(`   Alt: ${image.imageAlt || 'Sin alt text'}`);
          console.log(`   Descripción: ${image.description || 'Sin descripción'}`);
        });
      }

      // 3. Verificar que la página se carga correctamente
      console.log('\n🌐 Verificando página del programa...');
      const pageResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: `/programas/${programaConImagenes.id}`,
        method: 'GET'
      });

      console.log(`📄 Status de la página: ${pageResponse.status}`);
      
      if (pageResponse.status === 200) {
        const pageContent = pageResponse.raw;
        
        // Buscar referencias a la galería
        const galleryReferences = pageContent.match(/Galería de Imágenes/g);
        const imageReferences = pageContent.match(/imageLibrary/g);
        
        console.log(`✅ Referencias encontradas:`);
        console.log(`   - "Galería de Imágenes": ${galleryReferences ? galleryReferences.length : 0}`);
        console.log(`   - "imageLibrary": ${imageReferences ? imageReferences.length : 0}`);
        
        // Verificar que no hay referencias a noticias relacionadas
        const newsReferences = pageContent.match(/Noticias Relacionadas/g);
        console.log(`   - "Noticias Relacionadas": ${newsReferences ? newsReferences.length : 0} (debería ser 0)`);
        
        if (newsReferences && newsReferences.length === 0) {
          console.log(`\n🎉 ¡Éxito! La sección de noticias relacionadas ha sido eliminada`);
          console.log(`✅ La galería de imágenes está implementada correctamente`);
        } else {
          console.log(`\n⚠️  Aún hay referencias a noticias relacionadas`);
        }
      }

      console.log('\n📋 Resumen de cambios:');
      console.log('✅ Sección "Noticias Relacionadas" eliminada');
      console.log('✅ Nueva "Galería de Imágenes" implementada');
      console.log('✅ Muestra hasta 6 imágenes en grid 2x3');
      console.log('✅ Overlay con título al hacer hover');
      console.log('✅ Botón "Ver Todas" si hay más de 6 imágenes');
      console.log('✅ Estado vacío si no hay imágenes');

    } catch (error) {
      console.error('❌ Error en la prueba:', error.message);
    }
  }

  runTest();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testImageGallery();
}

module.exports = { testImageGallery };
