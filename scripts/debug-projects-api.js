const http = require('http');

function debugProjectsAPI() {
  console.log('🔍 Debuggeando API de proyectos...\n');
  
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
        console.log('✅ API funciona correctamente');
        console.log('📊 Datos:', JSON.stringify(apiResponse.data, null, 2));
      } else {
        console.log('❌ Error en API');
        console.log('📄 Respuesta:', apiResponse.raw);
      }

      // Probar también la API de programas para comparar
      console.log('\n📡 Probando API de programas para comparar...');
      const programasResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/public/programas',
        method: 'GET'
      });

      console.log(`📊 Status de programas: ${programasResponse.status}`);
      
      if (programasResponse.status === 200) {
        console.log('✅ API de programas funciona');
        console.log(`   Total programas: ${programasResponse.data.programas?.length || programasResponse.data.length}`);
      } else {
        console.log('❌ Error en API de programas');
        console.log('📄 Respuesta:', programasResponse.raw);
      }

    } catch (error) {
      console.error('❌ Error en la prueba:', error.message);
    }
  }

  runTest();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  debugProjectsAPI();
}

module.exports = { debugProjectsAPI };
