const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTransparencyDocuments() {
  try {
    console.log('Insertando documentos de transparencia de prueba...');

    const documents = [
      {
        id: 'transparency_001',
        title: 'Informe Anual 2023',
        description: 'Informe completo de actividades y resultados del año 2023',
        fileName: 'informe_anual_2023.pdf',
        fileUrl: 'https://example.com/informe_anual_2023.pdf',
        fileSize: 2048000,
        fileType: 'application/pdf',
        category: 'ANNUAL_REPORTS',
        year: 2023,
        isActive: true,
        isFeatured: true,
      },
      {
        id: 'transparency_002',
        title: 'Política de Transparencia',
        description: 'Documento que establece los principios y políticas de transparencia de la fundación',
        fileName: 'politica_transparencia.pdf',
        fileUrl: 'https://example.com/politica_transparencia.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        category: 'DOCUMENT_CENTER',
        year: null,
        isActive: true,
        isFeatured: false,
      },
      {
        id: 'transparency_003',
        title: 'Auditoría Financiera 2023',
        description: 'Informe de auditoría externa de los estados financieros del año 2023',
        fileName: 'auditoria_financiera_2023.pdf',
        fileUrl: 'https://example.com/auditoria_financiera_2023.pdf',
        fileSize: 3072000,
        fileType: 'application/pdf',
        category: 'ACCOUNTABILITY',
        year: 2023,
        isActive: true,
        isFeatured: true,
      },
      {
        id: 'transparency_004',
        title: 'Aliados Estratégicos',
        description: 'Lista de organizaciones aliadas y financiadores que apoyan nuestros proyectos',
        fileName: 'aliados_estrategicos.pdf',
        fileUrl: 'https://example.com/aliados_estrategicos.pdf',
        fileSize: 512000,
        fileType: 'application/pdf',
        category: 'FINANCIERS_AND_ALLIES',
        year: null,
        isActive: true,
        isFeatured: false,
      },
      {
        id: 'transparency_005',
        title: 'Memoria Institucional 2023',
        description: 'Documento que resume los logros y desafíos del año 2023',
        fileName: 'memoria_institucional_2023.pdf',
        fileUrl: 'https://example.com/memoria_institucional_2023.pdf',
        fileSize: 1536000,
        fileType: 'application/pdf',
        category: 'ANNUAL_REPORTS',
        year: 2023,
        isActive: true,
        isFeatured: false,
      },
      {
        id: 'transparency_006',
        title: 'Manual de Procedimientos',
        description: 'Manual interno que describe los procedimientos operativos de la fundación',
        fileName: 'manual_procedimientos.pdf',
        fileUrl: 'https://example.com/manual_procedimientos.pdf',
        fileSize: 2560000,
        fileType: 'application/pdf',
        category: 'DOCUMENT_CENTER',
        year: null,
        isActive: true,
        isFeatured: false,
      },
    ];

    for (const doc of documents) {
      await prisma.transparencyDocument.upsert({
        where: { id: doc.id },
        update: doc,
        create: doc,
      });
      console.log(`✓ Documento creado: ${doc.title}`);
    }

    console.log('✅ Documentos de transparencia insertados exitosamente');
  } catch (error) {
    console.error('❌ Error al insertar documentos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTransparencyDocuments();
