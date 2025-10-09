import { prisma } from './prisma'
import { 
  hashPassword, 
  verifyPassword, 
  validatePasswordStrength, 
  validateEmail, 
  sanitizeInput,
  generateEmailVerificationToken
} from './security'
import { UserRole, isValidRole } from './roles'

export interface RegisterData {
  email: string
  password: string
  name?: string
  role?: UserRole
  createdBy?: string // ID del administrador que crea el usuario
  isTemporaryPassword?: boolean // Si es una contraseña temporal
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name?: string
    role: UserRole
    mustChangePassword?: boolean
  }
  errors?: string[]
}

/**
 * Registra un nuevo usuario con validaciones de seguridad
 */
export async function registerUser(data: RegisterData): Promise<AuthResult> {
  try {
    // Sanitizar inputs
    const email = sanitizeInput(data.email.toLowerCase())
    const password = data.password
    const name = data.name ? sanitizeInput(data.name) : undefined
    const role = data.role || UserRole.TECNICO // Por defecto TÉCNICO
    const createdBy = data.createdBy
    const isTemporaryPassword = data.isTemporaryPassword || false

    // Validar email
    if (!validateEmail(email)) {
      return {
        success: false,
        message: 'Formato de email inválido',
        errors: ['El formato del email no es válido']
      }
    }

    // Validar rol
    if (!isValidRole(role)) {
      return {
        success: false,
        message: 'Rol inválido',
        errors: ['El rol especificado no es válido']
      }
    }

    // Validar fortaleza de contraseña (solo si no es temporal)
    if (!isTemporaryPassword) {
      const passwordValidation = validatePasswordStrength(password)
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: 'La contraseña no cumple con los requisitos de seguridad',
          errors: passwordValidation.errors
        }
      }
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return {
        success: false,
        message: 'El usuario ya existe',
        errors: ['Ya existe una cuenta con este email']
      }
    }

    // Encriptar contraseña
    const hashedPassword = await hashPassword(password)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        emailVerified: null, // Requiere verificación
        loginAttempts: 0,
        lockedUntil: null,
        refreshToken: null,
        refreshTokenExp: null,
        isActive: true,
        mustChangePassword: isTemporaryPassword, // Si es contraseña temporal, debe cambiarla
        createdBy: createdBy || null
      }
    })

    // Generar token de verificación de email
    const emailVerificationToken = generateEmailVerificationToken()
    
    // TODO: Enviar email de verificación
    // await sendEmailVerification(email, emailVerificationToken)

    return {
      success: true,
      message: isTemporaryPassword 
        ? 'Usuario creado exitosamente con contraseña temporal. El usuario debe cambiar su contraseña en el primer login.'
        : 'Usuario registrado exitosamente. Por favor verifica tu email.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role as UserRole,
        mustChangePassword: user.mustChangePassword
      }
    }

  } catch (error) {
    console.error('Error en registro:', error)
    return {
      success: false,
      message: 'Error interno del servidor',
      errors: ['Ocurrió un error inesperado. Inténtalo de nuevo.']
    }
  }
}

/**
 * Verifica las credenciales de login
 */
export async function verifyCredentials(data: LoginData): Promise<AuthResult> {
  try {
    // Sanitizar inputs
    const email = sanitizeInput(data.email.toLowerCase())
    const password = data.password

    // Validar email
    if (!validateEmail(email)) {
      return {
        success: false,
        message: 'Formato de email inválido',
        errors: ['El formato del email no es válido']
      }
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return {
        success: false,
        message: 'Credenciales inválidas',
        errors: ['Email o contraseña incorrectos']
      }
    }

    // Verificar contraseña
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      // Incrementar intentos fallidos
      const loginAttempts = user.loginAttempts + 1
      const updateData: any = { loginAttempts }

      // Bloquear cuenta si excede el límite (5 intentos)
      if (loginAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 horas
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      })

      return {
        success: false,
        message: 'Credenciales inválidas',
        errors: ['Email o contraseña incorrectos']
      }
    }

    // Resetear intentos fallidos y actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date()
      }
    })

    return {
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role as UserRole,
        mustChangePassword: user.mustChangePassword
      }
    }

  } catch (error) {
    console.error('Error en verificación de credenciales:', error)
    return {
      success: false,
      message: 'Error interno del servidor',
      errors: ['Ocurrió un error inesperado. Inténtalo de nuevo.']
    }
  }
}

/**
 * Verifica si un email está disponible
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
  try {
    const sanitizedEmail = sanitizeInput(email.toLowerCase())
    
    if (!validateEmail(sanitizedEmail)) {
      return false
    }

    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    })

    return !user
  } catch (error) {
    console.error('Error verificando disponibilidad de email:', error)
    return false
  }
}

/**
 * Cambia la contraseña de un usuario
 */
export async function changePassword(
  userId: string, 
  currentPassword: string, 
  newPassword: string
): Promise<AuthResult> {
  try {
    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return {
        success: false,
        message: 'Usuario no encontrado',
        errors: ['El usuario especificado no existe']
      }
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: 'Contraseña actual incorrecta',
        errors: ['La contraseña actual no es válida']
      }
    }

    // Validar nueva contraseña
    const passwordValidation = validatePasswordStrength(newPassword)
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: 'La nueva contraseña no cumple con los requisitos de seguridad',
        errors: passwordValidation.errors
      }
    }

    // Encriptar nueva contraseña
    const hashedNewPassword = await hashPassword(newPassword)

    // Actualizar contraseña y resetear flag
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        mustChangePassword: false
      }
    })

    return {
      success: true,
      message: 'Contraseña cambiada exitosamente'
    }

  } catch (error) {
    console.error('Error cambiando contraseña:', error)
    return {
      success: false,
      message: 'Error interno del servidor',
      errors: ['Ocurrió un error inesperado. Inténtalo de nuevo.']
    }
  }
}

/**
 * Obtiene información del usuario por ID
 */
export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        lastLoginAt: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return user
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    return null
  }
}
