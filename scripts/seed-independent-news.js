const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedIndependentNews() {
  try {
    console.log('🌱 Iniciando seed de noticias independientes...');

    // Obtener un usuario para ser autor
    const user = await prisma.user.findFirst({
      where: { isActive: true }
    });

    if (!user) {
      console.log('❌ No se encontró usuario para crear noticias');
      return;
    }

    // Noticias independientes (sin relaciones)
    const independentNews = [
      {
        title: "Estrella del Sur celebra 10 años de impacto social",
        content: "La organización Estrella del Sur celebra una década de trabajo incansable en favor de las comunidades más vulnerables, transformando vidas y creando oportunidades para miles de niños y familias.",
        excerpt: "Celebramos una década de impacto social transformando vidas en comunidades vulnerables.",
        category: "NOTICIAS",
        isFeatured: true,
        // Sin programaId, projectId o methodologyId
      },
      {
        title: "Nuevas oficinas regionales fortalecen presencia local",
        content: "La apertura de nuevas oficinas regionales permite a Estrella del Sur estar más cerca de las comunidades que servimos, mejorando la calidad y eficiencia de nuestros programas.",
        excerpt: "Nuevas oficinas regionales acercan nuestros servicios a las comunidades.",
        category: "NOTICIAS",
        isFeatured: false,
        // Sin relaciones
      },
      {
        title: "Reconocimiento internacional por transparencia y gestión",
        content: "Estrella del Sur ha recibido un reconocimiento internacional por su excelencia en transparencia financiera y gestión organizacional, consolidando su reputación como una ONG confiable.",
        excerpt: "Reconocimiento internacional por transparencia y gestión organizacional.",
        category: "NOTICIAS",
        isFeatured: true,
        // Sin relaciones
      },
      {
        title: "Alianza estratégica con universidades locales",
        content: "Nueva alianza con universidades locales fortalece nuestros programas de investigación y desarrollo, creando sinergias que benefician tanto a estudiantes como a las comunidades.",
        excerpt: "Alianza con universidades fortalece investigación y desarrollo comunitario.",
        category: "NOTICIAS",
        isFeatured: false,
        // Sin relaciones
      },
      {
        title: "Voluntarios internacionales se suman a nuestra misión",
        content: "Un grupo de voluntarios internacionales se ha unido a Estrella del Sur, aportando nuevas perspectivas y habilidades que enriquecen nuestros programas locales.",
        excerpt: "Voluntarios internacionales aportan nuevas perspectivas a nuestros programas.",
        category: "NOTICIAS",
        isFeatured: false,
        // Sin relaciones
      }
    ];

    // Crear las noticias independientes
    for (const newsData of independentNews) {
      const news = await prisma.news.create({
        data: {
          ...newsData,
          createdBy: user.id,
          publishedAt: new Date(),
        },
      });
      console.log(`✅ Noticia independiente creada: ${news.title}`);
    }

    console.log('🎉 Seed de noticias independientes completado exitosamente!');
    console.log(`📊 Total de noticias independientes creadas: ${independentNews.length}`);

    // Mostrar estadísticas
    const totalNews = await prisma.news.count();
    const newsWithPrograms = await prisma.news.count({
      where: { programaId: { not: null } }
    });
    const newsWithProjects = await prisma.news.count({
      where: { projectId: { not: null } }
    });
    const newsWithMethodologies = await prisma.news.count({
      where: { methodologyId: { not: null } }
    });
    const independentNewsCount = await prisma.news.count({
      where: {
        programaId: null,
        projectId: null,
        methodologyId: null
      }
    });

    console.log('\n📈 Estadísticas de noticias:');
    console.log(`   Total de noticias: ${totalNews}`);
    console.log(`   Con programas: ${newsWithPrograms}`);
    console.log(`   Con proyectos: ${newsWithProjects}`);
    console.log(`   Con metodologías: ${newsWithMethodologies}`);
    console.log(`   Independientes: ${independentNewsCount}`);

  } catch (error) {
    console.error('❌ Error en seed de noticias independientes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedIndependentNews();
