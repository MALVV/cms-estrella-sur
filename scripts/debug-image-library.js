const http = require('http');

function debugImageLibrary() {
  console.log('🔍 Debuggeando biblioteca de imágenes...\n');
  
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
      console.log(`📊 Total programas: ${programas.length}`);
      
      // Verificar estructura de cada programa
      programas.forEach((programa, index) => {
        console.log(`\n${index + 1}. ${programa.nombreSector}`);
        console.log(`   ID: ${programa.id}`);
        console.log(`   imageLibrary: ${programa.imageLibrary ? programa.imageLibrary.length : 'undefined'}`);
        console.log(`   _count: ${programa._count ? JSON.stringify(programa._count) : 'undefined'}`);
        
        if (programa.imageLibrary && programa.imageLibrary.length > 0) {
          console.log(`   Imágenes:`);
          programa.imageLibrary.forEach((img, imgIndex) => {
            console.log(`     ${imgIndex + 1}. ${img.title || 'Sin título'} (${img.id})`);
          });
        }
      });

      // Buscar programas con imágenes
      const programasConImagenes = programas.filter(p => 
        p.imageLibrary && Array.isArray(p.imageLibrary) && p.imageLibrary.length > 0
      );
      
      console.log(`\n📊 Programas con imágenes: ${programasConImagenes.length}`);
      
      if (programasConImagenes.length > 0) {
        const programaConMasImagenes = programasConImagenes.reduce((max, current) => 
          current.imageLibrary.length > max.imageLibrary.length ? current : max
        );
        
        console.log(`\n🎯 Programa con más imágenes: ${programaConMasImagenes.nombreSector}`);
        console.log(`   Imágenes: ${programaConMasImagenes.imageLibrary.length}`);
        
        // Probar página individual
        console.log(`\n🔍 Probando página individual...`);
        const individualResponse = await makeRequest({
          hostname: 'localhost',
          port: 3000,
          path: `/api/public/programas/${programaConMasImagenes.id}`,
          method: 'GET'
        });

        if (individualResponse.status === 200) {
          const programaIndividual = individualResponse.data;
          console.log(`✅ Página individual funciona`);
          console.log(`   Imágenes en página individual: ${programaIndividual.imageLibrary ? programaIndividual.imageLibrary.length : 'undefined'}`);
          
          if (programaIndividual.imageLibrary && programaIndividual.imageLibrary.length > 0) {
            console.log(`   Primera imagen: ${programaIndividual.imageLibrary[0].title}`);
          }
        } else {
          console.log(`❌ Error en página individual: ${individualResponse.status}`);
        }
      }

    } catch (error) {
      console.error('❌ Error en debug:', error.message);
    }
  }

  runDebug();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  debugImageLibrary();
}

module.exports = { debugImageLibrary };
