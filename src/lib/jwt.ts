import jwt from 'jsonwebtoken'

export interface JWTPayload {
  id: string
  email: string
  name?: string
  iat: number
  exp: number
}

export interface JWTDecoded {
  id: string
  email: string
  name?: string
  iat: number
  exp: number
}

/**
 * Genera un token JWT con los datos del usuario
 */
export function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET no está configurado')
  }

  const tokenPayload: JWTPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 días
  }

  return jwt.sign(tokenPayload, secret, {
    algorithm: 'HS256',
  })
}

/**
 * Verifica y decodifica un token JWT
 */
export function verifyJWT(token: string): JWTDecoded {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET no está configurado')
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
    }) as JWTDecoded

    return decoded
  } catch {
    throw new Error('Token JWT inválido')
  }
}

/**
 * Decodifica un token JWT sin verificar la firma (solo para desarrollo)
 */
export function decodeJWT(token: string): JWTDecoded | null {
  try {
    const decoded = jwt.decode(token) as JWTDecoded
    return decoded
  } catch {
    return null
  }
}

/**
 * Verifica si un token JWT ha expirado
 */
export function isJWTExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token)
    if (!decoded) return true
    
    const now = Math.floor(Date.now() / 1000)
    return decoded.exp < now
  } catch {
    return true
  }
}

/**
 * Obtiene el tiempo restante hasta la expiración del token en segundos
 */
export function getJWTTimeRemaining(token: string): number {
  try {
    const decoded = decodeJWT(token)
    if (!decoded) return 0
    
    const now = Math.floor(Date.now() / 1000)
    return Math.max(0, decoded.exp - now)
  } catch {
    return 0
  }
}

