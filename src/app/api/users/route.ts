import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@/lib/roles'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Construir filtros
    const where: any = {}
    
    if (role && role !== 'ALL') {
      where.role = role
    }
    
    if (status && status !== 'ALL') {
      where.isActive = status === 'ACTIVE'
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Construir ordenamiento
    const orderBy: any = {}
    if (sortBy === 'lastLogin') {
      orderBy.lastLoginAt = sortOrder
    } else if (sortBy === 'status') {
      orderBy.isActive = sortOrder
    } else {
      orderBy[sortBy] = sortOrder
    }

    const users = await prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        createdBy: true,
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Transformar datos para el frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name || 'Sin nombre',
      email: user.email,
      role: user.role,
      status: user.isActive ? 'ACTIVE' : 'INACTIVE',
      createdAt: user.createdAt.toISOString().split('T')[0],
      lastLogin: user.lastLoginAt?.toISOString().split('T')[0],
      department: 'Sistema', // Campo por defecto, se puede agregar al schema si es necesario
      phone: null, // Campo por defecto, se puede agregar al schema si es necesario
      createdBy: user.creator?.name || 'Sistema'
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Session data:', session) // Debug logging
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, role, password } = body

    console.log('Request body:', { name, email, role }) // Debug logging

    // Validar rol si se proporciona
    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Rol inválido' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      )
    }

    // Verificar que el usuario de la sesión existe en la base de datos
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    console.log('Current user:', currentUser) // Debug logging

    // TEMPORAL: Si no se encuentra el usuario de sesión, usar un usuario por defecto
    let creatorId = null
    if (currentUser) {
      creatorId = currentUser.id
    } else {
      console.log('⚠️ Usuario de sesión no encontrado, usando usuario por defecto')
      // Buscar cualquier administrador como fallback
      const fallbackUser = await prisma.user.findFirst({
        where: { role: 'ADMINISTRADOR' }
      })
      if (fallbackUser) {
        creatorId = fallbackUser.id
        console.log('✅ Usando administrador por defecto:', fallbackUser.email)
      }
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: role || UserRole.GESTOR,
        password: hashedPassword,
        createdBy: creatorId,
        mustChangePassword: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        createdBy: true
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}