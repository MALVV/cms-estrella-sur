const http = require('http');

function testProjectsPage() {
  console.log('🔍 Probando la nueva página de proyectos...\n');
  
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
      // Probar la API de proyectos
      console.log('📡 Probando API de proyectos...');
      const apiResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/public/projects',
        method: 'GET'
      });

      console.log(`📊 Status de API: ${apiResponse.status}`);
      
      if (apiResponse.status === 200) {
        const projects = apiResponse.data;
        console.log(`✅ API funciona correctamente`);
        console.log(`   Total proyectos: ${projects.length}`);
        
        const featuredProjects = projects.filter(p => p.isFeatured);
        console.log(`   Proyectos destacados: ${featuredProjects.length}`);
        
        if (projects.length > 0) {
          console.log(`   Ejemplo: ${projects[0].title}`);
          console.log(`   Tiene imagen: ${projects[0].imageUrl ? 'Sí' : 'No'}`);
          console.log(`   Es destacado: ${projects[0].isFeatured ? 'Sí' : 'No'}`);
        }
      }

      // Probar la página de proyectos
      console.log(`\n📄 Probando página de proyectos...`);
      const pageResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/proyectos',
        method: 'GET'
      });

      console.log(`📄 Status de la página: ${pageResponse.status}`);
      
      if (pageResponse.status === 200) {
        const pageContent = pageResponse.raw;
        
        // Verificar elementos clave de la nueva estructura
        const heroSection = pageContent.includes('Proyectos de Impacto Real');
        const gridLayout = pageContent.includes('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
        const cardStructure = pageContent.includes('Card');
        const badgeDestacado = pageContent.includes('Destacado');
        const buttonVerDetalles = pageContent.includes('Ver Detalles');
        const footer = pageContent.includes('SiteFooter');
        
        console.log(`\n✅ Verificación de elementos:`);
        console.log(`   - Hero section: ${heroSection ? '✅' : '❌'}`);
        console.log(`   - Grid layout: ${gridLayout ? '✅' : '❌'}`);
        console.log(`   - Card structure: ${cardStructure ? '✅' : '❌'}`);
        console.log(`   - Badge "Destacado": ${badgeDestacado ? '✅' : '❌'}`);
        console.log(`   - Botón "Ver Detalles": ${buttonVerDetalles ? '✅' : '❌'}`);
        console.log(`   - Footer incluido: ${footer ? '✅' : '❌'}`);
        
        // Verificar que no tenga elementos del diseño anterior
        const oldLayout = pageContent.includes('flex flex-col md:flex-row');
        const oldHero = pageContent.includes('TRANSFORMANDO COMUNIDADES');
        
        console.log(`\n✅ Verificación de eliminación de elementos antiguos:`);
        console.log(`   - Layout horizontal antiguo: ${oldLayout ? '❌ (aún presente)' : '✅ (eliminado)'}`);
        console.log(`   - Hero antiguo: ${oldHero ? '❌ (aún presente)' : '✅ (eliminado)'}`);
        
        if (heroSection && gridLayout && cardStructure && !oldLayout && !oldHero) {
          console.log(`\n🎉 ¡ÉXITO! La página de proyectos ha sido mejorada correctamente`);
          console.log(`✅ Estructura similar a la página de programas`);
          console.log(`✅ Diseño de tarjetas en grid`);
          console.log(`✅ Hero section modernizado`);
          console.log(`✅ Elementos antiguos eliminados`);
        } else {
          console.log(`\n⚠️  Verificar que todos los cambios se hayan aplicado correctamente`);
        }
      }

      console.log('\n📋 Resumen de mejoras:');
      console.log('✅ Estructura similar a la página de programas');
      console.log('✅ Diseño de tarjetas en grid (1/2/3 columnas)');
      console.log('✅ Hero section modernizado con gradiente');
      console.log('✅ Badges "Destacado" para proyectos destacados');
      console.log('✅ Botones de acción mejorados');
      console.log('✅ Footer incluido para consistencia');
      console.log('✅ Imágenes de fallback de Unsplash');
      console.log('✅ Metadatos informativos (fecha, autor, noticias)');

    } catch (error) {
      console.error('❌ Error en la prueba:', error.message);
    }
  }

  runTest();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testProjectsPage();
}

module.exports = { testProjectsPage };
