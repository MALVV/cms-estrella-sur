// Script para probar las APIs públicas
const fetch = require('node-fetch');

async function probarAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Probando APIs públicas...\n');

    // Probar API de metodologías
    console.log('📚 Probando /api/public/methodologies...');
    try {
      const methodologiesResponse = await fetch(`${baseUrl}/api/public/methodologies`);
      console.log(`Status: ${methodologiesResponse.status}`);
      
      if (methodologiesResponse.ok) {
        const methodologiesData = await methodologiesResponse.json();
        console.log(`✅ Metodologías encontradas: ${methodologiesData.length}`);
        methodologiesData.forEach(m => {
          console.log(`  • "${m.title}" (${m.category})`);
        });
      } else {
        console.log('❌ Error en API de metodologías');
      }
    } catch (error) {
      console.log('❌ Error conectando a API de metodologías:', error.message);
    }

    // Probar API de proyectos
    console.log('\n🚀 Probando /api/public/projects...');
    try {
      const projectsResponse = await fetch(`${baseUrl}/api/public/projects`);
      console.log(`Status: ${projectsResponse.status}`);
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        console.log(`✅ Proyectos encontrados: ${projectsData.length}`);
        projectsData.forEach(p => {
          console.log(`  • "${p.title}"`);
        });
      } else {
        console.log('❌ Error en API de proyectos');
      }
    } catch (error) {
      console.log('❌ Error conectando a API de proyectos:', error.message);
    }

    // Probar API de programas
    console.log('\n📋 Probando /api/public/programas...');
    try {
      const programasResponse = await fetch(`${baseUrl}/api/public/programas`);
      console.log(`Status: ${programasResponse.status}`);
      
      if (programasResponse.ok) {
        const programasData = await programasResponse.json();
        console.log(`✅ Programas encontrados: ${programasData.programas?.length || programasData.length}`);
        const programas = programasData.programas || programasData;
        programas.forEach(p => {
          console.log(`  • "${p.nombreSector}"`);
        });
      } else {
        console.log('❌ Error en API de programas');
      }
    } catch (error) {
      console.log('❌ Error conectando a API de programas:', error.message);
    }

    console.log('\n🎯 DIAGNÓSTICO:');
    console.log('Si las APIs están funcionando pero las páginas no muestran datos:');
    console.log('1. Verificar la consola del navegador para errores JavaScript');
    console.log('2. Verificar que el servidor de desarrollo esté corriendo');
    console.log('3. Verificar que no haya errores de CORS');
    console.log('4. Verificar que las páginas estén usando las URLs correctas');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

probarAPIs();
