# Implementación JWT en CMS Estrella Sur

## Descripción

Este proyecto implementa autenticación JWT (JSON Web Token) usando NextAuth.js con estrategia de credenciales. Los tokens JWT se generan automáticamente al iniciar sesión y se utilizan para autenticar las solicitudes a las APIs protegidas.

## Características Implementadas

### 1. **Generación Automática de JWT**
- Los tokens JWT se generan automáticamente al iniciar sesión
- Duración de 30 días por defecto
- Algoritmo HS256 para firma
- Incluye información del usuario (id, email, name)

### 2. **Middleware de Autenticación**
- `withAuth()`: Para APIs que requieren Bearer token
- `withNextAuth()`: Para APIs que usan cookies de sesión
- Verificación automática de tokens expirados

### 3. **Hook Personalizado**
- `useJWT()`: Hook para manejar información JWT en el cliente
- Muestra tiempo restante hasta expiración
- Detecta tokens expirados automáticamente

### 4. **Utilidades JWT**
- `generateJWT()`: Generar tokens personalizados
- `verifyJWT()`: Verificar y decodificar tokens
- `decodeJWT()`: Decodificar sin verificar (desarrollo)
- `isJWTExpired()`: Verificar expiración
- `getJWTTimeRemaining()`: Tiempo restante

## Estructura de Archivos

```
src/
├── lib/
│   ├── auth.ts              # Configuración NextAuth con JWT
│   ├── jwt.ts               # Utilidades JWT
│   └── auth-middleware.ts   # Middleware de autenticación
├── hooks/
│   └── use-jwt.ts           # Hook para manejar JWT en cliente
├── types/
│   └── next-auth.d.ts       # Tipos TypeScript extendidos
└── app/
    └── api/
        └── protected/
            └── route.ts      # Ejemplo de API protegida
```

## Configuración

### Variables de Entorno

```env
# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT (opcional, usa NEXTAUTH_SECRET por defecto)
JWT_SECRET="your-jwt-secret-here"
JWT_EXPIRES_IN="30d"
JWT_ALGORITHM="HS256"
```

### Configuración NextAuth

```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user }) {
      // Generar JWT personalizado
      if (token.id && process.env.NEXTAUTH_SECRET) {
        const customToken = jwt.sign({
          id: token.id,
          email: token.email,
          name: token.name,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
        }, process.env.NEXTAUTH_SECRET, {
          algorithm: 'HS256',
        })
        
        token.customToken = customToken
      }
      return token
    },
    async session({ session, token }) {
      // Enviar token al cliente
      session.customToken = token.customToken as string
      return session
    },
  },
}
```

## Uso

### 1. **En el Cliente (React)**

```typescript
import { useJWT } from '@/hooks/use-jwt'

function MyComponent() {
  const { jwtData, isExpired, formattedTimeRemaining } = useJWT()
  
  return (
    <div>
      <p>Token válido: {!isExpired ? 'Sí' : 'No'}</p>
      <p>Tiempo restante: {formattedTimeRemaining}</p>
      <p>Usuario: {jwtData?.email}</p>
    </div>
  )
}
```

### 2. **APIs Protegidas**

```typescript
// src/app/api/protected/route.ts
import { withAuth } from '@/lib/auth-middleware'

async function handler(req: AuthenticatedRequest) {
  const user = req.user! // Usuario autenticado
  
  return NextResponse.json({
    message: 'Acceso autorizado',
    user: user
  })
}

export const GET = withAuth(handler)
```

### 3. **Solicitudes con Bearer Token**

```typescript
// Cliente
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${session.customToken}`
  }
})
```

### 4. **Generar Token Personalizado**

```typescript
import { generateJWT } from '@/lib/jwt'

const token = generateJWT({
  id: 'user123',
  email: 'user@example.com',
  name: 'Usuario'
})
```

## Seguridad

### 1. **Verificación de Tokens**
- Todos los tokens se verifican usando la clave secreta
- Verificación automática de expiración
- Algoritmo HS256 para firma

### 2. **Middleware de Protección**
- Verificación automática en rutas protegidas
- Manejo de errores de autenticación
- Respuestas HTTP apropiadas (401, 403)

### 3. **Gestión de Sesiones**
- Tokens con expiración automática
- Renovación automática en NextAuth
- Logout limpia todos los tokens

## Monitoreo y Debugging

### 1. **Dashboard JWT**
- Información del token en tiempo real
- Estado de expiración
- Tiempo restante hasta expiración
- Datos del usuario en el token

### 2. **Logs de Desarrollo**
```typescript
// Habilitar en desarrollo
debug: process.env.NODE_ENV === 'development'
```

### 3. **Verificación Manual**
```typescript
import { verifyJWT, decodeJWT } from '@/lib/jwt'

// Verificar token
try {
  const decoded = verifyJWT(token)
  console.log('Token válido:', decoded)
} catch (error) {
  console.log('Token inválido:', error.message)
}

// Decodificar sin verificar (solo desarrollo)
const decoded = decodeJWT(token)
console.log('Datos del token:', decoded)
```

## Mejores Prácticas

1. **Nunca exponer la clave secreta** en el cliente
2. **Usar HTTPS** en producción
3. **Rotar claves secretas** periódicamente
4. **Implementar refresh tokens** para aplicaciones críticas
5. **Monitorear tokens expirados** y renovar automáticamente
6. **Validar todos los tokens** en el servidor
7. **Usar middleware** para proteger rutas automáticamente

## Troubleshooting

### Token Expirado
```typescript
// Verificar expiración
if (isJWTExpired(token)) {
  // Redirigir a login o renovar token
  router.push('/auth/sign-in')
}
```

### Error de Verificación
```typescript
try {
  const decoded = verifyJWT(token)
} catch (error) {
  if (error.message === 'Token JWT inválido') {
    // Token malformado o clave incorrecta
  } else if (error.message === 'jwt expired') {
    // Token expirado
  }
}
```

### Problemas de CORS
```typescript
// Asegurar que las cookies se envíen
fetch('/api/protected', {
  credentials: 'include'
})
```

