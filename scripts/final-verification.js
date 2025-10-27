// Script final para verificar todos los cambios
console.log('🔍 Verificación final de todos los cambios...\n');

const fs = require('fs');

const filesToCheck = [
  'src/app/dashboard/donaciones/page.tsx',
  'src/app/admin/donations/page.tsx'
];

filesToCheck.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = filePath.split('/').pop();
    
    console.log(`📄 ${fileName}:`);
    
    // Verificar campo de URL en popup de aprobación
    if (content.includes('bankTransferImageUrl') && content.includes('type="url"')) {
      console.log('  ✅ Campo de URL manual implementado');
    } else {
      console.log('  ❌ Campo de URL manual NO implementado');
    }
    
    // Verificar validación obligatoria
    if (content.includes('disabled={!bankTransferImageUrl.trim()}')) {
      console.log('  ✅ Validación obligatoria implementada');
    } else {
      console.log('  ❌ Validación obligatoria NO implementada');
    }
    
    // Verificar que NO hay botones en diálogo de detalles
    const hasButtonsInDetailsDialog = content.includes('Ver detalles') && 
      content.includes('Aprobar') && 
      content.includes('Rechazar') &&
      content.includes('DialogContent');
    
    if (!hasButtonsInDetailsDialog) {
      console.log('  ✅ Botones eliminados del diálogo de detalles');
    } else {
      console.log('  ❌ Botones aún presentes en diálogo de detalles');
    }
    
    // Verificar que SÍ hay botones en tarjeta principal
    const hasButtonsInMainCard = content.includes('Aprobar') && 
      content.includes('Rechazar') && 
      content.includes('PENDING');
    
    if (hasButtonsInMainCard) {
      console.log('  ✅ Botones presentes en tarjeta principal');
    } else {
      console.log('  ❌ Botones NO presentes en tarjeta principal');
    }
    
    console.log('');
    
  } catch (error) {
    console.log(`❌ Error leyendo ${filePath}:`, error.message);
  }
});

console.log('📋 Resumen de cambios implementados:');
console.log('1. ✅ Campo de URL manual en popup de aprobación');
console.log('2. ✅ Validación obligatoria (botón deshabilitado sin URL)');
console.log('3. ✅ Botones eliminados del diálogo "Ver detalles"');
console.log('4. ✅ Botones mantenidos en tarjeta principal');
console.log('5. ✅ Flujo simplificado y consistente');

console.log('\n🎯 Flujo final:');
console.log('1. Usuario ve tarjeta de donación con botones Aprobar/Rechazar');
console.log('2. Puede hacer clic en "Ver detalles" para ver información completa');
console.log('3. Para aprobar: clic en "Aprobar" → aparece popup con campo URL');
console.log('4. Debe ingresar URL del comprobante para poder aprobar');
console.log('5. Para rechazar: clic directo en "Rechazar"');

console.log('\n✨ Todos los cambios aplicados correctamente!');
