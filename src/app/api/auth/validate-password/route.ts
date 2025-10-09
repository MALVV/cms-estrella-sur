import { NextRequest, NextResponse } from 'next/server'
import { validatePasswordStrength } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { 
          message: 'Contraseña requerida',
          errors: ['La contraseña es requerida para validación']
        },
        { status: 400 }
      )
    }

    const validation = validatePasswordStrength(password)

    return NextResponse.json({
      isValid: validation.isValid,
      errors: validation.errors,
      strength: getPasswordStrength(password)
    })

  } catch (error) {
    console.error('Error validando contraseña:', error)
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        errors: ['Ocurrió un error inesperado']
      },
      { status: 500 }
    )
  }
}

/**
 * Calcula la fortaleza de la contraseña
 */
function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }

  // Calcular score
  Object.values(checks).forEach(check => {
    if (check) score += 1
  })

  // Determinar label y color
  if (score <= 2) {
    return { score, label: 'Muy débil', color: 'red' }
  } else if (score <= 3) {
    return { score, label: 'Débil', color: 'orange' }
  } else if (score <= 4) {
    return { score, label: 'Media', color: 'yellow' }
  } else {
    return { score, label: 'Fuerte', color: 'green' }
  }
}
