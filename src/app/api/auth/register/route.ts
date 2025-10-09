import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth-service'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { 
          message: 'Email y contraseña son requeridos',
          errors: ['Email y contraseña son campos obligatorios']
        },
        { status: 400 }
      )
    }

    // Usar el servicio de registro con validaciones de seguridad
    const result = await registerUser({
      email,
      password,
      name
    })

    if (!result.success) {
      return NextResponse.json(
        { 
          message: result.message,
          errors: result.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        message: result.message,
        user: result.user
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        errors: ['Ocurrió un error inesperado. Inténtalo de nuevo.']
      },
      { status: 500 }
    )
  }
}
