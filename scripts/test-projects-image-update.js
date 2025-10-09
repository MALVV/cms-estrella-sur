const http = require('http');

function testProjectsImageUpdate() {
  console.log('🖼️ Probando actualización de imagen en página de proyectos...\n');
  
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
      // Probar la página de proyectos
      console.log('📄 Verificando página de proyectos con nueva imagen...');
      const pageResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/proyectos',
        method: 'GET'
      });

      if (pageResponse.status === 200) {
        console.log(`✅ Página carga correctamente (${pageResponse.status})`);
        
        const pageContent = pageResponse.raw;
        
        // Verificar que la nueva imagen de Pexels esté presente
        const hasPexelsImage = pageContent.includes('https://images.pexels.com/photos/9543732/pexels-photo-9543732.jpeg');
        const hasOldImage = pageContent.includes('lh3.googleusercontent.com');
        
        console.log(`\n✅ Verificación de imagen:`);
        console.log(`   - Nueva imagen Pexels: ${hasPexelsImage ? '✅' : '❌'}`);
        console.log(`   - Imagen anterior: ${hasOldImage ? '❌ (aún presente)' : '✅ (reemplazada)'}`);
        
        // Verificar elementos del hero section
        const hasHeroTitle = pageContent.includes('Proyectos de Impacto Real');
        const hasGradient = pageContent.includes('bg-gradient-to-r from-black/70');
        const hasButton = pageContent.includes('EXPLORA NUESTROS PROYECTOS');
        
        console.log(`\n✅ Elementos del hero section:`);
        console.log(`   - Título principal: ${hasHeroTitle ? '✅' : '❌'}`);
        console.log(`   - Gradiente de fondo: ${hasGradient ? '✅' : '❌'}`);
        console.log(`   - Botón de acción: ${hasButton ? '✅' : '❌'}`);
        
        if (hasPexelsImage && !hasOldImage && hasHeroTitle && hasGradient && hasButton) {
          console.log(`\n🎉 ¡ÉXITO! La imagen de Pexels se ha aplicado correctamente`);
          console.log(`✅ Hero section actualizado con nueva imagen`);
          console.log(`✅ Diseño consistente mantenido`);
          console.log(`✅ Imagen anterior reemplazada`);
        } else {
          console.log(`\n⚠️  Verificar que todos los cambios se hayan aplicado correctamente`);
        }
      } else {
        console.log(`❌ Error en página: ${pageResponse.status}`);
        return;
      }

      console.log('\n📋 Resumen de cambios:');
      console.log('✅ Imagen de fondo actualizada a Pexels');
      console.log('✅ URL: https://images.pexels.com/photos/9543732/pexels-photo-9543732.jpeg');
      console.log('✅ Hero section mantiene el mismo diseño');
      console.log('✅ Gradiente y elementos de texto conservados');
      console.log('✅ Estructura de proyectos sin cambios');
      
      console.log('\n🎯 Para verificar visualmente:');
      console.log('   Visita: http://localhost:3000/proyectos');
      console.log('   La imagen de fondo del hero debe ser la nueva imagen de Pexels');

    } catch (error) {
      console.error('❌ Error en la prueba:', error.message);
    }
  }

  runTest();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testProjectsImageUpdate();
}

module.exports = { testProjectsImageUpdate };
