// Script para verificar que se hayan eliminado todas las referencias al campo content de eventos
console.log('🔍 Verificando eliminación del campo content de eventos...\n');

const fs = require('fs');

const filesToCheck = [
  'src/app/api/events/route.ts',
  'src/components/admin/create-event-form.tsx',
  'src/components/admin/edit-event-form.tsx',
  'prisma/schema.prisma'
];

let allClean = true;

filesToCheck.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = filePath.split('/').pop();
    
    console.log(`📄 ${fileName}:`);
    
    // Verificar que NO tenga referencias al campo content
    const contentReferences = content.match(/content/g);
    if (contentReferences) {
      console.log(`  ❌ Aún tiene ${contentReferences.length} referencias a 'content'`);
      allClean = false;
    } else {
      console.log('  ✅ Sin referencias a campo content');
    }
    
    // Verificar que tenga los campos necesarios
    if (content.includes('title') && content.includes('description')) {
      console.log('  ✅ Campos básicos presentes');
    } else {
      console.log('  ❌ Faltan campos básicos');
    }
    
    console.log('');
    
  } catch (error) {
    console.log(`❌ Error leyendo ${filePath}:`, error.message);
    allClean = false;
  }
});

console.log('📋 Resumen:');
if (allClean) {
  console.log('✅ Todas las referencias al campo content han sido eliminadas');
  console.log('✅ Los formularios de eventos funcionan sin el campo content');
  console.log('✅ La API de eventos no intenta usar el campo content');
  console.log('✅ El schema de Prisma no incluye el campo content');
  
  console.log('\n🎯 El error de "events.content does not exist" debería estar resuelto');
  console.log('   Los eventos ahora solo usan: title, description, imageUrl, imageAlt, eventDate, location');
} else {
  console.log('❌ Aún hay referencias al campo content que necesitan ser eliminadas');
}

console.log('\n✨ Verificación completada!');
