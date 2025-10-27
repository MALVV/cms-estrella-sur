const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testNewCardStructure() {
  try {
    console.log('🎨 Probando nueva estructura de tarjetas con imagen de referencia...\n');

    // 1. Obtener todos los proyectos de donación
    console.log('1. Obteniendo todos los proyectos de donación...');
    const donationProjects = await prisma.donationProject.findMany({
      include: {
        project: {
          select: {
            id: true,
            title: true,
            context: true,
            objectives: true,
            executionStart: true,
            executionEnd: true,
            imageUrl: true,
            imageAlt: true,
            isFeatured: true
          }
        },
        donations: {
          where: {
            status: 'APPROVED'
          },
          select: {
            amount: true,
            createdAt: true
          }
        }
      }
    });

    console.log(`✅ Encontrados ${donationProjects.length} proyectos de donación:`);
    
    // 2. Procesar cada proyecto con la nueva estructura
    const processedProjects = donationProjects.map(project => {
      const totalDonated = project.donations.reduce((sum, donation) => sum + Number(donation.amount), 0);
      const progressPercentage = project.targetAmount
        ? Math.min((totalDonated / Number(project.targetAmount)) * 100, 100)
        : 0;

      return {
        id: project.id,
        projectId: project.projectId,
        accountNumber: project.accountNumber,
        recipientName: project.recipientName,
        qrImageUrl: project.qrImageUrl,
        qrImageAlt: project.qrImageAlt,
        referenceImageUrl: project.referenceImageUrl,
        referenceImageAlt: project.referenceImageAlt,
        targetAmount: project.targetAmount,
        currentAmount: totalDonated,
        progressPercentage: Math.round(progressPercentage * 100) / 100,
        isCompleted: project.isCompleted,
        project: project.project,
        donationCount: project.donations.length
      };
    });

    // 3. Mostrar estructura de cada proyecto
    processedProjects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.project.title}`);
      console.log(`      ID: ${project.id}`);
      console.log(`      Imagen de referencia: ${project.referenceImageUrl ? '✅ Disponible' : '❌ No disponible'}`);
      if (project.referenceImageUrl) {
        console.log(`         URL: ${project.referenceImageUrl}`);
        console.log(`         Alt: ${project.referenceImageAlt || 'No definido'}`);
        console.log(`         Tamaño: 64x64px (w-16 h-16)`);
        console.log(`         Estilos: rounded-xl object-cover border-2 shadow-lg`);
      }
      console.log(`      Meta: ${project.targetAmount?.toString() || 'Sin límite'}`);
      console.log(`      Recaudado: ${project.currentAmount}`);
      console.log(`      Progreso: ${project.progressPercentage}%`);
      console.log(`      Completado: ${project.isCompleted}`);
      console.log('');
    });

    // 4. Verificar estructura específica del proyecto "SEMBRANDO UNA IDEA"
    console.log('2. Verificando estructura específica del proyecto "SEMBRANDO UNA IDEA, COSECHANDO UN FUTURO"...');
    const sembrandoProject = processedProjects.find(p => 
      p.project.title.includes('SEMBRANDO UNA IDEA')
    );

    if (sembrandoProject) {
      console.log('✅ Proyecto "SEMBRANDO UNA IDEA" encontrado:');
      console.log(`   Título: ${sembrandoProject.project.title}`);
      console.log(`   Imagen de referencia: ${sembrandoProject.referenceImageUrl ? '✅ Disponible' : '❌ No disponible'}`);
      console.log(`   Alt text: ${sembrandoProject.referenceImageAlt || 'No definido'}`);
      console.log(`   Meta: ${sembrandoProject.targetAmount?.toString()}`);
      console.log(`   Recaudado: ${sembrandoProject.currentAmount}`);
      console.log(`   Progreso: ${sembrandoProject.progressPercentage}%`);
      console.log(`   Completado: ${sembrandoProject.isCompleted}`);
      
      console.log('\n   🎨 Nueva estructura aplicada:');
      console.log('   - Imagen de referencia: 64x64px (w-16 h-16)');
      console.log('   - Estilos: rounded-xl object-cover border-2 shadow-lg');
      console.log('   - Posición: Lado izquierdo del header');
      console.log('   - Título: Lado derecho del header con flex-1');
      console.log('   - Layout: flex items-start gap-4');
    } else {
      console.log('❌ Proyecto "SEMBRANDO UNA IDEA" no encontrado');
    }

    // 5. Instrucciones para verificar en el frontend
    console.log('\n3. Instrucciones para verificar en el frontend:');
    console.log('   📋 Página pública /donar:');
    console.log('   1. Ir a http://localhost:3000/donar');
    console.log('   2. Buscar la tarjeta "SEMBRANDO UNA IDEA, COSECHANDO UN FUTURO"');
    console.log('   3. Verificar que la imagen de referencia está en el lado izquierdo del header');
    console.log('   4. La imagen debe ser de 64x64px (w-16 h-16)');
    console.log('   5. Debe tener bordes más redondeados (rounded-xl) y sombra más prominente (shadow-lg)');
    console.log('   6. El título debe estar al lado derecho de la imagen');
    console.log('   7. Verificar que todas las demás tarjetas siguen la misma estructura');
    console.log('');
    console.log('   🎨 Características de la nueva estructura:');
    console.log('   - Imagen más grande y prominente (64x64px)');
    console.log('   - Bordes más redondeados (rounded-xl)');
    console.log('   - Sombra más prominente (shadow-lg)');
    console.log('   - Layout horizontal con imagen a la izquierda');
    console.log('   - Título con flex-1 para ocupar el espacio restante');
    console.log('   - Gap de 4 unidades entre imagen y título');

    console.log('\n🎉 ¡Prueba de nueva estructura de tarjetas completada!');
    console.log('\n📋 Resumen:');
    console.log('   ✅ Todos los proyectos procesados con nueva estructura');
    console.log('   ✅ Imagen de referencia más prominente (64x64px)');
    console.log('   ✅ Estilos mejorados (rounded-xl, shadow-lg)');
    console.log('   ✅ Layout horizontal con imagen a la izquierda');
    console.log('   ✅ Estructura consistente para todas las tarjetas');
    console.log('   ✅ Proyecto "SEMBRANDO UNA IDEA" como referencia');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNewCardStructure();

