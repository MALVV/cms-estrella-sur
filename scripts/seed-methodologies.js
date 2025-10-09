const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMethodologies() {
  try {
    console.log('🌱 Sembrando metodologías...');

    // Crear metodologías de ejemplo
    const methodologies = [
      {
        title: 'Aprendizaje Basado en Proyectos',
        description: 'Metodología educativa que involucra a los estudiantes en proyectos del mundo real para desarrollar habilidades del siglo XXI. Los estudiantes trabajan en equipos para resolver problemas auténticos, desarrollando competencias como pensamiento crítico, colaboración y comunicación.',
        shortDescription: 'Desarrollo de habilidades a través de proyectos reales',
        ageGroup: '6-12 años',
        category: 'EDUCACION',
        targetAudience: 'Estudiantes de primaria',
        objectives: 'Fomentar el pensamiento crítico, la colaboración y la resolución de problemas a través de proyectos interdisciplinarios que conecten el aprendizaje con situaciones del mundo real.',
        implementation: 'Proyectos interdisciplinarios de 8 semanas con seguimiento semanal, presentaciones finales y evaluación por pares.',
        results: 'Mejora del 40% en habilidades de resolución de problemas, aumento del 60% en participación estudiantil y desarrollo de competencias del siglo XXI.',
        methodology: 'Los estudiantes identifican problemas reales en su comunidad, investigan soluciones, diseñan prototipos y presentan sus hallazgos a la comunidad educativa.',
        resources: 'Materiales de investigación, herramientas tecnológicas, espacios de trabajo colaborativo y mentores de la comunidad.',
        evaluation: 'Evaluación continua basada en rúbricas, autoevaluación, evaluación por pares y presentaciones finales a la comunidad.'
      },
      {
        title: 'Salud Comunitaria Preventiva',
        description: 'Programa integral de salud que empodera a las comunidades para prevenir enfermedades y promover estilos de vida saludables. Involucra a líderes comunitarios, trabajadores de salud y familias en la identificación y prevención de problemas de salud locales.',
        shortDescription: 'Prevención y promoción de salud comunitaria',
        ageGroup: 'Todas las edades',
        category: 'SALUD',
        targetAudience: 'Comunidades rurales',
        objectives: 'Reducir enfermedades prevenibles en un 60%, mejorar el acceso a servicios de salud básicos y empoderar a las comunidades para tomar decisiones informadas sobre su salud.',
        implementation: 'Talleres mensuales, seguimiento personalizado, campañas de vacunación, educación nutricional y formación de promotores de salud comunitarios.',
        results: 'Reducción del 45% en consultas por enfermedades prevenibles, formación de 25 promotores de salud y mejora del acceso a servicios básicos en 8 comunidades.',
        methodology: 'Identificación participativa de problemas de salud, formación de promotores comunitarios, implementación de estrategias preventivas y monitoreo continuo.',
        resources: 'Materiales educativos, equipos básicos de salud, medicamentos preventivos y transporte para campañas móviles.',
        evaluation: 'Indicadores de salud comunitaria, encuestas de satisfacción, seguimiento de casos y evaluación de impacto en la calidad de vida.'
      },
      {
        title: 'Desarrollo Comunitario Participativo',
        description: 'Metodología que involucra activamente a los miembros de la comunidad en la identificación y solución de sus propios problemas. Utiliza técnicas participativas para fortalecer la organización comunitaria y desarrollar capacidades locales de gestión.',
        shortDescription: 'Participación activa de la comunidad en su desarrollo',
        ageGroup: 'Adultos',
        category: 'SOCIAL',
        targetAudience: 'Líderes comunitarios',
        objectives: 'Fortalecer la organización comunitaria, desarrollar capacidades de gestión local y promover la participación ciudadana en la toma de decisiones que afectan el desarrollo comunitario.',
        implementation: 'Talleres participativos, planificación conjunta, formación de líderes, implementación de proyectos comunitarios y seguimiento colaborativo.',
        results: 'Formación de 15 organizaciones comunitarias, implementación de 8 proyectos locales y aumento del 70% en participación ciudadana.',
        methodology: 'Diagnóstico participativo, planificación estratégica comunitaria, formación de líderes, implementación de proyectos y evaluación continua.',
        resources: 'Facilitadores especializados, materiales de capacitación, espacios de reunión y fondos semilla para proyectos comunitarios.',
        evaluation: 'Evaluación participativa del proceso, indicadores de fortalecimiento organizacional y seguimiento de proyectos implementados.'
      },
      {
        title: 'Conservación Ambiental Participativa',
        description: 'Programa que involucra a las comunidades en la protección y conservación de sus recursos naturales locales. Combina conocimiento tradicional con técnicas modernas de conservación para proteger ecosistemas críticos.',
        shortDescription: 'Protección participativa del medio ambiente',
        ageGroup: 'Todas las edades',
        category: 'AMBIENTAL',
        targetAudience: 'Comunidades rurales',
        objectives: 'Conservar 500 hectáreas de bosque, proteger fuentes de agua, promover prácticas agrícolas sostenibles y desarrollar capacidades locales para la gestión ambiental.',
        implementation: 'Monitoreo comunitario, reforestación participativa, educación ambiental, implementación de prácticas sostenibles y formación de guardabosques comunitarios.',
        results: 'Conservación de 300 hectáreas en el primer año, protección de 5 fuentes de agua, formación de 20 guardabosques comunitarios y adopción de prácticas sostenibles en 12 comunidades.',
        methodology: 'Mapeo participativo de recursos naturales, formación de comités ambientales, implementación de planes de conservación y monitoreo comunitario.',
        resources: 'Equipos de monitoreo, plantas nativas, materiales educativos, herramientas de conservación y transporte para actividades de campo.',
        evaluation: 'Monitoreo de indicadores ambientales, evaluación de prácticas adoptadas, seguimiento de áreas conservadas y encuestas de satisfacción comunitaria.'
      }
    ];

    // Insertar metodologías
    for (const methodology of methodologies) {
      await prisma.methodology.create({
        data: methodology
      });
      console.log(`✅ Metodología creada: ${methodology.title}`);
    }

    console.log('🎉 Metodologías sembradas exitosamente!');
  } catch (error) {
    console.error('❌ Error sembrando metodologías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMethodologies();
