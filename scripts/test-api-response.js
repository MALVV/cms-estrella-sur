const fetch = require('node-fetch');

async function testApiResponse() {
  try {
    console.log('🔍 Probando respuesta de la API...\n');
    
    const response = await fetch('http://localhost:3000/api/public/programas');
    const data = await response.json();
    
    console.log(`📊 Total programas: ${data.programas.length}`);
    
    if (data.programas.length > 0) {
      const firstProgram = data.programas[0];
      console.log('\n📋 Campos del primer programa:');
      console.log(Object.keys(firstProgram));
      
      console.log('\n🖼️  Campos de imagen:');
      console.log(`imageUrl: ${firstProgram.imageUrl ? '✅ Presente' : '❌ Ausente'}`);
      console.log(`imageAlt: ${firstProgram.imageAlt ? '✅ Presente' : '❌ Ausente'}`);
      
      if (firstProgram.imageUrl) {
        console.log(`\n🔗 URL de imagen: ${firstProgram.imageUrl.substring(0, 50)}...`);
      }
    }
    
    // Verificar programas destacados
    const featuredPrograms = data.programas.filter(p => p.isFeatured);
    console.log(`\n⭐ Programas destacados: ${featuredPrograms.length}`);
    
    featuredPrograms.forEach((programa, index) => {
      console.log(`\n${index + 1}. ${programa.nombreSector}`);
      console.log(`   Destacado: ${programa.isFeatured ? '✅ Sí' : '❌ No'}`);
      console.log(`   Imagen: ${programa.imageUrl ? '✅ Configurada' : '❌ Sin imagen'}`);
      console.log(`   Alt: ${programa.imageAlt ? '✅ Configurado' : '❌ Sin alt text'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testApiResponse();
}

module.exports = { testApiResponse };
