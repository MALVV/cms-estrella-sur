import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const ally = await (prisma as any).allies.findUnique({
      where: { id: resolvedParams.id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!ally) {
      return NextResponse.json({ error: 'Aliado no encontrado' }, { status: 404 })
    }

    const formattedAlly = {
      id: ally.id,
      name: ally.name,
      role: ally.role,
      description: ally.description,
      imageUrl: ally.imageUrl,
      imageAlt: ally.imageAlt,
      status: ally.isActive ? 'ACTIVE' : 'INACTIVE',
      isFeatured: ally.isFeatured || false,
      createdAt: ally.createdAt.toISOString().split('T')[0],
      updatedAt: ally.updatedAt.toISOString().split('T')[0],
      createdBy: ally.createdBy,
      author: ally.users ? {
        id: ally.users.id,
        name: ally.users.name,
        email: ally.users.email,
        role: ally.users.role
      } : null
    }

    return NextResponse.json(formattedAlly)
  } catch (error) {
    console.error('Error al obtener aliado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, role, description, imageUrl, imageAlt, isActive, isFeatured } = body

    if (!name || !role) {
      return NextResponse.json(
        { error: 'Nombre y rol son requeridos' },
        { status: 400 }
      )
    }

    const updatedAlly = await (prisma as any).allies.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        role,
        description: description || '',
        imageUrl: imageUrl || '/placeholder-ally.jpg',
        imageAlt: imageAlt || name,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    const formattedAlly = {
      id: updatedAlly.id,
      name: updatedAlly.name,
      role: updatedAlly.role,
      description: updatedAlly.description,
      imageUrl: updatedAlly.imageUrl,
      imageAlt: updatedAlly.imageAlt,
      status: updatedAlly.isActive ? 'ACTIVE' : 'INACTIVE',
      isFeatured: updatedAlly.isFeatured || false,
      createdAt: updatedAlly.createdAt.toISOString().split('T')[0],
      updatedAt: updatedAlly.updatedAt.toISOString().split('T')[0],
      createdBy: updatedAlly.createdBy,
      author: updatedAlly.users ? {
        id: updatedAlly.users.id,
        name: updatedAlly.users.name,
        email: updatedAlly.users.email,
        role: updatedAlly.users.role
      } : null
    }

    return NextResponse.json(formattedAlly)
  } catch (error) {
    console.error('Error al actualizar aliado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'El campo isActive es requerido y debe ser booleano' },
        { status: 400 }
      )
    }

    const updatedAlly = await (prisma as any).allies.update({
      where: { id: resolvedParams.id },
      data: { isActive },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    const formattedAlly = {
      id: updatedAlly.id,
      name: updatedAlly.name,
      role: updatedAlly.role,
      description: updatedAlly.description,
      imageUrl: updatedAlly.imageUrl,
      imageAlt: updatedAlly.imageAlt,
      status: updatedAlly.isActive ? 'ACTIVE' : 'INACTIVE',
      isFeatured: updatedAlly.isFeatured || false,
      createdAt: updatedAlly.createdAt.toISOString().split('T')[0],
      updatedAt: updatedAlly.updatedAt.toISOString().split('T')[0],
      createdBy: updatedAlly.createdBy,
      author: updatedAlly.users ? {
        id: updatedAlly.users.id,
        name: updatedAlly.users.name,
        email: updatedAlly.users.email,
        role: updatedAlly.users.role
      } : null
    }

    return NextResponse.json(formattedAlly)
  } catch (error) {
    console.error('Error al cambiar estado del aliado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await (prisma as any).allies.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Aliado eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar aliado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
