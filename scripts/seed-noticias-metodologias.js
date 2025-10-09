const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedNoticiasMetodologias() {
  try {
    console.log('🌱 Iniciando seed de noticias relacionadas con metodologías...');

    // Obtener metodologías existentes
    const methodologies = await prisma.methodology.findMany({
      where: { isActive: true },
      take: 3
    });

    if (methodologies.length === 0) {
      console.log('❌ No se encontraron metodologías activas');
      return;
    }

    console.log(`📚 Encontradas ${methodologies.length} metodologías`);

    // Crear noticias relacionadas con metodologías
    const noticiasMetodologias = [
      {
        title: "Nueva Metodología de Educación Comunitaria Demuestra Resultados Excepcionales",
        content: "La implementación de nuestra metodología de educación comunitaria ha mostrado resultados extraordinarios en las comunidades rurales. Los participantes han mejorado significativamente sus habilidades de liderazgo y participación ciudadana. Esta metodología, desarrollada durante más de dos años de investigación, combina técnicas participativas con herramientas digitales adaptadas al contexto local. Los facilitadores han sido entrenados en técnicas de facilitación grupal y manejo de conflictos, lo que ha resultado en sesiones más efectivas y participativas. Los indicadores de impacto muestran un aumento del 85% en la participación comunitaria y una mejora del 70% en la resolución de conflictos locales.",
        excerpt: "Metodología de educación comunitaria muestra resultados extraordinarios con 85% más participación.",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
        imageAlt: "Comunidad participando en taller educativo",
        category: "NOTICIAS",
        isActive: true,
        isFeatured: true,
        publishedAt: new Date('2024-01-15'),
        methodologyId: methodologies[0].id
      },
      {
        title: "Metodología de Salud Preventiva Reduce Enfermedades en 60%",
        content: "Nuestra metodología de salud preventiva ha logrado reducir las enfermedades comunes en un 60% en las comunidades donde se implementa. La metodología incluye capacitación en higiene básica, nutrición balanceada y prevención de enfermedades transmisibles. Los promotores de salud comunitarios han sido capacitados para identificar factores de riesgo y educar a las familias sobre prácticas saludables. El programa incluye visitas domiciliarias regulares, talleres grupales y actividades de sensibilización comunitaria. Los resultados han sido tan positivos que otras organizaciones han solicitado replicar esta metodología en sus regiones.",
        excerpt: "Metodología de salud preventiva reduce enfermedades comunes en 60% en comunidades implementadas.",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
        imageAlt: "Promotores de salud realizando capacitación comunitaria",
        category: "NOTICIAS",
        isActive: true,
        isFeatured: false,
        publishedAt: new Date('2024-01-20'),
        methodologyId: methodologies[1]?.id
      },
      {
        title: "Metodología de Desarrollo Social Empodera a Mujeres Líderes",
        content: "La metodología de desarrollo social ha empoderado a más de 200 mujeres líderes en sus comunidades. Esta metodología se enfoca en el fortalecimiento de capacidades de liderazgo, participación ciudadana y emprendimiento social. Las participantes han desarrollado proyectos comunitarios que benefician a más de 1,500 familias. La metodología incluye módulos de autoestima, comunicación efectiva, planificación estratégica y gestión de proyectos. Las mujeres han formado redes de apoyo mutuo y han logrado incidir en políticas públicas locales. Los resultados demuestran que el empoderamiento femenino es clave para el desarrollo comunitario sostenible.",
        excerpt: "Metodología de desarrollo social empodera a 200 mujeres líderes en sus comunidades.",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0c29c0b0c8b?w=800&h=600&fit=crop",
        imageAlt: "Mujeres líderes participando en taller de desarrollo social",
        category: "NOTICIAS",
        isActive: true,
        isFeatured: true,
        publishedAt: new Date('2024-01-25'),
        methodologyId: methodologies[2]?.id
      },
      {
        title: "Metodología Ambiental Promueve Conservación Sostenible",
        content: "Nuestra metodología ambiental ha promovido prácticas de conservación sostenible en más de 50 comunidades. La metodología combina educación ambiental con técnicas de agricultura sostenible y manejo de recursos naturales. Los participantes han implementado sistemas de recolección de agua de lluvia, huertos familiares orgánicos y programas de reforestación comunitaria. La metodología incluye capacitación en técnicas de compostaje, control biológico de plagas y conservación de suelos. Los resultados muestran una reducción del 40% en el uso de agroquímicos y un aumento del 30% en la biodiversidad local. Las comunidades han desarrollado planes de gestión ambiental que garantizan la sostenibilidad a largo plazo.",
        excerpt: "Metodología ambiental promueve conservación sostenible en 50 comunidades con resultados positivos.",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        imageAlt: "Comunidad trabajando en proyecto de conservación ambiental",
        category: "NOTICIAS",
        isActive: true,
        isFeatured: false,
        publishedAt: new Date('2024-01-30'),
        methodologyId: methodologies[0]?.id
      }
    ];

    // Crear las noticias
    for (const noticia of noticiasMetodologias) {
      if (noticia.methodologyId) {
        const created = await prisma.news.create({
          data: noticia
        });
        console.log(`✅ Noticia creada: "${created.title}" relacionada con metodología`);
      }
    }

    console.log('🎉 Seed de noticias relacionadas con metodologías completado exitosamente!');
    
    // Verificar las relaciones creadas
    const noticiasConMetodologias = await prisma.news.findMany({
      where: {
        methodologyId: { not: null }
      },
      include: {
        methodology: {
          select: { title: true }
        }
      }
    });

    console.log(`\n📊 Resumen:`);
    console.log(`- Total de noticias relacionadas con metodologías: ${noticiasConMetodologias.length}`);
    
    noticiasConMetodologias.forEach(noticia => {
      console.log(`  • "${noticia.title}" → Metodología: ${noticia.methodology?.title}`);
    });

  } catch (error) {
    console.error('❌ Error en seed de noticias relacionadas con metodologías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNoticiasMetodologias();
