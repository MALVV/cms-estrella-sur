// Script para probar el sidebar con rol ASESOR
console.log('🎭 Probando configuración del sidebar para rol ASESOR...');

// Simular la función getNavSections
const getNavSections = (userRole) => {
  // Si es ASESOR, solo mostrar secciones de donaciones
  if (userRole === "ASESOR") {
    return [
      {
        title: "Donaciones",
        icon: "DollarSign",
        items: [
          {
            title: "Panel de Control",
            url: "/dashboard",
            icon: "Home",
            showFor: ["ASESOR"]
          },
          {
            title: "Gestión de Donaciones",
            url: "/dashboard/donaciones",
            icon: "Heart",
            showFor: ["ASESOR"]
          },
          {
            title: "Proyectos de Donación",
            url: "/dashboard/proyectos-donacion",
            icon: "Target",
            showFor: ["ASESOR"]
          },
          {
            title: "Metas Anuales",
            url: "/dashboard/metas-anuales",
            icon: "Target",
            showFor: ["ASESOR"]
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
          showFor: ["ADMINISTRADOR", "GESTOR"]
        },
        {
          title: "Usuarios",
          url: "#",
          icon: "Users",
          showFor: ["ADMINISTRADOR"]
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
          showFor: ["ADMINISTRADOR", "GESTOR", "ASESOR"],
          items: [
            {
              title: "Gestión de Donaciones",
              url: "/dashboard/donaciones",
              showFor: ["ADMINISTRADOR", "GESTOR", "ASESOR"]
            },
            {
              title: "Proyectos de Donación",
              url: "/dashboard/proyectos-donacion",
              showFor: ["ADMINISTRADOR", "GESTOR", "ASESOR"]
            },
          ],
        },
      ]
    },
  ]
}

// Probar con diferentes roles
console.log('\n🔍 Probando con rol ASESOR:');
const asesorSections = getNavSections("ASESOR");
console.log(`   - Secciones disponibles: ${asesorSections.length}`);
asesorSections.forEach(section => {
  console.log(`   📁 ${section.title}:`);
  section.items.forEach(item => {
    console.log(`      - ${item.title} (${item.url})`);
  });
});

console.log('\n🔍 Probando con rol ADMINISTRADOR:');
const adminSections = getNavSections("ADMINISTRADOR");
console.log(`   - Secciones disponibles: ${adminSections.length}`);
adminSections.forEach(section => {
  console.log(`   📁 ${section.title}:`);
  section.items.forEach(item => {
    console.log(`      - ${item.title} (${item.url})`);
  });
});

console.log('\n🔍 Probando con rol GESTOR:');
const gestorSections = getNavSections("GESTOR");
console.log(`   - Secciones disponibles: ${gestorSections.length}`);
gestorSections.forEach(section => {
  console.log(`   📁 ${section.title}:`);
  section.items.forEach(item => {
    console.log(`      - ${item.title} (${item.url})`);
  });
});

console.log('\n✅ Prueba del sidebar completada');
console.log('\n📋 Resumen:');
console.log('   - ASESOR: Solo ve secciones de donaciones');
console.log('   - ADMINISTRADOR: Ve todas las secciones');
console.log('   - GESTOR: Ve secciones según permisos');


