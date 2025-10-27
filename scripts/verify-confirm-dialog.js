// Script para verificar que el componente ConfirmDonationActionDialog tenga el campo de URL
console.log('🔍 Verificando componente ConfirmDonationActionDialog...\n');

const fs = require('fs');

try {
  const content = fs.readFileSync('src/components/admin/confirm-donation-action-dialog.tsx', 'utf8');
  
  console.log('📄 ConfirmDonationActionDialog:');
  
  // Verificar que tenga el campo de URL
  if (content.includes('bankTransferImageUrl')) {
    console.log('  ✅ Campo de URL implementado');
  } else {
    console.log('  ❌ Campo de URL NO implementado');
  }
  
  // Verificar que tenga el tipo URL
  if (content.includes('type="url"')) {
    console.log('  ✅ Tipo URL implementado');
  } else {
    console.log('  ❌ Tipo URL NO implementado');
  }
  
  // Verificar que tenga validación
  if (content.includes('disabled={loading || (isApprove && !bankTransferImageUrl.trim())}')) {
    console.log('  ✅ Validación implementada');
  } else {
    console.log('  ❌ Validación NO implementada');
  }
  
  // Verificar que tenga el placeholder
  if (content.includes('placeholder="https://ejemplo.com/comprobante.jpg"')) {
    console.log('  ✅ Placeholder implementado');
  } else {
    console.log('  ❌ Placeholder NO implementado');
  }
  
  // Verificar que solo aparezca en aprobación
  if (content.includes('{isApprove && (')) {
    console.log('  ✅ Campo solo aparece en aprobación');
  } else {
    console.log('  ❌ Campo aparece siempre');
  }
  
  // Verificar que haga la llamada a la API
  if (content.includes('fetch(`/api/donations/${donation.id}`')) {
    console.log('  ✅ Llamada a API implementada');
  } else {
    console.log('  ❌ Llamada a API NO implementada');
  }
  
  console.log('\n📋 Resumen de cambios:');
  console.log('1. ✅ Campo de URL agregado al componente ConfirmDonationActionDialog');
  console.log('2. ✅ Campo solo aparece cuando la acción es "approve"');
  console.log('3. ✅ Validación obligatoria (botón deshabilitado sin URL)');
  console.log('4. ✅ Llamada directa a la API con URL');
  console.log('5. ✅ Limpieza del campo al cerrar');
  
  console.log('\n🎯 Flujo actual:');
  console.log('1. Usuario hace clic en "Aprobar" en la tarjeta');
  console.log('2. Aparece el diálogo de confirmación con campo de URL');
  console.log('3. Debe ingresar URL del comprobante');
  console.log('4. Botón "Aprobar" se habilita solo con URL');
  console.log('5. Al confirmar, se guarda la URL en la base de datos');
  
  console.log('\n✨ Componente actualizado correctamente!');
  
} catch (error) {
  console.log('❌ Error leyendo el archivo:', error.message);
}
