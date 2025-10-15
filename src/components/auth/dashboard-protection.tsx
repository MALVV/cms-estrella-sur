'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface DashboardProtectionProps {
  children: React.ReactNode
}

export function DashboardProtection({ children }: DashboardProtectionProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Aún cargando

    if (status === 'unauthenticated' || !session) {
      // Redirigir al login con la URL actual como callback
      const currentPath = window.location.pathname
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(currentPath)}`)
      return
    }

    // Verificar que el usuario tenga los datos necesarios
    if (!session.user?.email || !session.user?.role) {
      console.error('Sesión inválida: faltan datos del usuario')
      router.push('/sign-in')
      return
    }
  }, [session, status, router])

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (status === 'unauthenticated' || !session) {
    return null
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>
}
