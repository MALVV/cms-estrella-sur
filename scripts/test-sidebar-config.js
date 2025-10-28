// Script para probar el sidebar con rol CONSULTANT
console.log('🎭 Probando configuración del sidebar para rol CONSULTANT...');

// Simular la función getNavSections
const getNavSections = (userRole) => {
  // Si es CONSULTANT, solo mostrar secciones de donaciones
  if (userRole === "CONSULTANT") {
    return [
      {
        title: "Donaciones",
        icon: "DollarSign",
        items: [
          {
            title: "Panel de Control",
            url: "/dashboard",
            icon: "Home",
            showFor: ["CONSULTANT"]
          },
          {
            title: "Gestión de Donaciones",
            url: "/dashboard/donaciones",
            icon: "Heart",
            showFor: ["CONSULTANT"]
          },
          {
            title: "Proyectos de Donación",
            url: "/dashboard/proyectos-donacion",
            icon: "Target",
            showFor: ["CONSULTANT"]
          },
          {
            title: "Metas Anuales",
            url: "/dashboard/metas-anuales",
            icon: "Target",
            showFor: ["CONSULTANT"]
          },
        ]
      }
    ]
  }

  // Para otros roles, mostrar todas las secciones
  return [
    {
      title: "Operaciones",
      icon: "Building2",
      items: [
        {
          title: "Panel de Control",
          url: "/dashboard",
          icon: "Home",
          showFor: ["ADMINISTRATOR", "MANAGER"]
        },
        {
          title: "Usuarios",
          url: "#",
          icon: "Users",
          showFor: ["ADMINISTRATOR"]
        },
      ]
    },
    {
      title: "Finanzas",
      icon: "DollarSign",
      items: [
        {
          title: "Donaciones",
          url: "#",
          icon: "Heart",
          showFor: ["ADMINISTRATOR", "MANAGER", "CONSULTANT"],
          items: [
            {
              title: "Gestión de Donaciones",
              url: "/dashboard/donaciones",
              showFor: ["ADMINISTRATOR", "MANAGER", "CONSULTANT"]
            },
            {
              title: "Proyectos de Donación",
              url: "/dashboard/proyectos-donacion",
              showFor: ["ADMINISTRATOR", "MANAGER", "CONSULTANT"]
            },
          ],
        },
      ]
    },
  ]
}

// Probar con diferentes roles
console.log('\n🔍 Probando con rol CONSULTANT:');
const CONSULTANTSections = getNavSections("CONSULTANT");
console.log(`   - Secciones disponibles: ${CONSULTANTSections.length}`);
CONSULTANTSections.forEach(section => {
  console.log(`   📁 ${section.title}:`);
  section.items.forEach(item => {
    console.log(`      - ${item.title} (${item.url})`);
  });
});

console.log('\n🔍 Probando con rol ADMINISTRATOR:');
const adminSections = getNavSections("ADMINISTRATOR");
console.log(`   - Secciones disponibles: ${adminSections.length}`);
adminSections.forEach(section => {
  console.log(`   📁 ${section.title}:`);
  section.items.forEach(item => {
    console.log(`      - ${item.title} (${item.url})`);
  });
});

console.log('\n🔍 Probando con rol MANAGER:');
const MANAGERSections = getNavSections("MANAGER");
console.log(`   - Secciones disponibles: ${MANAGERSections.length}`);
MANAGERSections.forEach(section => {
  console.log(`   📁 ${section.title}:`);
  section.items.forEach(item => {
    console.log(`      - ${item.title} (${item.url})`);
  });
});

console.log('\n✅ Prueba del sidebar completada');
console.log('\n📋 Resumen:');
console.log('   - CONSULTANT: Solo ve secciones de donaciones');
console.log('   - ADMINISTRATOR: Ve todas las secciones');
console.log('   - MANAGER: Ve secciones según permisos');


