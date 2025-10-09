// Script para debuggear la sesión en el navegador
// Ejecutar en la consola del navegador en la página de administración de noticias

console.log('🔍 Debugging session state...');

// Verificar si NextAuth está disponible
if (typeof window !== 'undefined') {
  // Esperar a que NextAuth se cargue
  setTimeout(() => {
    console.log('📋 NextAuth session debug:');
    
    // Verificar si hay datos de sesión en localStorage/sessionStorage
    console.log('LocalStorage keys:', Object.keys(localStorage));
    console.log('SessionStorage keys:', Object.keys(sessionStorage));
    
    // Buscar tokens de NextAuth
    const nextAuthKeys = Object.keys(localStorage).filter(key => key.includes('nextauth'));
    console.log('NextAuth localStorage keys:', nextAuthKeys);
    
    nextAuthKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value ? JSON.parse(value) : 'null');
      } catch (e) {
        console.log(`${key}:`, localStorage.getItem(key));
      }
    });
    
    // Verificar cookies
    console.log('Cookies:', document.cookie);
    
  }, 1000);
} else {
  console.log('⚠️ Este script debe ejecutarse en el navegador');
}
