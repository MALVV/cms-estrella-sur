import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { 
  verifyPassword, 
  generateAccessToken
} from './security'
import { UserRole } from './roles'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Buscar usuario
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() }
          }) as any

          if (!user) {
            return null
          }

          // Verificar contraseña
          const isPasswordValid = await verifyPassword(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          console.log('🔐 Usuario autenticado:', {
            email: user.email,
            name: user.name,
            role: user.role,
            mustChangePassword: user.mustChangePassword
          })

          // Actualizar último login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() } as any
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            role: user.role as UserRole,
            mustChangePassword: user.mustChangePassword
          }
        } catch (error) {
          console.error('Error en authorize:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas para mejor experiencia de usuario
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 horas para mejor experiencia de usuario
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('🎫 Creando JWT token:', {
          email: user.email,
          mustChangePassword: user.mustChangePassword
        })
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.mustChangePassword = user.mustChangePassword
        
        // Generar token personalizado para autenticación en APIs
        token.customToken = generateAccessToken({
          id: user.id,
          email: user.email,
          name: user.name
        })
      } else if (token) {
        // Regenerar token personalizado en cada request para evitar expiración
        token.customToken = generateAccessToken({
          id: token.id as string,
          email: token.email as string,
          name: token.name as string
        })
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        console.log('📋 Creando sesión:', {
          email: token.email,
          mustChangePassword: token.mustChangePassword,
          customTokenExists: !!token.customToken,
          customTokenLength: token.customToken ? token.customToken.length : 0
        })
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as UserRole
        session.user.mustChangePassword = token.mustChangePassword as boolean
        session.customToken = token.customToken as string
        
        console.log('🔑 Token asignado a sesión:', {
          sessionCustomTokenExists: !!session.customToken,
          sessionCustomTokenLength: session.customToken ? session.customToken.length : 0
        })
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Si la URL es relativa, usar baseUrl
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Si la URL es del mismo dominio, permitirla
      else if (new URL(url).origin === baseUrl) return url
      // Por defecto, redirigir al dashboard
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/sign-in'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
