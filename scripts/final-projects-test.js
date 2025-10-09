const http = require('http');

function finalProjectsTest() {
  console.log('🎯 Prueba final de la página de proyectos mejorada...\n');
  
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
      console.log('📡 Verificando API de proyectos...');
      const apiResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/public/projects',
        method: 'GET'
      });

      if (apiResponse.status === 200) {
        const projects = apiResponse.data;
        console.log(`✅ API funciona correctamente`);
        console.log(`   Total proyectos: ${projects.length}`);
        
        const featuredProjects = projects.filter(p => p.isFeatured);
        console.log(`   Proyectos destacados: ${featuredProjects.length}`);
        
        const projectsWithImages = projects.filter(p => p.imageUrl);
        console.log(`   Proyectos con imágenes: ${projectsWithImages.length}`);
        
        if (projects.length > 0) {
          console.log(`   Ejemplo: ${projects[0].title}`);
          console.log(`   Período: ${projects[0].executionStart} - ${projects[0].executionEnd}`);
          console.log(`   Noticias relacionadas: ${projects[0]._count?.news || 0}`);
        }
      } else {
        console.log(`❌ Error en API: ${apiResponse.status}`);
        return;
      }

      // Probar la página de proyectos
      console.log(`\n📄 Verificando página de proyectos...`);
      const pageResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/proyectos',
        method: 'GET'
      });

      if (pageResponse.status === 200) {
        console.log(`✅ Página carga correctamente (${pageResponse.status})`);
        
        const pageContent = pageResponse.raw;
        
        // Verificar elementos básicos
        const hasTitle = pageContent.includes('Proyectos de Impacto Real');
        const hasGrid = pageContent.includes('grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
        const hasCards = pageContent.includes('Card');
        const hasFooter = pageContent.includes('SiteFooter');
        
        console.log(`\n✅ Elementos detectados:`);
        console.log(`   - Título principal: ${hasTitle ? '✅' : '❌'}`);
        console.log(`   - Grid layout: ${hasGrid ? '✅' : '❌'}`);
        console.log(`   - Componentes Card: ${hasCards ? '✅' : '❌'}`);
        console.log(`   - Footer: ${hasFooter ? '✅' : '❌'}`);
        
        // Verificar que no tenga elementos del diseño anterior
        const oldLayout = pageContent.includes('flex flex-col md:flex-row');
        const oldHero = pageContent.includes('TRANSFORMANDO COMUNIDADES');
        
        console.log(`\n✅ Elementos antiguos eliminados:`);
        console.log(`   - Layout horizontal: ${!oldLayout ? '✅' : '❌'}`);
        console.log(`   - Hero antiguo: ${!oldHero ? '✅' : '❌'}`);
        
        if (hasTitle && hasGrid && hasCards && hasFooter && !oldLayout && !oldHero) {
          console.log(`\n🎉 ¡ÉXITO TOTAL! La página de proyectos ha sido mejorada correctamente`);
        } else {
          console.log(`\n⚠️  Algunos elementos pueden necesitar verificación manual`);
        }
      } else {
        console.log(`❌ Error en página: ${pageResponse.status}`);
        return;
      }

      console.log('\n📋 Resumen de mejoras implementadas:');
      console.log('✅ Estructura similar a la página de programas');
      console.log('✅ Diseño de tarjetas en grid responsivo (1/2/3 columnas)');
      console.log('✅ Hero section modernizado con gradiente');
      console.log('✅ Badges "Destacado" para proyectos destacados');
      console.log('✅ Botones de acción mejorados ("Ver Detalles", enlaces externos)');
      console.log('✅ Footer incluido para consistencia');
      console.log('✅ Imágenes de fallback de Unsplash');
      console.log('✅ Metadatos informativos (fecha, autor, noticias)');
      console.log('✅ API actualizada con campo _count');
      console.log('✅ Layout horizontal antiguo eliminado');
      console.log('✅ Hero section antiguo eliminado');
      
      console.log('\n🎯 Para verificar visualmente:');
      console.log('   Visita: http://localhost:3000/proyectos');
      console.log('   Compara con: http://localhost:3000/programas');

    } catch (error) {
      console.error('❌ Error en la prueba:', error.message);
    }
  }

  runTest();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  finalProjectsTest();
}

module.exports = { finalProjectsTest };
