const fs = require('fs');
const path = require('path');

function verificarNavbarIniciativas() {
  try {
    console.log('🔍 Verificando configuración del navbar para iniciativas...\n');

    const navbarPath = path.join(__dirname, '..', 'src', 'components', 'layout', 'navbar.tsx');
    const navbarContent = fs.readFileSync(navbarPath, 'utf8');

    console.log('📋 ANÁLISIS DEL NAVBAR:');

    // Verificar que existe el dropdown de iniciativas
    if (navbarContent.includes('isProgramasOpen')) {
      console.log('✅ Estado del dropdown encontrado');
    } else {
      console.log('❌ Estado del dropdown NO encontrado');
    }

    // Verificar el botón de iniciativas
    if (navbarContent.includes('Iniciativas')) {
      console.log('✅ Botón "Iniciativas" encontrado');
    } else {
      console.log('❌ Botón "Iniciativas" NO encontrado');
    }

    // Verificar las rutas del dropdown
    const rutas = [
      { texto: '/iniciativas', descripcion: 'Todas las Iniciativas' },
      { texto: '/programas-solo', descripcion: 'Programas' },
      { texto: '/proyectos', descripcion: 'Proyectos' },
      { texto: '/metodologias', descripcion: 'Metodologías' }
    ];

    console.log('\n🔗 VERIFICANDO RUTAS DEL DROPDOWN:');
    rutas.forEach(ruta => {
      if (navbarContent.includes(ruta.texto)) {
        console.log(`✅ ${ruta.descripcion}: ${ruta.texto}`);
      } else {
        console.log(`❌ ${ruta.descripcion}: ${ruta.texto} NO encontrado`);
      }
    });

    // Verificar el menú móvil
    console.log('\n📱 VERIFICANDO MENÚ MÓVIL:');
    if (navbarContent.includes('href="/iniciativas"')) {
      console.log('✅ Enlace móvil a /iniciativas encontrado');
    } else {
      console.log('❌ Enlace móvil a /iniciativas NO encontrado');
    }

    // Buscar posibles problemas
    console.log('\n🐛 POSIBLES PROBLEMAS:');
    
    if (navbarContent.includes('href="/programas"')) {
      console.log('⚠️  Encontrado enlace antiguo a /programas (debería ser /iniciativas)');
    }

    if (navbarContent.includes('createPortal')) {
      console.log('✅ Usando createPortal para el dropdown (correcto)');
    } else {
      console.log('❌ NO usando createPortal (podría causar problemas de z-index)');
    }

    if (navbarContent.includes('z-50') || navbarContent.includes('z-[9999]')) {
      console.log('✅ Z-index configurado para el dropdown');
    } else {
      console.log('❌ Z-index podría estar mal configurado');
    }

    console.log('\n🔧 INSTRUCCIONES PARA PROBAR:');
    console.log('1. Abre el navegador en http://localhost:3000');
    console.log('2. En desktop: Pasa el mouse sobre "Iniciativas"');
    console.log('3. Verifica que aparezca el dropdown con 4 opciones');
    console.log('4. Haz clic en cada opción para verificar que funcione');
    console.log('5. En móvil: Abre el menú hamburguesa y busca "Iniciativas"');
    console.log('6. Haz clic en "Iniciativas" para verificar que funcione');

    console.log('\n💡 SI EL DROPDOWN NO APARECE:');
    console.log('- Verifica que el servidor esté corriendo');
    console.log('- Revisa la consola del navegador para errores JavaScript');
    console.log('- Verifica que no haya conflictos de CSS');
    console.log('- Prueba en modo incógnito para descartar problemas de caché');

  } catch (error) {
    console.error('❌ Error verificando navbar:', error);
  }
}

verificarNavbarIniciativas();
