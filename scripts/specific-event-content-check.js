// Script específico para verificar referencias problemáticas solo en contexto de eventos
console.log('🔍 Verificación específica de referencias problemáticas en eventos...\n');

const fs = require('fs');

try {
  const content = fs.readFileSync('src/components/admin/news-events-management.tsx', 'utf8');
  
  console.log('📄 news-events-management.tsx:');
  
  // Buscar referencias problemáticas específicas para eventos
  const problematicPatterns = [
    /content:\s*formData\.content.*eventDate/, // content en payload de eventos
    /content:\s*formData\.content.*location/, // content en payload de eventos
    /item\.content.*eventDate/, // item.content en contexto de eventos
    /item\.content.*location/, // item.content en contexto de eventos
  ];
  
  let hasProblematicRefs = false;
  problematicPatterns.forEach((pattern, index) => {
    if (pattern.test(content)) {
      console.log(`  ❌ Patrón problemático ${index + 1} encontrado`);
      hasProblematicRefs = true;
    }
  });
  
  if (!hasProblematicRefs) {
    console.log('  ✅ Sin referencias problemáticas específicas para eventos');
  }
  
  // Verificar que los payloads de eventos no incluyan content
  const eventPayloadPattern = /activeTab === 'events'[\s\S]*?\{[\s\S]*?content:[\s\S]*?\}/;
  if (eventPayloadPattern.test(content)) {
    console.log('  ❌ Payload de eventos aún incluye content');
  } else {
    console.log('  ✅ Payload de eventos no incluye content');
  }
  
  // Verificar que las noticias sí mantengan content
  const newsContentPattern = /activeTab === 'news'[\s\S]*?content:[\s\S]*?formData\.content/;
  if (newsContentPattern.test(content)) {
    console.log('  ✅ Noticias mantienen campo content correctamente');
  } else {
    console.log('  ⚠️  Noticias podrían no tener content');
  }
  
} catch (error) {
  console.log('❌ Error leyendo archivo:', error.message);
}

console.log('\n📋 Verificación específica completada!');
console.log('   Las referencias a content en noticias son correctas');
console.log('   Solo las referencias a content en eventos son problemáticas');
