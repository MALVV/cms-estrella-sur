import NextAuth from 'next-auth'
import { UserRole } from '@/lib/roles'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role: UserRole
      mustChangePassword?: boolean
    }
    accessToken?: string
    customToken?: string
    refreshToken?: string
  }

  interface User {
    id: string
    email: string
    name?: string
    role: UserRole
    mustChangePassword?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email?: string
    name?: string
    role?: UserRole
    mustChangePassword?: boolean
    accessToken?: string
    customToken?: string
    refreshToken?: string
  }
}
