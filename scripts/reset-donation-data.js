import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDonationData() {
  try {
    console.log('🗑️ Eliminando datos existentes...');
    
    // Eliminar donaciones primero (por las relaciones)
    await prisma.donation.deleteMany({});
    console.log('✅ Donaciones eliminadas');
    
    // Eliminar proyectos de donación
    await prisma.donationProject.deleteMany({});
    console.log('✅ Proyectos de donación eliminados');
    
    console.log('📝 Creando nuevos proyectos de donación...');
    
    // Crear nuevos proyectos de donación
    const donationProjects = await prisma.donationProject.createMany({
      data: [
        {
          title: 'Construcción de Aula Escolar',
          description: 'Construcción de una nueva aula para la escuela rural de San José',
          context: 'La escuela rural de San José necesita urgentemente una nueva aula para poder atender a todos los estudiantes de la comunidad. Actualmente los niños estudian en condiciones precarias.',
          objectives: 'Construir una aula de 40m² con materiales de calidad, incluyendo pizarrón, pupitres y ventilación adecuada.',
          executionStart: new Date('2024-01-15'),
          executionEnd: new Date('2024-06-30'),
          accountNumber: '1234567890123456',
          recipientName: 'Fundación Estrella Sur',
          qrImageUrl: 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=QR+Code',
          qrImageAlt: 'Código QR para donaciones',
          referenceImageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          referenceImageAlt: 'Niños estudiando en aula rural',
          targetAmount: 15000,
          currentAmount: 0,
          isActive: true,
          isCompleted: false,
          isFeatured: true
        },
        {
          title: 'Programa de Alimentación Infantil',
          description: 'Proporcionar desayunos nutritivos a niños en situación de vulnerabilidad',
          context: 'Muchos niños de la comunidad llegan a la escuela sin haber desayunado, lo que afecta su rendimiento académico y desarrollo físico.',
          objectives: 'Proporcionar desayunos nutritivos diarios a 50 niños durante 6 meses, incluyendo frutas, lácteos y cereales.',
          executionStart: new Date('2024-02-01'),
          executionEnd: new Date('2024-07-31'),
          accountNumber: '1234567890123457',
          recipientName: 'Fundación Estrella Sur',
          qrImageUrl: 'https://via.placeholder.com/200x200/059669/FFFFFF?text=QR+Code',
          qrImageAlt: 'Código QR para donaciones',
          referenceImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          referenceImageAlt: 'Niños disfrutando desayuno escolar',
          targetAmount: 8000,
          currentAmount: 0,
          isActive: true,
          isCompleted: false,
          isFeatured: true
        },
        {
          title: 'Taller de Capacitación Técnica',
          description: 'Capacitación en habilidades técnicas para jóvenes de la comunidad',
          context: 'Los jóvenes de la comunidad necesitan adquirir habilidades técnicas que les permitan acceder a mejores oportunidades laborales.',
          objectives: 'Capacitar a 30 jóvenes en carpintería, electricidad básica y soldadura durante 4 meses.',
          executionStart: new Date('2024-03-01'),
          executionEnd: new Date('2024-08-31'),
          accountNumber: '1234567890123458',
          recipientName: 'Fundación Estrella Sur',
          qrImageUrl: 'https://via.placeholder.com/200x200/DC2626/FFFFFF?text=QR+Code',
          qrImageAlt: 'Código QR para donaciones',
          referenceImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          referenceImageAlt: 'Jóvenes aprendiendo carpintería',
          targetAmount: 12000,
          currentAmount: 0,
          isActive: true,
          isCompleted: false,
          isFeatured: false
        },
        {
          title: 'Centro de Salud Comunitario',
          description: 'Equipamiento médico para el centro de salud de la comunidad',
          context: 'El centro de salud de la comunidad carece de equipamiento médico básico para atender las necesidades de salud de los habitantes.',
          objectives: 'Adquirir equipamiento médico básico incluyendo estetoscopios, tensiómetros, termómetros y medicamentos esenciales.',
          executionStart: new Date('2024-04-01'),
          executionEnd: new Date('2024-09-30'),
          accountNumber: '1234567890123459',
          recipientName: 'Fundación Estrella Sur',
          qrImageUrl: 'https://via.placeholder.com/200x200/7C3AED/FFFFFF?text=QR+Code',
          qrImageAlt: 'Código QR para donaciones',
          referenceImageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          referenceImageAlt: 'Centro de salud comunitario',
          targetAmount: 20000,
          currentAmount: 0,
          isActive: true,
          isCompleted: false,
          isFeatured: true
        },
        {
          title: 'Biblioteca Comunitaria',
          description: 'Creación de una biblioteca con libros educativos para la comunidad',
          context: 'La comunidad no cuenta con acceso a libros educativos y literatura, limitando las oportunidades de aprendizaje.',
          objectives: 'Crear una biblioteca comunitaria con 500 libros educativos, literatura infantil y juvenil, y espacio de lectura.',
          executionStart: new Date('2024-05-01'),
          executionEnd: new Date('2024-10-31'),
          accountNumber: '1234567890123460',
          recipientName: 'Fundación Estrella Sur',
          qrImageUrl: 'https://via.placeholder.com/200x200/0891B2/FFFFFF?text=QR+Code',
          qrImageAlt: 'Código QR para donaciones',
          referenceImageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          referenceImageAlt: 'Niños leyendo en biblioteca',
          targetAmount: 10000,
          currentAmount: 0,
          isActive: true,
          isCompleted: false,
          isFeatured: false
        }
      ]
    });
    
    console.log(`✅ Creados ${donationProjects.count} proyectos de donación`);
    
    // Obtener los proyectos creados para crear donaciones de prueba
    const createdProjects = await prisma.donationProject.findMany();
    
    console.log('💰 Creando donaciones de prueba...');
    
    // Crear donaciones de prueba para algunos proyectos
    const donations = await prisma.donation.createMany({
      data: [
        // Donaciones para el primer proyecto (Aula Escolar)
        {
          donorName: 'María González',
          donorEmail: 'maria.gonzalez@email.com',
          donorAddress: 'Av. Principal 123, La Paz',
          donorPhone: '+591 70123456',
          amount: 500,
          donationType: 'SPECIFIC_PROJECT',
          message: 'Espero que esto ayude a los niños a tener un mejor lugar para estudiar.',
          donationProjectId: createdProjects[0].id,
          status: 'APPROVED',
          approvedAt: new Date()
        },
        {
          donorName: 'Carlos Mendoza',
          donorEmail: 'carlos.mendoza@email.com',
          donorAddress: 'Calle 15 de Abril 456, Santa Cruz',
          donorPhone: '+591 70234567',
          amount: 1000,
          donationType: 'SPECIFIC_PROJECT',
          message: 'Feliz de contribuir a la educación de los niños.',
          donationProjectId: createdProjects[0].id,
          status: 'APPROVED',
          approvedAt: new Date()
        },
        {
          donorName: 'Ana Rodríguez',
          donorEmail: 'ana.rodriguez@email.com',
          donorAddress: 'Plaza Murillo 789, La Paz',
          donorPhone: '+591 70345678',
          amount: 750,
          donationType: 'SPECIFIC_PROJECT',
          donationProjectId: createdProjects[0].id,
          status: 'PENDING'
        },
        
        // Donaciones para el segundo proyecto (Alimentación)
        {
          donorName: 'Roberto Silva',
          donorEmail: 'roberto.silva@email.com',
          donorAddress: 'Av. Cañoto 321, Santa Cruz',
          donorPhone: '+591 70456789',
          amount: 300,
          donationType: 'SPECIFIC_PROJECT',
          message: 'Los niños necesitan una buena alimentación para aprender mejor.',
          donationProjectId: createdProjects[1].id,
          status: 'APPROVED',
          approvedAt: new Date()
        },
        {
          donorName: 'Patricia López',
          donorEmail: 'patricia.lopez@email.com',
          donorAddress: 'Calle Potosí 654, Cochabamba',
          donorPhone: '+591 70567890',
          amount: 500,
          donationType: 'SPECIFIC_PROJECT',
          donationProjectId: createdProjects[1].id,
          status: 'APPROVED',
          approvedAt: new Date()
        },
        
        // Donación para el tercer proyecto (Taller Técnico)
        {
          donorName: 'Miguel Torres',
          donorEmail: 'miguel.torres@email.com',
          donorAddress: 'Av. Mariscal Santa Cruz 987, La Paz',
          donorPhone: '+591 70678901',
          amount: 800,
          donationType: 'SPECIFIC_PROJECT',
          message: 'Es importante que los jóvenes aprendan oficios técnicos.',
          donationProjectId: createdProjects[2].id,
          status: 'APPROVED',
          approvedAt: new Date()
        },
        
        // Donación general
        {
          donorName: 'Laura Fernández',
          donorEmail: 'laura.fernandez@email.com',
          donorAddress: 'Calle Sucre 147, Potosí',
          donorPhone: '+591 70789012',
          amount: 200,
          donationType: 'GENERAL',
          message: 'Donación general para apoyar todos los proyectos.',
          status: 'APPROVED',
          approvedAt: new Date()
        }
      ]
    });
    
    console.log(`✅ Creadas ${donations.count} donaciones de prueba`);
    
    // Actualizar los montos actuales de los proyectos
    console.log('🔄 Actualizando montos de proyectos...');
    
    for (const project of createdProjects) {
      const totalDonated = await prisma.donation.aggregate({
        where: {
          donationProjectId: project.id,
          status: 'APPROVED'
        },
        _sum: {
          amount: true
        }
      });
      
      const currentAmount = totalDonated._sum.amount || 0;
      
      await prisma.donationProject.update({
        where: { id: project.id },
        data: { currentAmount }
      });
      
      console.log(`✅ Proyecto "${project.title}": $${currentAmount} recaudado`);
    }
    
    console.log('🎉 ¡Datos de donación actualizados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al actualizar datos de donación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDonationData();
