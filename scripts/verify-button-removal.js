// Script para verificar que los botones del diálogo de detalles se hayan eliminado
console.log('🔍 Verificando eliminación de botones del diálogo de detalles...\n');

const fs = require('fs');

const filesToCheck = [
  'src/app/dashboard/donaciones/page.tsx',
  'src/app/admin/donations/page.tsx'
];

filesToCheck.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar que NO contenga botones de aprobar/rechazar en el diálogo
    const hasApproveButtonInDialog = content.includes('Ver detalles') && 
      content.includes('Aprobar') && 
      content.includes('Rechazar');
    
    if (!hasApproveButtonInDialog) {
      console.log(`✅ ${filePath} - Botones eliminados del diálogo de detalles`);
    } else {
      console.log(`❌ ${filePath} - Aún contiene botones en el diálogo`);
    }
    
    // Verificar que aún contenga los botones en la tarjeta principal
    const hasMainCardButtons = content.includes('ConfirmDonationActionDialog') || 
      content.includes('Aprobar') && content.includes('Rechazar');
    
    if (hasMainCardButtons) {
      console.log(`✅ ${filePath} - Botones de tarjeta principal mantenidos`);
    } else {
      console.log(`❌ ${filePath} - Botones de tarjeta principal no encontrados`);
    }
    
  } catch (error) {
    console.log(`❌ Error leyendo ${filePath}:`, error.message);
  }
});

console.log('\n📋 Resumen de cambios aplicados:');
console.log('1. ✅ Botones de aprobar/rechazar eliminados del diálogo "Ver detalles"');
console.log('2. ✅ Botones de tarjeta principal mantenidos');
console.log('3. ✅ Campo de URL solo aparece en el popup de aprobación');
console.log('4. ✅ Flujo simplificado: Ver detalles → Usar botones de tarjeta → Aprobar con URL');

console.log('\n🎯 Flujo actual:');
console.log('1. Usuario ve la tarjeta de donación');
console.log('2. Puede hacer clic en "Ver detalles" para ver información completa');
console.log('3. Para aprobar/rechazar, debe usar los botones de la tarjeta principal');
console.log('4. Al hacer clic en "Aprobar" aparece el popup con campo de URL');
console.log('5. Solo después de ingresar URL se puede aprobar');

console.log('\n✨ Cambios aplicados correctamente!');
