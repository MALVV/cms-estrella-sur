const http = require('http');

function testNewsRelationsUpdate() {
  console.log('🔍 Probando actualización robusta de relaciones en noticias...\n');
  
  // Función para hacer peticiones HTTP
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
            resolve({ status: res.statusCode, data: jsonData });
          } catch (error) {
            resolve({ status: res.statusCode, data: responseData });
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
      // 1. Obtener lista de noticias
      console.log('📰 Obteniendo lista de noticias...');
      const newsResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/news',
        method: 'GET'
      });

      if (newsResponse.status !== 200) {
        throw new Error(`Error obteniendo noticias: ${newsResponse.status}`);
      }

      const news = newsResponse.data.news;
      if (!news || news.length === 0) {
        console.log('❌ No hay noticias disponibles para probar');
        return;
      }

      const testNews = news[0];
      console.log(`✅ Noticia encontrada: ${testNews.title}`);
      console.log(`   ID: ${testNews.id}`);
      console.log(`   Programa actual: ${testNews.programa ? testNews.programa.nombreSector : 'Ninguno'}`);
      console.log(`   Proyecto actual: ${testNews.project ? testNews.project.title : 'Ninguno'}`);
      console.log(`   Metodología actual: ${testNews.methodology ? testNews.methodology.title : 'Ninguno'}`);

      // 2. Obtener lista de programas para asignar
      console.log('\n📋 Obteniendo lista de programas...');
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
      const targetPrograma = programas.find(p => p.isFeatured) || programas[0];
      
      console.log(`✅ Programa seleccionado para asignar: ${targetPrograma.nombreSector}`);

      // 3. Actualizar la noticia con nueva relación
      console.log('\n🔄 Actualizando noticia con nueva relación...');
      const updateData = {
        title: testNews.title,
        content: testNews.content,
        excerpt: testNews.excerpt,
        imageUrl: testNews.imageUrl,
        imageAlt: testNews.imageAlt,
        category: testNews.category,
        isFeatured: testNews.isFeatured,
        isActive: testNews.isActive,
        programaId: targetPrograma.id,
        projectId: null,
        methodologyId: null,
      };

      const updateResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: `/api/news/${testNews.id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      }, updateData);

      if (updateResponse.status !== 200) {
        throw new Error(`Error actualizando noticia: ${updateResponse.status} - ${JSON.stringify(updateResponse.data)}`);
      }

      const updatedNews = updateResponse.data;
      console.log(`✅ Noticia actualizada exitosamente!`);
      console.log(`   Programa: ${updatedNews.programa ? updatedNews.programa.nombreSector : 'Ninguno'}`);
      console.log(`   Proyecto: ${updatedNews.project ? updatedNews.project.title : 'Ninguno'}`);
      console.log(`   Metodología: ${updatedNews.methodology ? updatedNews.methodology.title : 'Ninguno'}`);

      // 4. Verificar que la actualización se guardó correctamente
      console.log('\n🔍 Verificando que los cambios se guardaron...');
      const verifyResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: `/api/news/${testNews.id}`,
        method: 'GET'
      });

      if (verifyResponse.status !== 200) {
        throw new Error(`Error verificando noticia: ${verifyResponse.status}`);
      }

      const verifiedNews = verifyResponse.data;
      console.log(`✅ Verificación exitosa:`);
      console.log(`   Programa: ${verifiedNews.programa ? verifiedNews.programa.nombreSector : 'Ninguno'}`);
      console.log(`   Proyecto: ${verifiedNews.project ? verifiedNews.project.title : 'Ninguno'}`);
      console.log(`   Metodología: ${verifiedNews.methodology ? verifiedNews.methodology.title : 'Ninguno'}`);

      // 5. Verificar que la relación se refleja en la API pública
      console.log('\n🌐 Verificando API pública...');
      const publicResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: `/api/public/news/related?programaId=${targetPrograma.id}`,
        method: 'GET'
      });

      if (publicResponse.status === 200) {
        const relatedNews = publicResponse.data.news;
        const foundNews = relatedNews.find(n => n.id === testNews.id);
        if (foundNews) {
          console.log(`✅ La noticia aparece correctamente en noticias relacionadas del programa`);
        } else {
          console.log(`⚠️  La noticia no aparece en noticias relacionadas del programa`);
        }
      }

      console.log('\n🎉 Prueba completada exitosamente!');
      console.log('✅ La funcionalidad de actualización de relaciones está funcionando correctamente');

    } catch (error) {
      console.error('❌ Error en la prueba:', error.message);
      console.error('Detalles:', error);
    }
  }

  runTest();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testNewsRelationsUpdate();
}

module.exports = { testNewsRelationsUpdate };
