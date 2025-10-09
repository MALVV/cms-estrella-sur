import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Toggle estado en lote para múltiples videos testimoniales
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { ids, isActive } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de IDs válido' },
        { status: 400 }
      )
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'El estado isActive debe ser un booleano' },
        { status: 400 }
      )
    }

    // Actualizar múltiples videos testimoniales
    const result = await prisma.videoTestimonial.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        isActive
      }
    })

    return NextResponse.json({
      message: `${result.count} videos testimoniales actualizados exitosamente`,
      count: result.count
    })
  } catch (error) {
    console.error('Error bulk updating video testimonials:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
