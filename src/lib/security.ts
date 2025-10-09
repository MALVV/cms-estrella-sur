import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

// Configuración de seguridad
const BCRYPT_ROUNDS = 12
const JWT_SECRET = process.env.NEXTAUTH_SECRET!
const JWT_EXPIRES_IN = '30d'
const REFRESH_TOKEN_EXPIRES_IN = '90d'
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000 // 2 horas

export interface SecurityConfig {
  bcryptRounds: number
  jwtSecret: string
  jwtExpiresIn: string
  refreshTokenExpiresIn: string
  maxLoginAttempts: number
  lockTime: number
}

export const securityConfig: SecurityConfig = {
  bcryptRounds: BCRYPT_ROUNDS,
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: JWT_EXPIRES_IN,
  refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
  maxLoginAttempts: MAX_LOGIN_ATTEMPTS,
  lockTime: LOCK_TIME,
}

/**
 * Encripta una contraseña usando bcrypt con salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS)
    return await bcrypt.hash(password, salt)
  } catch {
    throw new Error('Error al encriptar la contraseña')
  }
}

/**
 * Verifica una contraseña contra su hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch {
    throw new Error('Error al verificar la contraseña')
  }
}

/**
 * Genera un token JWT de acceso
 */
export function generateAccessToken(payload: {
  id: string
  email: string
  name?: string
}): string {
  try {
    return jwt.sign(
      {
        ...payload,
        type: 'access',
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: 'HS256',
      }
    )
  } catch {
    throw new Error('Error al generar token de acceso')
  }
}

/**
 * Genera un token de refresh
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex')
}

/**
 * Verifica un token JWT de acceso
 */
export function verifyAccessToken(token: string): unknown {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    })
  } catch {
    throw new Error('Token de acceso inválido o expirado')
  }
}

/**
 * Verifica si un usuario está bloqueado por intentos fallidos
 */
export function isAccountLocked(lockUntil?: Date): boolean {
  if (!lockUntil) return false
  return new Date() < lockUntil
}

/**
 * Calcula el tiempo de bloqueo
 */
export function calculateLockUntil(): Date {
  return new Date(Date.now() + LOCK_TIME)
}

/**
 * Valida la fortaleza de una contraseña
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Genera un token seguro para verificación de email
 */
export function generateEmailVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Genera un token seguro para reset de contraseña
 */
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Valida el formato de email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitiza input para prevenir inyección
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres potencialmente peligrosos
    .substring(0, 255) // Limitar longitud
}

/**
 * Genera un hash seguro para tokens
 */
export function generateSecureHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}
