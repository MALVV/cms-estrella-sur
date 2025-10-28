const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProjects() {
  try {
    console.log('🌱 Iniciando seed de proyectos...');

    // Obtener un usuario para asignar como creador
    const user = await prisma.user.findFirst({
      where: { role: 'ADMINISTRATOR' }
    });

    if (!user) {
      console.error('❌ No se encontró un usuario ADMINISTRATOR');
      return;
    }

    const projects = [
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
        createdBy: user.id
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
        createdBy: user.id
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
        createdBy: user.id
      },
      {
        title: 'MICROEMPRESAS FEMENINAS',
        executionStart: new Date('2021-03-01'),
        executionEnd: new Date('2022-02-28'),
        context: 'Las mujeres en zonas rurales enfrentan múltiples barreras para acceder a oportunidades económicas. Este proyecto busca empoderar económicamente a mujeres a través del desarrollo de microempresas sostenibles.',
        objectives: 'Capacitar a 120 mujeres en gestión empresarial, apoyar la creación de 60 microempresas femeninas, y establecer una red de comercialización para sus productos.',
        content: 'El proyecto incluye talleres de capacitación empresarial, CONSULTANTía técnica especializada, acceso a microcréditos con tasas preferenciales, y la creación de una plataforma de comercialización digital.',
        strategicAllies: 'Banco de Desarrollo Productivo\nFederación de Mujeres Campesinas\nCámara de Comercio',
        financing: 'Banco Interamericano de Desarrollo\nFondo de Microfinanzas\nEmpresas privadas',
        isActive: true,
        isFeatured: false,
        createdBy: user.id
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
        createdBy: user.id
      }
    ];

    for (const projectData of projects) {
      const project = await prisma.project.create({
        data: projectData
      });
      console.log(`✅ Proyecto creado: ${project.title}`);
    }

    console.log('🎉 Seed de proyectos completado exitosamente!');
  } catch (error) {
    console.error('❌ Error en seed de proyectos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProjects();
