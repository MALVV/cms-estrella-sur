const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const updatedVideos = [
  {
    id: "cmgf88l6t0001fv0843ih8vpj",
    title: "Transformando Vidas en la Comunidad",
    description: "María nos cuenta cómo nuestro programa de educación le cambió la vida completamente. Desde aprender a leer hasta convertirse en líder comunitaria."
  },
  {
    id: "cmgf88l710003fv08uef8itrh", 
    title: "Historia de Superación y Esperanza",
    description: "Carlos comparte su experiencia de cómo superó las dificultades económicas gracias a nuestros programas de capacitación laboral."
  },
  {
    id: "cmgf88l730005fv08hib5l3dc",
    title: "Construyendo un Futuro Mejor", 
    description: "Ana relata cómo nuestro proyecto de construcción de viviendas dignas transformó su familia y su comunidad."
  },
  {
    id: "cmgf88l750007fv08qyghb8qk",
    title: "Educación que Cambia Destinos",
    description: "Roberto explica cómo nuestros programas educativos le permitieron acceder a mejores oportunidades laborales y mejorar su calidad de vida."
  },
  {
    id: "cmgf88l770009fv081h08sd7n",
    title: "Salud y Bienestar para Todos",
    description: "Isabel comparte su testimonio sobre cómo nuestros programas de salud comunitaria mejoraron la calidad de vida de su familia."
  },
  {
    id: "cmgf88l7a000bfv08gw1h9jpr",
    title: "Empoderamiento Femenino",
    description: "Lucía nos cuenta cómo nuestros talleres de empoderamiento femenino la ayudaron a convertirse en una líder en su comunidad."
  },
  {
    id: "cmgf88l7c000dfv08vme9qvq0",
    title: "Jóvenes Construyendo el Futuro",
    description: "Diego y sus amigos comparten cómo nuestros programas juveniles les dieron las herramientas para ser agentes de cambio positivo."
  },
  {
    id: "cmgf88l7e000ffv0827dfzngq",
    title: "Sostenibilidad y Medio Ambiente", 
    description: "Carmen explica cómo nuestros proyectos ambientales están ayudando a proteger el planeta para las futuras generaciones."
  }
]

async function updateVideoTitles() {
  try {
    console.log('🔄 Actualizando títulos y descripciones de videos testimoniales...')

    for (const videoData of updatedVideos) {
      const updated = await prisma.videoTestimonial.update({
        where: { id: videoData.id },
        data: {
          title: videoData.title,
          description: videoData.description
        }
      })
      console.log(`✅ Video actualizado: "${updated.title}"`)
    }

    console.log('🎉 Todos los videos han sido actualizados exitosamente!')

  } catch (error) {
    console.error('❌ Error al actualizar videos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateVideoTitles()
