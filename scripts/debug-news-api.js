const http = require('http');

function debugNewsAPI() {
  console.log('🔍 Debuggeando API de noticias...\n');
  
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

  async function runDebug() {
    try {
      // Probar diferentes endpoints de noticias
      const endpoints = [
        '/api/news',
        '/api/public/news',
        '/api/admin/news'
      ];

      for (const endpoint of endpoints) {
        console.log(`\n📡 Probando endpoint: ${endpoint}`);
        try {
          const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: endpoint,
            method: 'GET'
          });

          console.log(`   Status: ${response.status}`);
          if (response.status === 200) {
            if (response.data.news) {
              console.log(`   Noticias encontradas: ${response.data.news.length}`);
              if (response.data.news.length > 0) {
                console.log(`   Primera noticia: ${response.data.news[0].title}`);
              }
            } else if (Array.isArray(response.data)) {
              console.log(`   Noticias encontradas: ${response.data.length}`);
              if (response.data.length > 0) {
                console.log(`   Primera noticia: ${response.data[0].title}`);
              }
            } else {
              console.log(`   Respuesta: ${JSON.stringify(response.data).substring(0, 200)}...`);
            }
          } else {
            console.log(`   Error: ${response.raw.substring(0, 200)}...`);
          }
        } catch (error) {
          console.log(`   Error: ${error.message}`);
        }
      }

      // Probar crear una noticia de prueba
      console.log('\n📝 Intentando crear noticia de prueba...');
      const testNewsData = {
        title: 'Noticia de Prueba - Actualización de Relaciones',
        content: 'Esta es una noticia de prueba para verificar la funcionalidad de actualización de relaciones.',
        excerpt: 'Noticia de prueba para testing',
        category: 'NOTICIAS',
        isActive: true,
        isFeatured: false,
        programaId: null,
        projectId: null,
        methodologyId: null,
      };

      const createResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/news',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }, testNewsData);

      console.log(`   Status de creación: ${createResponse.status}`);
      if (createResponse.status === 200 || createResponse.status === 201) {
        console.log(`   ✅ Noticia creada: ${createResponse.data.title}`);
        console.log(`   ID: ${createResponse.data.id}`);
        
        // Ahora probar actualización
        console.log('\n🔄 Probando actualización de relaciones...');
        
        // Obtener un programa para asignar
        const programasResponse = await makeRequest({
          hostname: 'localhost',
          port: 3000,
          path: '/api/public/programas',
          method: 'GET'
        });

        if (programasResponse.status === 200 && programasResponse.data.programas.length > 0) {
          const programa = programasResponse.data.programas[0];
          console.log(`   Asignando programa: ${programa.nombreSector}`);
          
          const updateData = {
            ...testNewsData,
            programaId: programa.id,
          };

          const updateResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: `/api/news/${createResponse.data.id}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            }
          }, updateData);

          console.log(`   Status de actualización: ${updateResponse.status}`);
          if (updateResponse.status === 200) {
            console.log(`   ✅ Noticia actualizada exitosamente!`);
            console.log(`   Programa asignado: ${updateResponse.data.programa ? updateResponse.data.programa.nombreSector : 'Ninguno'}`);
          } else {
            console.log(`   ❌ Error en actualización: ${updateResponse.raw.substring(0, 200)}...`);
          }
        }
      } else {
        console.log(`   ❌ Error creando noticia: ${createResponse.raw.substring(0, 200)}...`);
      }

    } catch (error) {
      console.error('❌ Error en debug:', error.message);
    }
  }

  runDebug();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  debugNewsAPI();
}

module.exports = { debugNewsAPI };
