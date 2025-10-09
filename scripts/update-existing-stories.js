const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateExistingStories() {
  try {
    console.log('🔄 Actualizando stories existentes...');
    
    // Obtener todas las stories
    const stories = await prisma.stories.findMany();

    console.log(`📊 Encontradas ${stories.length} stories para actualizar`);

    for (const story of stories) {
      // Generar contenido de ejemplo basado en el título
      const sampleContent = `Esta es una historia inspiradora sobre ${story.title.toLowerCase()}. 

En nuestra organización, creemos firmemente en el poder de la transformación comunitaria. Esta historia representa uno de los muchos casos de éxito que hemos logrado a través de nuestro compromiso y dedicación.

El impacto de este proyecto se extiende más allá de lo que inicialmente imaginamos. Las comunidades involucradas han experimentado cambios positivos significativos que perdurarán por generaciones.

Nuestro enfoque integral y la colaboración con aliados estratégicos han sido clave para el éxito de esta iniciativa. Continuamos trabajando para replicar estos resultados en otras comunidades que necesitan nuestro apoyo.`;

      const sampleSummary = `Historia inspiradora sobre ${story.title.toLowerCase()} que demuestra el impacto positivo de nuestros programas comunitarios.`;

      await prisma.stories.update({
        where: { id: story.id },
        data: {
          content: sampleContent,
          summary: sampleSummary
        }
      });

      console.log(`✅ Actualizada story: ${story.title}`);
    }

    console.log('🎉 ¡Todas las stories han sido actualizadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al actualizar stories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingStories();
