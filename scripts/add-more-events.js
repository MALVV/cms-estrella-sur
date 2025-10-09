const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const additionalEvents = [
  {
    title: "Taller de Arte y Creatividad",
    description: "Taller gratuito de arte y creatividad para niños de 6 a 12 años. Incluye pintura, dibujo, manualidades y expresión artística.",
    content: "Taller de arte y creatividad diseñado para estimular la imaginación y habilidades artísticas de los niños. Los participantes aprenderán diferentes técnicas de pintura, dibujo y manualidades usando materiales reciclados y naturales. Incluye materiales, refrigerio y exposición final de trabajos.",
    eventDate: new Date('2024-12-10T15:00:00Z'),
    location: "Centro Cultural Comunitario",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop",
    imageAlt: "Niños pintando en taller de arte"
  },
  {
    title: "Caminata Ecológica Familiar",
    description: "Caminata ecológica por senderos naturales con actividades de educación ambiental para toda la familia. Incluye observación de aves y plantas nativas.",
    content: "Caminata ecológica de 3 horas por senderos naturales con guías especializados. Incluye actividades de educación ambiental, observación de aves, identificación de plantas nativas y charlas sobre conservación. Recomendado para niños mayores de 8 años.",
    eventDate: new Date('2024-12-08T07:00:00Z'),
    location: "Reserva Natural El Refugio",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    imageAlt: "Familia caminando por sendero ecológico"
  },
  {
    title: "Feria de Empleo Social",
    description: "Feria de empleo especializada en oportunidades de trabajo social y voluntariado. Incluye charlas sobre desarrollo profesional en el sector social.",
    content: "Feria de empleo que conecta profesionales con oportunidades en el sector social. Incluye stands de organizaciones, charlas sobre desarrollo profesional, talleres de CV para el sector social y networking. Dirigido a profesionales interesados en impacto social.",
    eventDate: new Date('2024-12-12T09:00:00Z'),
    location: "Centro de Convenciones, Cali",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop",
    imageAlt: "Feria de empleo social"
  },
  {
    title: "Cine Foro: Documentales Sociales",
    description: "Proyección de documentales sobre temas sociales seguida de debate y reflexión. Incluye películas sobre educación, medio ambiente y derechos humanos.",
    content: "Cine foro con proyección de documentales que abordan temas sociales relevantes. Después de cada película habrá un debate moderado por expertos. Incluye palomitas, refrescos y materiales de reflexión. Entrada gratuita.",
    eventDate: new Date('2024-12-14T18:30:00Z'),
    location: "Auditorio Universidad Nacional",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1489599808427-5b3b3b3b3b3b?w=600&h=400&fit=crop",
    imageAlt: "Cine foro con documentales sociales"
  },
  {
    title: "Taller de Huerta Urbana",
    description: "Taller práctico sobre cultivo de hortalizas en espacios urbanos pequeños. Incluye semillas, materiales y seguimiento durante 3 meses.",
    content: "Taller de huerta urbana que enseña técnicas de cultivo en espacios reducidos como balcones, terrazas y patios pequeños. Incluye semillas, materiales básicos, manual de cultivo y seguimiento durante 3 meses. Ideal para familias que quieren cultivar sus propios alimentos.",
    eventDate: new Date('2024-12-18T10:00:00Z'),
    location: "Centro de Agricultura Urbana",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    imageAlt: "Taller de huerta urbana"
  },
  {
    title: "Festival de Música Tradicional",
    description: "Festival de música tradicional colombiana con grupos locales. Incluye talleres de instrumentos, danza folclórica y gastronomía típica.",
    content: "Festival de música tradicional que celebra la cultura colombiana con presentaciones de grupos locales, talleres de instrumentos tradicionales, clases de danza folclórica y degustación de gastronomía típica. Incluye mercado artesanal y actividades para niños.",
    eventDate: new Date('2024-12-22T16:00:00Z'),
    location: "Plaza de Bolívar",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    imageAlt: "Festival de música tradicional"
  },
  {
    title: "Campaña de Donación de Libros",
    description: "Campaña de recolección de libros para bibliotecas comunitarias. Incluye actividades de lectura, cuentacuentos y trueque de libros.",
    content: "Campaña de donación de libros nuevos y usados para abastecer bibliotecas comunitarias. Incluye actividades de lectura en voz alta, sesiones de cuentacuentos, trueque de libros y charlas sobre la importancia de la lectura. Se aceptan libros en buen estado.",
    eventDate: new Date('2024-12-16T14:00:00Z'),
    location: "Biblioteca Pública Central",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    imageAlt: "Campaña de donación de libros"
  },
  {
    title: "Taller de Primeros Auxilios",
    description: "Taller práctico de primeros auxilios básicos para la comunidad. Incluye RCP, manejo de heridas y emergencias comunes.",
    content: "Taller de primeros auxilios básicos dirigido a la comunidad general. Incluye técnicas de RCP, manejo de heridas, fracturas, quemaduras y otras emergencias comunes. Impartido por profesionales de la salud con certificado de participación.",
    eventDate: new Date('2024-12-19T09:00:00Z'),
    location: "Centro de Salud Comunitario",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    imageAlt: "Taller de primeros auxilios"
  },
  {
    title: "Mercado Solidario Navideño",
    description: "Mercado navideño con productos artesanales y locales. Incluye actividades para niños, música en vivo y comida tradicional.",
    content: "Mercado navideño que promueve el comercio local y artesanal. Incluye stands de productos artesanales, comida tradicional, actividades para niños como decoración de galletas, música en vivo y rifas. Todos los fondos van a programas comunitarios.",
    eventDate: new Date('2024-12-21T11:00:00Z'),
    location: "Parque de los Artesanos",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=400&fit=crop",
    imageAlt: "Mercado solidario navideño"
  },
  {
    title: "Taller de Tecnología para Adultos Mayores",
    description: "Taller básico de tecnología para adultos mayores. Incluye uso de smartphones, redes sociales y aplicaciones útiles.",
    content: "Taller de tecnología diseñado específicamente para adultos mayores. Incluye uso básico de smartphones, redes sociales, aplicaciones útiles para la vida diaria, videollamadas y seguridad digital. Impartido por jóvenes voluntarios con paciencia y dedicación.",
    eventDate: new Date('2024-12-17T15:00:00Z'),
    location: "Centro de Adultos Mayores",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    imageAlt: "Taller de tecnología para adultos mayores"
  },
  {
    title: "Carrera de Obstáculos Infantil",
    description: "Carrera de obstáculos divertida para niños de 5 a 12 años. Incluye medallas, refrigerio y actividades adicionales.",
    content: "Carrera de obstáculos diseñada especialmente para niños con circuitos seguros y divertidos. Incluye diferentes categorías por edad, medallas para todos los participantes, refrigerio saludable y actividades adicionales como pintacaritas y globoflexia.",
    eventDate: new Date('2024-12-23T10:00:00Z'),
    location: "Parque Deportivo Infantil",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    imageAlt: "Carrera de obstáculos infantil"
  },
  {
    title: "Taller de Repostería Saludable",
    description: "Taller de repostería con ingredientes saludables y naturales. Incluye recetas sin azúcar refinada y técnicas básicas.",
    content: "Taller de repostería que enseña a preparar postres saludables usando ingredientes naturales y alternativas al azúcar refinada. Incluye recetas, degustación, técnicas básicas de decoración y materiales para llevar a casa.",
    eventDate: new Date('2024-12-24T14:00:00Z'),
    location: "Cocina Comunitaria",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    imageAlt: "Taller de repostería saludable"
  },
  {
    title: "Campaña de Limpieza Comunitaria",
    description: "Campaña de limpieza y embellecimiento de espacios públicos. Incluye reciclaje, plantación de árboles y educación ambiental.",
    content: "Campaña de limpieza comunitaria que incluye recolección de basura, separación de residuos reciclables, plantación de árboles nativos y charlas de educación ambiental. Incluye materiales, refrigerio y certificado de participación.",
    eventDate: new Date('2024-12-26T08:00:00Z'),
    location: "Parque Central y alrededores",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    imageAlt: "Campaña de limpieza comunitaria"
  },
  {
    title: "Taller de Fotografía Social",
    description: "Taller de fotografía para documentar historias comunitarias. Incluye técnicas básicas y uso de smartphones para fotografía social.",
    content: "Taller de fotografía enfocado en documentar historias y realidades comunitarias. Incluye técnicas básicas de composición, iluminación, uso de smartphones para fotografía profesional y ética en la fotografía social.",
    eventDate: new Date('2024-12-28T10:00:00Z'),
    location: "Centro Cultural Comunitario",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=400&fit=crop",
    imageAlt: "Taller de fotografía social"
  },
  {
    title: "Fiesta de Fin de Año Comunitaria",
    description: "Celebración de fin de año para toda la comunidad. Incluye música, comida, actividades para niños y reflexión sobre el año.",
    content: "Fiesta de fin de año que reúne a toda la comunidad para celebrar los logros del año y proyectar el siguiente. Incluye música en vivo, comida tradicional, actividades para niños, reflexión comunitaria y fuegos artificiales.",
    eventDate: new Date('2024-12-31T19:00:00Z'),
    location: "Plaza Principal",
    isActive: true,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=400&fit=crop",
    imageAlt: "Fiesta de fin de año comunitaria"
  }
];

async function addMoreEvents() {
  try {
    console.log('🎉 Agregando más eventos...');

    // Obtener el primer usuario para usar como organizador
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No se encontró ningún usuario en la base de datos.');
      return;
    }

    // Crear eventos adicionales
    console.log('📅 Creando eventos adicionales...');
    for (const eventData of additionalEvents) {
      await prisma.event.create({
        data: {
          ...eventData,
          createdBy: user.id,
        },
      });
    }

    console.log('✅ Eventos adicionales creados exitosamente!');
    console.log(`📅 ${additionalEvents.length} eventos adicionales creados`);

    // Mostrar resumen total
    const totalEvents = await prisma.event.count();
    console.log(`📊 Total de eventos en la base de datos: ${totalEvents}`);

  } catch (error) {
    console.error('❌ Error al agregar eventos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreEvents();
