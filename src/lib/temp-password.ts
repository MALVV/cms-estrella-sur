import crypto from 'crypto'

/**
 * Genera una contraseña temporal segura
 */
export function generateTemporaryPassword(): string {
  // Generar una contraseña de 12 caracteres con:
  // - Al menos 2 mayúsculas
  // - Al menos 2 minúsculas  
  // - Al menos 2 números
  // - Al menos 2 caracteres especiales
  
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '!@#$%^&*'
  
  let password = ''
  
  // Agregar caracteres requeridos
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]
  password += special[Math.floor(Math.random() * special.length)]
  
  // Completar con caracteres aleatorios
  const allChars = uppercase + lowercase + numbers + special
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Mezclar la contraseña
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Genera credenciales temporales para un nuevo usuario
 */
export function generateTemporaryCredentials() {
  const password = generateTemporaryPassword()
  const username = generateTemporaryUsername()
  
  return {
    username,
    password,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
  }
}

/**
 * Genera un nombre de usuario temporal
 */
function generateTemporaryUsername(): string {
  const adjectives = ['Rapid', 'Quick', 'Swift', 'Fast', 'Agile', 'Smart', 'Bright', 'Sharp']
  const nouns = ['User', 'Member', 'Guest', 'Visitor', 'Client', 'Agent', 'Helper', 'Worker']
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 9999) + 1
  
  return `${adjective}${noun}${number}`
}

/**
 * Valida si una contraseña temporal es válida
 */
export function isValidTemporaryPassword(password: string): boolean {
  // Verificar longitud mínima
  if (password.length < 8) return false
  
  // Verificar que tenga al menos una mayúscula
  if (!/[A-Z]/.test(password)) return false
  
  // Verificar que tenga al menos una minúscula
  if (!/[a-z]/.test(password)) return false
  
  // Verificar que tenga al menos un número
  if (!/\d/.test(password)) return false
  
  // Verificar que tenga al menos un carácter especial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false
  
  return true
}
