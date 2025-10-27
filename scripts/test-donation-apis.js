const fetch = require('node-fetch');

async function testDonationAPIs() {
  try {
    console.log('🧪 Probando APIs de donaciones...\n');

    const donationData = {
      donorName: 'Test User',
      donorEmail: 'test@example.com',
      donorAddress: 'Test Address',
      donorPhone: '12345678',
      amount: 100,
      donationType: 'SPECIFIC_PROJECT',
      message: 'Test donation',
      donationProjectId: null
    };

    // 1. Probar API pública (debería funcionar)
    console.log('1. Probando API pública /api/public/donations...');
    try {
      const publicResponse = await fetch('http://localhost:3000/api/public/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData)
      });

      if (publicResponse.ok) {
        const result = await publicResponse.json();
        console.log('   ✅ API pública funciona correctamente');
        console.log(`   📊 Donación creada: ${result.donation.id}`);
      } else {
        const error = await publicResponse.json();
        console.log('   ❌ Error en API pública:', error.error);
      }
    } catch (error) {
      console.log('   ❌ Error de conexión:', error.message);
    }

    // 2. Probar API principal sin autenticación (debería fallar)
    console.log('\n2. Probando API principal /api/donations sin autenticación...');
    try {
      const mainResponse = await fetch('http://localhost:3000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData)
      });

      if (mainResponse.ok) {
        console.log('   ⚠️ API principal permite crear donaciones sin autenticación (PROBLEMA DE SEGURIDAD)');
      } else {
        const error = await mainResponse.json();
        console.log('   ✅ API principal correctamente protegida:', error.error);
      }
    } catch (error) {
      console.log('   ❌ Error de conexión:', error.message);
    }

    console.log('\n🎉 Prueba completada!');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testDonationAPIs();


