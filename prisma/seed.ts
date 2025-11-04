import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed completo para Estrella Sur...');

  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.donation.deleteMany();
    await prisma.donationProject.deleteMany();
    await prisma.annualGoal.deleteMany();
    await prisma.imageLibrary.deleteMany();
    await prisma.news.deleteMany();
    await prisma.event.deleteMany();
    await prisma.videoTestimonial.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.transparencyDocument.deleteMany();
    await prisma.project.deleteMany();
    await prisma.methodology.deleteMany();
    await prisma.story.deleteMany();
    await prisma.ally.deleteMany();
    await prisma.program.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Datos existentes eliminados');

    // ==========================================
    // USUARIOS
    // ==========================================
    console.log('👥 Creando usuarios...');
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const MANAGERPassword = await bcrypt.hash('MANAGER123!', 12);
    const CONSULTANTPassword = await bcrypt.hash('CONSULTANT123!', 12);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@estrellasur.org',
        name: 'María Elena Fernández',
        password: adminPassword,
        role: 'ADMINISTRATOR',
      isActive: true,
        mustChangePassword: false,
        emailVerified: new Date(),
    },
    });

    const MANAGER = await prisma.user.create({
      data: {
        email: 'MANAGER@estrellasur.org',
        name: 'Carlos Mendoza',
        password: MANAGERPassword,
        role: 'MANAGER',
      isActive: true,
        mustChangePassword: false,
        emailVerified: new Date(),
      },
    });

    const CONSULTANT = await prisma.user.create({
      data: {
        email: 'CONSULTANT@estrellasur.org',
        name: 'Ana Patricia Quispe',
        password: CONSULTANTPassword,
        role: 'CONSULTANT',
        isActive: true,
        mustChangePassword: false,
      emailVerified: new Date(),
    },
    });

    console.log('✅ Usuarios creados');

    // ==========================================
    // PROGRAMAS
    // ==========================================
    console.log('📚 Creando programas...');
    
    const programas = await prisma.program.createMany({
      data: [
        {
          sectorName: 'Salud Infantil Integral',
          description: 'Programa dirigido a la prevención de enfermedades infantiles y promoción de hábitos saludables en niños y niñas de comunidades rurales.',
          presentationVideo: 'https://www.youtube.com/watch?v=ejemplo',
          odsAlignment: 'ODS 3: Salud y Bienestar',
          resultsAreas: 'Control y seguimiento de salud infantil, Talleres de nutrición infantil',
          results: 'Más de 1,200 niños con esquemas de vacunación completos',
          targetGroups: 'Niños y niñas de 0 a 12 años, Madres gestantes',
          contentTopics: 'Programas de vacunación, Talleres de alimentación complementaria',
          moreInfoLink: 'https://estrellasur.org/salud-infantil',
          imageUrl: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285',
          imageAlt: 'Niños en actividad de promoción de salud',
      isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
        {
          sectorName: 'Educación Rural de Calidad',
          description: 'Programa que fortalece la educación en zonas rurales mediante capacitación docente y provisión de materiales educativos.',
          presentationVideo: 'https://www.youtube.com/watch?v=ejemplo',
          odsAlignment: 'ODS 4: Educación de Calidad',
          resultsAreas: 'Formación docente continua, Materiales educativos innovadores',
          results: '150 docentes capacitados. 2,500 estudiantes con acceso a materiales',
          targetGroups: 'Docentes de escuelas rurales, Estudiantes',
          contentTopics: 'Capacitación docente, Talleres de lectura y escritura',
          moreInfoLink: 'https://estrellasur.org/educacion-rural',
          imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
          imageAlt: 'Docente trabajando con estudiantes rurales',
      isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
        {
          sectorName: 'Fortalecimiento Económico de Mujeres',
          description: 'Programa que empodera económicamente a mujeres mediante capacitación técnica y acceso a microcréditos.',
          presentationVideo: 'https://www.youtube.com/watch?v=ejemplo',
          odsAlignment: 'ODS 5: Igualdad de Género y ODS 8: Trabajo Decente',
          resultsAreas: 'Capacitación técnica en oficios, Acceso a microcréditos',
          results: 'Más de 300 mujeres capacitadas. 180 microempresas iniciadas',
          targetGroups: 'Mujeres de 18 a 50 años, Madres solteras',
          contentTopics: 'Capacitación en oficios técnicos, Gestión de microcréditos',
          moreInfoLink: 'https://estrellasur.org/mujeres-emprendedoras',
          imageUrl: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5',
          imageAlt: 'Mujeres en taller de emprendimiento',
      isActive: true,
      isFeatured: true,
        createdBy: MANAGER.id,
    },
        {
          sectorName: 'Seguridad Alimentaria y Nutrición',
          description: 'Programa integral que combate la desnutrición mediante huertos familiares y capacitación en alimentación saludable.',
          presentationVideo: 'https://www.youtube.com/watch?v=ejemplo',
          odsAlignment: 'ODS 2: Hambre Cero',
          resultsAreas: 'Huertos familiares y comunitarios, Capacitación nutricional',
          results: '300 familias con huertos productivos. 60% de reducción en desnutrición',
          targetGroups: 'Familias con niños menores de 5 años, Comunidades rurales',
          contentTopics: 'Talleres de huertos familiares, Educación nutricional',
          moreInfoLink: 'https://estrellasur.org/seguridad-alimentaria',
          imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8',
          imageAlt: 'Huerto familiar comunitario',
      isActive: true,
      isFeatured: false,
        createdBy: MANAGER.id,
      },
        {
          sectorName: 'Protección de la Niñez',
          description: 'Programa que previene violencia infantil y promueve derechos de la niñez en entornos protectores.',
          presentationVideo: 'https://www.youtube.com/watch?v=ejemplo',
          odsAlignment: 'ODS 16: Paz, Justicia e Instituciones Sólidas',
          resultsAreas: 'Prevención de violencia infantil, Atención psicosocial',
          results: 'Más de 500 niños identificados en riesgo. 8 espacios seguros',
          targetGroups: 'Niños y niñas en situación de vulnerabilidad',
          contentTopics: 'Derechos de la niñez, Prevención de violencia',
          moreInfoLink: 'https://estrellasur.org/proteccion-ninez',
          imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9',
          imageAlt: 'Niños en espacio recreativo seguro',
      isActive: true,
      isFeatured: true,
        createdBy: admin.id,
    },
      ],
    });

    const programasCreated = await prisma.program.findMany();
    console.log('✅ Programas creados:', programasCreated.length);

    // ==========================================
    // IMAGENES DE LA GALERÍA (ImageLibrary)
    // ==========================================
    console.log('🖼️ Creando galería de imágenes...');
    const imageLibrary = await prisma.imageLibrary.createMany({
      data: [
        {
          title: 'Taller de nutrición infantil',
          description: 'Niños participando en taller de educación nutricional',
          imageUrl: 'https://images.unsplash.com/photo-1565501631754-4c066ae82486',
          imageAlt: 'Taller de nutrición',
          isActive: true,
          isFeatured: true,
          programId: programasCreated[0].id,
          createdBy: admin.id,
        },
        {
          title: 'Aula rural - Escuela multigrado',
          description: 'Docente trabajando con estudiantes en aula rural',
          imageUrl: 'https://images.unsplash.com/photo-1580584126903-c17d41801450',
          imageAlt: 'Aula rural',
          isActive: true,
          isFeatured: true,
          programId: programasCreated[1].id,
          createdBy: MANAGER.id,
        },
        {
          title: 'Taller de emprendimiento',
          description: 'Mujeres en taller de elaboración de productos',
          imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68',
          imageAlt: 'Taller emprendimiento',
          isActive: true,
          isFeatured: false,
          programId: programasCreated[2].id,
          createdBy: CONSULTANT.id,
        },
      ],
    });
    console.log('✅ Galería de imágenes creada:', imageLibrary.count);

    // ==========================================
    // METODOLOGÍAS
    // ==========================================
    console.log('📖 Creando metodologías...');
    const metodologias = await prisma.methodology.createMany({
      data: [
        {
          title: 'Metodología de Aprendizaje Activo',
          description: 'Enfoque pedagógico que promueve la participación activa de los estudiantes mediante dinámicas grupales y proyectos colaborativos.',
          shortDescription: 'Metodología participativa para educación rural',
          ageGroup: '5 a 18 años',
          sectors: ['EDUCATION', 'PROTECTION'],
          targetAudience: 'Docentes y estudiantes de escuelas rurales',
          objectives: 'Mejorar el aprendizaje significativo y desarrollar competencias básicas',
          implementation: 'Talleres de capacitación docente, acompañamiento pedagógico',
          results: 'Mejora del 40% en comprensión lectora y habilidades matemáticas',
          methodology: 'Aprendizaje basado en proyectos, trabajo colaborativo',
          resources: 'Materiales educativos contextualizados, kits pedagógicos',
          evaluation: 'Evaluación continua mediante portafolios y proyectos',
          isActive: true,
          isFeatured: true,
          createdBy: admin.id,
        },
        {
          title: 'Modelo de Intervención en Salud Comunitaria',
          description: 'Estrategia integral para mejorar la salud infantil mediante actividades preventivas y educativas.',
          shortDescription: 'Intervención en salud comunitaria',
          ageGroup: '0 a 12 años',
          sectors: ['HEALTH', 'SUSTAINABILITY'],
          targetAudience: 'Niños, madres y familias en comunidades rurales',
          objectives: 'Reducir enfermedades prevenibles y mejorar hábitos saludables',
          implementation: 'Campañas de vacunación, talleres de salud familiar',
          results: '85% de menores con controles de salud regulares',
          methodology: 'Participación comunitaria, promotores de salud',
          resources: 'Materiales educativos, equipos médicos básicos',
          evaluation: 'Indicadores de salud, reportes mensuales',
          isActive: true,
          isFeatured: true,
          createdBy: MANAGER.id,
        },
        {
          title: 'Programa de Empoderamiento Económico',
          description: 'Modelo para fortalecer capacidades empresariales de mujeres mediante formación técnica y financiera.',
          shortDescription: 'Empoderamiento económico de mujeres',
          ageGroup: 'Adultas',
          sectors: ['LIVELIHOODS', 'SUSTAINABILITY'],
          targetAudience: 'Mujeres emprendedoras y en situación de vulnerabilidad',
          objectives: 'Mejorar ingresos familiares y promover emprendimientos sostenibles',
          implementation: 'Capacitación técnica, apoyo a microempresas, redes de comercio',
          results: '70% de mujeres con ingresos propios, 180 microempresas',
          methodology: 'Capacitación por competencias, acompañamiento técnico',
          resources: 'Microcréditos, herramientas de trabajo, espacios productivos',
          evaluation: 'Seguimiento mensual, indicadores de ingresos',
          isActive: true,
          isFeatured: false,
          createdBy: CONSULTANT.id,
        },
      ],
    });
    console.log('✅ Metodologías creadas:', metodologias.count);

    const metodologiasCreated = await prisma.methodology.findMany();

    // ==========================================
    // PROYECTOS
    // ==========================================
    console.log('🏗️ Creando proyectos...');
    const proyectos = await prisma.project.createMany({
      data: [
        {
          title: 'Proyecto de Modernización de Escuelas Rurales',
          executionStart: new Date('2024-01-15'),
          executionEnd: new Date('2024-12-31'),
          context: 'Zonas rurales con infraestructura escolar deficiente',
          objectives: 'Mejorar infraestructura y dotar de recursos educativos',
          content: 'Renovación de aulas, instalación de bibliotecas, equipamiento tecnológico',
          strategicAllies: 'Ministerio de Educación, Gobierno Regional',
          financing: 'Fundación internacional, Cooperación internacional',
          imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80',
          imageAlt: 'Escuela rural modernizada',
          isActive: true,
          isFeatured: true,
          createdBy: admin.id,
        },
        {
          title: 'Campaña Nacional de Vacunación 2024',
          executionStart: new Date('2024-03-01'),
          executionEnd: new Date('2024-11-30'),
          context: 'Comunidades rurales con baja cobertura de vacunación',
          objectives: 'Inmunizar a más de 5,000 niños contra enfermedades prevenibles',
          content: 'Brigadas móviles, jornadas de vacunación, registro actualizado',
          strategicAllies: 'Ministerio de Salud, Centros de salud comunales',
          financing: 'Organismos internacionales, contribuciones locales',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5',
          imageAlt: 'Campaña de vacunación',
          isActive: true,
          isFeatured: true,
          createdBy: MANAGER.id,
        },
        {
          title: 'Red de Huertos Comunitarios',
          executionStart: new Date('2024-02-01'),
          executionEnd: new Date('2024-12-15'),
          context: 'Comunidades con alta inseguridad alimentaria',
          objectives: 'Crear 300 huertos familiares productivos',
          content: 'Capacitación técnica, provisión de semillas, seguimiento constante',
          strategicAllies: 'AGRICOL, Cooperativas locales',
          financing: 'Fondo de desarrollo local, aportes de socios',
          imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
          imageAlt: 'Huerto comunitario',
          isActive: true,
          isFeatured: false,
          createdBy: MANAGER.id,
        },
      ],
    });
    console.log('✅ Proyectos creados:', proyectos.count);

    const proyectosCreated = await prisma.project.findMany();

    // ==========================================
    // NOTICIAS
    // ==========================================
    console.log('📰 Creando noticias...');
    const noticias = await prisma.news.createMany({
      data: [
        {
          title: 'Más de 1,200 niños vacunados en campaña de salud',
          content: 'La campaña nacional de vacunación de Estrella Sur ha logrado inmunizar a más de 1,200 niños en zonas rurales durante el primer trimestre del año.',
          excerpt: 'Campaña de vacunación logra impacto positivo en comunidades rurales',
          imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1adb4',
          imageAlt: 'Niños recibiendo vacunación',
          isActive: true,
          isFeatured: true,
          publishedAt: new Date('2024-06-15'),
          programId: programasCreated[0].id,
          createdBy: admin.id,
        },
        {
          title: 'Taller de emprendimiento beneficia a 45 mujeres',
          content: 'El taller de emprendimiento y capacitación técnica benefició a 45 mujeres de comunidades rurales, quienes desarrollaron habilidades para iniciar sus propios negocios.',
          excerpt: 'Mujeres rurales se capacitan en emprendimiento e iniciación de negocios',
          imageUrl: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5',
          imageAlt: 'Taller de emprendimiento',
          isActive: true,
          isFeatured: true,
          methodologyId: metodologiasCreated[2].id,
          createdBy: MANAGER.id,
        },
        {
          title: 'Escuela rural estrena nueva infraestructura educativa',
          content: 'La escuela de la comunidad de San José ha estrenado modernas instalaciones educativas, mejorando significativamente el ambiente de aprendizaje para 180 estudiantes.',
          excerpt: 'Nueva infraestructura escolar beneficia a estudiantes rurales',
          imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc',
          imageAlt: 'Nueva escuela rural',
          isActive: true,
          isFeatured: false,
          projectId: proyectosCreated[0].id,
          createdBy: CONSULTANT.id,
        },
        {
          title: 'Capacitación docente impacta a 150 profesionales',
          content: 'Programa de capacitación docente ha formado a 150 profesores en metodologías activas de enseñanza, mejorando la calidad educativa en zonas rurales.',
          excerpt: 'Docentes rurales se capacitan en metodologías innovadoras',
          imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          imageAlt: 'Capacitación docente',
          isActive: true,
          isFeatured: false,
          programId: programasCreated[1].id,
          methodologyId: metodologiasCreated[0].id,
          createdBy: admin.id,
        },
      ],
    });
    console.log('✅ Noticias creadas:', noticias.count);

    // ==========================================
    // EVENTOS
    // ==========================================
    console.log('📅 Creando eventos...');
    const eventos = await prisma.event.createMany({
      data: [
        {
          title: 'Jornada de Salud Infantil 2024',
          description: 'Gran jornada de atención pediátrica, vacunación y talleres de nutrición infantil para familias de comunidades rurales.',
          imageUrl: 'https://images.unsplash.com/photo-1551818255-c9b361f6c9c2',
          imageAlt: 'Jornada de salud infantil',
          eventDate: new Date('2024-09-15T09:00:00'),
          location: 'Plaza Principal - Centro de la ciudad',
          isActive: true,
          isFeatured: true,
          createdBy: admin.id,
        },
        {
          title: 'Feria de Emprendedoras',
          description: 'Exposición y venta de productos elaborados por mujeres participantes del programa de emprendimiento.',
          imageUrl: 'https://images.unsplash.com/photo-1524820197278-540916411e20',
          imageAlt: 'Feria de emprendedoras',
          eventDate: new Date('2024-10-20T14:00:00'),
          location: 'Centro Comunitario Los Olivos',
          isActive: true,
          isFeatured: true,
          createdBy: MANAGER.id,
        },
        {
          title: 'Congreso de Educación Rural',
          description: 'Encuentro académico sobre innovación educativa en zonas rurales con expertos nacionales e internacionales.',
          imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          imageAlt: 'Congreso educación rural',
          eventDate: new Date('2024-11-08T08:00:00'),
          location: 'Centro de Convenciones',
          isActive: true,
          isFeatured: false,
          createdBy: CONSULTANT.id,
        },
      ],
    });
    console.log('✅ Eventos creados:', eventos.count);

    // ==========================================
    // ALIADOS ESTRATÉGICOS
    // ==========================================
    console.log('🤝 Creando aliados estratégicos...');
    const aliados = await prisma.ally.createMany({
      data: [
        {
          id: 'ally-1',
          name: 'Ministerio de Educación',
          role: 'Aliado Gubernamental',
          description: 'Apoyo en programas de educación rural y capacitación docente',
          imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
          imageAlt: 'Logo Ministerio de Educación',
          isActive: true,
          isFeatured: true,
          createdBy: admin.id,
        },
        {
          id: 'ally-2',
          name: 'Fundación Internacional para el Desarrollo',
          role: 'Organización Cooperante',
          description: 'Financiamiento y acompañamiento técnico en proyectos de desarrollo',
          imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
          imageAlt: 'Logo FID',
          isActive: true,
          isFeatured: true,
          createdBy: admin.id,
        },
        {
          id: 'ally-3',
          name: 'Cooperativa AGRICOL',
          role: 'Aliado Comunitario',
          description: 'Apoyo en programas de seguridad alimentaria y huertos comunitarios',
          imageUrl: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552',
          imageAlt: 'Logo AGRICOL',
          isActive: true,
          isFeatured: false,
          createdBy: MANAGER.id,
        },
        {
          id: 'ally-4',
          name: 'Gobierno Regional',
          role: 'Aliado Gubernamental',
          description: 'Coordinación en programas de desarrollo social',
          imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
          imageAlt: 'Logo Gobierno Regional',
          isActive: true,
          isFeatured: true,
          createdBy: MANAGER.id,
        },
      ],
    });
    console.log('✅ Aliados creados:', aliados.count);

    // ==========================================
    // HISTORIAS
    // ==========================================
    console.log('📖 Creando historias...');
    const historias = await prisma.story.createMany({
      data: [
        {
          id: 'story-1',
          title: 'Ana y su camino hacia la independencia económica',
          content: 'Ana, una madre soltera de 28 años, participó en nuestro programa de emprendimiento y hoy dirige su propio negocio de artesanías, generando ingresos suficientes para mantener a su familia.',
          summary: 'Historia de empoderamiento económico de una madre soltera',
          imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
          imageAlt: 'Ana en su taller',
          isActive: true,
          createdBy: MANAGER.id,
        },
        {
          id: 'story-2',
          title: 'José, de la desnutrición a una vida saludable',
          content: 'José, un niño de 6 años, superó la desnutrición gracias al programa de seguridad alimentaria que instaló un huerto familiar en su hogar.',
          summary: 'Historia de superación de desnutrición infantil',
          imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9',
          imageAlt: 'José en su huerto',
          isActive: true,
          createdBy: admin.id,
        },
        {
          id: 'story-3',
          title: 'María Elena: Maestra transformadora',
          content: 'María Elena, docente rural por 15 años, transformó su metodología de enseñanza gracias a nuestra capacitación, mejorando el aprendizaje de 120 estudiantes.',
          summary: 'Historia de transformación educativa',
          imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          imageAlt: 'María Elena enseñando',
          isActive: true,
          createdBy: CONSULTANT.id,
        },
      ],
    });
    console.log('✅ Historias creadas:', historias.count);

    // ==========================================
    // VIDEOS TESTIMONIALES
    // ==========================================
    console.log('🎥 Creando videos testimoniales...');
    const videos = await prisma.videoTestimonial.createMany({
      data: [
        {
          title: 'Testimonio: Rosa y su emprendimiento',
          description: 'Rosa comparte cómo el programa de emprendimiento cambió su vida y la de su familia',
          youtubeUrl: 'https://www.youtube.com/watch?v=test1',
          thumbnailUrl: 'https://images.unsplash.com/photo-1521521875411-21ea7c42a9fe',
          isActive: true,
          isFeatured: true,
          createdBy: MANAGER.id,
        },
        {
          title: 'Testimonio: Comunidad beneficiada con salud',
          description: 'Comunidad rural comparte su experiencia con el programa de salud infantil',
          youtubeUrl: 'https://www.youtube.com/watch?v=test2',
          thumbnailUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9',
          isActive: true,
          isFeatured: true,
          createdBy: admin.id,
        },
        {
          title: 'Testimonio: Docente transformada',
          description: 'Profesora María comparte cómo las capacitaciones mejoraron su práctica docente',
          youtubeUrl: 'https://www.youtube.com/watch?v=test3',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          isActive: true,
          isFeatured: false,
          createdBy: CONSULTANT.id,
        },
      ],
    });
    console.log('✅ Videos testimoniales creados:', videos.count);

    // ==========================================
    // RECURSOS
    // ==========================================
    console.log('📁 Creando recursos...');
    const recursos = await prisma.resource.createMany({
      data: [
        {
          title: 'Guía de Nutrición Infantil',
          description: 'Manual completo sobre alimentación complementaria para menores de 2 años',
          fileName: 'guia-nutricion-infantil.pdf',
          fileUrl: 'https://www.example.com/resources/guia-nutricion.pdf',
          fileType: 'application/pdf',
          category: 'PUBLICATIONS',
          subcategory: 'MANUALS',
          thumbnailUrl: 'https://images.unsplash.com/photo-1488196749152-4c3e5e09e2ec',
          isActive: true,
          isFeatured: true,
          createdBy: admin.id,
        },
        {
          title: 'Serie: Aprendiendo en Casa',
          description: 'Videos educativos para padres sobre desarrollo infantil temprano',
          fileName: 'serie-aprendiendo-en-casa.mp4',
          fileUrl: 'https://www.example.com/resources/serie-videos.mp4',
          fileType: 'video/mp4',
          category: 'MULTIMEDIA_CENTER',
          subcategory: 'VIDEOS',
          thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
          isActive: true,
          isFeatured: true,
          createdBy: MANAGER.id,
        },
        {
          title: 'Podcast: Historias de Éxito',
          description: 'Serie de podcasts con testimonios de beneficiarios',
          fileName: 'podcast-historias-exito.mp3',
          fileUrl: 'https://www.example.com/resources/podcasts.mp3',
          fileType: 'audio/mpeg',
          category: 'MULTIMEDIA_CENTER',
          subcategory: 'AUDIOS',
          thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618',
          isActive: true,
          isFeatured: false,
          createdBy: CONSULTANT.id,
        },
      ],
    });
    console.log('✅ Recursos creados:', recursos.count);

    // ==========================================
    // DOCUMENTOS DE TRANSPARENCIA
    // ==========================================
    console.log('📄 Creando documentos de transparencia...');
    const transparencia = await prisma.transparencyDocument.createMany({
      data: [
        {
          title: 'Memoria Anual 2023',
          description: 'Reporte completo de actividades y resultados del año 2023',
          fileName: 'memoria-anual-2023.pdf',
          fileUrl: 'https://www.example.com/transparency/memoria-2023.pdf',
          category: 'ANNUAL_REPORTS',
          isActive: true,
          isFeatured: true,
          createdBy: admin.id,
        },
        {
          title: 'Estados Financieros 2024',
          description: 'Balance general y estado de resultados del primer semestre 2024',
          fileName: 'estados-financieros-2024.pdf',
          fileUrl: 'https://www.example.com/transparency/estados-2024.pdf',
          category: 'ACCOUNTABILITY',
          isActive: true,
          isFeatured: true,
          createdBy: admin.id,
        },
        {
          title: 'Proyecto Inversión Pública',
          description: 'Documentación del proyecto de inversión aprobado por el Estado',
          fileName: 'proyecto-inversion-publica.pdf',
          fileUrl: 'https://www.example.com/transparency/inversion-publica.pdf',
          category: 'DOCUMENT_CENTER',
          isActive: true,
          isFeatured: false,
          createdBy: MANAGER.id,
        },
        {
          title: 'Convenios de Cooperación',
          description: 'Convenios firmados con organizaciones internacionales y aliados',
          fileName: 'convenios-cooperacion.pdf',
          fileUrl: 'https://www.example.com/transparency/convenios.pdf',
          category: 'FINANCIERS_AND_ALLIES',
          isActive: true,
          isFeatured: true,
          createdBy: MANAGER.id,
        },
      ],
    });
    console.log('✅ Documentos de transparencia creados:', transparencia.count);

    // ==========================================
    // PROYECTOS DE DONACIÓN
    // ==========================================
    console.log('💰 Creando proyectos de donación...');
    const donationProjects = await prisma.donationProject.createMany({
      data: [
        {
          title: 'Alimentación Escolar 2024',
          description: 'Proyecto para proporcionar desayunos y almuerzos nutritivos a 500 estudiantes de escuelas rurales',
          context: 'Estudiantes de zonas rurales enfrentan inseguridad alimentaria que afecta su aprendizaje',
          objectives: 'Garantizar al menos una comida nutritiva diaria para estudiantes vulnerables',
          executionStart: new Date('2024-08-01'),
          executionEnd: new Date('2024-12-31'),
          accountNumber: '1234567890',
          recipientName: 'Estrella Sur - Alimentación Escolar',
          qrImageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e',
          targetAmount: 25000.00,
          currentAmount: 15200.50,
          isActive: true,
          isCompleted: false,
          isFeatured: true,
        },
        {
          title: 'Construcción de Aulas',
          description: 'Construcción de 3 nuevas aulas para ampliar capacidad de escuela rural',
          context: 'Escuela rural necesita ampliar infraestructura para más estudiantes',
          objectives: 'Construir 3 aulas funcionales con mobiliario y equipamiento básico',
          executionStart: new Date('2024-07-01'),
          executionEnd: new Date('2025-06-30'),
          accountNumber: '0987654321',
          recipientName: 'Estrella Sur - Infraestructura Escolar',
          targetAmount: 45000.00,
          currentAmount: 28000.00,
          isActive: true,
          isCompleted: false,
          isFeatured: true,
        },
        {
          title: 'Emergencia: Inundaciones',
          description: 'Ayuda urgente para familias afectadas por inundaciones',
          context: 'Inundaciones han dejado a 200 familias sin hogar ni alimentos',
          objectives: 'Brindar alimentos, vivienda temporal y kits de limpieza',
          executionStart: new Date('2024-06-15'),
          executionEnd: new Date('2024-09-30'),
          accountNumber: '5555555555',
          recipientName: 'Estrella Sur - Emergencias',
          qrImageUrl: 'https://images.unsplash.com/photo-1582435512280-8d5e23785f9b',
          targetAmount: 15000.00,
          currentAmount: 8750.00,
          isActive: true,
          isCompleted: false,
          isFeatured: false,
        },
      ],
    });
    console.log('✅ Proyectos de donación creados:', donationProjects.count);

    const donationProjectsCreated = await prisma.donationProject.findMany();

    // ==========================================
    // DONACIONES
    // ==========================================
    console.log('💝 Creando donaciones...');
    await prisma.donation.createMany({
      data: [
        {
          donorName: 'Juan Pérez',
          donorEmail: 'juan@example.com',
          donorAddress: 'Av. Principal 123',
          donorPhone: '999888777',
          amount: 500.00,
          donationType: 'SPECIFIC_PROJECT',
          message: 'Espero que ayude a los niños',
          status: 'APPROVED',
          donationProjectId: donationProjectsCreated[0].id,
          bankTransferImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
          approvedBy: admin.id,
          approvedAt: new Date('2024-06-20'),
        },
        {
          donorName: 'María González',
          donorEmail: 'maria@example.com',
          donorAddress: 'Jr. Los Olivos 456',
          donorPhone: '999777666',
          amount: 250.00,
          donationType: 'EMERGENCY',
          message: 'Para ayudar en las emergencias',
          status: 'APPROVED',
          donationProjectId: donationProjectsCreated[2].id,
          approvedBy: admin.id,
          approvedAt: new Date('2024-06-18'),
        },
        {
          donorName: 'Carlos Ramírez',
          donorEmail: 'carlos@example.com',
          donorAddress: 'Calle Libertad 789',
          donorPhone: '999666555',
          amount: 1000.00,
          donationType: 'SPECIFIC_PROJECT',
          donationProjectId: donationProjectsCreated[1].id,
          status: 'PENDING',
        },
      ],
    });
    console.log('✅ Donaciones creadas: 3');

    // ==========================================
    // METAS ANUALES
    // ==========================================
    console.log('🎯 Creando metas anuales...');
    await prisma.annualGoal.createMany({
      data: [
        {
          year: 2024,
          targetAmount: 100000.00,
          currentAmount: 62500.00,
          description: 'Meta anual para programas de desarrollo social',
          isActive: true,
          isFeatured: true,
        },
        {
          year: 2023,
          targetAmount: 85000.00,
          currentAmount: 87500.00,
          description: 'Meta anual 2023 cumplida exitosamente',
          isActive: false,
          isFeatured: true,
        },
        {
          year: 2025,
          targetAmount: 120000.00,
          currentAmount: 0.00,
          description: 'Meta anual proyectada para 2025',
          isActive: true,
          isFeatured: false,
        },
      ],
    });
    console.log('✅ Metas anuales creadas: 3');

    // ==========================================
    // RESUMEN FINAL
    // ==========================================
    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log('👥 Usuarios: 3');
    console.log('📚 Programas: 5');
    console.log('📖 Metodologías: 3');
    console.log('🏗️ Proyectos: 3');
    console.log('📰 Noticias: 4');
    console.log('📅 Eventos: 3');
    console.log('🤝 Aliados: 4');
    console.log('📖 Historias: 3');
    console.log('🎥 Videos testimoniales: 3');
    console.log('📁 Recursos: 3');
    console.log('📄 Documentos de transparencia: 4');
    console.log('💰 Proyectos de donación: 3');
    console.log('💝 Donaciones: 3');
    console.log('🎯 Metas anuales: 3');
    console.log('🖼️ Imágenes en galería: 3');
    console.log('\n🔑 Credenciales:');
    console.log('Admin: admin@estrellasur.org / Admin123!');
    console.log('MANAGER: MANAGER@estrellasur.org / MANAGER123!');
    console.log('CONSULTANT: CONSULTANT@estrellasur.org / CONSULTANT123!');
    console.log('\n✨ Base de datos completamente poblada con datos realistas para Estrella Sur');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  });