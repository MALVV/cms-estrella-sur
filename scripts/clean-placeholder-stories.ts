/**
 * Script para limpiar valores de placeholder en la tabla stories
 * Ejecutar con: npx tsx scripts/clean-placeholder-stories.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanPlaceholderStories() {
  try {
    console.log('🧹 Limpiando valores de placeholder en stories...')
    
    // Actualizar todas las stories que tengan /placeholder-story.jpg a null
    const result = await prisma.story.updateMany({
      where: {
        imageUrl: '/placeholder-story.jpg'
      },
      data: {
        imageUrl: null,
        imageAlt: null
      }
    })
    
    console.log(`✅ ${result.count} stories actualizadas`)
    
    // También limpiar cadenas vacías
    const emptyResult = await prisma.story.updateMany({
      where: {
        OR: [
          { imageUrl: '' },
          { imageUrl: null }
        ]
      },
      data: {
        imageUrl: null,
        imageAlt: null
      }
    })
    
    console.log(`✅ ${emptyResult.count} stories con cadenas vacías actualizadas`)
    
    console.log('✨ Limpieza completada')
  } catch (error) {
    console.error('❌ Error al limpiar stories:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanPlaceholderStories()

