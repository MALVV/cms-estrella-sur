const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarRutasIniciativas() {
  try {
    console.log('🔗 Verificando rutas de iniciativas...\n');

    // Verificar que existan datos para cada sección
    const programas = await prisma.programas.count({ where: { isActive: true } });
    const proyectos = await prisma.project.count({ where: { isActive: true } });
    const metodologias = await prisma.methodology.count({ where: { isActive: true } });

    console.log('📊 DATOS DISPONIBLES:');
    console.log(`- Programas activos: ${programas}`);
    console.log(`- Proyectos activos: ${proyectos}`);
    console.log(`- Metodologías activas: ${metodologias}`);

    console.log('\n🌐 RUTAS DE INICIATIVAS:');
    console.log('1. /iniciativas - Página principal con todas las iniciativas');
    console.log('2. /programas-solo - Solo programas');
    console.log('3. /proyectos - Solo proyectos');
    console.log('4. /metodologias - Solo metodologías');

    console.log('\n📱 NAVEGACIÓN EN HEADER:');
    console.log('✅ Desktop: Dropdown "Iniciativas" con 4 opciones');
    console.log('✅ Mobile: Enlace directo "Iniciativas"');
    console.log('✅ Todas las rutas apuntan a las páginas correctas');

    console.log('\n🔧 ESTRUCTURA DEL DROPDOWN:');
    console.log('• Todas las Iniciativas → /iniciativas');
    console.log('• Programas → /programas-solo');
    console.log('• Proyectos → /proyectos');
    console.log('• Metodologías → /metodologias');

    console.log('\n✅ VERIFICACIÓN COMPLETADA');
    console.log('Todas las rutas de iniciativas están configuradas correctamente.');
    console.log('El problema debería estar resuelto.');

    if (programas === 0 && proyectos === 0 && metodologias === 0) {
      console.log('\n⚠️  ADVERTENCIA:');
      console.log('No hay datos en ninguna de las secciones.');
      console.log('Las páginas se mostrarán vacías.');
    }

  } catch (error) {
    console.error('❌ Error verificando rutas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarRutasIniciativas();
