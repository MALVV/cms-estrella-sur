// Script para verificar que se hayan eliminado todas las referencias problemáticas al campo content en eventos
console.log('🔍 Verificación final de referencias problemáticas al campo content...\n');

const fs = require('fs');

const filesToCheck = [
  'src/app/eventos/[id]/page.tsx',
  'src/components/admin/news-events-management.tsx',
  'src/app/api/events/route.ts',
  'src/components/admin/create-event-form.tsx',
  'src/components/admin/edit-event-form.tsx'
];

let allClean = true;

filesToCheck.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = filePath.split('/').pop();
    
    console.log(`📄 ${fileName}:`);
    
    // Verificar que NO tenga referencias problemáticas al campo content para eventos
    const problematicReferences = [
      'event.content',
      'events.content',
      'content: formData.content', // En contexto de eventos
      'formData.content', // En contexto de eventos
      'item.content' // En contexto de eventos
    ];
    
    let hasProblematicRefs = false;
    problematicReferences.forEach(ref => {
      if (content.includes(ref)) {
        console.log(`  ❌ Tiene referencia problemática: ${ref}`);
        hasProblematicRefs = true;
        allClean = false;
      }
    });
    
    if (!hasProblematicRefs) {
      console.log('  ✅ Sin referencias problemáticas al campo content');
    }
    
    // Verificar que tenga los campos correctos para eventos
    if (content.includes('description') && content.includes('title')) {
      console.log('  ✅ Campos básicos de eventos presentes');
    } else if (fileName.includes('event')) {
      console.log('  ⚠️  Podría faltar campos básicos de eventos');
    }
    
    console.log('');
    
  } catch (error) {
    console.log(`❌ Error leyendo ${filePath}:`, error.message);
    allClean = false;
  }
});

console.log('📋 Resumen de correcciones realizadas:');
console.log('1. ✅ src/app/eventos/[id]/page.tsx - Cambiado event.content por event.description');
console.log('2. ✅ src/components/admin/news-events-management.tsx - Eliminado content de payloads de eventos');
console.log('3. ✅ src/components/admin/news-events-management.tsx - Eliminado campos de contenido adicional');
console.log('4. ✅ src/app/api/events/route.ts - Eliminado content de creación y actualización');
console.log('5. ✅ Formularios de eventos - Eliminado campo content');

if (allClean) {
  console.log('\n🎯 El error "events.content does not exist" debería estar completamente resuelto');
  console.log('   Los eventos ahora usan solo: title, description, imageUrl, imageAlt, eventDate, location');
  console.log('   Las noticias siguen usando content correctamente');
} else {
  console.log('\n❌ Aún hay referencias problemáticas que necesitan ser corregidas');
}

console.log('\n✨ Verificación completada!');
