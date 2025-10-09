const http = require('http');

function testNewsUpdate() {
  console.log('🔍 Probando actualización de relaciones en noticias...\n');
  
  // Primero obtener una noticia existente
  const getOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/news',
    method: 'GET'
  };

  const getReq = http.request(getOptions, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        
        if (jsonData.news && jsonData.news.length > 0) {
          const firstNews = jsonData.news[0];
          console.log(`📰 Noticia encontrada: ${firstNews.title}`);
          console.log(`   ID: ${firstNews.id}`);
          console.log(`   Programa actual: ${firstNews.programa ? firstNews.programa.nombreSector : 'Ninguno'}`);
          console.log(`   Proyecto actual: ${firstNews.project ? firstNews.project.title : 'Ninguno'}`);
          console.log(`   Metodología actual: ${firstNews.methodology ? firstNews.methodology.title : 'Ninguno'}`);
          
          // Simular actualización de relaciones
          console.log(`\n🔄 Simulando actualización de relaciones...`);
          
          const updateData = {
            title: firstNews.title,
            content: firstNews.content,
            excerpt: firstNews.excerpt,
            imageUrl: firstNews.imageUrl,
            imageAlt: firstNews.imageAlt,
            category: firstNews.category,
            isFeatured: firstNews.isFeatured,
            isActive: firstNews.isActive,
            programaId: 'cmgfbz7tu000dfvicz97jebvs', // Empoderamiento de Mujeres
            projectId: null,
            methodologyId: null,
          };
          
          const updateOptions = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/news/${firstNews.id}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              // Nota: En un test real necesitarías un token de autenticación válido
            }
          };

          const updateReq = http.request(updateOptions, (updateRes) => {
            let updateData = '';

            updateRes.on('data', (chunk) => {
              updateData += chunk;
            });

            updateRes.on('end', () => {
              console.log(`📊 Status de actualización: ${updateRes.statusCode}`);
              
              if (updateRes.statusCode === 200) {
                try {
                  const updatedNews = JSON.parse(updateData);
                  console.log(`\n✅ Noticia actualizada exitosamente:`);
                  console.log(`   Programa: ${updatedNews.programa ? updatedNews.programa.nombreSector : 'Ninguno'}`);
                  console.log(`   Proyecto: ${updatedNews.project ? updatedNews.project.title : 'Ninguno'}`);
                  console.log(`   Metodología: ${updatedNews.methodology ? updatedNews.methodology.title : 'Ninguno'}`);
                } catch (error) {
                  console.log(`❌ Error parsing response: ${error.message}`);
                  console.log(`Raw response: ${updateData.substring(0, 200)}...`);
                }
              } else {
                console.log(`❌ Error en actualización: ${updateRes.statusCode}`);
                console.log(`Response: ${updateData}`);
              }
            });
          });

          updateReq.on('error', (error) => {
            console.error('❌ Error en actualización:', error.message);
          });

          updateReq.write(JSON.stringify(updateData));
          updateReq.end();
          
        } else {
          console.log('❌ No se encontraron noticias para probar');
        }
        
      } catch (error) {
        console.error('❌ Error parsing JSON:', error.message);
        console.log('Raw response:', data.substring(0, 200) + '...');
      }
    });
  });

  getReq.on('error', (error) => {
    console.error('❌ Error:', error.message);
  });

  getReq.end();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testNewsUpdate();
}

module.exports = { testNewsUpdate };
