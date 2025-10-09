const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const programasFicticios = [
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
    isFeatured: true
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
    isFeatured: true
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
    isFeatured: false
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
    isFeatured: true
  },
  {
    nombreSector: "Agua y Saneamiento",
    descripcion: "Programa que mejora el acceso a agua potable y saneamiento básico en comunidades rurales. Incluye construcción de sistemas de agua, letrinas ecológicas y educación sobre higiene.",
    videoPresentacion: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    alineacionODS: "ODS 6: Agua Limpia y Saneamiento - Garantizar disponibilidad y gestión sostenible del agua. ODS 3: Salud y Bienestar - Asegurar vidas saludables.",
    subareasResultados: "Acceso a agua potable, Saneamiento básico, Gestión comunitaria, Educación en higiene, Infraestructura sostenible",
    resultados: "100% de familias tienen acceso a agua potable, 95% de hogares cuentan con saneamiento adecuado, 80% de reducción en enfermedades hídricas",
    gruposAtencion: "Comunidades rurales, Familias sin acceso a servicios básicos, Escuelas rurales, Centros de salud comunitarios",
    contenidosTemas: "Gestión del agua, Higiene personal, Saneamiento ecológico, Mantenimiento de infraestructura, Participación comunitaria",
    enlaceMasInformacion: "https://childfund.org/programas/agua-saneamiento",
    isFeatured: false
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
    isFeatured: false
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
    isFeatured: true
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
    isFeatured: false
  }
];

async function crearProgramasFicticios() {
  try {
    console.log('🚀 Iniciando creación de programas ficticios...');

    // Buscar un usuario administrador para asignar como creador
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRADOR' }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario administrador. Creando usuario temporal...');
      
      // Crear usuario administrador temporal
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@childfund.org',
          name: 'Administrador ChildFund',
          password: hashedPassword,
          role: 'ADMINISTRADOR',
          isActive: true
        }
      });
      
      console.log('✅ Usuario administrador creado:', newAdmin.email);
    }

    const creatorId = adminUser?.id || (await prisma.user.findFirst({
      where: { email: 'admin@childfund.org' }
    }))?.id;

    if (!creatorId) {
      throw new Error('No se pudo obtener ID del usuario creador');
    }

    // Crear programas ficticios
    for (const programaData of programasFicticios) {
      const programa = await prisma.programas.create({
        data: {
          ...programaData,
          createdBy: creatorId
        }
      });

      console.log(`✅ Programa creado: ${programa.nombreSector}`);
    }

    // Crear algunas imágenes ficticias para la biblioteca
    const imagenesFicticias = [
      {
        title: "Niños en aula de clase",
        description: "Niños participando en actividades educativas en el programa de Educación Infantil",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
        imageAlt: "Niños aprendiendo en el aula",
        programaId: null, // Se asignará después
        isFeatured: true,
        createdBy: creatorId
      },
      {
        title: "Promotora de salud comunitaria",
        description: "Promotora de salud capacitando a la comunidad sobre prácticas saludables",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
        imageAlt: "Promotora de salud en la comunidad",
        programaId: null,
        isFeatured: true,
        createdBy: creatorId
      },
      {
        title: "Jóvenes en capacitación técnica",
        description: "Jóvenes aprendiendo habilidades técnicas en el programa de Desarrollo Económico",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
        imageAlt: "Jóvenes en capacitación",
        programaId: null,
        isFeatured: false,
        createdBy: creatorId
      },
      {
        title: "Sistema de agua comunitario",
        description: "Infraestructura de agua potable construida en comunidad rural",
        imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800",
        imageAlt: "Sistema de agua comunitario",
        programaId: null,
        isFeatured: true,
        createdBy: creatorId
      },
      {
        title: "Mujeres en taller de liderazgo",
        description: "Mujeres participando en taller de empoderamiento y liderazgo",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
        imageAlt: "Mujeres en taller de liderazgo",
        programaId: null,
        isFeatured: true,
        createdBy: creatorId
      }
    ];

    // Obtener IDs de programas para asignar imágenes
    const programas = await prisma.programas.findMany();
    
    // Asignar imágenes a programas específicos
    const programasConImagenes = [
      { programa: 'Educación Infantil', imagen: 0 },
      { programa: 'Salud Comunitaria', imagen: 1 },
      { programa: 'Desarrollo Económico Juvenil', imagen: 2 },
      { programa: 'Agua y Saneamiento', imagen: 3 },
      { programa: 'Empoderamiento de Mujeres', imagen: 4 }
    ];

    for (const { programa: nombrePrograma, imagen: indiceImagen } of programasConImagenes) {
      const programa = programas.find(p => p.nombreSector === nombrePrograma);
      if (programa) {
        const imagenData = imagenesFicticias[indiceImagen];
        await prisma.imageLibrary.create({
          data: {
            ...imagenData,
            programaId: programa.id
          }
        });
        console.log(`✅ Imagen creada para programa: ${nombrePrograma}`);
      }
    }

    console.log('🎉 ¡Programas ficticios creados exitosamente!');
    console.log(`📊 Total de programas creados: ${programasFicticios.length}`);
    console.log(`🖼️ Total de imágenes creadas: ${imagenesFicticias.length}`);

  } catch (error) {
    console.error('❌ Error creando programas ficticios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
crearProgramasFicticios();
