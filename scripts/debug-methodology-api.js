// Usar fetch nativo de Node.js 18+

async function testMethodologyAPI() {
  try {
    console.log('🔍 Probando API de metodologías...');
    
    // Primero probar GET
    console.log('\n📋 Probando GET /api/methodologies...');
    const getResponse = await fetch('http://localhost:3000/api/methodologies');
    
    console.log('Status:', getResponse.status);
    console.log('Headers:', Object.fromEntries(getResponse.headers.entries()));
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('\n📊 Datos recibidos:');
      console.log('Total metodologías:', data.methodologies?.length || 0);
      console.log('Paginación:', data.pagination);
    } else {
      const errorText = await getResponse.text();
      console.log('❌ Error GET:', errorText);
    }

    // Ahora probar POST con datos de prueba
    console.log('\n📝 Probando POST /api/methodologies...');
    const testData = {
      title: 'Metodología de Prueba',
      description: 'Descripción de prueba para la metodología',
      shortDescription: 'Descripción corta',
      ageGroup: '6-12 años',
      category: 'EDUCACION',
      targetAudience: 'Estudiantes de primaria',
      objectives: 'Objetivos de prueba',
      implementation: 'Implementación de prueba',
      results: 'Resultados esperados'
    };

    const postResponse = await fetch('http://localhost:3000/api/methodologies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Sin token de autorización para ver qué pasa
      },
      body: JSON.stringify(testData)
    });

    console.log('Status:', postResponse.status);
    console.log('Headers:', Object.fromEntries(postResponse.headers.entries()));
    
    const responseText = await postResponse.text();
    console.log('\n📄 Respuesta completa:', responseText);
    
    // Intentar parsear como JSON
    try {
      const jsonData = JSON.parse(responseText);
      console.log('\n✅ JSON válido:', jsonData);
    } catch (jsonError) {
      console.log('\n❌ Error al parsear JSON:', jsonError.message);
      console.log('Primeros 200 caracteres de la respuesta:', responseText.substring(0, 200));
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testMethodologyAPI();
