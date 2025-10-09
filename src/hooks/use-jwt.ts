'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { JWTDecoded } from '@/lib/jwt'

export function useJWT() {
  const { data: session, status } = useSession()
  const [jwtData, setJwtData] = useState<JWTDecoded | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (session?.customToken) {
      try {
        // Decodificar el token sin verificar (solo para mostrar información)
        const tokenParts = session.customToken.split('.')
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]))
          setJwtData(payload)
          
          // Verificar si está expirado
          const now = Math.floor(Date.now() / 1000)
          const expired = payload.exp < now
          setIsExpired(expired)
          
          if (!expired) {
            setTimeRemaining(payload.exp - now)
          }
        }
      } catch (error) {
        console.error('Error decodificando JWT:', error)
      }
    }
  }, [session])

  // Actualizar tiempo restante cada minuto
  useEffect(() => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            setIsExpired(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [timeRemaining])

  const formatTimeRemaining = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return {
    jwtData,
    isExpired,
    timeRemaining,
    formattedTimeRemaining: formatTimeRemaining(timeRemaining),
    isLoading: status === 'loading',
    isAuthenticated: !!session,
  }
}

