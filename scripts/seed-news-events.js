const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleNews = [
  {
    title: "Nueva Iniciativa de Apoyo Educativo",
    content: "Estamos emocionados de anunciar el lanzamiento de nuestra nueva iniciativa de apoyo educativo que beneficiará a más de 500 niños en comunidades rurales. Este programa incluye materiales escolares, capacitación docente y apoyo nutricional.",
    excerpt: "Nueva iniciativa que beneficiará a más de 500 niños en comunidades rurales con apoyo educativo integral.",
    category: "NOTICIAS",
    isActive: true,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    imageAlt: "Niños estudiando en aula rural"
  },
  {
    title: "Campaña de Recaudación de Fondos Exitosos",
    content: "Gracias al apoyo de nuestra comunidad, hemos logrado recaudar $50,000 para nuestro programa de alimentación escolar. Estos fondos nos permitirán proporcionar comidas nutritivas a 200 niños durante todo el año escolar.",
    excerpt: "Campaña exitosa que recaudó $50,000 para el programa de alimentación escolar.",
    category: "FUNDRAISING",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
    imageAlt: "Niños recibiendo comida en la escuela"
  },
  {
    title: "Expansión de Nuestras Operaciones",
    content: "Estrella Sur está expandiendo sus operaciones a tres nuevas regiones del país. Esta expansión nos permitirá llegar a más comunidades necesitadas y duplicar nuestro impacto en los próximos dos años.",
    excerpt: "Expansión a tres nuevas regiones para duplicar nuestro impacto social.",
    category: "COMPAÑIA",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
    imageAlt: "Mapa de expansión de operaciones"
  },
  {
    title: "Voluntarios Destacados del Mes",
    content: "Reconocemos a nuestros voluntarios destacados del mes: María González, Juan Pérez y Ana Rodríguez. Su dedicación y compromiso han sido fundamentales para el éxito de nuestros programas comunitarios.",
    excerpt: "Reconocimiento a voluntarios destacados por su compromiso con la comunidad.",
    category: "NOTICIAS",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    imageAlt: "Grupo de voluntarios trabajando"
  },
  {
    title: "Nuevo Centro de Capacitación",
    content: "Hemos inaugurado un nuevo centro de capacitación en la ciudad de Medellín. Este centro ofrecerá cursos de habilidades técnicas y empresariales para jóvenes de comunidades vulnerables.",
    excerpt: "Nuevo centro de capacitación en Medellín para jóvenes de comunidades vulnerables.",
    category: "COMPAÑIA",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    imageAlt: "Centro de capacitación moderno"
  },
  {
    title: "Campaña de Donaciones de Invierno",
    content: "Lanzamos nuestra campaña anual de donaciones de invierno para proporcionar ropa abrigada, mantas y alimentos a familias en situación de vulnerabilidad durante la temporada fría.",
    excerpt: "Campaña de invierno para ayudar a familias vulnerables con ropa y alimentos.",
    category: "FUNDRAISING",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    imageAlt: "Donaciones de ropa de invierno"
  },
  {
    title: "Alianza Estratégica con Empresa Local",
    content: "Estrella Sur ha firmado una alianza estratégica con la empresa local TechCorp para desarrollar programas de educación digital en comunidades rurales. Esta colaboración incluye donación de equipos y capacitación técnica.",
    excerpt: "Alianza con TechCorp para programas de educación digital en comunidades rurales.",
    category: "COMPAÑIA",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
    imageAlt: "Firma de alianza estratégica"
  },
  {
    title: "Resultados del Programa de Salud",
    content: "Nuestro programa de salud comunitaria ha atendido a más de 1,000 personas este año, proporcionando atención médica básica, vacunación y educación en salud preventiva en zonas rurales.",
    excerpt: "Programa de salud comunitaria atendió a más de 1,000 personas este año.",
    category: "NOTICIAS",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    imageAlt: "Atención médica comunitaria"
  },
  {
    title: "Campaña de Reforestación",
    content: "En colaboración con comunidades locales, hemos plantado más de 5,000 árboles en áreas deforestadas. Este proyecto no solo ayuda al medio ambiente sino que también genera empleo local.",
    excerpt: "Proyecto de reforestación plantó más de 5,000 árboles con comunidades locales.",
    category: "FUNDRAISING",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    imageAlt: "Plantación de árboles comunitarios"
  },
  {
    title: "Actualización de Políticas Internas",
    content: "Hemos actualizado nuestras políticas internas para mejorar la transparencia y eficiencia en nuestras operaciones. Estas mejoras incluyen nuevos protocolos de evaluación y seguimiento de proyectos.",
    excerpt: "Actualización de políticas internas para mayor transparencia y eficiencia.",
    category: "SIN_CATEGORIA",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
    imageAlt: "Documentos de políticas organizacionales"
  }
];

const sampleEvents = [
  {
    title: "Maratón Solidario 2024",
    description: "Únete a nuestro maratón solidario anual. Todos los fondos recaudados irán directamente a nuestros programas de educación infantil. Habrá categorías para todas las edades y niveles.",
    content: "El Maratón Solidario 2024 es nuestro evento más importante del año. Contamos con rutas de 5K, 10K y 21K, además de actividades familiares. Incluye kit de corredor, hidratación, medalla de participación y refrigerio.",
    eventDate: new Date('2024-12-15T08:00:00Z'),
    location: "Parque Central, Bogotá",
    isActive: true,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    imageAlt: "Corredores en maratón solidario"
  },
  {
    title: "Taller de Capacitación Docente",
    description: "Taller especializado para maestros de comunidades rurales sobre metodologías de enseñanza innovadoras y uso de tecnología educativa.",
    content: "Este taller de dos días incluye sesiones teóricas y prácticas sobre nuevas metodologías de enseñanza, uso de tecnología educativa, y técnicas de motivación estudiantil. Incluye materiales y certificado de participación.",
    eventDate: new Date('2024-11-20T09:00:00Z'),
    location: "Centro de Capacitación Estrella Sur",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    imageAlt: "Taller de capacitación docente"
  },
  {
    title: "Feria de Emprendimiento Social",
    description: "Exposición de proyectos sociales desarrollados por jóvenes emprendedores de nuestras comunidades beneficiarias. Incluye presentaciones, networking y premiación.",
    content: "La Feria de Emprendimiento Social reúne a jóvenes emprendedores que han desarrollado proyectos sociales innovadores. Habrá presentaciones, sesiones de networking, talleres y premiación a los mejores proyectos.",
    eventDate: new Date('2024-12-05T10:00:00Z'),
    location: "Centro de Convenciones, Medellín",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop",
    imageAlt: "Feria de emprendimiento social"
  },
  {
    title: "Campaña de Vacunación Comunitaria",
    description: "Campaña gratuita de vacunación para niños y adultos en comunidades vulnerables. Incluye vacunas básicas y educación en salud preventiva.",
    content: "Campaña de vacunación gratuita que incluye vacunas básicas para niños y adultos, además de charlas educativas sobre salud preventiva, nutrición y cuidado personal.",
    eventDate: new Date('2024-11-25T08:00:00Z'),
    location: "Centro de Salud Comunitario",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    imageAlt: "Campaña de vacunación comunitaria"
  },
  {
    title: "Concierto Benéfico",
    description: "Concierto musical con artistas locales para recaudar fondos para nuestros programas de educación. Incluye música en vivo, comida y actividades para toda la familia.",
    content: "Concierto benéfico con artistas locales reconocidos. El evento incluye música en vivo, stands de comida, actividades para niños y rifas. Todos los fondos recaudados van directamente a nuestros programas educativos.",
    eventDate: new Date('2024-12-20T19:00:00Z'),
    location: "Teatro Municipal",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
    imageAlt: "Concierto benéfico musical"
  },
  {
    title: "Taller de Nutrición Infantil",
    description: "Taller práctico para madres y cuidadores sobre preparación de comidas nutritivas y económicas para niños en edad escolar.",
    content: "Taller práctico de dos horas donde madres y cuidadores aprenderán a preparar comidas nutritivas y económicas. Incluye recetas, degustación y materiales informativos sobre nutrición infantil.",
    eventDate: new Date('2024-11-30T14:00:00Z'),
    location: "Cocina Comunitaria",
    isActive: true,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
    imageAlt: "Taller de nutrición infantil"
  }
];

async function seedNewsAndEvents() {
  try {
    console.log('🌱 Iniciando seed de news y events...');

    // Obtener el primer usuario para usar como autor/organizador
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      console.log('❌ No se encontró ningún usuario en la base de datos. Creando usuario de prueba...');
      const testUser = await prisma.user.create({
        data: {
          name: 'Admin Estrella Sur',
          email: 'admin@estrellasur.org',
          password: 'password123',
          role: 'ADMINISTRATOR',
          isActive: true,
        },
      });
      console.log('✅ Usuario de prueba creado:', testUser.email);
    }

    const user = await prisma.user.findFirst();

    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.news.deleteMany({});
    await prisma.event.deleteMany({});

    // Crear noticias
    console.log('📰 Creando noticias...');
    for (const newsData of sampleNews) {
      await prisma.news.create({
        data: {
          ...newsData,
          createdBy: user.id,
        },
      });
    }

    // Crear eventos
    console.log('📅 Creando eventos...');
    for (const eventData of sampleEvents) {
      await prisma.event.create({
        data: {
          ...eventData,
          createdBy: user.id,
        },
      });
    }

    console.log('✅ Seed completado exitosamente!');
    console.log(`📰 ${sampleNews.length} noticias creadas`);
    console.log(`📅 ${sampleEvents.length} eventos creados`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNewsAndEvents();