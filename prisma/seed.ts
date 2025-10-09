import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Datos actuales del CMS de Estrella Sur (extraídos de scripts existentes)
const seedData = {
  users: [
    {
      email: 'admin@estrellasur.com',
      name: 'Administrador Principal',
      password: 'Admin123!',
      role: 'ADMINISTRADOR' as const,
      isActive: true,
      mustChangePassword: true,
    },
    {
      email: 'supervisor@estrellasur.com',
      name: 'Supervisor de Contenido',
      password: 'Supervisor123!',
      role: 'SUPERVISOR' as const,
      isActive: true,
      mustChangePassword: true,
    },
    {
      email: 'tecnico@estrellasur.com',
      name: 'Técnico de Soporte',
      password: 'Tecnico123!',
      role: 'TECNICO' as const,
      isActive: true,
      mustChangePassword: true,
    },
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
      id: 'story-001',
      title: 'Transformando vidas en la comunidad de San José',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      imageAlt: 'Mujer emprendedora en su tienda local',
      content: 'Conoce la historia de María, una madre soltera que logró emprender su propio negocio gracias al programa de microcréditos de Estrella Sur.',
      summary: 'Conoce la historia de María, una madre soltera que logró emprender su propio negocio gracias al programa de microcréditos de Estrella Sur.',
      isActive: true,
    },
    {
      id: 'story-002',
      title: 'Educación que cambia el futuro',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
      imageAlt: 'Jóvenes aprendiendo computación',
      content: 'El programa de alfabetización digital ha beneficiado a más de 500 jóvenes en zonas rurales, abriendo nuevas oportunidades de empleo.',
      summary: 'El programa de alfabetización digital ha beneficiado a más de 500 jóvenes en zonas rurales, abriendo nuevas oportunidades de empleo.',
      isActive: true,
    },
    {
      id: 'story-003',
      title: 'Agua potable para todos',
      imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop',
      imageAlt: 'Familia obteniendo agua potable',
      content: 'La instalación de sistemas de purificación de agua ha mejorado la salud de más de 1,200 familias en comunidades vulnerables.',
      summary: 'La instalación de sistemas de purificación de agua ha mejorado la salud de más de 1,200 familias en comunidades vulnerables.',
      isActive: true,
    },
    {
      id: 'story-004',
      title: 'Reconstruyendo después del desastre',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop',
      imageAlt: 'Construcción de viviendas nuevas',
      content: 'Después del terremoto, Estrella Sur ayudó a reconstruir 50 hogares y proporcionó apoyo psicológico a las familias afectadas.',
      summary: 'Después del terremoto, Estrella Sur ayudó a reconstruir 50 hogares y proporcionó apoyo psicológico a las familias afectadas.',
      isActive: true,
    },
    {
      id: 'story-005',
      title: 'Empoderando mujeres líderes',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
      imageAlt: 'Grupo de mujeres líderes comunitarias',
      content: 'El programa de liderazgo femenino ha formado a 200 mujeres que ahora lideran proyectos comunitarios en sus localidades.',
      summary: 'El programa de liderazgo femenino ha formado a 200 mujeres que ahora lideran proyectos comunitarios en sus localidades.',
      isActive: true,
    },
  ],

  allies: [
    {
      id: 'ally-001',
      name: 'Fundación Esperanza',
      role: 'Socio Estratégico',
      description: 'Organización sin fines de lucro con más de 20 años de experiencia en desarrollo comunitario y programas de educación.',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop',
      imageAlt: 'Logo de Fundación Esperanza',
      isActive: true,
      isFeatured: true,
    },
    {
      id: 'ally-002',
      name: 'Corporación Desarrollo Rural',
      role: 'Aliado Técnico',
      description: 'Especialistas en proyectos de desarrollo rural sostenible y capacitación agrícola para comunidades campesinas.',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
      imageAlt: 'Logo de Corporación Desarrollo Rural',
      isActive: true,
      isFeatured: true,
    },
    {
      id: 'ally-003',
      name: 'Universidad Nacional',
      role: 'Socio Académico',
      description: 'Facultad de Ciencias Sociales colabora en investigación y evaluación de impacto de nuestros programas sociales.',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
      imageAlt: 'Logo de Universidad Nacional',
      isActive: true,
      isFeatured: false,
    },
    {
      id: 'ally-004',
      name: 'Banco Solidario',
      role: 'Socio Financiero',
      description: 'Institución financiera que facilita microcréditos y productos bancarios para nuestros beneficiarios.',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
      imageAlt: 'Logo de Banco Solidario',
      isActive: true,
      isFeatured: false,
    },
    {
      id: 'ally-005',
      name: 'Ministerio de Desarrollo Social',
      role: 'Socio Gubernamental',
      description: 'Entidad gubernamental que apoya nuestros programas de inclusión social y desarrollo comunitario.',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop',
      imageAlt: 'Logo del Ministerio de Desarrollo Social',
      isActive: true,
      isFeatured: true,
    },
  ],

  programs: [
    {
      nombreSector: "Educación Infantil",
      descripcion: "Programa integral de desarrollo infantil que promueve el aprendizaje temprano y el desarrollo cognitivo en niños de 0 a 6 años. Incluye actividades educativas, nutrición adecuada y apoyo psicosocial para familias vulnerables.",
      videoPresentacion: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      alineacionODS: "ODS 4: Educación de Calidad - Garantizar una educación inclusiva, equitativa y de calidad. ODS 3: Salud y Bienestar - Asegurar vidas saludables y promover el bienestar para todos.",
      subareasResultados: "Desarrollo cognitivo temprano, Alfabetización emergente, Habilidades socioemocionales, Nutrición infantil, Apoyo parental",
      resultados: "95% de los niños muestran mejoras en habilidades cognitivas, 80% de las familias reportan mejoras en prácticas de crianza, 90% de los niños alcanzan hitos de desarrollo apropiados para su edad",
      gruposAtencion: "Niños de 0 a 6 años, Madres embarazadas, Familias en situación de vulnerabilidad, Comunidades rurales",
      contenidosTemas: "Estimulación temprana, Lectura en voz alta, Juegos educativos, Nutrición balanceada, Desarrollo psicomotor, Apoyo emocional",
      enlaceMasInformacion: "https://childfund.org/programas/educacion-infantil",
      isActive: true,
      isFeatured: true,
    },
    {
      nombreSector: "Salud Comunitaria",
      descripcion: "Programa de salud preventiva que fortalece los sistemas de salud comunitarios y promueve prácticas saludables en poblaciones vulnerables. Incluye capacitación de promotores de salud, campañas de vacunación y educación sanitaria.",
      videoPresentacion: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      alineacionODS: "ODS 3: Salud y Bienestar - Asegurar vidas saludables y promover el bienestar para todos. ODS 6: Agua Limpia y Saneamiento - Garantizar disponibilidad y gestión sostenible del agua.",
      subareasResultados: "Prevención de enfermedades, Promoción de la salud, Capacitación comunitaria, Acceso a servicios de salud, Educación sanitaria",
      resultados: "70% de reducción en enfermedades prevenibles, 85% de cobertura de vacunación, 60% de familias adoptan prácticas sanitarias mejoradas",
      gruposAtencion: "Comunidades rurales, Mujeres en edad reproductiva, Niños menores de 5 años, Adultos mayores, Familias en pobreza",
      contenidosTemas: "Prevención de enfermedades, Nutrición adecuada, Higiene personal, Salud reproductiva, Vacunación, Primeros auxilios",
      enlaceMasInformacion: "https://childfund.org/programas/salud-comunitaria",
      isActive: true,
      isFeatured: true,
    },
    {
      nombreSector: "Desarrollo Económico Juvenil",
      descripcion: "Programa que empodera a jóvenes de 15 a 24 años con habilidades técnicas y empresariales para generar ingresos sostenibles. Incluye capacitación vocacional, microcréditos y mentoría empresarial.",
      videoPresentacion: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      alineacionODS: "ODS 8: Trabajo Decente y Crecimiento Económico - Promover el crecimiento económico sostenido. ODS 1: Fin de la Pobreza - Poner fin a la pobreza en todas sus formas.",
      subareasResultados: "Capacitación técnica, Desarrollo empresarial, Acceso a financiamiento, Mentoría profesional, Inserción laboral",
      resultados: "75% de jóvenes completan capacitación técnica, 60% inician emprendimientos exitosos, 80% mejoran sus ingresos familiares",
      gruposAtencion: "Jóvenes de 15 a 24 años, Mujeres jóvenes, Población rural, Personas con discapacidad, Comunidades indígenas",
      contenidosTemas: "Habilidades técnicas, Planificación empresarial, Gestión financiera, Marketing, Liderazgo, Innovación social",
      enlaceMasInformacion: "https://childfund.org/programas/desarrollo-economico-juvenil",
      isActive: true,
      isFeatured: false,
    },
    {
      nombreSector: "Protección Infantil",
      descripcion: "Programa integral de protección que previene y responde a situaciones de violencia, abuso y explotación infantil. Incluye sistemas de alerta temprana, apoyo psicosocial y fortalecimiento de redes comunitarias.",
      videoPresentacion: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      alineacionODS: "ODS 16: Paz, Justicia e Instituciones Sólidas - Promover sociedades pacíficas e inclusivas. ODS 5: Igualdad de Género - Lograr la igualdad de género y empoderar a todas las mujeres.",
      subareasResultados: "Prevención de violencia, Protección de derechos, Apoyo psicosocial, Fortalecimiento comunitario, Acceso a justicia",
      resultados: "90% de casos reportados reciben atención oportuna, 85% de comunidades implementan sistemas de protección, 95% de niños conocen sus derechos",
      gruposAtencion: "Niños y adolescentes, Familias en riesgo, Comunidades vulnerables, Educadores, Líderes comunitarios",
      contenidosTemas: "Derechos de la infancia, Prevención de abuso, Apoyo emocional, Comunicación efectiva, Resolución de conflictos, Justicia restaurativa",
      enlaceMasInformacion: "https://childfund.org/programas/proteccion-infantil",
      isActive: true,
      isFeatured: true,
    },
    {
      nombreSector: "Agua y Saneamiento",
      descripcion: "Programa que mejora el acceso a agua potable y saneamiento básico en comunidades rurales. Incluye construcción de sistemas de agua, letrinas ecológicas y educación sobre higiene.",
      videoPresentacion: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      alineacionODS: "ODS 6: Agua Limpia y Saneamiento - Garantizar disponibilidad y gestión sostenible del agua. ODS 3: Salud y Bienestar - Asegurar vidas saludables.",
      subareasResultados: "Acceso a agua potable, Saneamiento básico, Gestión comunitaria, Educación en higiene, Infraestructura sostenible",
      resultados: "100% de familias tienen acceso a agua potable, 95% de hogares cuentan con saneamiento adecuado, 80% de reducción en enfermedades hídricas",
      gruposAtencion: "Comunidades rurales, Familias sin acceso a servicios básicos, Escuelas rurales, Centros de salud comunitarios",
      contenidosTemas: "Gestión del agua, Higiene personal, Saneamiento ecológico, Mantenimiento de infraestructura, Participación comunitario",
      enlaceMasInformacion: "https://childfund.org/programas/agua-saneamiento",
      isActive: true,
      isFeatured: false,
    },
    {
      nombreSector: "Desarrollo Rural Sostenible",
      descripcion: "Programa que promueve prácticas agrícolas sostenibles y diversificación económica en comunidades rurales. Incluye capacitación en agricultura orgánica, conservación de suelos y desarrollo de mercados locales.",
      videoPresentacion: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      alineacionODS: "ODS 2: Hambre Cero - Poner fin al hambre, lograr seguridad alimentaria. ODS 15: Vida de Ecosistemas Terrestres - Gestionar sosteniblemente los bosques.",
      subareasResultados: "Agricultura sostenible, Seguridad alimentaria, Conservación ambiental, Desarrollo de mercados, Fortalecimiento organizacional",
      resultados: "70% de familias mejoran su producción agrícola, 85% implementan prácticas sostenibles, 60% aumentan sus ingresos agrícolas",
      gruposAtencion: "Agricultores familiares, Mujeres rurales, Jóvenes agricultores, Comunidades indígenas, Cooperativas agrícolas",
      contenidosTemas: "Agricultura orgánica, Conservación de suelos, Manejo de cultivos, Comercialización, Organización comunitaria, Sostenibilidad ambiental",
      enlaceMasInformacion: "https://childfund.org/programas/desarrollo-rural-sostenible",
      isActive: true,
      isFeatured: false,
    },
    {
      nombreSector: "Empoderamiento de Mujeres",
      descripcion: "Programa que promueve la igualdad de género y el empoderamiento económico de las mujeres. Incluye capacitación en liderazgo, microfinanzas, derechos humanos y prevención de violencia de género.",
      videoPresentacion: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      alineacionODS: "ODS 5: Igualdad de Género - Lograr la igualdad de género y empoderar a todas las mujeres. ODS 10: Reducción de Desigualdades - Reducir la desigualdad en y entre países.",
      subareasResultados: "Liderazgo femenino, Empoderamiento económico, Derechos humanos, Prevención de violencia, Participación política",
      resultados: "80% de mujeres participan en espacios de decisión, 70% inician actividades económicas, 90% conocen sus derechos",
      gruposAtencion: "Mujeres adultas, Jóvenes mujeres, Líderes comunitarias, Madres solteras, Mujeres indígenas",
      contenidosTemas: "Liderazgo femenino, Derechos de las mujeres, Emprendimiento, Prevención de violencia, Participación ciudadana, Autoestima",
      enlaceMasInformacion: "https://childfund.org/programas/empoderamiento-mujeres",
      isActive: true,
      isFeatured: true,
    },
    {
      nombreSector: "Desarrollo de la Primera Infancia",
      descripcion: "Programa especializado en el desarrollo integral de niños de 0 a 3 años, enfocado en nutrición, estimulación temprana y apoyo parental. Incluye seguimiento nutricional y actividades de desarrollo psicomotor.",
      videoPresentacion: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      alineacionODS: "ODS 2: Hambre Cero - Poner fin al hambre, lograr seguridad alimentaria. ODS 3: Salud y Bienestar - Asegurar vidas saludables.",
      subareasResultados: "Nutrición infantil, Estimulación temprana, Desarrollo psicomotor, Apoyo parental, Seguimiento nutricional",
      resultados: "95% de niños mantienen peso adecuado, 85% alcanzan hitos de desarrollo, 90% de madres mejoran prácticas de crianza",
      gruposAtencion: "Niños de 0 a 3 años, Madres embarazadas, Familias vulnerables, Comunidades rurales, Centros de salud",
      contenidosTemas: "Nutrición infantil, Estimulación temprana, Desarrollo psicomotor, Lactancia materna, Alimentación complementaria, Crianza positiva",
      enlaceMasInformacion: "https://childfund.org/programas/primera-infancia",
      isActive: true,
      isFeatured: false,
    },
  ],

  methodologies: [
    {
      title: 'Aprendizaje Basado en Proyectos',
      description: 'Metodología educativa que involucra a los estudiantes en proyectos del mundo real para desarrollar habilidades del siglo XXI. Los estudiantes trabajan en equipos para resolver problemas auténticos, desarrollando competencias como pensamiento crítico, colaboración y comunicación.',
      shortDescription: 'Desarrollo de habilidades a través de proyectos reales',
      ageGroup: '6-12 años',
      category: 'EDUCACION' as const,
      targetAudience: 'Estudiantes de primaria',
      objectives: 'Fomentar el pensamiento crítico, la colaboración y la resolución de problemas a través de proyectos interdisciplinarios que conecten el aprendizaje con situaciones del mundo real.',
      implementation: 'Proyectos interdisciplinarios de 8 semanas con seguimiento semanal, presentaciones finales y evaluación por pares.',
      results: 'Mejora del 40% en habilidades de resolución de problemas, aumento del 60% en participación estudiantil y desarrollo de competencias del siglo XXI.',
      methodology: 'Los estudiantes identifican problemas reales en su comunidad, investigan soluciones, diseñan prototipos y presentan sus hallazgos a la comunidad educativa.',
      resources: 'Materiales de investigación, herramientas tecnológicas, espacios de trabajo colaborativo y mentores de la comunidad.',
      evaluation: 'Evaluación continua basada en rúbricas, autoevaluación, evaluación por pares y presentaciones finales a la comunidad.',
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Salud Comunitaria Preventiva',
      description: 'Programa integral de salud que empodera a las comunidades para prevenir enfermedades y promover estilos de vida saludables. Involucra a líderes comunitarios, trabajadores de salud y familias en la identificación y prevención de problemas de salud locales.',
      shortDescription: 'Prevención y promoción de salud comunitaria',
      ageGroup: 'Todas las edades',
      category: 'SALUD' as const,
      targetAudience: 'Comunidades rurales',
      objectives: 'Reducir enfermedades prevenibles en un 60%, mejorar el acceso a servicios de salud básicos y empoderar a las comunidades para tomar decisiones informadas sobre su salud.',
      implementation: 'Talleres mensuales, seguimiento personalizado, campañas de vacunación, educación nutricional y formación de promotores de salud comunitarios.',
      results: 'Reducción del 45% en consultas por enfermedades prevenibles, formación de 25 promotores de salud y mejora del acceso a servicios básicos en 8 comunidades.',
      methodology: 'Identificación participativa de problemas de salud, formación de promotores comunitarios, implementación de estrategias preventivas y monitoreo continuo.',
      resources: 'Materiales educativos, equipos básicos de salud, medicamentos preventivos y transporte para campañas móviles.',
      evaluation: 'Indicadores de salud comunitaria, encuestas de satisfacción, seguimiento de casos y evaluación de impacto en la calidad de vida.',
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'Desarrollo Comunitario Participativo',
      description: 'Metodología que involucra activamente a los miembros de la comunidad en la identificación y solución de sus propios problemas. Utiliza técnicas participativas para fortalecer la organización comunitario y desarrollar capacidades locales de gestión.',
      shortDescription: 'Participación activa de la comunidad en su desarrollo',
      ageGroup: 'Adultos',
      category: 'SOCIAL' as const,
      targetAudience: 'Líderes comunitarios',
      objectives: 'Fortalecer la organización comunitario, desarrollar capacidades de gestión local y promover la participación ciudadana en la toma de decisiones que afectan el desarrollo comunitario.',
      implementation: 'Talleres participativos, planificación conjunta, formación de líderes, implementación de proyectos comunitarios y seguimiento colaborativo.',
      results: 'Formación de 15 organizaciones comunitarias, implementación de 8 proyectos locales y aumento del 70% en participación ciudadana.',
      methodology: 'Diagnóstico participativo, planificación estratégica comunitaria, formación de líderes, implementación de proyectos y evaluación continua.',
      resources: 'Facilitadores especializados, materiales de capacitación, espacios de reunión y fondos semilla para proyectos comunitarios.',
      evaluation: 'Evaluación participativa del proceso, indicadores de fortalecimiento organizacional y seguimiento de proyectos implementados.',
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Conservación Ambiental Participativa',
      description: 'Programa que involucra a las comunidades en la protección y conservación de sus recursos naturales locales. Combina conocimiento tradicional con técnicas modernas de conservación para proteger ecosistemas críticos.',
      shortDescription: 'Protección participativa del medio ambiente',
      ageGroup: 'Todas las edades',
      category: 'AMBIENTAL' as const,
      targetAudience: 'Comunidades rurales',
      objectives: 'Conservar 500 hectáreas de bosque, proteger fuentes de agua, promover prácticas agrícolas sostenibles y desarrollar capacidades locales para la gestión ambiental.',
      implementation: 'Monitoreo comunitario, reforestación participativa, educación ambiental, implementación de prácticas sostenibles y formación de guardabosques comunitarios.',
      results: 'Conservación de 300 hectáreas en el primer año, protección de 5 fuentes de agua, formación de 20 guardabosques comunitarios y adopción de prácticas sostenibles en 12 comunidades.',
      methodology: 'Mapeo participativo de recursos naturales, formación de comités ambientales, implementación de planes de conservación y monitoreo comunitario.',
      resources: 'Equipos de monitoreo, plantas nativas, materiales educativos, herramientas de conservación y transporte para actividades de campo.',
      evaluation: 'Monitoreo de indicadores ambientales, evaluación de prácticas adoptadas, seguimiento de áreas conservadas y encuestas de satisfacción comunitaria.',
      isActive: true,
      isFeatured: false,
    },
  ],

  projects: [
    {
      title: 'SEMBRANDO UNA IDEA, COSECHANDO UN FUTURO',
      executionStart: new Date('2016-04-01'),
      executionEnd: new Date('2016-09-30'),
      context: 'La falta de oportunidades laborales para jóvenes, la carencia de orientación vocacional, genera procesos de incertidumbre en jóvenes y señoritas, solo un 39 % de la población escolar graduada logra ingresar a la universidad, muchos de ellos dejan la carrera por situaciones económicas, el restante 61% busca un empleo o decide emprender algún negocio, en la mayoría sin orientación alguna.',
      objectives: 'El proyecto busca el desarrollo de habilidades blandas en jóvenes y señoritas, acompañado de un proceso de fortalecimiento en la identificación de ideas de negocio, validación de su idea, elaboración del plan de negocio y la puesta en marcha, permitiendo generar nuevas y mejores oportunidades económicas en 98 jóvenes y señoritas.',
      content: 'El proyecto desarrolla habilidades en liderazgo en jóvenes a través de la escuela de emprendedores. Los 98 jóvenes y señoritas desarrollan competencias en la elaboración de un plan de negocio, fase fundamental para la puesta en marcha de su emprendimiento. El sector privado a través de la confederación de microempresarios evalúa la factibilidad de los emprendimientos y los mejores son apoyados por el sector. El proyecto contempla el financiamiento para un equipamiento básico según el rubro del negocio.',
      strategicAllies: 'Confederación de Microempresarios',
      financing: 'Barnfondem\nChildFund Bolivia',
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'EDUCACIÓN DIGITAL PARA TODOS',
      executionStart: new Date('2023-01-15'),
      executionEnd: new Date('2023-12-15'),
      context: 'La pandemia aceleró la necesidad de digitalización en la educación, pero muchas comunidades rurales quedaron rezagadas. Este proyecto busca cerrar la brecha digital educativa en zonas rurales del país.',
      objectives: 'Capacitar a 200 docentes rurales en herramientas digitales educativas y dotar de equipamiento tecnológico básico a 50 escuelas rurales para mejorar la calidad educativa.',
      content: 'El proyecto incluye capacitación intensiva en herramientas digitales, entrega de tablets y laptops a escuelas, instalación de internet satelital, y seguimiento pedagógico durante todo el año escolar.',
      strategicAllies: 'Ministerio de Educación\nFundación Telefónica\nCisco Systems',
      financing: 'Banco Mundial\nFondo de Desarrollo Digital\nEmpresas privadas',
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'CONSERVACIÓN DE BOSQUES NATIVOS',
      executionStart: new Date('2022-06-01'),
      executionEnd: new Date('2024-05-31'),
      context: 'La deforestación en la región amazónica ha aumentado significativamente en los últimos años. Las comunidades indígenas necesitan apoyo para proteger sus territorios y desarrollar alternativas económicas sostenibles.',
      objectives: 'Proteger 10,000 hectáreas de bosque nativo, capacitar a 150 familias indígenas en técnicas de agroforestería sostenible, y establecer 5 viveros comunitarios para reforestación.',
      content: 'El proyecto trabaja directamente con comunidades indígenas para establecer sistemas de monitoreo forestal, capacitar en técnicas de cultivo sostenible, y crear fuentes de ingresos alternativas que no dependan de la tala de árboles.',
      strategicAllies: 'Confederación de Pueblos Indígenas\nWWF Bolivia\nUniversidad Amazónica',
      financing: 'Fondo Verde del Clima\nGobierno de Noruega\nFundación Ford',
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'MICROEMPRESAS FEMENINAS',
      executionStart: new Date('2021-03-01'),
      executionEnd: new Date('2022-02-28'),
      context: 'Las mujeres en zonas rurales enfrentan múltiples barreras para acceder a oportunidades económicas. Este proyecto busca empoderar económicamente a mujeres a través del desarrollo de microempresas sostenibles.',
      objectives: 'Capacitar a 120 mujeres en gestión empresarial, apoyar la creación de 60 microempresas femeninas, y establecer una red de comercialización para sus productos.',
      content: 'El proyecto incluye talleres de capacitación empresarial, asesoría técnica especializada, acceso a microcréditos con tasas preferenciales, y la creación de una plataforma de comercialización digital.',
      strategicAllies: 'Banco de Desarrollo Productivo\nFederación de Mujeres Campesinas\nCámara de Comercio',
      financing: 'Banco Interamericano de Desarrollo\nFondo de Microfinanzas\nEmpresas privadas',
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'AGUA LIMPIA PARA COMUNIDADES RURALES',
      executionStart: new Date('2020-08-01'),
      executionEnd: new Date('2021-07-31'),
      context: 'Muchas comunidades rurales no tienen acceso a agua potable, lo que genera problemas de salud pública. Este proyecto busca implementar sistemas de purificación de agua en comunidades vulnerables.',
      objectives: 'Instalar sistemas de purificación de agua en 25 comunidades rurales, capacitar a 500 familias en el mantenimiento de los sistemas, y reducir en 80% las enfermedades relacionadas con agua contaminada.',
      content: 'El proyecto incluye la instalación de filtros de agua, capacitación comunitaria en mantenimiento, monitoreo de calidad del agua, y educación en higiene y saneamiento.',
      strategicAllies: 'Ministerio de Salud\nUNICEF\nCruz Roja Boliviana',
      financing: 'Agencia de Cooperación Internacional\nFundación Bill Gates\nGobierno local',
      isActive: true,
      isFeatured: false,
    },
  ],

  news: [
    {
      title: "Nueva Iniciativa de Apoyo Educativo",
      content: "Estamos emocionados de anunciar el lanzamiento de nuestra nueva iniciativa de apoyo educativo que beneficiará a más de 500 niños en comunidades rurales. Este programa incluye materiales escolares, capacitación docente y apoyo nutricional.",
      excerpt: "Nueva iniciativa que beneficiará a más de 500 niños en comunidades rurales con apoyo educativo integral.",
      category: "NOTICIAS" as const,
      isActive: true,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
      imageAlt: "Niños estudiando en aula rural",
    },
    {
      title: "Campaña de Recaudación de Fondos Exitosos",
      content: "Gracias al apoyo de nuestra comunidad, hemos logrado recaudar $50,000 para nuestro programa de alimentación escolar. Estos fondos nos permitirán proporcionar comidas nutritivas a 200 niños durante todo el año escolar.",
      excerpt: "Campaña exitosa que recaudó $50,000 para el programa de alimentación escolar.",
      category: "FUNDRAISING" as const,
      isActive: true,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
      imageAlt: "Niños recibiendo comida en la escuela",
    },
    {
      title: "Expansión de Nuestras Operaciones",
      content: "Estrella Sur está expandiendo sus operaciones a tres nuevas regiones del país. Esta expansión nos permitirá llegar a más comunidades necesitadas y duplicar nuestro impacto en los próximos dos años.",
      excerpt: "Expansión a tres nuevas regiones para duplicar nuestro impacto social.",
      category: "COMPANIA" as const,
      isActive: true,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
      imageAlt: "Mapa de expansión de operaciones",
    },
    {
      title: "Voluntarios Destacados del Mes",
      content: "Reconocemos a nuestros voluntarios destacados del mes: María González, Juan Pérez y Ana Rodríguez. Su dedicación y compromiso han sido fundamentales para el éxito de nuestros programas comunitarios.",
      excerpt: "Reconocimiento a voluntarios destacados por su compromiso con la comunidad.",
      category: "NOTICIAS" as const,
      isActive: true,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
      imageAlt: "Grupo de voluntarios trabajando",
    },
    {
      title: "Nuevo Centro de Capacitación",
      content: "Hemos inaugurado un nuevo centro de capacitación en la ciudad de Medellín. Este centro ofrecerá cursos de habilidades técnicas y empresariales para jóvenes de comunidades vulnerables.",
      excerpt: "Nuevo centro de capacitación en Medellín para jóvenes de comunidades vulnerables.",
      category: "COMPANIA" as const,
      isActive: true,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      imageAlt: "Centro de capacitación moderno",
    },
    {
      title: "Campaña de Donaciones de Invierno",
      content: "Lanzamos nuestra campaña anual de donaciones de invierno para proporcionar ropa abrigada, mantas y alimentos a familias en situación de vulnerabilidad durante la temporada fría.",
      excerpt: "Campaña de invierno para ayudar a familias vulnerables con ropa y alimentos.",
      category: "FUNDRAISING" as const,
      isActive: true,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      imageAlt: "Donaciones de ropa de invierno",
    },
    {
      title: "Alianza Estratégica con Empresa Local",
      content: "Estrella Sur ha firmado una alianza estratégica con la empresa local TechCorp para desarrollar programas de educación digital en comunidades rurales. Esta colaboración incluye donación de equipos y capacitación técnica.",
      excerpt: "Alianza con TechCorp para programas de educación digital en comunidades rurales.",
      category: "COMPANIA" as const,
      isActive: true,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
      imageAlt: "Firma de alianza estratégica",
    },
    {
      title: "Resultados del Programa de Salud",
      content: "Nuestro programa de salud comunitaria ha atendido a más de 1,000 personas este año, proporcionando atención médica básica, vacunación y educación en salud preventiva en zonas rurales.",
      excerpt: "Programa de salud comunitaria atendió a más de 1,000 personas este año.",
      category: "NOTICIAS" as const,
      isActive: true,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      imageAlt: "Atención médica comunitaria",
    },
    {
      title: "Campaña de Reforestación",
      content: "En colaboración con comunidades locales, hemos plantado más de 5,000 árboles en áreas deforestadas. Este proyecto no solo ayuda al medio ambiente sino que también genera empleo local.",
      excerpt: "Proyecto de reforestación plantó más de 5,000 árboles con comunidades locales.",
      category: "FUNDRAISING" as const,
      isActive: true,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
      imageAlt: "Plantación de árboles comunitarios",
    },
    {
      title: "Actualización de Políticas Internas",
      content: "Hemos actualizado nuestras políticas internas para mejorar la transparencia y eficiencia en nuestras operaciones. Estas mejoras incluyen nuevos protocolos de evaluación y seguimiento de proyectos.",
      excerpt: "Actualización de políticas internas para mayor transparencia y eficiencia.",
      category: "SIN_CATEGORIA" as const,
      isActive: true,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
      imageAlt: "Documentos de políticas internas",
    },
  ],

  events: [
    {
      title: 'Jornada de salud comunitaria en San José',
      description: 'Jornada médica gratuita que incluye consultas generales, vacunación y exámenes preventivos para toda la comunidad.',
      content: 'La jornada de salud comunitaria se realizará en el Centro Comunitario de San José el próximo sábado. Contaremos con médicos especialistas, enfermeras y voluntarios capacitados para atender a toda la comunidad. Los servicios incluyen: consultas médicas generales, vacunación contra enfermedades prevenibles, exámenes de presión arterial y glucosa, charlas educativas sobre prevención de enfermedades, y entrega de medicamentos básicos.',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
      imageAlt: 'Jornada médica comunitaria',
      eventDate: new Date('2024-12-15T08:00:00Z'),
      location: 'Centro Comunitario San José, Calle Principal #123',
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Taller de emprendimiento para mujeres',
      description: 'Capacitación especializada en creación y gestión de microempresas dirigida exclusivamente a mujeres de la comunidad.',
      content: 'Este taller de 3 días está diseñado para empoderar a las mujeres de la comunidad con herramientas prácticas para iniciar y gestionar sus propios negocios. Los temas incluyen: identificación de oportunidades de negocio, planificación financiera básica, marketing local, gestión de inventarios, y redes de apoyo entre emprendedoras.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
      imageAlt: 'Mujeres en taller de emprendimiento',
      eventDate: new Date('2024-12-20T09:00:00Z'),
      location: 'Salón Comunitario Las Flores',
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Feria de productos locales',
      description: 'Exposición y venta de productos artesanales y agrícolas producidos por emprendedores locales.',
      content: 'La feria de productos locales es una oportunidad para que los emprendedores de la comunidad muestren y vendan sus productos. Incluye: productos agrícolas frescos, artesanías tradicionales, comida local, música en vivo, actividades para niños, y premios para los mejores productos.',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      imageAlt: 'Feria de productos locales',
      eventDate: new Date('2024-12-28T10:00:00Z'),
      location: 'Plaza Central del Pueblo',
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'Charla sobre nutrición infantil',
      description: 'Conferencia educativa sobre alimentación saludable para niños y prevención de desnutrición.',
      content: 'La charla está dirigida a padres, madres y cuidadores de niños menores de 5 años. Los temas incluyen: importancia de la lactancia materna, introducción de alimentos sólidos, prevención de anemia, identificación de signos de desnutrición, y preparación de comidas nutritivas con ingredientes locales.',
      imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c3c56?w=800&h=600&fit=crop',
      imageAlt: 'Charla sobre nutrición infantil',
      eventDate: new Date('2025-01-10T14:00:00Z'),
      location: 'Centro de Salud Comunitario',
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'Campaña de reforestación comunitaria',
      description: 'Actividad de plantación de árboles nativos para mejorar el medio ambiente local.',
      content: 'Únete a nuestra campaña de reforestación donde plantaremos 500 árboles nativos en áreas degradadas de la comunidad. La actividad incluye: capacitación sobre importancia de los árboles, técnicas de plantación, cuidado posterior, y compromiso de mantenimiento comunitario.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      imageAlt: 'Plantación de árboles comunitarios',
      eventDate: new Date('2025-01-25T07:00:00Z'),
      location: 'Reserva Natural Comunitaria',
      isActive: true,
      isFeatured: false,
    },
  ],

  resources: [
    {
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
      title: 'Testimonio de María - Beneficiaria del Programa Educativo',
      description: 'María comparte su experiencia como beneficiaria del programa educativo de Estrella Sur',
      youtubeUrl: 'https://www.youtube.com/watch?v=example-testimonial-1',
      thumbnailUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      duration: 300,
      isActive: true,
      isFeatured: true,
    },
    {
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
      title: 'Niños en aula de clase',
      description: 'Niños participando en actividades educativas en el programa de Educación Infantil',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      imageAlt: 'Niños aprendiendo en el aula',
      fileName: 'ninos-aula-clase.jpg',
      fileSize: 1024000,
      fileType: 'image/jpeg',
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Promotora de salud comunitaria',
      description: 'Promotora de salud capacitando a la comunidad sobre prácticas saludables',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      imageAlt: 'Promotora de salud en la comunidad',
      fileName: 'promotora-salud.jpg',
      fileSize: 1200000,
      fileType: 'image/jpeg',
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Jóvenes en capacitación técnica',
      description: 'Jóvenes aprendiendo habilidades técnicas en el programa de Desarrollo Económico',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      imageAlt: 'Jóvenes en capacitación',
      fileName: 'jovenes-capacitacion.jpg',
      fileSize: 1100000,
      fileType: 'image/jpeg',
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'Sistema de agua comunitario',
      description: 'Infraestructura de agua potable construida en comunidad rural',
      imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800',
      imageAlt: 'Sistema de agua comunitario',
      fileName: 'sistema-agua.jpg',
      fileSize: 1300000,
      fileType: 'image/jpeg',
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Mujeres en taller de liderazgo',
      description: 'Mujeres participando en taller de empoderamiento y liderazgo',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
      imageAlt: 'Mujeres en taller de liderazgo',
      fileName: 'mujeres-liderazgo.jpg',
      fileSize: 1150000,
      fileType: 'image/jpeg',
      isActive: true,
      isFeatured: true,
    },
  ],
};

async function main() {
  console.log('🌱 Iniciando proceso de seed con datos actuales de Estrella Sur...');

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
          programaId: createdPrograms[0]?.id, // Asignar al primer programa si existe
          methodologyId: createdMethodologies[0]?.id, // Asignar a la primera metodología si existe
          projectId: createdProjects[0]?.id, // Asignar al primer proyecto si existe
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
          programaId: createdPrograms[0]?.id, // Asignar al primer programa si existe
        },
      });
      console.log(`✅ Imagen creada: ${image.title}`);
    }

    console.log('🎉 ¡Seed completado exitosamente con datos actuales!');
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
    console.log('Admin Principal: admin@estrellasur.com / Admin123!');
    console.log('Supervisor: supervisor@estrellasur.com / Supervisor123!');
    console.log('Técnico: tecnico@estrellasur.com / Tecnico123!');
    console.log('Admin Alternativo: admin@estrellasur.org / admin123');
    console.log('Supervisor Alternativo: supervisor@estrellasur.org / supervisor123');
    console.log('Técnico Alternativo: tecnico1@estrellasur.org / tecnico123');

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
