import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Datos de ejemplo para el CMS de Estrella Sur
const seedData = {
  users: [
    {
      email: 'admin@estrellasur.org',
      name: 'María González',
      password: 'admin123',
      role: 'ADMINISTRADOR' as const,
      isActive: true,
      emailVerified: new Date(),
    },
    {
      email: 'supervisor@estrellasur.org',
      name: 'Carlos Rodríguez',
      password: 'supervisor123',
      role: 'SUPERVISOR' as const,
      isActive: true,
      emailVerified: new Date(),
    },
    {
      email: 'tecnico1@estrellasur.org',
      name: 'Ana Martínez',
      password: 'tecnico123',
      role: 'TECNICO' as const,
      isActive: true,
      emailVerified: new Date(),
    },
    {
      email: 'tecnico2@estrellasur.org',
      name: 'Luis Fernández',
      password: 'tecnico123',
      role: 'TECNICO' as const,
      isActive: true,
      emailVerified: new Date(),
    },
    {
      email: 'comunicaciones@estrellasur.org',
      name: 'Sofia Herrera',
      password: 'comunicaciones123',
      role: 'TECNICO' as const,
      isActive: true,
      emailVerified: new Date(),
    },
  ],

  stories: [
    {
      id: 'story-1',
      title: 'Transformando vidas en la comunidad',
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      imageAlt: 'Comunidad trabajando juntos',
      content: 'Esta es la historia de cómo nuestra organización ha transformado vidas en la comunidad local.',
      summary: 'Historia inspiradora de transformación comunitaria',
      isActive: true,
    },
    {
      id: 'story-2',
      title: 'Educación para el futuro',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      imageAlt: 'Niños estudiando',
      content: 'Programa educativo que está cambiando el futuro de nuestros niños.',
      summary: 'Programa educativo innovador',
      isActive: true,
    },
  ],

  allies: [
    {
      id: 'ally-1',
      name: 'Fundación Esperanza',
      role: 'Aliado Estratégico',
      description: 'Organización dedicada al desarrollo social',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400',
      imageAlt: 'Logo Fundación Esperanza',
      isActive: true,
      isFeatured: true,
    },
    {
      id: 'ally-2',
      name: 'Universidad del Sur',
      role: 'Institución Académica',
      description: 'Universidad comprometida con la investigación social',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
      imageAlt: 'Logo Universidad del Sur',
      isActive: true,
      isFeatured: false,
    },
  ],

  programs: [
    {
      id: 'program-1',
      nombreSector: 'Educación Comunitaria',
      descripcion: 'Programa integral de educación para comunidades vulnerables',
      videoPresentacion: 'https://www.youtube.com/watch?v=example1',
      alineacionODS: 'ODS 4: Educación de Calidad',
      subareasResultados: 'Alfabetización, Capacitación técnica, Desarrollo de habilidades',
      resultados: 'Más de 500 personas capacitadas en el último año',
      gruposAtencion: 'Niños, jóvenes y adultos de comunidades vulnerables',
      contenidosTemas: 'Lectoescritura, Matemáticas básicas, Habilidades digitales',
      enlaceMasInformacion: 'https://estrellasur.org/educacion',
      isActive: true,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      imageAlt: 'Programa de educación comunitaria',
    },
    {
      id: 'program-2',
      nombreSector: 'Salud Preventiva',
      descripcion: 'Iniciativa de salud preventiva y promoción de hábitos saludables',
      videoPresentacion: 'https://www.youtube.com/watch?v=example2',
      alineacionODS: 'ODS 3: Salud y Bienestar',
      subareasResultados: 'Prevención, Promoción, Atención primaria',
      resultados: 'Reducción del 30% en enfermedades prevenibles',
      gruposAtencion: 'Familias, mujeres embarazadas, adultos mayores',
      contenidosTemas: 'Nutrición, Higiene, Prevención de enfermedades',
      enlaceMasInformacion: 'https://estrellasur.org/salud',
      isActive: true,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      imageAlt: 'Programa de salud preventiva',
    },
  ],

  methodologies: [
    {
      id: 'methodology-1',
      title: 'Aprendizaje Participativo',
      description: 'Metodología que involucra activamente a los participantes en su proceso de aprendizaje',
      shortDescription: 'Enfoque participativo para el aprendizaje',
      ageGroup: 'Todas las edades',
      category: 'EDUCACION' as const,
      targetAudience: 'Educadores, facilitadores, líderes comunitarios',
      objectives: 'Promover el aprendizaje activo y participativo',
      implementation: 'Talleres interactivos, dinámicas grupales, proyectos colaborativos',
      results: 'Mayor engagement y retención del conocimiento',
      methodology: 'Enfoque constructivista con elementos de gamificación',
      resources: 'Materiales didácticos, espacios colaborativos, tecnología',
      evaluation: 'Evaluación continua y feedback de participantes',
      isActive: true,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
      imageAlt: 'Metodología de aprendizaje participativo',
    },
    {
      id: 'methodology-2',
      title: 'Intervención Comunitaria',
      description: 'Metodología para el desarrollo comunitario sostenible',
      shortDescription: 'Desarrollo comunitario sostenible',
      ageGroup: 'Adultos',
      category: 'SOCIAL' as const,
      targetAudience: 'Trabajadores sociales, líderes comunitarios',
      objectives: 'Fortalecer capacidades comunitarias',
      implementation: 'Diagnóstico participativo, planificación conjunta, ejecución colaborativa',
      results: 'Comunidades más organizadas y autogestionarias',
      methodology: 'Enfoque de desarrollo comunitario participativo',
      resources: 'Herramientas de diagnóstico, espacios de encuentro',
      evaluation: 'Indicadores de desarrollo comunitario',
      isActive: true,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600',
      imageAlt: 'Intervención comunitaria',
    },
  ],

  projects: [
    {
      id: 'project-1',
      title: 'Escuelas Rurales Digitales',
      executionStart: new Date('2023-01-01'),
      executionEnd: new Date('2024-12-31'),
      context: 'Comunidades rurales con limitado acceso a tecnología educativa',
      objectives: 'Implementar tecnología digital en escuelas rurales',
      content: 'Proyecto integral que incluye equipamiento, capacitación docente y seguimiento',
      strategicAllies: 'Ministerio de Educación, Fundación Tecnológica',
      financing: 'Fondo de Desarrollo Rural',
      isActive: true,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      imageAlt: 'Escuelas rurales digitales',
    },
    {
      id: 'project-2',
      title: 'Huertos Comunitarios Sostenibles',
      executionStart: new Date('2023-06-01'),
      executionEnd: new Date('2025-05-31'),
      context: 'Comunidades urbanas con problemas de seguridad alimentaria',
      objectives: 'Crear huertos comunitarios para mejorar la nutrición',
      content: 'Capacitación en agricultura urbana, creación de huertos y comercialización',
      strategicAllies: 'Municipalidad, Cooperativa Agrícola',
      financing: 'Programa de Desarrollo Urbano',
      isActive: true,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      imageAlt: 'Huertos comunitarios',
    },
  ],

  news: [
    {
      id: 'news-1',
      title: 'Nuevo programa educativo llega a comunidades rurales',
      content: 'Estrella Sur lanza un innovador programa educativo que beneficiará a más de 1000 niños en comunidades rurales del sur del país.',
      excerpt: 'Programa educativo innovador para comunidades rurales',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      imageAlt: 'Niños en programa educativo',
      category: 'NOTICIAS' as const,
      isActive: true,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      id: 'news-2',
      title: 'Alianza estratégica con Fundación Esperanza',
      content: 'Estrella Sur y Fundación Esperanza firman alianza estratégica para fortalecer programas de desarrollo social.',
      excerpt: 'Nueva alianza para el desarrollo social',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
      imageAlt: 'Firma de alianza estratégica',
      category: 'COMPANIA' as const,
      isActive: true,
      isFeatured: false,
      publishedAt: new Date(),
    },
    {
      id: 'news-3',
      title: 'Campaña de recaudación de fondos 2024',
      content: 'Únete a nuestra campaña de recaudación de fondos para continuar apoyando a las comunidades más vulnerables.',
      excerpt: 'Campaña de recaudación de fondos',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
      imageAlt: 'Campaña de recaudación',
      category: 'FUNDRAISING' as const,
      isActive: true,
      isFeatured: true,
      publishedAt: new Date(),
    },
  ],

  events: [
    {
      id: 'event-1',
      title: 'Taller de Capacitación Docente',
      description: 'Taller intensivo para docentes sobre nuevas metodologías educativas',
      content: 'Este taller incluye sesiones teóricas y prácticas sobre metodologías innovadoras',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      imageAlt: 'Taller de capacitación docente',
      eventDate: new Date('2024-03-15'),
      location: 'Centro de Convenciones Estrella Sur',
      isActive: true,
      isFeatured: true,
    },
    {
      id: 'event-2',
      title: 'Feria de Desarrollo Comunitario',
      description: 'Exposición de proyectos y logros comunitarios',
      content: 'Evento anual que muestra los avances en desarrollo comunitario',
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      imageAlt: 'Feria de desarrollo comunitario',
      eventDate: new Date('2024-06-20'),
      location: 'Parque Central',
      isActive: true,
      isFeatured: false,
    },
  ],

  resources: [
    {
      id: 'resource-1',
      title: 'Guía de Metodologías Participativas',
      description: 'Manual completo sobre metodologías participativas para el desarrollo comunitario',
      fileName: 'guia-metodologias-participativas.pdf',
      fileUrl: 'https://estrellasur.org/resources/guia-metodologias.pdf',
      fileSize: 2048000,
      fileType: 'application/pdf',
      category: 'PUBLICACIONES' as const,
      subcategory: 'MANUALES' as const,
      thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
      duration: null,
      isActive: true,
      isFeatured: true,
      downloadCount: 150,
    },
    {
      id: 'resource-2',
      title: 'Video: Introducción al Desarrollo Comunitario',
      description: 'Video educativo sobre conceptos básicos del desarrollo comunitario',
      fileName: 'introduccion-desarrollo-comunitario.mp4',
      fileUrl: 'https://estrellasur.org/resources/video-desarrollo.mp4',
      fileSize: 52428800,
      fileType: 'video/mp4',
      category: 'CENTRO_MULTIMEDIA' as const,
      subcategory: 'VIDEOS' as const,
      thumbnailUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300',
      duration: 1800,
      isActive: true,
      isFeatured: false,
      downloadCount: 75,
    },
  ],

  videoTestimonials: [
    {
      id: 'testimonial-1',
      title: 'Testimonio de María - Beneficiaria del Programa Educativo',
      description: 'María comparte su experiencia como beneficiaria del programa educativo de Estrella Sur',
      youtubeUrl: 'https://www.youtube.com/watch?v=example-testimonial-1',
      thumbnailUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      duration: 300,
      isActive: true,
      isFeatured: true,
    },
    {
      id: 'testimonial-2',
      title: 'Testimonio de Carlos - Facilitador Comunitario',
      description: 'Carlos habla sobre su trabajo como facilitador comunitario',
      youtubeUrl: 'https://www.youtube.com/watch?v=example-testimonial-2',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      duration: 240,
      isActive: true,
      isFeatured: false,
    },
  ],

  transparencyDocuments: [
    {
      id: 'doc-1',
      title: 'Informe Anual 2023',
      description: 'Informe anual de actividades y resultados de Estrella Sur',
      fileName: 'informe-anual-2023.pdf',
      fileUrl: 'https://estrellasur.org/transparency/informe-2023.pdf',
      fileSize: 5120000,
      fileType: 'application/pdf',
      category: 'INFORMES_ANUALES' as const,
      year: 2023,
      isActive: true,
      isFeatured: true,
    },
    {
      id: 'doc-2',
      title: 'Rendición de Cuentas Q1 2024',
      description: 'Rendición de cuentas del primer trimestre de 2024',
      fileName: 'rendicion-cuentas-q1-2024.pdf',
      fileUrl: 'https://estrellasur.org/transparency/rendicion-q1-2024.pdf',
      fileSize: 2560000,
      fileType: 'application/pdf',
      category: 'RENDICION_CUENTAS' as const,
      year: 2024,
      isActive: true,
      isFeatured: false,
    },
  ],

  imageLibrary: [
    {
      id: 'image-1',
      title: 'Actividad Comunitaria',
      description: 'Imagen de actividad comunitaria en desarrollo',
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      imageAlt: 'Actividad comunitaria',
      fileName: 'actividad-comunitaria.jpg',
      fileSize: 1024000,
      fileType: 'image/jpeg',
      isActive: true,
      isFeatured: true,
    },
    {
      id: 'image-2',
      title: 'Taller Educativo',
      description: 'Imagen de taller educativo en acción',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      imageAlt: 'Taller educativo',
      fileName: 'taller-educativo.jpg',
      fileSize: 1200000,
      fileType: 'image/jpeg',
      isActive: true,
      isFeatured: false,
    },
  ],
};

async function main() {
  console.log('🌱 Iniciando proceso de seed...');

  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.imageLibrary.deleteMany();
    await prisma.transparencyDocument.deleteMany();
    await prisma.videoTestimonial.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.event.deleteMany();
    await prisma.news.deleteMany();
    await prisma.project.deleteMany();
    await prisma.methodology.deleteMany();
    await prisma.programas.deleteMany();
    await prisma.allies.deleteMany();
    await prisma.stories.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Datos existentes eliminados');

    // Crear usuarios
    console.log('👥 Creando usuarios...');
    const createdUsers = [];
    for (const userData of seedData.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
      createdUsers.push(user);
      console.log(`✅ Usuario creado: ${user.email}`);
    }

    // Crear historias
    console.log('📖 Creando historias...');
    for (const storyData of seedData.stories) {
      const story = await prisma.stories.create({
        data: {
          ...storyData,
          createdBy: createdUsers[0].id, // Asignar al primer usuario
        },
      });
      console.log(`✅ Historia creada: ${story.title}`);
    }

    // Crear aliados
    console.log('🤝 Creando aliados...');
    for (const allyData of seedData.allies) {
      const ally = await prisma.allies.create({
        data: {
          ...allyData,
          createdBy: createdUsers[0].id,
        },
      });
      console.log(`✅ Aliado creado: ${ally.name}`);
    }

    // Crear programas
    console.log('📚 Creando programas...');
    const createdPrograms = [];
    for (const programData of seedData.programs) {
      const program = await prisma.programas.create({
        data: {
          ...programData,
          createdBy: createdUsers[0].id,
        },
      });
      createdPrograms.push(program);
      console.log(`✅ Programa creado: ${program.nombreSector}`);
    }

    // Crear metodologías
    console.log('🔬 Creando metodologías...');
    const createdMethodologies = [];
    for (const methodologyData of seedData.methodologies) {
      const methodology = await prisma.methodology.create({
        data: {
          ...methodologyData,
          createdBy: createdUsers[0].id,
        },
      });
      createdMethodologies.push(methodology);
      console.log(`✅ Metodología creada: ${methodology.title}`);
    }

    // Crear proyectos
    console.log('🚀 Creando proyectos...');
    const createdProjects = [];
    for (const projectData of seedData.projects) {
      const project = await prisma.project.create({
        data: {
          ...projectData,
          createdBy: createdUsers[0].id,
        },
      });
      createdProjects.push(project);
      console.log(`✅ Proyecto creado: ${project.title}`);
    }

    // Crear noticias
    console.log('📰 Creando noticias...');
    for (const newsData of seedData.news) {
      const news = await prisma.news.create({
        data: {
          ...newsData,
          createdBy: createdUsers[0].id,
          programaId: createdPrograms[0].id, // Asignar al primer programa
          methodologyId: createdMethodologies[0].id, // Asignar a la primera metodología
          projectId: createdProjects[0].id, // Asignar al primer proyecto
        },
      });
      console.log(`✅ Noticia creada: ${news.title}`);
    }

    // Crear eventos
    console.log('📅 Creando eventos...');
    for (const eventData of seedData.events) {
      const event = await prisma.event.create({
        data: {
          ...eventData,
          createdBy: createdUsers[0].id,
        },
      });
      console.log(`✅ Evento creado: ${event.title}`);
    }

    // Crear recursos
    console.log('📁 Creando recursos...');
    for (const resourceData of seedData.resources) {
      const resource = await prisma.resource.create({
        data: {
          ...resourceData,
          createdBy: createdUsers[0].id,
        },
      });
      console.log(`✅ Recurso creado: ${resource.title}`);
    }

    // Crear testimonios en video
    console.log('🎥 Creando testimonios en video...');
    for (const testimonialData of seedData.videoTestimonials) {
      const testimonial = await prisma.videoTestimonial.create({
        data: {
          ...testimonialData,
          createdBy: createdUsers[0].id,
        },
      });
      console.log(`✅ Testimonio creado: ${testimonial.title}`);
    }

    // Crear documentos de transparencia
    console.log('📄 Creando documentos de transparencia...');
    for (const docData of seedData.transparencyDocuments) {
      const doc = await prisma.transparencyDocument.create({
        data: {
          ...docData,
          createdBy: createdUsers[0].id,
        },
      });
      console.log(`✅ Documento creado: ${doc.title}`);
    }

    // Crear biblioteca de imágenes
    console.log('🖼️ Creando biblioteca de imágenes...');
    for (const imageData of seedData.imageLibrary) {
      const image = await prisma.imageLibrary.create({
        data: {
          ...imageData,
          createdBy: createdUsers[0].id,
          programaId: createdPrograms[0].id, // Asignar al primer programa
        },
      });
      console.log(`✅ Imagen creada: ${image.title}`);
    }

    console.log('🎉 ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen de datos creados:');
    console.log(`👥 Usuarios: ${createdUsers.length}`);
    console.log(`📖 Historias: ${seedData.stories.length}`);
    console.log(`🤝 Aliados: ${seedData.allies.length}`);
    console.log(`📚 Programas: ${createdPrograms.length}`);
    console.log(`🔬 Metodologías: ${createdMethodologies.length}`);
    console.log(`🚀 Proyectos: ${createdProjects.length}`);
    console.log(`📰 Noticias: ${seedData.news.length}`);
    console.log(`📅 Eventos: ${seedData.events.length}`);
    console.log(`📁 Recursos: ${seedData.resources.length}`);
    console.log(`🎥 Testimonios: ${seedData.videoTestimonials.length}`);
    console.log(`📄 Documentos: ${seedData.transparencyDocuments.length}`);
    console.log(`🖼️ Imágenes: ${seedData.imageLibrary.length}`);

    console.log('\n🔑 Credenciales de acceso:');
    console.log('Admin: admin@estrellasur.org / admin123');
    console.log('Supervisor: supervisor@estrellasur.org / supervisor123');
    console.log('Técnico: tecnico1@estrellasur.org / tecnico123');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed
main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  });
