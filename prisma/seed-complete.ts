import { PrismaClient, ProgrammaticSector, ResourceCategory, ResourceSubcategory, TransparencyCategory, DonationType, DonationStatus, ConvocatoriaStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// URLs de imágenes de prueba (Unsplash y Picsum)
const IMAGE_URLS = {
  news: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
  ],
  events: [
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
  ],
  projects: [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800',
  ],
  methodologies: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
  ],
  programs: [
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
  ],
  stories: [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800',
  ],
  allies: [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  ],
  gallery: [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/600?random=5',
  ],
};

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  console.log('🌱 Iniciando seed completo para Estrella Sur...\n');

  try {
    // ==========================================
    // LIMPIAR DATOS EXISTENTES
    // ==========================================
    console.log('🧹 Limpiando datos existentes...');
    
    // Eliminar en orden para respetar foreign keys
    await prisma.donation.deleteMany();
    await prisma.donationProject.deleteMany();
    await prisma.annualGoal.deleteMany();
    await prisma.galleryImage.deleteMany();
    await prisma.album.deleteMany();
    await prisma.imageLibrary.deleteMany();
    await prisma.convocatoriaApplication.deleteMany();
    await prisma.convocatoria.deleteMany();
    await prisma.volunteerApplication.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.contactMessage.deleteMany();
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

    console.log('✅ Datos existentes eliminados\n');

    // ==========================================
    // USUARIOS
    // ==========================================
    console.log('👥 Creando usuarios...');
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const managerPassword = await bcrypt.hash('Manager123!', 12);
    const consultantPassword = await bcrypt.hash('Consultant123!', 12);

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

    const manager = await prisma.user.create({
      data: {
        email: 'manager@estrellasur.org',
        name: 'Carlos Ramírez',
        password: managerPassword,
        role: 'MANAGER',
        isActive: true,
        mustChangePassword: false,
        emailVerified: new Date(),
        createdBy: admin.id,
      },
    });

    const consultant = await prisma.user.create({
      data: {
        email: 'consultant@estrellasur.org',
        name: 'Ana Martínez',
        password: consultantPassword,
        role: 'CONSULTANT',
        isActive: true,
        mustChangePassword: false,
        emailVerified: new Date(),
        createdBy: admin.id,
      },
    });

    const users = [admin, manager, consultant];
    console.log(`✅ ${users.length} usuarios creados\n`);

    // ==========================================
    // PROGRAMAS
    // ==========================================
    console.log('📚 Creando programas...');
    const programs = [
      {
        sectorName: 'Salud y Bienestar',
        description: 'Programa integral de salud que busca mejorar las condiciones de vida de las comunidades más vulnerables mediante atención médica, prevención y educación en salud.',
        odsAlignment: 'ODS 3: Salud y Bienestar',
        resultsAreas: 'Reducción de enfermedades prevenibles, mejora en acceso a servicios de salud, educación en hábitos saludables',
        results: 'Más de 5,000 personas atendidas anualmente, reducción del 30% en enfermedades prevenibles',
        targetGroups: 'Niños, adolescentes, mujeres embarazadas, adultos mayores',
        contentTopics: 'Vacunación, nutrición, salud mental, prevención de enfermedades',
        imageUrl: getRandomItem(IMAGE_URLS.programs),
        imageAlt: 'Programa de Salud y Bienestar',
        isFeatured: true,
        createdBy: admin.id,
      },
      {
        sectorName: 'Educación y Desarrollo',
        description: 'Programa educativo que promueve el acceso a educación de calidad y desarrollo de habilidades para niños y jóvenes en situación de vulnerabilidad.',
        odsAlignment: 'ODS 4: Educación de Calidad',
        resultsAreas: 'Alfabetización, refuerzo escolar, desarrollo de habilidades, acceso a tecnología',
        results: 'Más de 3,000 estudiantes beneficiados, 85% de mejora en rendimiento académico',
        targetGroups: 'Niños y adolescentes en edad escolar, jóvenes',
        contentTopics: 'Matemáticas, lectura, ciencias, tecnología, arte',
        imageUrl: getRandomItem(IMAGE_URLS.programs),
        imageAlt: 'Programa de Educación',
        isFeatured: true,
        createdBy: manager.id,
      },
      {
        sectorName: 'Protección Infantil',
        description: 'Programa enfocado en la protección y defensa de los derechos de los niños y adolescentes, previniendo situaciones de riesgo y violencia.',
        odsAlignment: 'ODS 16: Paz, Justicia e Instituciones Sólidas',
        resultsAreas: 'Prevención de violencia, protección de derechos, apoyo psicosocial',
        results: 'Más de 2,000 niños protegidos, 40 casos de violencia prevenidos',
        targetGroups: 'Niños y adolescentes en situación de riesgo',
        contentTopics: 'Derechos del niño, prevención de abuso, apoyo emocional',
        imageUrl: getRandomItem(IMAGE_URLS.programs),
        imageAlt: 'Programa de Protección Infantil',
        isFeatured: false,
        createdBy: admin.id,
      },
    ];

    const createdPrograms = await Promise.all(
      programs.map(program => prisma.program.create({ data: program }))
    );
    console.log(`✅ ${createdPrograms.length} programas creados\n`);

    // ==========================================
    // METODOLOGÍAS
    // ==========================================
    console.log('🎯 Creando metodologías...');
    const methodologies = [
      {
        title: 'Aprendizaje Lúdico',
        description: 'Metodología educativa que utiliza el juego y actividades recreativas para facilitar el aprendizaje en niños y adolescentes.',
        shortDescription: 'Educación a través del juego',
        ageGroup: '5-12 años',
        sectors: [ProgrammaticSector.EDUCATION, ProgrammaticSector.EARLY_CHILD_DEVELOPMENT],
        targetAudience: 'Niños en edad escolar',
        objectives: 'Mejorar el rendimiento académico, desarrollar habilidades sociales, fomentar la creatividad',
        implementation: 'Talleres semanales, actividades grupales, seguimiento individualizado',
        results: 'Mejora del 60% en participación activa, aumento del 45% en retención de conocimientos',
        methodology: 'Enfoque constructivista con elementos de gamificación',
        resources: 'Material didáctico, juegos educativos, espacios recreativos',
        evaluation: 'Evaluación continua mediante observación y pruebas formativas',
        imageUrl: getRandomItem(IMAGE_URLS.methodologies),
        imageAlt: 'Metodología de Aprendizaje Lúdico',
        isFeatured: true,
        createdBy: manager.id,
      },
      {
        title: 'Terapia de Arte',
        description: 'Metodología terapéutica que utiliza expresiones artísticas para el desarrollo emocional y psicológico de niños y adolescentes.',
        shortDescription: 'Terapia a través del arte',
        ageGroup: '8-16 años',
        sectors: [ProgrammaticSector.HEALTH, ProgrammaticSector.PROTECTION],
        targetAudience: 'Niños y adolescentes con necesidades emocionales',
        objectives: 'Desarrollo emocional, expresión de sentimientos, mejora de autoestima',
        implementation: 'Sesiones individuales y grupales, talleres de arte, exposiciones',
        results: 'Mejora del 70% en expresión emocional, reducción del 50% en síntomas de ansiedad',
        methodology: 'Enfoque humanista con técnicas artísticas',
        resources: 'Materiales artísticos, espacios creativos, profesionales especializados',
        evaluation: 'Evaluación cualitativa mediante análisis de obras y observación',
        imageUrl: getRandomItem(IMAGE_URLS.methodologies),
        imageAlt: 'Metodología de Terapia de Arte',
        isFeatured: true,
        createdBy: admin.id,
      },
      {
        title: 'Mentoría Juvenil',
        description: 'Programa de acompañamiento donde adultos voluntarios guían y apoyan a jóvenes en su desarrollo personal y profesional.',
        shortDescription: 'Acompañamiento personalizado',
        ageGroup: '13-18 años',
        sectors: [ProgrammaticSector.EDUCATION, ProgrammaticSector.LIVELIHOODS],
        targetAudience: 'Adolescentes en transición a la vida adulta',
        objectives: 'Desarrollo de habilidades de vida, orientación vocacional, apoyo emocional',
        implementation: 'Parejas mentor-mentee, encuentros regulares, actividades grupales',
        results: '85% de jóvenes con mejor plan de vida, 60% ingresan a educación superior',
        methodology: 'Modelo de mentoría basado en relaciones significativas',
        resources: 'Voluntarios capacitados, materiales de orientación, espacios de encuentro',
        evaluation: 'Seguimiento mensual, evaluaciones semestrales, testimonios',
        imageUrl: getRandomItem(IMAGE_URLS.methodologies),
        imageAlt: 'Metodología de Mentoría Juvenil',
        isFeatured: false,
        createdBy: manager.id,
      },
    ];

    const createdMethodologies = await Promise.all(
      methodologies.map(methodology => prisma.methodology.create({ data: methodology }))
    );
    console.log(`✅ ${createdMethodologies.length} metodologías creadas\n`);

    // ==========================================
    // PROYECTOS
    // ==========================================
    console.log('🏗️ Creando proyectos...');
    const projects = [
      {
        title: 'Centro Comunitario San Juan',
        executionStart: new Date('2024-01-15'),
        executionEnd: new Date('2024-12-31'),
        context: 'Comunidad vulnerable con altos índices de desempleo y falta de espacios de encuentro comunitario.',
        objectives: 'Crear un espacio comunitario que sirva como centro de actividades educativas, recreativas y de desarrollo social.',
        content: 'El proyecto busca construir y equipar un centro comunitario que ofrezca servicios educativos, recreativos y de apoyo social a más de 500 familias de la comunidad San Juan. El centro contará con aulas, biblioteca, cancha deportiva y espacios para talleres.',
        strategicAllies: 'Municipalidad local, empresas privadas, organizaciones comunitarias',
        financing: 'Fondos públicos, donaciones privadas, recursos propios',
        imageUrl: getRandomItem(IMAGE_URLS.projects),
        imageAlt: 'Centro Comunitario San Juan',
        isFeatured: true,
        createdBy: admin.id,
      },
      {
        title: 'Programa de Nutrición Infantil',
        executionStart: new Date('2024-03-01'),
        executionEnd: new Date('2024-11-30'),
        context: 'Alta prevalencia de desnutrición infantil en comunidades rurales de la región.',
        objectives: 'Reducir la desnutrición infantil mediante alimentación complementaria y educación nutricional.',
        content: 'Programa integral que incluye entrega de alimentos nutritivos, talleres de educación nutricional para madres y seguimiento médico a niños menores de 5 años. Se espera beneficiar a más de 300 niños.',
        strategicAllies: 'Ministerio de Salud, ONGs internacionales, empresas alimentarias',
        financing: 'Fondos internacionales, donaciones en especie, recursos gubernamentales',
        imageUrl: getRandomItem(IMAGE_URLS.projects),
        imageAlt: 'Programa de Nutrición Infantil',
        isFeatured: true,
        createdBy: manager.id,
      },
      {
        title: 'Talleres de Emprendimiento Juvenil',
        executionStart: new Date('2024-06-01'),
        executionEnd: new Date('2024-12-15'),
        context: 'Alto desempleo juvenil y falta de oportunidades de desarrollo económico para jóvenes.',
        objectives: 'Capacitar a jóvenes en habilidades de emprendimiento y apoyar la creación de microempresas.',
        content: 'Serie de talleres prácticos sobre emprendimiento, gestión empresarial, marketing y finanzas. Incluye acompañamiento para la creación de microempresas y acceso a microcréditos.',
        strategicAllies: 'Instituciones financieras, cámaras de comercio, universidades',
        financing: 'Fondos de desarrollo, patrocinios privados',
        imageUrl: getRandomItem(IMAGE_URLS.projects),
        imageAlt: 'Talleres de Emprendimiento',
        isFeatured: false,
        createdBy: consultant.id,
      },
    ];

    const createdProjects = await Promise.all(
      projects.map(project => prisma.project.create({ data: project }))
    );
    console.log(`✅ ${createdProjects.length} proyectos creados\n`);

    // ==========================================
    // NOTICIAS
    // ==========================================
    console.log('📰 Creando noticias...');
    const newsTitles = [
      'Inauguración del Nuevo Centro Comunitario',
      'Resultados Exitosos del Programa de Nutrición',
      'Taller de Emprendimiento para Jóvenes',
      'Celebración del Día del Niño',
      'Alianza Estratégica con Empresa Local',
      'Graduación de Primera Generación de Mentores',
      'Campaña de Vacunación Comunitaria',
      'Exposición de Arte Infantil',
    ];

    const newsContent = [
      'Estamos orgullosos de anunciar la inauguración del nuevo centro comunitario en San Juan. Este espacio beneficiará a más de 500 familias con servicios educativos, recreativos y de apoyo social. El centro cuenta con aulas modernas, biblioteca, cancha deportiva y áreas de talleres.',
      'El programa de nutrición infantil ha logrado resultados excepcionales este año. Hemos atendido a más de 300 niños, reduciendo los índices de desnutrición en un 40%. Las madres han recibido capacitación en nutrición y preparación de alimentos saludables.',
      'Más de 50 jóvenes participaron en nuestros talleres de emprendimiento, aprendiendo habilidades empresariales y desarrollando ideas de negocio. Varios participantes ya han iniciado sus microempresas con nuestro apoyo.',
      'Celebramos el Día del Niño con una gran fiesta comunitaria que incluyó juegos, música, comida y regalos para más de 200 niños. Fue un día lleno de alegría y sonrisas.',
      'Hemos establecido una alianza estratégica con una empresa local que nos apoyará con recursos y voluntariado. Esta colaboración fortalecerá nuestros programas comunitarios.',
      'La primera generación de mentores juveniles completó su capacitación y está lista para acompañar a jóvenes en su desarrollo personal y profesional. Este programa transformará vidas.',
      'Realizamos una exitosa campaña de vacunación comunitaria, inmunizando a más de 400 niños contra enfermedades prevenibles. La comunidad respondió positivamente a esta iniciativa.',
      'Los niños de nuestros programas de arte expusieron sus creaciones en una muestra comunitaria. Las obras reflejan su creatividad y expresión emocional.',
    ];

    const createdNews = await Promise.all(
      newsTitles.map((title, index) => 
        prisma.news.create({
          data: {
            title,
            content: newsContent[index] || newsContent[0],
            imageUrl: getRandomItem(IMAGE_URLS.news),
            imageAlt: title,
            isActive: true,
            isFeatured: index < 3,
            publishedAt: new Date(2024, 0, 15 + index * 7),
            programId: index % 2 === 0 ? getRandomItem(createdPrograms).id : null,
            methodologyId: index % 3 === 0 ? getRandomItem(createdMethodologies).id : null,
            projectId: index % 4 === 0 ? getRandomItem(createdProjects).id : null,
            createdBy: getRandomItem(users).id,
          },
        })
      )
    );
    console.log(`✅ ${createdNews.length} noticias creadas\n`);

    // ==========================================
    // EVENTOS
    // ==========================================
    console.log('📅 Creando eventos...');
    const events = [
      {
        title: 'Feria de Salud Comunitaria',
        content: 'Gran feria de salud que incluirá chequeos médicos gratuitos, vacunación, charlas de prevención y actividades recreativas para toda la familia. Contaremos con la participación de profesionales de la salud y organizaciones aliadas.',
        eventDate: new Date('2024-08-15T10:00:00'),
        location: 'Parque Central, San Juan',
        imageUrl: getRandomItem(IMAGE_URLS.events),
        imageAlt: 'Feria de Salud Comunitaria',
        isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
      {
        title: 'Taller de Arte para Niños',
        content: 'Taller creativo donde los niños podrán explorar diferentes técnicas artísticas, crear sus propias obras y desarrollar su creatividad. Incluye materiales y merienda. Dirigido a niños de 6 a 12 años.',
        eventDate: new Date('2024-09-20T14:00:00'),
        location: 'Centro Comunitario San Juan',
        imageUrl: getRandomItem(IMAGE_URLS.events),
        imageAlt: 'Taller de Arte',
        isActive: true,
        isFeatured: true,
        createdBy: manager.id,
      },
      {
        title: 'Charla sobre Emprendimiento',
        content: 'Charla motivacional y educativa sobre emprendimiento dirigida a jóvenes y adultos. Incluirá casos de éxito, herramientas prácticas y oportunidades de financiamiento. Al final habrá ronda de preguntas.',
        eventDate: new Date('2024-10-05T18:00:00'),
        location: 'Auditorio Municipal',
        imageUrl: getRandomItem(IMAGE_URLS.events),
        imageAlt: 'Charla de Emprendimiento',
        isActive: true,
        isFeatured: false,
        createdBy: consultant.id,
      },
      {
        title: 'Festival Cultural Comunitario',
        content: 'Festival que celebra la diversidad cultural de nuestra comunidad con presentaciones artísticas, música en vivo, comida tradicional y actividades para toda la familia. Un día lleno de cultura y diversión.',
        eventDate: new Date('2024-11-10T12:00:00'),
        location: 'Plaza Principal',
        imageUrl: getRandomItem(IMAGE_URLS.events),
        imageAlt: 'Festival Cultural',
        isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
    ];

    const createdEvents = await Promise.all(
      events.map(event => prisma.event.create({ data: event }))
    );
    console.log(`✅ ${createdEvents.length} eventos creados\n`);

    // ==========================================
    // HISTORIAS DE IMPACTO
    // ==========================================
    console.log('📖 Creando historias de impacto...');
    const stories = [
      {
        id: 'story-1',
        title: 'María: De la Desnutrición a la Esperanza',
        content: 'María, una niña de 5 años, llegó a nuestro programa con desnutrición severa. Gracias al apoyo nutricional y el seguimiento médico, no solo recuperó su salud, sino que ahora es una niña activa y feliz que asiste regularmente a la escuela.',
        imageUrl: getRandomItem(IMAGE_URLS.stories),
        imageAlt: 'Historia de María',
        isActive: true,
        createdBy: admin.id,
      },
      {
        id: 'story-2',
        title: 'Carlos: Emprendedor Exitoso',
        content: 'Carlos participó en nuestros talleres de emprendimiento y con el apoyo recibido, logró abrir su propio negocio de reparación de bicicletas. Hoy emplea a dos personas y es un ejemplo para otros jóvenes de la comunidad.',
        imageUrl: getRandomItem(IMAGE_URLS.stories),
        imageAlt: 'Historia de Carlos',
        isActive: true,
        createdBy: manager.id,
      },
      {
        id: 'story-3',
        title: 'La Comunidad que se Unió',
        content: 'La comunidad de San Juan se unió para construir su centro comunitario. Con trabajo voluntario y determinación, lograron crear un espacio que hoy beneficia a cientos de familias y es un símbolo de esperanza.',
        imageUrl: getRandomItem(IMAGE_URLS.stories),
        imageAlt: 'Comunidad unida',
        isActive: true,
        createdBy: admin.id,
      },
    ];

    const createdStories = await Promise.all(
      stories.map(story => prisma.story.create({ data: story }))
    );
    console.log(`✅ ${createdStories.length} historias creadas\n`);

    // ==========================================
    // ALIADOS
    // ==========================================
    console.log('🤝 Creando aliados...');
    const allies = [
      {
        id: 'ally-1',
        name: 'Fundación Solidaridad',
        role: 'Socio Estratégico',
        description: 'Organización que nos apoya con recursos y voluntariado para nuestros programas comunitarios.',
        imageUrl: getRandomItem(IMAGE_URLS.allies),
        imageAlt: 'Fundación Solidaridad',
        isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
      {
        id: 'ally-2',
        name: 'Empresa Constructora ABC',
        role: 'Patrocinador',
        description: 'Empresa que ha contribuido significativamente con la construcción de nuestro centro comunitario.',
        imageUrl: getRandomItem(IMAGE_URLS.allies),
        imageAlt: 'Empresa Constructora ABC',
        isActive: true,
        isFeatured: true,
        createdBy: manager.id,
      },
      {
        id: 'ally-3',
        name: 'Universidad Nacional',
        role: 'Aliado Académico',
        description: 'Institución educativa que colabora con nuestros programas de educación y desarrollo.',
        imageUrl: getRandomItem(IMAGE_URLS.allies),
        imageAlt: 'Universidad Nacional',
        isActive: true,
        isFeatured: false,
        createdBy: admin.id,
      },
    ];

    const createdAllies = await Promise.all(
      allies.map(ally => prisma.ally.create({ data: ally }))
    );
    console.log(`✅ ${createdAllies.length} aliados creados\n`);

    // ==========================================
    // BIBLIOTECA DE IMÁGENES
    // ==========================================
    console.log('🖼️ Creando biblioteca de imágenes...');
    const imageLibrary = [
      {
        title: 'Actividad Comunitaria',
        description: 'Imagen de actividad comunitaria',
        imageUrl: getRandomItem(IMAGE_URLS.gallery),
        imageAlt: 'Actividad comunitaria',
        programId: createdPrograms[0].id,
        isActive: true,
        createdBy: admin.id,
      },
      {
        title: 'Taller Educativo',
        description: 'Imagen de taller educativo',
        imageUrl: getRandomItem(IMAGE_URLS.gallery),
        imageAlt: 'Taller educativo',
        methodologyId: createdMethodologies[0].id,
        isActive: true,
        createdBy: manager.id,
      },
      {
        title: 'Proyecto en Ejecución',
        description: 'Imagen de proyecto',
        imageUrl: getRandomItem(IMAGE_URLS.gallery),
        imageAlt: 'Proyecto',
        projectId: createdProjects[0].id,
        isActive: true,
        createdBy: admin.id,
      },
    ];

    const createdImages = await Promise.all(
      imageLibrary.map(img => prisma.imageLibrary.create({ data: img }))
    );
    console.log(`✅ ${createdImages.length} imágenes creadas\n`);

    // ==========================================
    // ÁLBUMES Y GALERÍA
    // ==========================================
    console.log('📸 Creando álbumes y galería...');
    const album = await prisma.album.create({
      data: {
        title: 'Eventos 2024',
        description: 'Galería de imágenes de eventos realizados durante 2024',
        isActive: true,
        isFeatured: true,
        createdBy: admin.id,
        images: {
          create: [
            {
              imageUrl: getRandomItem(IMAGE_URLS.gallery),
              caption: 'Evento comunitario',
              isActive: true,
              createdBy: admin.id,
            },
            {
              imageUrl: getRandomItem(IMAGE_URLS.gallery),
              caption: 'Taller educativo',
              isActive: true,
              createdBy: manager.id,
            },
            {
              imageUrl: getRandomItem(IMAGE_URLS.gallery),
              caption: 'Celebración comunitaria',
              isActive: true,
              createdBy: admin.id,
            },
          ],
        },
      },
      include: {
        images: true,
      },
    });
    console.log(`✅ 1 álbum con ${album.images.length} imágenes creado\n`);

    // ==========================================
    // RECURSOS
    // ==========================================
    console.log('📚 Creando recursos...');
    const resources = [
      {
        title: 'Guía de Nutrición Infantil',
        description: 'Guía completa sobre nutrición para niños',
        fileName: 'guia-nutricion-infantil.pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        category: ResourceCategory.PUBLICATIONS,
        subcategory: ResourceSubcategory.METHODOLOGICAL_RESOURCES,
        thumbnailUrl: getRandomItem(IMAGE_URLS.gallery),
        isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
      {
        title: 'Video: Metodología de Aprendizaje Lúdico',
        description: 'Video explicativo sobre la metodología',
        fileName: 'aprendizaje-ludico.mp4',
        fileUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        category: ResourceCategory.MULTIMEDIA_CENTER,
        subcategory: ResourceSubcategory.VIDEOS,
        thumbnailUrl: getRandomItem(IMAGE_URLS.gallery),
        isActive: true,
        isFeatured: false,
        createdBy: manager.id,
      },
    ];

    const createdResources = await Promise.all(
      resources.map(resource => prisma.resource.create({ data: resource }))
    );
    console.log(`✅ ${createdResources.length} recursos creados\n`);

    // ==========================================
    // DOCUMENTOS DE TRANSPARENCIA
    // ==========================================
    console.log('📄 Creando documentos de transparencia...');
    const transparencyDocs = [
      {
        title: 'Memoria Anual 2023',
        description: 'Informe anual de actividades y resultados del año 2023',
        fileName: 'memoria-anual-2023.pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        category: TransparencyCategory.ANNUAL_REPORTS,
        isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
      {
        title: 'Estados Financieros 2023',
        description: 'Estados financieros auditados del año 2023',
        fileName: 'estados-financieros-2023.pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        category: TransparencyCategory.ACCOUNTABILITY,
        isActive: true,
        isFeatured: false,
        createdBy: admin.id,
      },
    ];

    const createdDocs = await Promise.all(
      transparencyDocs.map(doc => prisma.transparencyDocument.create({ data: doc }))
    );
    console.log(`✅ ${createdDocs.length} documentos creados\n`);

    // ==========================================
    // TESTIMONIOS EN VIDEO
    // ==========================================
    console.log('🎥 Creando testimonios en video...');
    const videos = [
      {
        title: 'Testimonio de María',
        description: 'María comparte su experiencia en nuestro programa de nutrición',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: getRandomItem(IMAGE_URLS.gallery),
        duration: 180,
        isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
      {
        title: 'Historia de Éxito: Carlos',
        description: 'Carlos cuenta cómo el programa de emprendimiento cambió su vida',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: getRandomItem(IMAGE_URLS.gallery),
        duration: 240,
        isActive: true,
        isFeatured: false,
        createdBy: manager.id,
      },
    ];

    const createdVideos = await Promise.all(
      videos.map(video => prisma.videoTestimonial.create({ data: video }))
    );
    console.log(`✅ ${createdVideos.length} videos creados\n`);

    // ==========================================
    // PROYECTOS DE DONACIÓN
    // ==========================================
    console.log('💰 Creando proyectos de donación...');
    const donationProjects = [
      {
        title: 'Construcción de Aula Comunitaria',
        description: 'Proyecto para construir una nueva aula en el centro comunitario',
        context: 'Necesitamos ampliar nuestras instalaciones para atender a más niños',
        objectives: 'Construir un aula de 50m² con equipamiento completo',
        executionStart: new Date('2024-09-01'),
        executionEnd: new Date('2024-12-31'),
        accountNumber: '1234567890',
        recipientName: 'Estrella Sur',
        targetAmount: 50000,
        currentAmount: 15000,
        isActive: true,
        isFeatured: true,
        isCompleted: false,
      },
      {
        title: 'Programa de Alimentación Escolar',
        description: 'Proyecto para proporcionar desayunos nutritivos a niños en edad escolar',
        context: 'Muchos niños llegan a la escuela sin desayunar',
        objectives: 'Proporcionar desayunos diarios a 200 niños durante el año escolar',
        executionStart: new Date('2024-08-15'),
        executionEnd: new Date('2024-12-20'),
        accountNumber: '0987654321',
        recipientName: 'Estrella Sur',
        targetAmount: 30000,
        currentAmount: 8000,
        isActive: true,
        isFeatured: true,
        isCompleted: false,
      },
    ];

    const createdDonationProjects = await Promise.all(
      donationProjects.map(project => prisma.donationProject.create({ data: project }))
    );
    console.log(`✅ ${createdDonationProjects.length} proyectos de donación creados\n`);

    // ==========================================
    // DONACIONES
    // ==========================================
    console.log('💵 Creando donaciones...');
    const donations = [
      {
        donorName: 'Juan Pérez',
        donorEmail: 'juan.perez@email.com',
        donorAddress: 'Calle Principal 123',
        donorPhone: '+1234567890',
        amount: 500,
        donationType: DonationType.SPECIFIC_PROJECT,
        message: 'Feliz de apoyar este proyecto',
        status: DonationStatus.APPROVED,
        donationProjectId: createdDonationProjects[0].id,
        approvedBy: admin.id,
        approvedAt: new Date(),
      },
      {
        donorName: 'María González',
        donorEmail: 'maria.gonzalez@email.com',
        donorAddress: 'Avenida Central 456',
        donorPhone: '+0987654321',
        amount: 1000,
        donationType: DonationType.GENERAL,
        message: 'Gracias por su trabajo',
        status: DonationStatus.APPROVED,
        approvedBy: manager.id,
        approvedAt: new Date(),
      },
      {
        donorName: 'Carlos Rodríguez',
        donorEmail: 'carlos.rodriguez@email.com',
        donorAddress: 'Boulevard Norte 789',
        donorPhone: '+1122334455',
        amount: 250,
        donationType: DonationType.SPECIFIC_PROJECT,
        status: DonationStatus.PENDING,
        donationProjectId: createdDonationProjects[1].id,
      },
    ];

    const createdDonations = await Promise.all(
      donations.map(donation => prisma.donation.create({ data: donation }))
    );
    console.log(`✅ ${createdDonations.length} donaciones creadas\n`);

    // ==========================================
    // METAS ANUALES
    // ==========================================
    console.log('🎯 Creando metas anuales...');
    const annualGoals = [
      {
        year: 2024,
        targetAmount: 200000,
        currentAmount: 125000,
        description: 'Meta de recaudación para el año 2024',
        isActive: true,
        isFeatured: true,
      },
      {
        year: 2025,
        targetAmount: 250000,
        currentAmount: 0,
        description: 'Meta de recaudación para el año 2025',
        isActive: true,
        isFeatured: false,
      },
    ];

    const createdGoals = await Promise.all(
      annualGoals.map(goal => prisma.annualGoal.create({ data: goal }))
    );
    console.log(`✅ ${createdGoals.length} metas anuales creadas\n`);

    // ==========================================
    // CONVOCATORIAS
    // ==========================================
    console.log('📢 Creando convocatorias...');
    const convocatorias = [
      {
        title: 'Convocatoria para Voluntarios 2024',
        description: 'Buscamos voluntarios comprometidos para nuestros programas',
        fullDescription: 'Estamos buscando personas comprometidas que quieran contribuir a mejorar la vida de las comunidades más vulnerables. Ofrecemos capacitación y experiencia valiosa.',
        imageUrl: getRandomItem(IMAGE_URLS.gallery),
        imageAlt: 'Convocatoria Voluntarios',
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-10-31'),
        requirements: {
          edad: 'Mayor de 18 años',
          disponibilidad: 'Mínimo 4 horas semanales',
          habilidades: 'Comunicación, trabajo en equipo',
        },
        documents: {
          cv: 'Requerido',
          carta: 'Carta de motivación',
        },
        status: ConvocatoriaStatus.ACTIVE,
        isActive: true,
        isFeatured: true,
        createdBy: admin.id,
      },
    ];

    const createdConvocatorias = await Promise.all(
      convocatorias.map(conv => prisma.convocatoria.create({ data: conv }))
    );
    console.log(`✅ ${createdConvocatorias.length} convocatorias creadas\n`);

    // ==========================================
    // MENSAJES DE CONTACTO
    // ==========================================
    console.log('📧 Creando mensajes de contacto...');
    const contactMessages = [
      {
        name: 'Pedro Martínez',
        email: 'pedro.martinez@email.com',
        phone: '+1234567890',
        message: 'Me interesa conocer más sobre sus programas de voluntariado',
        isRead: false,
      },
      {
        name: 'Laura Sánchez',
        email: 'laura.sanchez@email.com',
        phone: '+0987654321',
        message: 'Quisiera hacer una donación, ¿cómo puedo hacerlo?',
        isRead: true,
        readAt: new Date(),
      },
    ];

    const createdMessages = await Promise.all(
      contactMessages.map(msg => prisma.contactMessage.create({ data: msg }))
    );
    console.log(`✅ ${createdMessages.length} mensajes de contacto creados\n`);

    // ==========================================
    // RESUMEN FINAL
    // ==========================================
    console.log('\n📊 RESUMEN DE DATOS CREADOS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Usuarios: ${users.length}`);
    console.log(`📚 Programas: ${createdPrograms.length}`);
    console.log(`🎯 Metodologías: ${createdMethodologies.length}`);
    console.log(`🏗️ Proyectos: ${createdProjects.length}`);
    console.log(`📰 Noticias: ${createdNews.length}`);
    console.log(`📅 Eventos: ${createdEvents.length}`);
    console.log(`📖 Historias: ${createdStories.length}`);
    console.log(`🤝 Aliados: ${createdAllies.length}`);
    console.log(`🖼️ Imágenes: ${createdImages.length}`);
    console.log(`📸 Álbumes: 1`);
    console.log(`📚 Recursos: ${createdResources.length}`);
    console.log(`📄 Documentos: ${createdDocs.length}`);
    console.log(`🎥 Videos: ${createdVideos.length}`);
    console.log(`💰 Proyectos de Donación: ${createdDonationProjects.length}`);
    console.log(`💵 Donaciones: ${createdDonations.length}`);
    console.log(`🎯 Metas Anuales: ${createdGoals.length}`);
    console.log(`📢 Convocatorias: ${createdConvocatorias.length}`);
    console.log(`📧 Mensajes: ${createdMessages.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Seed completado exitosamente!');
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Admin: admin@estrellasur.org / Admin123!');
    console.log('   Manager: manager@estrellasur.org / Manager123!');
    console.log('   Consultant: consultant@estrellasur.org / Consultant123!');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

