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
    if (status === 'loading') {
      setState(prev => ({ ...prev, isLoading: true }))
      return
    }

    if (status === 'unauthenticated') {
      setState({
        needsPasswordChange: false,
        isLoading: false,
        userName: undefined
      })
      return
    }

    if (session?.user) {
      // Verificar si el usuario necesita cambiar su contraseña
      const needsChange = (session.user as any)?.mustChangePassword === true
      
      setState({
        needsPasswordChange: needsChange,
        isLoading: false,
        userName: session.user.name || undefined
      })
    } else {
      setState({
        needsPasswordChange: false,
        isLoading: false,
        userName: undefined
      })
    }
  }, [session, status])

  return state
}
