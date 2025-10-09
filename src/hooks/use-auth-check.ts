'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useAuthCheck() {
  const { data: session, status } = useSession()
  const [isTokenValid, setIsTokenValid] = useState(true)
  const [tokenExpired, setTokenExpired] = useState(false)

  useEffect(() => {
    if (session?.customToken) {
      try {
        // Decodificar el token para verificar si está expirado
        const tokenParts = session.customToken.split('.')
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]))
          const now = Math.floor(Date.now() / 1000)
          const expired = payload.exp < now
          
          setIsTokenValid(!expired)
          setTokenExpired(expired)
          
          if (expired) {
            console.warn('⚠️ Token de autenticación expirado')
            // Opcional: redirigir al login o mostrar mensaje
            // router.push('/sign-in')
          }
        }
      } catch (error) {
        console.error('Error verificando token:', error)
        setIsTokenValid(false)
        setTokenExpired(true)
      }
    } else if (status === 'authenticated') {
      // Si estamos autenticados pero no hay token personalizado
      setIsTokenValid(false)
      setTokenExpired(true)
    }
  }, [session, status])

  const refreshSession = async () => {
    try {
      const response = await fetch('/api/auth/refresh-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        // Recargar la página para obtener la nueva sesión
        window.location.reload()
      }
    } catch (error) {
      console.error('Error refrescando sesión:', error)
    }
  }

  return {
    isAuthenticated: status === 'authenticated',
    isTokenValid,
    tokenExpired,
    session,
    refreshSession,
    isLoading: status === 'loading'
  }
}
