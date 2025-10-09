const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const noticiasFicticias = [
  {
    title: "Programa de Educación Infantil alcanza 500 niños beneficiados",
    content: "El programa de Educación Infantil ha logrado un hito importante al alcanzar los 500 niños beneficiados en la región. Este programa integral de desarrollo infantil promueve el aprendizaje temprano y el desarrollo cognitivo en niños de 0 a 6 años, incluyendo actividades educativas, nutrición adecuada y apoyo psicosocial para familias vulnerables. Los resultados muestran mejoras significativas en las habilidades cognitivas de los participantes.",
    excerpt: "Programa de Educación Infantil alcanza importante hito con 500 niños beneficiados, mostrando mejoras significativas en desarrollo cognitivo.",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    imageAlt: "Niños participando en actividades educativas",
    category: "NOTICIAS",
    isFeatured: true,
    programaId: null // Se asignará después
  },
  {
    title: "Campaña de vacunación comunitaria protege a más de 1,000 familias",
    content: "La campaña de vacunación comunitaria del programa de Salud Comunitaria ha protegido exitosamente a más de 1,000 familias en comunidades rurales. Esta iniciativa forma parte del programa integral de salud preventiva que fortalece los sistemas de salud comunitarios y promueve prácticas saludables en poblaciones vulnerables. La campaña incluyó capacitación de promotores de salud, educación sanitaria y seguimiento médico.",
    excerpt: "Campaña de vacunación comunitaria protege a más de 1,000 familias en comunidades rurales vulnerables.",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    imageAlt: "Campaña de vacunación comunitaria",
    category: "NOTICIAS",
    isFeatured: true,
    programaId: null
  },
  {
    title: "Jóvenes emprendedores inician 50 nuevos negocios con apoyo del programa",
    content: "El programa de Desarrollo Económico Juvenil celebra el éxito de 50 jóvenes emprendedores que han iniciado nuevos negocios con el apoyo del programa. Estos jóvenes de 15 a 24 años han recibido capacitación técnica, microcréditos y mentoría empresarial, logrando generar ingresos sostenibles para sus familias. Los emprendimientos incluyen negocios de artesanías, servicios técnicos y comercio local.",
    excerpt: "50 jóvenes emprendedores inician nuevos negocios con apoyo del programa de Desarrollo Económico Juvenil.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    imageAlt: "Jóvenes emprendedores en capacitación",
    category: "NOTICIAS",
    isFeatured: false,
    programaId: null
  },
  {
    title: "Sistema de protección infantil previene 200 casos de violencia",
    content: "El programa de Protección Infantil ha logrado prevenir más de 200 casos de violencia infantil a través de su sistema integral de protección. El programa incluye sistemas de alerta temprana, apoyo psicosocial y fortalecimiento de redes comunitarias. Las comunidades han implementado exitosamente protocolos de protección y han mejorado significativamente la seguridad de los niños y adolescentes.",
    excerpt: "Sistema de protección infantil previene más de 200 casos de violencia a través de redes comunitarias fortalecidas.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    imageAlt: "Niños en ambiente seguro y protegido",
    category: "NOTICIAS",
    isFeatured: true,
    programaId: null
  },
  {
    title: "Comunidad rural obtiene acceso a agua potable por primera vez",
    content: "Una comunidad rural de 300 familias ha obtenido acceso a agua potable por primera vez gracias al programa de Agua y Saneamiento. El proyecto incluyó la construcción de un sistema de agua comunitario, letrinas ecológicas y educación sobre higiene. Esta mejora ha reducido significativamente las enfermedades hídricas y ha mejorado la calidad de vida de toda la comunidad.",
    excerpt: "Comunidad rural de 300 familias obtiene acceso a agua potable por primera vez, reduciendo enfermedades hídricas.",
    imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800",
    imageAlt: "Sistema de agua comunitario",
    category: "NOTICIAS",
    isFeatured: false,
    programaId: null
  },
  {
    title: "Mujeres líderes promueven igualdad de género en sus comunidades",
    content: "El programa de Empoderamiento de Mujeres celebra el éxito de 100 mujeres líderes que están promoviendo la igualdad de género en sus comunidades. Estas mujeres han recibido capacitación en liderazgo, derechos humanos y prevención de violencia de género. Ahora participan activamente en espacios de decisión comunitaria y han iniciado actividades económicas que benefician a sus familias.",
    excerpt: "100 mujeres líderes promueven igualdad de género en sus comunidades tras capacitación en liderazgo y derechos humanos.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
    imageAlt: "Mujeres líderes en taller de empoderamiento",
    category: "NOTICIAS",
    isFeatured: true,
    programaId: null
  },
  {
    title: "Programa de Primera Infancia reduce desnutrición infantil en 40%",
    content: "El programa de Desarrollo de la Primera Infancia ha logrado reducir la desnutrición infantil en un 40% en las comunidades donde opera. El programa especializado en niños de 0 a 3 años incluye seguimiento nutricional, estimulación temprana y apoyo parental. Las madres han mejorado significativamente sus prácticas de crianza y los niños han alcanzado hitos de desarrollo apropiados para su edad.",
    excerpt: "Programa de Primera Infancia reduce desnutrición infantil en 40% a través de seguimiento nutricional y apoyo parental.",
    imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800",
    imageAlt: "Madre alimentando a su bebé",
    category: "NOTICIAS",
    isFeatured: false,
    programaId: null
  },
  {
    title: "Agricultores implementan prácticas sostenibles en 500 hectáreas",
    content: "El programa de Desarrollo Rural Sostenible ha logrado que 200 agricultores implementen prácticas agrícolas sostenibles en más de 500 hectáreas. Los agricultores han recibido capacitación en agricultura orgánica, conservación de suelos y desarrollo de mercados locales. Los resultados muestran mejoras en la producción agrícola y la conservación del medio ambiente.",
    excerpt: "200 agricultores implementan prácticas sostenibles en 500 hectáreas con apoyo del programa de Desarrollo Rural.",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    imageAlt: "Agricultores trabajando en campo sostenible",
    category: "NOTICIAS",
    isFeatured: false,
    programaId: null
  }
];

async function crearNoticiasFicticias() {
  try {
    console.log('🚀 Iniciando creación de noticias ficticias...');

    // Buscar un usuario administrador para asignar como autor
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRADOR' }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario administrador.');
      return;
    }

    // Obtener programas para asignar noticias
    const programas = await prisma.programas.findMany();
    
    // Mapear programas por nombre
    const programasMap = {
      'Educación Infantil': programas.find(p => p.nombreSector === 'Educación Infantil'),
      'Salud Comunitaria': programas.find(p => p.nombreSector === 'Salud Comunitaria'),
      'Desarrollo Económico Juvenil': programas.find(p => p.nombreSector === 'Desarrollo Económico Juvenil'),
      'Protección Infantil': programas.find(p => p.nombreSector === 'Protección Infantil'),
      'Agua y Saneamiento': programas.find(p => p.nombreSector === 'Agua y Saneamiento'),
      'Empoderamiento de Mujeres': programas.find(p => p.nombreSector === 'Empoderamiento de Mujeres'),
      'Desarrollo de la Primera Infancia': programas.find(p => p.nombreSector === 'Desarrollo de la Primera Infancia'),
      'Desarrollo Rural Sostenible': programas.find(p => p.nombreSector === 'Desarrollo Rural Sostenible')
    };

    // Asignar programas a noticias
    const noticiasConProgramas = [
      { noticia: 0, programa: 'Educación Infantil' },
      { noticia: 1, programa: 'Salud Comunitaria' },
      { noticia: 2, programa: 'Desarrollo Económico Juvenil' },
      { noticia: 3, programa: 'Protección Infantil' },
      { noticia: 4, programa: 'Agua y Saneamiento' },
      { noticia: 5, programa: 'Empoderamiento de Mujeres' },
      { noticia: 6, programa: 'Desarrollo de la Primera Infancia' },
      { noticia: 7, programa: 'Desarrollo Rural Sostenible' }
    ];

    // Crear noticias ficticias
    for (const { noticia: indiceNoticia, programa: nombrePrograma } of noticiasConProgramas) {
      const programa = programasMap[nombrePrograma];
      const noticiaData = noticiasFicticias[indiceNoticia];
      
      const noticia = await prisma.news.create({
        data: {
          ...noticiaData,
          programaId: programa?.id || null,
          createdBy: adminUser.id,
          publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Últimos 30 días
        }
      });

      console.log(`✅ Noticia creada: ${noticia.title}`);
      if (programa) {
        console.log(`   📌 Asociada al programa: ${programa.nombreSector}`);
      }
    }

    console.log('🎉 ¡Noticias ficticias creadas exitosamente!');
    console.log(`📊 Total de noticias creadas: ${noticiasFicticias.length}`);

  } catch (error) {
    console.error('❌ Error creando noticias ficticias:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
crearNoticiasFicticias();
