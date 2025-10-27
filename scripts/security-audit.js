const fetch = require('node-fetch');

async function testAPISecurity() {
  try {
    console.log('🔒 Auditoría de seguridad de APIs...\n');

    const testData = {
      title: 'Test Security',
      content: 'Testing security breach',
      description: 'Security test'
    };

    const apisToTest = [
      { url: '/api/annual-goals', method: 'POST', data: { year: 2027, targetAmount: 100000 } },
      { url: '/api/annual-goals', method: 'PUT', data: { id: 'test', year: 2027, targetAmount: 100000 } },
      { url: '/api/donation-projects', method: 'POST', data: { title: 'Test', description: 'Test', context: 'Test', objectives: 'Test', accountNumber: '123', recipientName: 'Test' } },
      { url: '/api/donations', method: 'POST', data: { donorName: 'Test', donorEmail: 'test@test.com', donorAddress: 'Test', donorPhone: '123', amount: 100, donationType: 'GENERAL' } },
      { url: '/api/news', method: 'POST', data: testData },
      { url: '/api/projects', method: 'POST', data: testData },
      { url: '/api/events', method: 'POST', data: testData },
      { url: '/api/resources', method: 'POST', data: testData },
      { url: '/api/stories', method: 'POST', data: testData },
      { url: '/api/transparency', method: 'POST', data: testData },
      { url: '/api/video-testimonials', method: 'POST', data: testData },
      { url: '/api/allies', method: 'POST', data: testData },
      { url: '/api/users', method: 'POST', data: { name: 'Test', email: 'test@test.com', password: 'test123' } }
    ];

    let vulnerabilities = 0;
    let protected = 0;

    for (const api of apisToTest) {
      try {
        const response = await fetch(`http://localhost:3000${api.url}`, {
          method: api.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(api.data)
        });

        if (response.ok) {
          console.log(`❌ VULNERABLE: ${api.method} ${api.url} - Permite acceso sin autenticación`);
          vulnerabilities++;
        } else if (response.status === 401) {
          console.log(`✅ PROTEGIDA: ${api.method} ${api.url} - Requiere autenticación`);
          protected++;
        } else {
          console.log(`⚠️  ${api.method} ${api.url} - Status: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ERROR: ${api.method} ${api.url} - ${error.message}`);
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ APIs Protegidas: ${protected}`);
    console.log(`   ❌ Vulnerabilidades: ${vulnerabilities}`);
    
    if (vulnerabilities === 0) {
      console.log(`\n🎉 ¡Todas las APIs están protegidas!`);
    } else {
      console.log(`\n⚠️  Se encontraron ${vulnerabilities} vulnerabilidades de seguridad`);
    }

  } catch (error) {
    console.error('❌ Error en auditoría:', error);
  }
}

testAPISecurity();


