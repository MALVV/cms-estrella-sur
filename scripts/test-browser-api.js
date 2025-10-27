// Script para probar la API de usuarios directamente
console.log('🌐 Probando API de usuarios...');

// Función para probar la API
async function testUsersAPI() {
  try {
    console.log('📡 Haciendo petición a /api/users...');
    
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Incluir cookies de sesión
    });

    console.log('📊 Respuesta recibida:');
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Status Text: ${response.statusText}`);
    console.log(`   - Headers:`, Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Datos recibidos:');
      console.log(`   - Total usuarios: ${data.length}`);
      data.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
    } else {
      const errorData = await response.text();
      console.log('❌ Error en la respuesta:');
      console.log(`   - Error: ${errorData}`);
    }

  } catch (error) {
    console.error('❌ Error en la petición:', error);
  }
}

// Función para verificar la sesión
async function checkSession() {
  try {
    console.log('🔐 Verificando sesión...');
    
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      const session = await response.json();
      console.log('✅ Sesión encontrada:');
      console.log(`   - Usuario: ${session.user?.email || 'No encontrado'}`);
      console.log(`   - Nombre: ${session.user?.name || 'No encontrado'}`);
      console.log(`   - Rol: ${session.user?.role || 'No encontrado'}`);
      console.log(`   - ID: ${session.user?.id || 'No encontrado'}`);
    } else {
      console.log('❌ No hay sesión activa');
    }

  } catch (error) {
    console.error('❌ Error verificando sesión:', error);
  }
}

// Ejecutar pruebas
console.log('🚀 Iniciando pruebas...');
console.log('   - Asegúrate de estar en el navegador');
console.log('   - Abre las herramientas de desarrollador');
console.log('   - Ejecuta este script en la consola');
console.log('   - O copia y pega las funciones individualmente');

// Exportar funciones para uso manual
window.testUsersAPI = testUsersAPI;
window.checkSession = checkSession;

console.log('\n📋 Funciones disponibles:');
console.log('   - testUsersAPI() - Probar API de usuarios');
console.log('   - checkSession() - Verificar sesión actual');
console.log('\n💡 Ejemplo de uso:');
console.log('   checkSession().then(() => testUsersAPI());');
