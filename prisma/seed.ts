import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Iniciando proceso de seed para Estrella Sur...');

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
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const gestorPassword = await bcrypt.hash('Gestor123!', 12);

    const admin = await prisma.user.create({
      data: {
      email: 'admin@estrellasur.com',
      name: 'Administrador Principal',
        password: adminPassword,
        role: 'ADMINISTRADOR',
      isActive: true,
      mustChangePassword: true,
        emailVerified: new Date(),
    },
    });

    const gestor = await prisma.user.create({
      data: {
      email: 'gestor@estrellasur.com',
      name: 'Gestor de Contenido',
        password: gestorPassword,
        role: 'GESTOR',
      isActive: true,
      mustChangePassword: true,
      emailVerified: new Date(),
    },
    });

    console.log('✅ Usuarios creados');

    // Crear programas
    console.log('📚 Creando programas...');
    const programa1 = await prisma.programas.create({
      data: {
        nombreSector: 'Educación Infantil',
        descripcion: 'Programa integral de desarrollo infantil que promueve el aprendizaje temprano y el desarrollo cognitivo en niños de 0 a 6 años.',
        videoPresentacion: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        alineacionODS: 'ODS 4: Educación de Calidad - Garantizar una educación inclusiva, equitativa y de calidad.',
        subareasResultados: 'Desarrollo cognitivo temprano, Alfabetización emergente, Habilidades socioemocionales',
        resultados: '95% de los niños muestran mejoras en habilidades cognitivas, 80% de las familias reportan mejoras en prácticas de crianza',
        gruposAtencion: 'Niños de 0 a 6 años, Madres embarazadas, Familias en situación de vulnerabilidad',
        contenidosTemas: 'Estimulación temprana, Lectura en voz alta, Juegos educativos, Nutrición balanceada',
        enlaceMasInformacion: 'https://estrellasur.org/programas/educacion-infantil',
      isActive: true,
      isFeatured: true,
        createdBy: admin.id,
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
        imageAlt: 'Niños en programa de educación infantil',
      },
    });

    const programa2 = await prisma.programas.create({
      data: {
        nombreSector: 'Salud Comunitaria',
        descripcion: 'Programa de salud preventiva que fortalece los sistemas de salud comunitarios y promueve prácticas saludables.',
        videoPresentacion: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        alineacionODS: 'ODS 3: Salud y Bienestar - Asegurar vidas saludables y promover el bienestar para todos.',
        subareasResultados: 'Prevención de enfermedades, Promoción de la salud, Capacitación comunitaria',
        resultados: '70% de reducción en enfermedades prevenibles, 85% de cobertura de vacunación',
        gruposAtencion: 'Comunidades rurales, Mujeres en edad reproductiva, Niños menores de 5 años',
        contenidosTemas: 'Prevención de enfermedades, Nutrición adecuada, Higiene personal, Salud reproductiva',
        enlaceMasInformacion: 'https://estrellasur.org/programas/salud-comunitaria',
      isActive: true,
      isFeatured: true,
        createdBy: admin.id,
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
        imageAlt: 'Promotora de salud comunitaria',
      },
    });

    const programa3 = await prisma.programas.create({
      data: {
        nombreSector: 'Desarrollo Económico Juvenil',
        descripcion: 'Programa que empodera a jóvenes de 15 a 24 años con habilidades técnicas y empresariales para generar ingresos sostenibles.',
        videoPresentacion: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        alineacionODS: 'ODS 8: Trabajo Decente y Crecimiento Económico - Promover el crecimiento económico sostenido.',
        subareasResultados: 'Capacitación técnica, Desarrollo empresarial, Acceso a financiamiento',
        resultados: '75% de jóvenes completan capacitación técnica, 60% inician emprendimientos exitosos',
        gruposAtencion: 'Jóvenes de 15 a 24 años, Mujeres jóvenes, Población rural',
        contenidosTemas: 'Habilidades técnicas, Planificación empresarial, Gestión financiera, Marketing',
        enlaceMasInformacion: 'https://estrellasur.org/programas/desarrollo-economico-juvenil',
      isActive: true,
      isFeatured: false,
        createdBy: gestor.id,
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
        imageAlt: 'Jóvenes en capacitación técnica',
      },
    });

    console.log('✅ Programas creados');

    // Crear metodologías
    console.log('🔬 Creando metodologías...');
    const metodologia1 = await prisma.methodology.create({
      data: {
      title: 'Aprendizaje Basado en Proyectos',
        description: 'Metodología educativa que involucra a los estudiantes en proyectos del mundo real para desarrollar habilidades del siglo XXI.',
      shortDescription: 'Desarrollo de habilidades a través de proyectos reales',
      ageGroup: '6-12 años',
        sectors: ['EDUCACION'],
      targetAudience: 'Estudiantes de primaria',
        objectives: 'Fomentar el pensamiento crítico, la colaboración y la resolución de problemas a través de proyectos interdisciplinarios.',
      implementation: 'Proyectos interdisciplinarios de 8 semanas con seguimiento semanal, presentaciones finales y evaluación por pares.',
        results: 'Mejora del 40% en habilidades de resolución de problemas, aumento del 60% en participación estudiantil.',
        methodology: 'Los estudiantes identifican problemas reales en su comunidad, investigan soluciones, diseñan prototipos y presentan sus hallazgos.',
      resources: 'Materiales de investigación, herramientas tecnológicas, espacios de trabajo colaborativo y mentores de la comunidad.',
        evaluation: 'Evaluación continua basada en rúbricas, autoevaluación, evaluación por pares y presentaciones finales.',
      isActive: true,
      isFeatured: true,
        createdBy: admin.id,
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
        imageAlt: 'Estudiantes trabajando en proyecto',
    },
    });

    const metodologia2 = await prisma.methodology.create({
      data: {
      title: 'Salud Comunitaria Preventiva',
        description: 'Programa integral de salud que empodera a las comunidades para prevenir enfermedades y promover estilos de vida saludables.',
      shortDescription: 'Prevención y promoción de salud comunitaria',
      ageGroup: 'Todas las edades',
        sectors: ['SALUD'],
      targetAudience: 'Comunidades rurales',
        objectives: 'Reducir enfermedades prevenibles en un 60%, mejorar el acceso a servicios de salud básicos.',
        implementation: 'Talleres mensuales, seguimiento personalizado, campañas de vacunación, educación nutricional.',
        results: 'Reducción del 45% en consultas por enfermedades prevenibles, formación de 25 promotores de salud.',
        methodology: 'Identificación participativa de problemas de salud, formación de promotores comunitarios, implementación de estrategias preventivas.',
      resources: 'Materiales educativos, equipos básicos de salud, medicamentos preventivos y transporte para campañas móviles.',
        evaluation: 'Indicadores de salud comunitaria, encuestas de satisfacción, seguimiento de casos.',
      isActive: true,
      isFeatured: false,
        createdBy: gestor.id,
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
        imageAlt: 'Promotora de salud comunitaria',
      },
    });

    console.log('✅ Metodologías creadas');

    // Crear proyectos
    console.log('🚀 Creando proyectos...');
    const proyecto1 = await prisma.project.create({
      data: {
      title: 'SEMBRANDO UNA IDEA, COSECHANDO UN FUTURO',
      executionStart: new Date('2016-04-01'),
      executionEnd: new Date('2016-09-30'),
        context: 'La falta de oportunidades laborales para jóvenes, la carencia de orientación vocacional, genera procesos de incertidumbre en jóvenes y señoritas.',
        objectives: 'El proyecto busca el desarrollo de habilidades blandas en jóvenes y señoritas, acompañado de un proceso de fortalecimiento en la identificación de ideas de negocio.',
        content: 'El proyecto desarrolla habilidades en liderazgo en jóvenes a través de la escuela de emprendedores. Los 98 jóvenes y señoritas desarrollan competencias en la elaboración de un plan de negocio.',
      strategicAllies: 'Confederación de Microempresarios',
      financing: 'Barnfondem\nChildFund Bolivia',
      isActive: true,
      isFeatured: true,
        createdBy: admin.id,
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
        imageAlt: 'Jóvenes emprendedores',
    },
    });

    const proyecto2 = await prisma.project.create({
      data: {
      title: 'EDUCACIÓN DIGITAL PARA TODOS',
      executionStart: new Date('2023-01-15'),
      executionEnd: new Date('2023-12-15'),
        context: 'La pandemia aceleró la necesidad de digitalización en la educación, pero muchas comunidades rurales quedaron rezagadas.',
        objectives: 'Capacitar a 200 docentes rurales en herramientas digitales educativas y dotar de equipamiento tecnológico básico a 50 escuelas rurales.',
        content: 'El proyecto incluye capacitación intensiva en herramientas digitales, entrega de tablets y laptops a escuelas, instalación de internet satelital.',
      strategicAllies: 'Ministerio de Educación\nFundación Telefónica\nCisco Systems',
      financing: 'Banco Mundial\nFondo de Desarrollo Digital\nEmpresas privadas',
      isActive: true,
      isFeatured: true,
        createdBy: gestor.id,
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
        imageAlt: 'Educación digital rural',
      },
    });

    console.log('✅ Proyectos creados');

    // Crear noticias con relaciones
    console.log('📰 Creando noticias...');
    const noticia1 = await prisma.news.create({
      data: {
        title: 'Nueva Iniciativa de Apoyo Educativo',
        content: 'Estamos emocionados de anunciar el lanzamiento de nuestra nueva iniciativa de apoyo educativo que beneficiará a más de 500 niños en comunidades rurales. Este programa incluye materiales escolares, capacitación docente y apoyo nutricional.',
        excerpt: 'Nueva iniciativa que beneficiará a más de 500 niños en comunidades rurales con apoyo educativo integral.',
      isActive: true,
      isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
        imageAlt: 'Niños estudiando en aula rural',
        createdBy: gestor.id,
        programaId: programa1.id,
      },
    });

    const noticia2 = await prisma.news.create({
      data: {
        title: 'Campaña de Recaudación de Fondos Exitosos',
        content: 'Gracias al apoyo de nuestra comunidad, hemos logrado recaudar $50,000 para nuestro programa de alimentación escolar. Estos fondos nos permitirán proporcionar comidas nutritivas a 200 niños durante todo el año escolar.',
        excerpt: 'Campaña exitosa que recaudó $50,000 para el programa de alimentación escolar.',
      isActive: true,
      isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop',
        imageAlt: 'Niños recibiendo comida en la escuela',
        createdBy: gestor.id,
        programaId: programa2.id,
      },
    });

    const noticia3 = await prisma.news.create({
      data: {
        title: 'Expansión de Nuestras Operaciones',
        content: 'Estrella Sur está expandiendo sus operaciones a tres nuevas regiones del país. Esta expansión nos permitirá llegar a más comunidades necesitadas y duplicar nuestro impacto en los próximos dos años.',
        excerpt: 'Expansión a tres nuevas regiones para duplicar nuestro impacto social.',
      isActive: true,
      isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop',
        imageAlt: 'Mapa de expansión de operaciones',
        createdBy: gestor.id,
        methodologyId: metodologia1.id,
      },
    });

    const noticia4 = await prisma.news.create({
      data: {
        title: 'Voluntarios Destacados del Mes',
        content: 'Reconocemos a nuestros voluntarios destacados del mes: María González, Juan Pérez y Ana Rodríguez. Su dedicación y compromiso han sido fundamentales para el éxito de nuestros programas comunitarios.',
        excerpt: 'Reconocimiento a voluntarios destacados por su compromiso con la comunidad.',
      isActive: true,
      isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
        imageAlt: 'Grupo de voluntarios trabajando',
        createdBy: gestor.id,
        projectId: proyecto1.id,
      },
    });

    console.log('✅ Noticias creadas');

    // Crear eventos
    console.log('📅 Creando eventos...');
    const evento1 = await prisma.event.create({
      data: {
      title: 'Jornada de salud comunitaria en San José',
      description: 'Jornada médica gratuita que incluye consultas generales, vacunación y exámenes preventivos para toda la comunidad.',
        content: 'La jornada de salud comunitaria se realizará en el Centro Comunitario de San José el próximo sábado. Contaremos con médicos especialistas, enfermeras y voluntarios capacitados para atender a toda la comunidad.',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
      imageAlt: 'Jornada médica comunitaria',
      eventDate: new Date('2024-12-15T08:00:00Z'),
      location: 'Centro Comunitario San José, Calle Principal #123',
      isActive: true,
      isFeatured: true,
        createdBy: gestor.id,
    },
    });

    const evento2 = await prisma.event.create({
      data: {
      title: 'Taller de emprendimiento para mujeres',
      description: 'Capacitación especializada en creación y gestión de microempresas dirigida exclusivamente a mujeres de la comunidad.',
        content: 'Este taller de 3 días está diseñado para empoderar a las mujeres de la comunidad con herramientas prácticas para iniciar y gestionar sus propios negocios.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
      imageAlt: 'Mujeres en taller de emprendimiento',
      eventDate: new Date('2024-12-20T09:00:00Z'),
      location: 'Salón Comunitario Las Flores',
      isActive: true,
      isFeatured: true,
        createdBy: gestor.id,
      },
    });

    console.log('✅ Eventos creados');

    // Crear historias
    console.log('📖 Creando historias...');
    const historia1 = await prisma.stories.create({
      data: {
        id: 'story-001',
        title: 'Transformando vidas en la comunidad de San José',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
        imageAlt: 'Mujer emprendedora en su tienda local',
        content: 'Conoce la historia de María, una madre soltera que logró emprender su propio negocio gracias al programa de microcréditos de Estrella Sur.',
        summary: 'Conoce la historia de María, una madre soltera que logró emprender su propio negocio gracias al programa de microcréditos de Estrella Sur.',
        isActive: true,
        createdBy: gestor.id,
      },
    });

    const historia2 = await prisma.stories.create({
      data: {
        id: 'story-002',
        title: 'Educación que cambia el futuro',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
        imageAlt: 'Jóvenes aprendiendo computación',
        content: 'El programa de alfabetización digital ha beneficiado a más de 500 jóvenes en zonas rurales, abriendo nuevas oportunidades de empleo.',
        summary: 'El programa de alfabetización digital ha beneficiado a más de 500 jóvenes en zonas rurales, abriendo nuevas oportunidades de empleo.',
      isActive: true,
        createdBy: gestor.id,
      },
    });

    console.log('✅ Historias creadas');

    // Crear aliados
    console.log('🤝 Creando aliados...');
    const aliado1 = await prisma.allies.create({
      data: {
        id: 'ally-001',
        name: 'Fundación Esperanza',
        role: 'Socio Estratégico',
        description: 'Organización sin fines de lucro con más de 20 años de experiencia en desarrollo comunitario y programas de educación.',
        imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop',
        imageAlt: 'Logo de Fundación Esperanza',
      isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
    });

    const aliado2 = await prisma.allies.create({
      data: {
        id: 'ally-002',
        name: 'Corporación Desarrollo Rural',
        role: 'Aliado Técnico',
        description: 'Especialistas en proyectos de desarrollo rural sostenible y capacitación agrícola para comunidades campesinas.',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
        imageAlt: 'Logo de Corporación Desarrollo Rural',
      isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
    });

    console.log('✅ Aliados creados');

    // Crear recursos
    console.log('📁 Creando recursos...');
    const recurso1 = await prisma.resource.create({
      data: {
      title: 'Guía de Metodologías Participativas',
      description: 'Manual completo sobre metodologías participativas para el desarrollo comunitario',
      fileName: 'guia-metodologias-participativas.pdf',
      fileUrl: 'https://estrellasur.org/resources/guia-metodologias.pdf',
      fileSize: 2048000,
      fileType: 'application/pdf',
        category: 'PUBLICACIONES',
        subcategory: 'MANUALES',
      thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
      duration: null,
      isActive: true,
      isFeatured: true,
      downloadCount: 150,
        createdBy: gestor.id,
    },
    });

    const recurso2 = await prisma.resource.create({
      data: {
      title: 'Video: Introducción al Desarrollo Comunitario',
      description: 'Video educativo sobre conceptos básicos del desarrollo comunitario',
      fileName: 'introduccion-desarrollo-comunitario.mp4',
      fileUrl: 'https://estrellasur.org/resources/video-desarrollo.mp4',
      fileSize: 52428800,
      fileType: 'video/mp4',
        category: 'CENTRO_MULTIMEDIA',
        subcategory: 'VIDEOS',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300',
      duration: 1800,
      isActive: true,
      isFeatured: false,
      downloadCount: 75,
        createdBy: gestor.id,
      },
    });

    console.log('✅ Recursos creados');

    // Crear testimonios en video
    console.log('🎥 Creando testimonios en video...');
    const testimonio1 = await prisma.videoTestimonial.create({
      data: {
      title: 'Testimonio de María - Beneficiaria del Programa Educativo',
      description: 'María comparte su experiencia como beneficiaria del programa educativo de Estrella Sur',
      youtubeUrl: 'https://www.youtube.com/watch?v=example-testimonial-1',
      thumbnailUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      duration: 300,
      isActive: true,
      isFeatured: true,
        createdBy: gestor.id,
    },
    });

    const testimonio2 = await prisma.videoTestimonial.create({
      data: {
      title: 'Testimonio de Carlos - Facilitador Comunitario',
      description: 'Carlos habla sobre su trabajo como facilitador comunitario',
      youtubeUrl: 'https://www.youtube.com/watch?v=example-testimonial-2',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      duration: 240,
      isActive: true,
      isFeatured: false,
        createdBy: gestor.id,
      },
    });

    console.log('✅ Testimonios creados');

    // Crear documentos de transparencia
    console.log('📄 Creando documentos de transparencia...');
    const documento1 = await prisma.transparencyDocument.create({
      data: {
      title: 'Informe Anual 2023',
      description: 'Informe anual de actividades y resultados de Estrella Sur',
      fileName: 'informe-anual-2023.pdf',
      fileUrl: 'https://estrellasur.org/transparency/informe-2023.pdf',
      fileSize: 5120000,
      fileType: 'application/pdf',
        category: 'INFORMES_ANUALES',
      year: 2023,
      isActive: true,
      isFeatured: true,
        createdBy: admin.id,
    },
    });

    const documento2 = await prisma.transparencyDocument.create({
      data: {
      title: 'Rendición de Cuentas Q1 2024',
      description: 'Rendición de cuentas del primer trimestre de 2024',
      fileName: 'rendicion-cuentas-q1-2024.pdf',
      fileUrl: 'https://estrellasur.org/transparency/rendicion-q1-2024.pdf',
      fileSize: 2560000,
      fileType: 'application/pdf',
        category: 'RENDICION_CUENTAS',
      year: 2024,
      isActive: true,
      isFeatured: false,
        createdBy: admin.id,
      },
    });

    console.log('✅ Documentos de transparencia creados');

    // Crear biblioteca de imágenes
    console.log('🖼️ Creando biblioteca de imágenes...');
    const imagen1 = await prisma.imageLibrary.create({
      data: {
      title: 'Niños en aula de clase',
      description: 'Niños participando en actividades educativas en el programa de Educación Infantil',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      imageAlt: 'Niños aprendiendo en el aula',
      fileName: 'ninos-aula-clase.jpg',
      fileSize: 1024000,
      fileType: 'image/jpeg',
      isActive: true,
      isFeatured: true,
        createdBy: gestor.id,
        programaId: programa1.id,
    },
    });

    const imagen2 = await prisma.imageLibrary.create({
      data: {
      title: 'Promotora de salud comunitaria',
      description: 'Promotora de salud capacitando a la comunidad sobre prácticas saludables',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      imageAlt: 'Promotora de salud en la comunidad',
      fileName: 'promotora-salud.jpg',
      fileSize: 1200000,
      fileType: 'image/jpeg',
      isActive: true,
      isFeatured: true,
        createdBy: gestor.id,
        programaId: programa2.id,
        },
      });

    console.log('✅ Biblioteca de imágenes creada');

    console.log('🎉 ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen de datos creados:');
    console.log(`👥 Usuarios: 2`);
    console.log(`📚 Programas: 3`);
    console.log(`🔬 Metodologías: 2`);
    console.log(`🚀 Proyectos: 2`);
    console.log(`📰 Noticias: 4 (con relaciones a programas, metodologías y proyectos)`);
    console.log(`📅 Eventos: 2`);
    console.log(`📖 Historias: 2`);
    console.log(`🤝 Aliados: 2`);
    console.log(`📁 Recursos: 2`);
    console.log(`🎥 Testimonios: 2`);
    console.log(`📄 Documentos: 2`);
    console.log(`🖼️ Imágenes: 2`);

    console.log('\n🔑 Credenciales de acceso:');
    console.log('Administrador: admin@estrellasur.com / Admin123!');
    console.log('Gestor: gestor@estrellasur.com / Gestor123!');

    console.log('\n🔗 Relaciones creadas:');
    console.log(`- Noticia 1 vinculada al Programa: ${programa1.nombreSector}`);
    console.log(`- Noticia 2 vinculada al Programa: ${programa2.nombreSector}`);
    console.log(`- Noticia 3 vinculada a la Metodología: ${metodologia1.title}`);
    console.log(`- Noticia 4 vinculada al Proyecto: ${proyecto1.title}`);

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
