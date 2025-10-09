const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleImages() {
  try {
    console.log('🖼️  Agregando imágenes de ejemplo a programas destacados...\n');

    // Obtener programas destacados
    const featuredPrograms = await prisma.programas.findMany({
      where: { isFeatured: true },
      select: { id: true, nombreSector: true }
    });

    console.log(`📊 Encontrados ${featuredPrograms.length} programas destacados`);

    // Imágenes de ejemplo
    const sampleImages = [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5c7sgQH1Lc7mtyahGIQYWnnAo2tgVe7SqX7oZBhzKOsF6WT7-tG0K5qhw0bSScIu-DTQJ0XZs_C6nC-0D7DA8RySqIaXkg42tnBW4RdRPnCig5Rj0K_IjHGpt2auGQ1NNfTEso6LHX9rv0CnrRch126cPinPzvkfbhRK_OPE0zN3WMAXo4rjHiy0dj_vbqNfIEgRSIeYTNtdGRDHrVr1YxQTsDXV1IOhOYsnFw07qZXOSsZF5YjszrXliB3LtVb-yTqcQXDVizYQ",
        alt: "Niños participando en actividades educativas"
      },
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfcd1THX-kNBtPUO3yGHeTZXEqtXox42LyzhCfPYktbQc-RvgkPJDmPICrmGJITFvAvYfflo9F1p1wiRHLTKaJM4uAN-6ZyGpcAL0m7kTVJv1pZyM06QJgk84mx4R7V6EHYmEwrnRB0hm_ihJyOndWkRa49kJ_ssPoEMX-YvtfdRtREi24WNHjiaU-_w5EWlJRTO418v5NQDvbaVksG0069Vmang3LLhAxpzMegCdIfTaUvRbx60JgZk4XFmeb2dPcvEzwkKtIwyY",
        alt: "Mujeres participando en talleres de empoderamiento"
      },
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD95Djd7grT7KPgWsCpRX9pQfnUKAc0pVGzScwfMjfDJLQHhQw3f-6KNWYCtfJlo62MocE_H3KOvqij7kjrUsJYo9DMMur2bojx8Y9zUc5hMHmqRCPuJt23tyazG2pB2yc0C9LB8KY8EWLh1U7lqFfCQolo_gqfzcWKPo98Rv5OGaRTuuSj849TklYSgMtxKnLmdsFKy7WszCtV7MXXhCD53uNijabU-Tm_gnlUleyJOOSM4OqhjVZ1kRO-wJB0CyGENPXyxvy5L64",
        alt: "Comunidad trabajando en proyectos de desarrollo rural"
      },
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5c7sgQH1Lc7mtyahGIQYWnnAo2tgVe7SqX7oZBhzKOsF6WT7-tG0K5qhw0bSScIu-DTQJ0XZs_C6nC-0D7DA8RySqIaXkg42tnBW4RdRPnCig5Rj0K_IjHGpt2auGQ1NNfTEso6LHX9rv0CnrRch126cPinPzvkfbhRK_OPE0zN3WMAXo4rjHiy0dj_vbqNfIEgRSIeYTNtdGRDHrVr1YxQTsDXV1IOhOYsnFw07qZXOSsZF5YjszrXliB3LtVb-yTqcQXDVizYQ",
        alt: "Acceso a agua potable en comunidades rurales"
      }
    ];

    // Actualizar cada programa destacado con una imagen
    for (let i = 0; i < featuredPrograms.length && i < sampleImages.length; i++) {
      const programa = featuredPrograms[i];
      const image = sampleImages[i];

      await prisma.programas.update({
        where: { id: programa.id },
        data: {
          imageUrl: image.url,
          imageAlt: image.alt
        }
      });

      console.log(`✅ ${programa.nombreSector} - Imagen agregada`);
    }

    // Verificar resultados
    console.log('\n🔍 Verificando resultados...');
    const updatedPrograms = await prisma.programas.findMany({
      where: { 
        isFeatured: true,
        imageUrl: { not: null }
      },
      select: {
        nombreSector: true,
        imageUrl: true,
        imageAlt: true
      }
    });

    console.log(`\n📊 Programas destacados con imagen: ${updatedPrograms.length}`);
    updatedPrograms.forEach((programa, index) => {
      console.log(`\n${index + 1}. ${programa.nombreSector}`);
      console.log(`   Imagen: ✅ ${programa.imageUrl.substring(0, 50)}...`);
      console.log(`   Alt: ✅ ${programa.imageAlt}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  addSampleImages();
}

module.exports = { addSampleImages };
