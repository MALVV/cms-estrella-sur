// Script para verificar el estado de la sesión
console.log('🔍 Verificando estado de la sesión...');

// Verificar si hay variables de entorno necesarias
console.log('\n📋 Variables de entorno:');
console.log(`   - NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`   - NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'No configurada'}`);
console.log(`   - DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada'}`);

// Verificar si el servidor está corriendo
console.log('\n🌐 Verificando servidor...');
console.log('   - Asegúrate de que el servidor de desarrollo esté corriendo');
console.log('   - Ejecuta: npm run dev o yarn dev');
console.log('   - Verifica que no haya errores en la consola del servidor');

// Instrucciones para debugging
console.log('\n🔧 Pasos para debugging:');
console.log('   1. Abre las herramientas de desarrollador del navegador');
console.log('   2. Ve a la pestaña "Network"');
console.log('   3. Intenta cargar la página de usuarios');
console.log('   4. Busca la petición a /api/users');
console.log('   5. Verifica el status code y la respuesta');

console.log('\n🔐 Verificar autenticación:');
console.log('   1. Ve a /sign-in');
console.log('   2. Inicia sesión con admin@estrellasur.com / admin123');
console.log('   3. Verifica que seas redirigido al dashboard');
console.log('   4. Intenta acceder a /dashboard/users');

console.log('\n📊 Verificar datos:');
console.log('   - Ejecuta: node scripts/test-users-api.js');
console.log('   - Ejecuta: node scripts/test-authentication.js');
console.log('   - Ejecuta: node scripts/assign-asesor-role.js list');

console.log('\n✅ Script de verificación completado');
