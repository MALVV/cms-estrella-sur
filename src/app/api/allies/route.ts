import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'ALL'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Construir filtros
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        role?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
      isActive?: boolean;
    } = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'ALL') {
      where.isActive = status === 'ACTIVE'
    }

    // Obtener aliados con información del creador
    const allies = await prisma.allies.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
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

    const formattedAllies = allies.map((ally: any) => ({
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
    }))

    return NextResponse.json(formattedAllies)
  } catch (error) {
    console.error('Error al obtener aliados:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 Sesión obtenida:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    })
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, role, description, imageUrl, imageAlt } = body

    if (!name || !role) {
      return NextResponse.json(
        { error: 'Nombre y rol son requeridos' },
        { status: 400 }
      )
    }

    // Generar ID único para el aliado
    const allyId = `ally_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Obtener el ID del usuario de la sesión
    const createdBy = session.user.id
    
    if (!createdBy) {
      console.error('❌ No se encontró userId en la sesión del usuario')
      return NextResponse.json({ error: 'Error de autenticación: ID de usuario no encontrado' }, { status: 401 })
    }
    
    console.log('✅ Creando aliado para usuario:', {
      id: createdBy,
      email: session.user.email,
      name: session.user.name
    })

    const newAlly = await prisma.allies.create({
      data: {
        id: allyId,
        name,
        role,
        description: description || '',
        imageUrl: imageUrl || '/placeholder-ally.jpg',
        imageAlt: imageAlt || name,
        isActive: true,
        createdBy: createdBy
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
      id: newAlly.id,
      name: newAlly.name,
      role: newAlly.role,
      description: newAlly.description,
      imageUrl: newAlly.imageUrl,
      imageAlt: newAlly.imageAlt,
      status: newAlly.isActive ? 'ACTIVE' : 'INACTIVE',
      isFeatured: newAlly.isFeatured || false,
      createdAt: newAlly.createdAt.toISOString().split('T')[0],
      updatedAt: newAlly.updatedAt.toISOString().split('T')[0],
      createdBy: newAlly.createdBy,
      author: newAlly.users ? {
        id: newAlly.users.id,
        name: newAlly.users.name,
        email: newAlly.users.email,
        role: newAlly.users.role
      } : null
    }

    return NextResponse.json(formattedAlly, { status: 201 })
  } catch (error) {
    console.error('Error al crear aliado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
