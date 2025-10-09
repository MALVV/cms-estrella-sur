"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface MandatoryPasswordChangeState {
  needsPasswordChange: boolean
  isLoading: boolean
  userName?: string
}

export function useMandatoryPasswordChange(): MandatoryPasswordChangeState {
  const { data: session, status } = useSession()
  const [state, setState] = useState<MandatoryPasswordChangeState>({
    needsPasswordChange: false,
    isLoading: true,
    userName: undefined
  })

  useEffect(() => {
    console.log('🔄 Hook ejecutándose:', { status, session: !!session })
    
    if (status === 'loading') {
      console.log('⏳ Estado: Cargando...')
      setState(prev => ({ ...prev, isLoading: true }))
      return
    }

    if (status === 'unauthenticated') {
      console.log('❌ Estado: No autenticado')
      setState({
        needsPasswordChange: false,
        isLoading: false,
        userName: undefined
      })
      return
    }

    if (session?.user) {
      // Verificar si el usuario necesita cambiar su contraseña
      console.log('🔍 Verificando sesión del usuario:', {
        email: session.user.email,
        name: session.user.name,
        mustChangePassword: (session.user as any)?.mustChangePassword,
        fullUser: session.user
      })
      
      const needsChange = (session.user as any)?.mustChangePassword === true
      console.log('🔐 Usuario necesita cambiar contraseña:', needsChange)
      
      setState({
        needsPasswordChange: needsChange,
        isLoading: false,
        userName: session.user.name || undefined
      })
    } else {
      console.log('⚠️ Sesión existe pero no hay usuario')
      setState({
        needsPasswordChange: false,
        isLoading: false,
        userName: undefined
      })
    }
  }, [session, status])

  console.log('📤 Hook retornando estado:', state)
  return state
}
