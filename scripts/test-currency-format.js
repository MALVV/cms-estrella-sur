// Script para probar el formato de moneda
const testAmounts = [800, 15000, 16800, 200];

console.log('🧪 Probando formato de moneda:');
console.log('============================');

testAmounts.forEach(amount => {
  const formatted = `Bs. ${amount.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
  console.log(`${amount} → ${formatted}`);
});

console.log('\n✅ Formato correcto: Bs. 16.800,00');
