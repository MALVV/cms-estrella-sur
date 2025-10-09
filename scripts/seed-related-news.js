const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedRelatedNews() {
  try {
    console.log('🌱 Iniciando seed de noticias relacionadas...');

    // Obtener algunos proyectos existentes
    const projects = await prisma.project.findMany({
      take: 3,
      where: { isActive: true }
    });

    // Obtener algunas metodologías existentes
    const methodologies = await prisma.methodology.findMany({
      take: 3,
      where: { isActive: true }
    });

    // Obtener algunos programas existentes
    const programas = await prisma.programas.findMany({
      take: 3,
      where: { isActive: true }
    });

    // Obtener un usuario para ser autor
    const user = await prisma.user.findFirst({
      where: { isActive: true }
    });

    if (!user) {
      console.log('❌ No se encontró usuario para crear noticias');
      return;
    }

    // Noticias relacionadas con proyectos
    const projectNews = [
      {
        title: "Proyecto de Educación Rural alcanza nuevas comunidades",
        content: "El proyecto de educación rural ha logrado expandirse a 5 nuevas comunidades, beneficiando a más de 200 niños y niñas con acceso a educación de calidad.",
        excerpt: "Expansión exitosa del proyecto educativo rural que beneficia a más de 200 niños.",
        category: "NOTICIAS",
        isFeatured: true,
        projectId: projects[0]?.id,
        programaId: programas[0]?.id,
      },
      {
        title: "Resultados positivos en proyecto de salud comunitaria",
        content: "El proyecto de salud comunitaria ha mostrado resultados excepcionales, reduciendo la mortalidad infantil en un 40% en las comunidades intervenidas.",
        excerpt: "Reducción del 40% en mortalidad infantil gracias al proyecto de salud comunitaria.",
        category: "NOTICIAS",
        isFeatured: false,
        projectId: projects[1]?.id,
        programaId: programas[1]?.id,
      },
      {
        title: "Proyecto de desarrollo sostenible recibe reconocimiento internacional",
        content: "Nuestro proyecto de desarrollo sostenible ha sido reconocido por la ONU como una iniciativa modelo para otras organizaciones.",
        excerpt: "Reconocimiento internacional para nuestro proyecto de desarrollo sostenible.",
        category: "NOTICIAS",
        isFeatured: true,
        projectId: projects[2]?.id,
        programaId: programas[2]?.id,
      }
    ];

    // Noticias relacionadas con metodologías
    const methodologyNews = [
      {
        title: "Nueva metodología de aprendizaje participativo muestra excelentes resultados",
        content: "La implementación de nuestra metodología de aprendizaje participativo ha demostrado un aumento del 60% en la retención de conocimientos entre los estudiantes.",
        excerpt: "Metodología participativa aumenta retención de conocimientos en 60%.",
        category: "NOTICIAS",
        isFeatured: true,
        methodologyId: methodologies[0]?.id,
        programaId: programas[0]?.id,
      },
      {
        title: "Metodología de desarrollo infantil temprano se expande a nuevas regiones",
        content: "Nuestra metodología de desarrollo infantil temprano ha sido adoptada por 15 nuevas comunidades, beneficiando a más de 500 familias.",
        excerpt: "Metodología de desarrollo infantil se expande a 15 nuevas comunidades.",
        category: "NOTICIAS",
        isFeatured: false,
        methodologyId: methodologies[1]?.id,
        programaId: programas[1]?.id,
      },
      {
        title: "Capacitación en metodología de liderazgo comunitario",
        content: "Se realizó una capacitación intensiva en nuestra metodología de liderazgo comunitario, formando a 30 nuevos líderes locales.",
        excerpt: "Capacitación forma 30 nuevos líderes comunitarios.",
        category: "NOTICIAS",
        isFeatured: false,
        methodologyId: methodologies[2]?.id,
        programaId: programas[2]?.id,
      }
    ];

    // Noticias relacionadas con programas
    const programNews = [
      {
        title: "Programa de primera infancia celebra su primer aniversario",
        content: "El programa de desarrollo de la primera infancia celebra su primer aniversario con resultados excepcionales en el desarrollo cognitivo de los niños.",
        excerpt: "Primer aniversario del programa de primera infancia con resultados excepcionales.",
        category: "NOTICIAS",
        isFeatured: true,
        programaId: programas[0]?.id,
      },
      {
        title: "Programa de salud comunitaria recibe apoyo adicional",
        content: "El programa de salud comunitaria ha recibido apoyo financiero adicional que permitirá expandir sus servicios a más comunidades.",
        excerpt: "Programa de salud comunitaria recibe apoyo para expansión.",
        category: "NOTICIAS",
        isFeatured: false,
        programaId: programas[1]?.id,
      },
      {
        title: "Programa de protección infantil fortalece sus protocolos",
        content: "El programa de protección infantil ha fortalecido sus protocolos de seguridad, implementando nuevas medidas de protección para los niños.",
        excerpt: "Programa de protección infantil fortalece protocolos de seguridad.",
        category: "NOTICIAS",
        isFeatured: true,
        programaId: programas[2]?.id,
      }
    ];

    // Crear todas las noticias
    const allNews = [...projectNews, ...methodologyNews, ...programNews];

    for (const newsData of allNews) {
      const news = await prisma.news.create({
        data: {
          ...newsData,
          createdBy: user.id,
          publishedAt: new Date(),
        },
      });
      console.log(`✅ Noticia creada: ${news.title}`);
    }

    console.log('🎉 Seed de noticias relacionadas completado exitosamente!');
    console.log(`📊 Total de noticias creadas: ${allNews.length}`);

  } catch (error) {
    console.error('❌ Error en seed de noticias relacionadas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRelatedNews();
