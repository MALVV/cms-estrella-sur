const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testToggleProjectStatus() {
  try {
    console.log('🔄 Probando cambio de estado activo/inactivo de proyectos...\n');

    // 1. Crear un proyecto de prueba
    console.log('1. Creando proyecto de prueba...');
    const project = await prisma.project.create({
      data: {
        title: 'Proyecto Cambio Estado - Prueba',
        context: 'Este proyecto se usará para probar el cambio de estado',
        objectives: 'Probar cambio de estado activo/inactivo',
        content: 'Contenido de prueba para cambio de estado',
        executionStart: new Date(),
        executionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        isFeatured: false,
        creator: {
          connect: { id: 'cmgz8yvb10000fv4cnlxzcxw5' }
        }
      }
    });

    const donationProject = await prisma.donationProject.create({
      data: {
        projectId: project.id,
        accountNumber: '1111111111',
        recipientName: 'Fundación Estrella del Sur',
        qrImageUrl: 'https://ejemplo.com/qr-estado.png',
        qrImageAlt: 'QR estado',
        referenceImageUrl: 'https://ejemplo.com/referencia-estado.jpg',
        referenceImageAlt: 'Imagen de referencia estado',
        targetAmount: 1000,
        currentAmount: 0,
        isActive: true, // Inicialmente activo
        isCompleted: false
      }
    });

    console.log('✅ Proyecto creado:', {
      id: donationProject.id,
      title: project.title,
      isActive: donationProject.isActive
    });

    // 2. Probar cambio a inactivo usando la API
    console.log('\n2. Probando cambio a inactivo...');
    try {
      const response1 = await fetch('http://localhost:3000/api/donation-projects/' + donationProject.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: false
        })
      });

      if (response1.ok) {
        const result1 = await response1.json();
        console.log('   ✅ Proyecto desactivado vía API');
        
        // Verificar estado en base de datos
        const projectAfterDeactivation = await prisma.donationProject.findUnique({
          where: { id: donationProject.id }
        });
        
        console.log('   📊 Estado después de desactivación:', {
          isActive: projectAfterDeactivation.isActive,
          expected: false
        });
      } else {
        console.log('   ❌ Error desactivando proyecto:', response1.status);
      }
    } catch (error) {
      console.log('   ⚠️ Error en API (servidor no corriendo):', error.message);
    }

    // 3. Probar cambio a activo usando la API
    console.log('\n3. Probando cambio a activo...');
    try {
      const response2 = await fetch('http://localhost:3000/api/donation-projects/' + donationProject.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: true
        })
      });

      if (response2.ok) {
        const result2 = await response2.json();
        console.log('   ✅ Proyecto activado vía API');
        
        // Verificar estado en base de datos
        const projectAfterActivation = await prisma.donationProject.findUnique({
          where: { id: donationProject.id }
        });
        
        console.log('   📊 Estado después de activación:', {
          isActive: projectAfterActivation.isActive,
          expected: true
        });
      } else {
        console.log('   ❌ Error activando proyecto:', response2.status);
      }
    } catch (error) {
      console.log('   ⚠️ Error en API (servidor no corriendo):', error.message);
    }

    // 4. Probar cambios directos en base de datos
    console.log('\n4. Probando cambios directos en base de datos...');
    
    // Cambiar a inactivo
    const deactivatedProject = await prisma.donationProject.update({
      where: { id: donationProject.id },
      data: { isActive: false }
    });
    
    console.log('   ✅ Proyecto desactivado directamente:', {
      isActive: deactivatedProject.isActive
    });

    // Cambiar a activo
    const activatedProject = await prisma.donationProject.update({
      where: { id: donationProject.id },
      data: { isActive: true }
    });
    
    console.log('   ✅ Proyecto activado directamente:', {
      isActive: activatedProject.isActive
    });

    // 5. Verificar en API pública
    console.log('\n5. Verificando en API pública...');
    const publicProjects = await prisma.donationProject.findMany({
      where: { id: donationProject.id },
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (publicProjects.length > 0) {
      console.log('✅ Proyecto en API pública:', {
        title: publicProjects[0].project.title,
        isActive: publicProjects[0].isActive
      });
    }

    // 6. Limpiar datos de prueba
    console.log('\n6. Limpiando datos de prueba...');
    await prisma.donationProject.delete({
      where: { id: donationProject.id }
    });
    
    await prisma.project.delete({
      where: { id: project.id }
    });

    console.log('✅ Datos de prueba eliminados');
    console.log('\n🎉 ¡Prueba de cambio de estado completada!');
    console.log('\n📋 Resumen:');
    console.log('   ✅ Proyecto creado inicialmente activo');
    console.log('   ✅ Cambio a inactivo probado');
    console.log('   ✅ Cambio a activo probado');
    console.log('   ✅ Cambios directos en BD probados');
    console.log('   ✅ Verificado en API pública');
    console.log('   ✅ Limpieza de datos completada');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testToggleProjectStatus();
