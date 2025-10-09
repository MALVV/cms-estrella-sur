const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Datos ficticios realistas para el CMS de Estrella Sur
const realisticData = {
  users: [
    {
      email: 'admin@estrellasur.org',
      name: 'María González',
      password: 'admin123',
      role: 'ADMINISTRADOR',
      isActive: true,
      emailVerified: new Date(),
    },
    {
      email: 'supervisor@estrellasur.org',
      name: 'Carlos Rodríguez',
      password: 'supervisor123',
      role: 'SUPERVISOR',
      isActive: true,
      emailVerified: new Date(),
    },
    {
      email: 'tecnico1@estrellasur.org',
      name: 'Ana Martínez',
      password: 'tecnico123',
      role: 'TECNICO',
      isActive: true,
      emailVerified: new Date(),
    },
    {
      email: 'tecnico2@estrellasur.org',
      name: 'Luis Fernández',
      password: 'tecnico123',
      role: 'TECNICO',
      isActive: true,
      emailVerified: new Date(),
    },
    {
      email: 'comunicaciones@estrellasur.org',
      name: 'Sofia Herrera',
      password: 'comunicaciones123',
      role: 'TECNICO',
      isActive: true,
      emailVerified: new Date(),
    }
  ],

  stories: [
    {
      id: 'story-001',
      title: 'Transformando vidas en la comunidad de San José',
      description: 'Conoce la historia de María, una madre soltera que logró emprender su propio negocio gracias al programa de microcréditos de Estrella Sur.',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      imageAlt: 'Mujer emprendedora en su tienda local',
    },
    {
      id: 'story-002',
      title: 'Educación que cambia el futuro',
      description: 'El programa de alfabetización digital ha beneficiado a más de 500 jóvenes en zonas rurales, abriendo nuevas oportunidades de empleo.',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
      imageAlt: 'Jóvenes aprendiendo computación',
    },
    {
      id: 'story-003',
      title: 'Agua potable para todos',
      description: 'La instalación de sistemas de purificación de agua ha mejorado la salud de más de 1,200 familias en comunidades vulnerables.',
      imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop',
      imageAlt: 'Familia obteniendo agua potable',
    },
    {
      id: 'story-004',
      title: 'Reconstruyendo después del desastre',
      description: 'Después del terremoto, Estrella Sur ayudó a reconstruir 50 hogares y proporcionó apoyo psicológico a las familias afectadas.',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop',
      imageAlt: 'Construcción de viviendas nuevas',
    },
    {
      id: 'story-005',
      title: 'Empoderando mujeres líderes',
      description: 'El programa de liderazgo femenino ha formado a 200 mujeres que ahora lideran proyectos comunitarios en sus localidades.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
      imageAlt: 'Grupo de mujeres líderes comunitarias',
    }
  ],

  allies: [
    {
      id: 'ally-001',
      name: 'Fundación Esperanza',
      role: 'Socio Estratégico',
      description: 'Organización sin fines de lucro con más de 20 años de experiencia en desarrollo comunitario y programas de educación.',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop',
      imageAlt: 'Logo de Fundación Esperanza',
      isFeatured: true,
    },
    {
      id: 'ally-002',
      name: 'Corporación Desarrollo Rural',
      role: 'Aliado Técnico',
      description: 'Especialistas en proyectos de desarrollo rural sostenible y capacitación agrícola para comunidades campesinas.',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
      imageAlt: 'Logo de Corporación Desarrollo Rural',
      isFeatured: true,
    },
    {
      id: 'ally-003',
      name: 'Universidad Nacional',
      role: 'Socio Académico',
      description: 'Facultad de Ciencias Sociales colabora en investigación y evaluación de impacto de nuestros programas sociales.',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
      imageAlt: 'Logo de Universidad Nacional',
      isFeatured: false,
    },
    {
      id: 'ally-004',
      name: 'Banco Solidario',
      role: 'Socio Financiero',
      description: 'Institución financiera que facilita microcréditos y productos bancarios para nuestros beneficiarios.',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
      imageAlt: 'Logo de Banco Solidario',
      isFeatured: false,
    },
    {
      id: 'ally-005',
      name: 'Ministerio de Desarrollo Social',
      role: 'Socio Gubernamental',
      description: 'Entidad gubernamental que apoya nuestros programas de inclusión social y desarrollo comunitario.',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop',
      imageAlt: 'Logo del Ministerio de Desarrollo Social',
      isFeatured: true,
    }
  ],

  news: [
    {
      title: 'Estrella Sur recibe reconocimiento internacional por su labor social',
      content: 'La organización fue galardonada con el Premio Internacional de Desarrollo Comunitario 2024 por su innovador programa de inclusión digital en zonas rurales. Este reconocimiento valida el trabajo de más de 15 años dedicados al desarrollo social sostenible.',
      excerpt: 'Reconocimiento internacional por programa de inclusión digital en zonas rurales.',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      imageAlt: 'Ceremonia de entrega de premio internacional',
      category: 'NOTICIAS',
      isFeatured: true,
    },
    {
      title: 'Nueva campaña de recaudación de fondos para programa de vivienda',
      content: 'Lanzamos nuestra campaña anual "Hogar para Todos" con el objetivo de recaudar $500,000 para construir 100 viviendas dignas en comunidades vulnerables. Cada donación contribuye directamente a mejorar las condiciones de vida de familias necesitadas.',
      excerpt: 'Campaña para recaudar fondos y construir 100 viviendas dignas.',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop',
      imageAlt: 'Construcción de viviendas sociales',
      category: 'FUNDRAISING',
      isFeatured: true,
    },
    {
      title: 'Estrella Sur celebra 15 años de transformación social',
      content: 'Este mes celebramos 15 años de trabajo ininterrumpido en favor de las comunidades más vulnerables. Durante este tiempo hemos impactado positivamente a más de 50,000 personas a través de nuestros programas de educación, salud y desarrollo económico.',
      excerpt: 'Celebración de 15 años impactando a más de 50,000 personas.',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
      imageAlt: 'Celebración de aniversario de la organización',
      category: 'COMPAÑIA',
      isFeatured: false,
    },
    {
      title: 'Programa de alfabetización digital alcanza nuevas comunidades',
      content: 'Nuestro programa de alfabetización digital ha llegado a 5 nuevas comunidades rurales, beneficiando a 300 jóvenes y adultos. El programa incluye capacitación en herramientas digitales básicas y acceso a internet comunitario.',
      excerpt: 'Programa de alfabetización digital llega a 5 nuevas comunidades.',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
      imageAlt: 'Personas aprendiendo computación',
      category: 'NOTICIAS',
      isFeatured: false,
    },
    {
      title: 'Alianza estratégica con empresa tecnológica para innovación social',
      content: 'Firmamos una alianza con TechCorp para desarrollar soluciones tecnológicas que mejoren la eficiencia de nuestros programas sociales. Esta colaboración nos permitirá llegar a más comunidades con herramientas digitales innovadoras.',
      excerpt: 'Nueva alianza para desarrollar soluciones tecnológicas sociales.',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      imageAlt: 'Firma de alianza estratégica',
      category: 'COMPAÑIA',
      isFeatured: false,
    }
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
      isFeatured: false,
    },
    {
      title: 'Charla sobre nutrición infantil',
      description: 'Conferencia educativa sobre alimentación saludable para niños y prevención de desnutrición.',
      content: 'La charla está dirigida a padres, madres y cuidadores de niños menores de 5 años. Los temas incluyen: importancia de la lactancia materna, introducción de alimentos sólidos, prevención de anemia, identificación de signos de desnutrición, y preparación de comidas nutritivas con ingredientes locales.',
      imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop',
      imageAlt: 'Charla sobre nutrición infantil',
      eventDate: new Date('2025-01-10T14:00:00Z'),
      location: 'Centro de Salud Comunitario',
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
      isFeatured: false,
    }
  ],

  projects: [
    {
      title: 'Programa de Microcréditos para Mujeres Emprendedoras',
      executionStart: new Date('2024-01-01'),
      executionEnd: new Date('2024-12-31'),
      context: 'En las comunidades rurales, las mujeres enfrentan barreras significativas para acceder a financiamiento tradicional. Este programa busca empoderar económicamente a las mujeres a través de microcréditos y capacitación empresarial.',
      objectives: 'Facilitar el acceso a microcréditos a 200 mujeres emprendedoras, proporcionar capacitación empresarial especializada, crear una red de apoyo entre emprendedoras, y generar empleo local a través de nuevos negocios.',
      content: 'El programa incluye evaluación crediticia simplificada, capacitación en gestión empresarial, acompañamiento técnico personalizado, acceso a materias primas locales, y seguimiento de resultados. Las participantes reciben créditos de $500 a $2,000 con tasas preferenciales.',
      strategicAllies: 'Banco Solidario, Cooperativa de Mujeres, Universidad Nacional (Facultad de Economía)',
      financing: 'Fondo de Desarrollo Social ($200,000), Donaciones privadas ($50,000), Recursos propios ($30,000)',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      imageAlt: 'Mujeres emprendedoras en taller de capacitación',
      isFeatured: true,
    },
    {
      title: 'Centro de Alfabetización Digital Rural',
      executionStart: new Date('2024-03-01'),
      executionEnd: new Date('2025-02-28'),
      context: 'La brecha digital en zonas rurales limita las oportunidades de empleo y educación de los jóvenes. Este proyecto establece centros de alfabetización digital en comunidades remotas.',
      objectives: 'Capacitar a 500 jóvenes en herramientas digitales básicas, establecer 5 centros de alfabetización digital, conectar las comunidades a internet de alta velocidad, y facilitar el acceso a oportunidades laborales remotas.',
      content: 'El proyecto incluye instalación de equipos informáticos, contratación de instructores especializados, desarrollo de currículo adaptado al contexto rural, conexión a internet satelital, y programa de certificación reconocido.',
      strategicAllies: 'Ministerio de Tecnologías de la Información, Fundación Tecnológica, Empresas de telecomunicaciones',
      financing: 'Fondo de Innovación Tecnológica ($300,000), Alianzas corporativas ($100,000), Recursos comunitarios ($25,000)',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
      imageAlt: 'Centro de alfabetización digital rural',
      isFeatured: true,
    },
    {
      title: 'Sistema de Purificación de Agua Comunitario',
      executionStart: new Date('2024-06-01'),
      executionEnd: new Date('2025-05-31'),
      context: 'Muchas comunidades rurales carecen de acceso a agua potable, lo que genera problemas de salud pública. Este proyecto implementa sistemas de purificación de agua sostenibles.',
      objectives: 'Instalar sistemas de purificación en 10 comunidades, capacitar a líderes comunitarios en mantenimiento, reducir enfermedades relacionadas con agua contaminada en 80%, y crear comités de gestión del agua.',
      content: 'El proyecto incluye instalación de sistemas de filtración y purificación, capacitación técnica para mantenimiento, educación comunitaria sobre higiene, monitoreo de calidad del agua, y establecimiento de tarifas comunitarias.',
      strategicAllies: 'Ministerio de Salud, Organización Mundial de la Salud, Empresas de tecnología del agua',
      financing: 'Fondo de Salud Pública ($400,000), Cooperación internacional ($150,000), Contribución comunitaria ($50,000)',
      imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop',
      imageAlt: 'Sistema de purificación de agua comunitario',
      isFeatured: false,
    },
    {
      title: 'Programa de Reconstrucción Post-Desastre',
      executionStart: new Date('2024-09-01'),
      executionEnd: new Date('2025-08-31'),
      context: 'Después del terremoto de magnitud 7.2, muchas familias perdieron sus hogares y necesitan apoyo para reconstruir sus vidas. Este programa aborda la reconstrucción física y emocional.',
      objectives: 'Reconstruir 50 viviendas seguras y resistentes, proporcionar apoyo psicológico a 200 familias afectadas, capacitar en construcción antisísmica, y fortalecer la resiliencia comunitaria.',
      content: 'El programa incluye construcción de viviendas con estándares antisísmicos, terapia psicológica individual y grupal, capacitación en técnicas de construcción segura, establecimiento de sistemas de alerta temprana, y creación de planes de emergencia comunitarios.',
      strategicAllies: 'Cruz Roja Internacional, Ministerio de Vivienda, Organizaciones de ayuda humanitaria',
      financing: 'Fondo de Emergencia Nacional ($500,000), Ayuda humanitaria internacional ($300,000), Donaciones privadas ($100,000)',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop',
      imageAlt: 'Reconstrucción de viviendas post-terremoto',
      isFeatured: false,
    }
  ],

  methodologies: [
    {
      title: 'Metodología de Desarrollo Comunitario Participativo',
      description: 'Enfoque integral que involucra activamente a las comunidades en la identificación, planificación e implementación de soluciones a sus problemas locales.',
      shortDescription: 'Desarrollo comunitario con participación activa de los beneficiarios.',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
      imageAlt: 'Reunión comunitaria participativa',
      ageGroup: 'Adultos (18-65 años)',
      category: 'SOCIAL',
      targetAudience: 'Líderes comunitarios, organizaciones locales, funcionarios públicos',
      objectives: 'Fortalecer la capacidad organizativa comunitaria, promover la participación ciudadana, desarrollar habilidades de liderazgo local, y crear planes de desarrollo sostenible.',
      implementation: 'La metodología se implementa en 4 fases: diagnóstico participativo, planificación comunitaria, ejecución colaborativa, y evaluación continua. Incluye talleres, reuniones comunitarias, y acompañamiento técnico.',
      results: 'Aumento del 60% en participación comunitaria, creación de 15 organizaciones locales, implementación de 30 proyectos comunitarios, y mejora en indicadores de desarrollo local.',
      methodology: 'Enfoque bottom-up que prioriza el conocimiento local, utiliza herramientas de diagnóstico participativo, implementa sistemas de monitoreo comunitario, y promueve la sostenibilidad a largo plazo.',
      resources: 'Facilitadores comunitarios, materiales educativos, espacios de reunión, herramientas de diagnóstico, y fondos semilla para proyectos.',
      evaluation: 'Evaluación participativa trimestral, indicadores de desarrollo comunitario, encuestas de satisfacción, y seguimiento de proyectos implementados.',
      isFeatured: true,
    },
    {
      title: 'Programa de Alfabetización Digital Rural',
      description: 'Metodología adaptada para enseñar competencias digitales básicas en contextos rurales con limitaciones de conectividad y recursos tecnológicos.',
      shortDescription: 'Alfabetización digital adaptada para contextos rurales.',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
      imageAlt: 'Personas aprendiendo computación en zona rural',
      ageGroup: 'Jóvenes y adultos (15-50 años)',
      category: 'EDUCACION',
      targetAudience: 'Jóvenes rurales, agricultores, comerciantes locales, mujeres emprendedoras',
      objectives: 'Enseñar uso básico de computadoras e internet, desarrollar habilidades digitales para empleo, facilitar acceso a servicios digitales, y reducir la brecha digital rural.',
      implementation: 'Curso de 40 horas dividido en módulos: computación básica, internet y redes sociales, herramientas de productividad, comercio electrónico, y seguridad digital.',
      results: 'Capacitación de 500 personas, 80% mejora en habilidades digitales, 30% aumento en empleabilidad, y creación de 5 centros digitales comunitarios.',
      methodology: 'Enseñanza práctica con equipos reales, contenido contextualizado al entorno rural, horarios flexibles, y certificación reconocida.',
      resources: 'Computadoras portátiles, conexión a internet, instructores certificados, materiales didácticos, y espacios de aprendizaje.',
      evaluation: 'Evaluación práctica por módulos, seguimiento de empleabilidad, encuestas de satisfacción, y medición de impacto en la comunidad.',
      isFeatured: true,
    },
    {
      title: 'Metodología de Microcréditos con Enfoque de Género',
      description: 'Sistema de microfinanzas diseñado específicamente para mujeres emprendedoras, incluyendo capacitación empresarial y apoyo psicosocial.',
      shortDescription: 'Microcréditos especializados para mujeres emprendedoras.',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      imageAlt: 'Mujeres emprendedoras recibiendo capacitación',
      ageGroup: 'Mujeres adultas (25-55 años)',
      category: 'SOCIAL',
      targetAudience: 'Mujeres emprendedoras, madres cabeza de familia, mujeres rurales, organizaciones de mujeres',
      objectives: 'Facilitar acceso a financiamiento para mujeres, desarrollar capacidades empresariales, crear redes de apoyo entre emprendedoras, y promover la independencia económica femenina.',
      implementation: 'Proceso de 6 meses: evaluación crediticia, capacitación empresarial, desembolso de crédito, acompañamiento técnico, y seguimiento de resultados.',
      results: '200 mujeres beneficiadas, 85% tasa de recuperación, creación de 150 microempresas, y aumento del 40% en ingresos familiares.',
      methodology: 'Evaluación crediticia simplificada, capacitación grupal e individual, acompañamiento técnico personalizado, y sistema de garantías solidarias.',
      resources: 'Fondo rotatorio de microcréditos, capacitadores empresariales, materiales educativos, y sistema de seguimiento.',
      evaluation: 'Monitoreo mensual de cartera, evaluación de impacto económico, seguimiento de casos de éxito, y medición de empoderamiento femenino.',
      isFeatured: false,
    },
    {
      title: 'Programa de Salud Comunitaria Preventiva',
      description: 'Metodología integral de promoción de la salud que combina educación preventiva, detección temprana y fortalecimiento del sistema de salud local.',
      shortDescription: 'Promoción de salud preventiva en comunidades.',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
      imageAlt: 'Jornada de salud comunitaria',
      ageGroup: 'Todas las edades',
      category: 'SALUD',
      targetAudience: 'Familias rurales, niños menores de 5 años, mujeres embarazadas, adultos mayores',
      objectives: 'Reducir enfermedades prevenibles, mejorar acceso a servicios de salud, capacitar promotores de salud comunitarios, y fortalecer el sistema de salud local.',
      implementation: 'Jornadas de salud mensuales, capacitación de promotores comunitarios, campañas de vacunación, educación en salud familiar, y establecimiento de rutas de referencia.',
      results: 'Reducción del 50% en enfermedades prevenibles, capacitación de 30 promotores de salud, 95% de cobertura de vacunación, y mejora en indicadores de salud materno-infantil.',
      methodology: 'Enfoque de atención primaria en salud, participación comunitaria activa, trabajo intersectorial, y fortalecimiento de capacidades locales.',
      resources: 'Equipos médicos básicos, medicamentos esenciales, materiales educativos, vehículo para traslados, y personal de salud.',
      evaluation: 'Indicadores de salud comunitaria, encuestas de satisfacción, seguimiento de casos, y evaluación de impacto en salud.',
      isFeatured: false,
    },
    {
      title: 'Metodología de Conservación Ambiental Participativa',
      description: 'Enfoque comunitario para la conservación de recursos naturales que integra conocimiento tradicional con técnicas modernas de manejo ambiental.',
      shortDescription: 'Conservación ambiental con participación comunitaria.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      imageAlt: 'Comunidad trabajando en conservación ambiental',
      ageGroup: 'Todas las edades',
      category: 'AMBIENTAL',
      targetAudience: 'Comunidades rurales, agricultores, líderes ambientales, estudiantes',
      objectives: 'Conservar recursos naturales locales, promover prácticas agrícolas sostenibles, crear conciencia ambiental, y establecer áreas protegidas comunitarias.',
      implementation: 'Diagnóstico ambiental participativo, capacitación en técnicas de conservación, implementación de prácticas sostenibles, monitoreo ambiental comunitario, y creación de reservas naturales.',
      results: 'Conservación de 500 hectáreas, implementación de agricultura sostenible en 100 fincas, creación de 3 reservas comunitarias, y reducción del 30% en deforestación.',
      methodology: 'Integración de conocimiento tradicional y científico, participación comunitaria en todas las fases, enfoque ecosistémico, y sostenibilidad a largo plazo.',
      resources: 'Herramientas de monitoreo ambiental, materiales educativos, plantas nativas, equipos de medición, y técnicos especializados.',
      evaluation: 'Monitoreo ambiental participativo, indicadores de biodiversidad, evaluación de prácticas agrícolas, y seguimiento de áreas conservadas.',
      isFeatured: false,
    }
  ],

  posts: [
    {
      title: 'El impacto de la tecnología en el desarrollo rural',
      content: 'La tecnología está transformando la forma en que las comunidades rurales acceden a servicios básicos, educación y oportunidades económicas. En Estrella Sur, hemos visto cómo la implementación de centros de alfabetización digital ha abierto nuevas posibilidades para jóvenes y adultos en zonas remotas.',
      published: true,
    },
    {
      title: 'Mujeres líderes: agentes de cambio en sus comunidades',
      content: 'Las mujeres están demostrando ser las principales impulsoras del desarrollo comunitario. A través de nuestro programa de liderazgo femenino, hemos capacitado a más de 200 mujeres que ahora lideran proyectos transformadores en sus localidades.',
      published: true,
    },
    {
      title: 'Construyendo resiliencia ante desastres naturales',
      content: 'La preparación comunitaria es clave para enfrentar desastres naturales. Nuestro programa de reconstrucción post-desastre no solo reconstruye infraestructura, sino que fortalece la capacidad de las comunidades para prevenir y responder a futuras emergencias.',
      published: false,
    }
  ]
};

async function clearDatabase() {
  console.log('🧹 Limpiando base de datos...');
  
  // Eliminar en orden para respetar las foreign keys
  await prisma.posts.deleteMany();
  await prisma.stories.deleteMany();
  await prisma.allies.deleteMany();
  await prisma.news.deleteMany();
  await prisma.events.deleteMany();
  await prisma.projects.deleteMany();
  await prisma.methodologies.deleteMany();
  await prisma.users.deleteMany();
  
  console.log('✅ Base de datos limpiada exitosamente');
}

async function seedUsers() {
  console.log('👥 Creando usuarios...');
  
  for (const userData of realisticData.users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    await prisma.users.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }
  
  console.log(`✅ ${realisticData.users.length} usuarios creados`);
}

async function seedStories() {
  console.log('📖 Creando historias de impacto...');
  
  const users = await prisma.users.findMany();
  const adminUser = users.find(u => u.role === 'ADMINISTRADOR');
  
  for (const storyData of realisticData.stories) {
    await prisma.stories.create({
      data: {
        ...storyData,
        createdBy: adminUser?.id,
      },
    });
  }
  
  console.log(`✅ ${realisticData.stories.length} historias creadas`);
}

async function seedAllies() {
  console.log('🤝 Creando aliados estratégicos...');
  
  const users = await prisma.users.findMany();
  const supervisorUser = users.find(u => u.role === 'SUPERVISOR');
  
  for (const allyData of realisticData.allies) {
    await prisma.allies.create({
      data: {
        ...allyData,
        createdBy: supervisorUser?.id,
      },
    });
  }
  
  console.log(`✅ ${realisticData.allies.length} aliados creados`);
}

async function seedNews() {
  console.log('📰 Creando noticias...');
  
  const users = await prisma.users.findMany();
  const comunicacionesUser = users.find(u => u.email === 'comunicaciones@estrellasur.org');
  
  for (const newsData of realisticData.news) {
    await prisma.news.create({
      data: {
        ...newsData,
        createdBy: comunicacionesUser?.id,
      },
    });
  }
  
  console.log(`✅ ${realisticData.news.length} noticias creadas`);
}

async function seedEvents() {
  console.log('📅 Creando eventos...');
  
  const users = await prisma.users.findMany();
  const supervisorUser = users.find(u => u.role === 'SUPERVISOR');
  
  for (const eventData of realisticData.events) {
    await prisma.events.create({
      data: {
        ...eventData,
        createdBy: supervisorUser?.id,
      },
    });
  }
  
  console.log(`✅ ${realisticData.events.length} eventos creados`);
}

async function seedProjects() {
  console.log('🏗️ Creando proyectos...');
  
  const users = await prisma.users.findMany();
  const adminUser = users.find(u => u.role === 'ADMINISTRADOR');
  
  for (const projectData of realisticData.projects) {
    await prisma.projects.create({
      data: {
        ...projectData,
        createdBy: adminUser?.id,
      },
    });
  }
  
  console.log(`✅ ${realisticData.projects.length} proyectos creados`);
}

async function seedMethodologies() {
  console.log('📚 Creando metodologías...');
  
  const users = await prisma.users.findMany();
  const tecnicoUser = users.find(u => u.role === 'TECNICO');
  
  for (const methodologyData of realisticData.methodologies) {
    await prisma.methodologies.create({
      data: {
        ...methodologyData,
        createdBy: tecnicoUser?.id,
      },
    });
  }
  
  console.log(`✅ ${realisticData.methodologies.length} metodologías creadas`);
}

async function seedPosts() {
  console.log('📝 Creando posts...');
  
  for (const postData of realisticData.posts) {
    await prisma.posts.create({
      data: postData,
    });
  }
  
  console.log(`✅ ${realisticData.posts.length} posts creados`);
}

async function main() {
  try {
    console.log('🌱 Iniciando proceso de seed con datos realistas...');
    
    await clearDatabase();
    await seedUsers();
    await seedStories();
    await seedAllies();
    await seedNews();
    await seedEvents();
    await seedProjects();
    await seedMethodologies();
    await seedPosts();
    
    console.log('🎉 ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen de datos creados:');
    console.log(`👥 Usuarios: ${realisticData.users.length}`);
    console.log(`📖 Historias: ${realisticData.stories.length}`);
    console.log(`🤝 Aliados: ${realisticData.allies.length}`);
    console.log(`📰 Noticias: ${realisticData.news.length}`);
    console.log(`📅 Eventos: ${realisticData.events.length}`);
    console.log(`🏗️ Proyectos: ${realisticData.projects.length}`);
    console.log(`📚 Metodologías: ${realisticData.methodologies.length}`);
    console.log(`📝 Posts: ${realisticData.posts.length}`);
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
