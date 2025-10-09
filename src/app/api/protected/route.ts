import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware'

async function handler(req: AuthenticatedRequest) {
  // Esta función solo se ejecuta si el usuario está autenticado
  const user = req.user!

  return NextResponse.json({
    message: 'Acceso autorizado',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    timestamp: new Date().toISOString(),
  })
}

export const GET = withAuth(handler)
export const POST = withAuth(handler)

