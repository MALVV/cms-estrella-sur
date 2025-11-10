"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, signIn, signOut } from 'next-auth/react'
import { MandatoryPasswordChangeModal } from './mandatory-password-change-modal'
import { useMandatoryPasswordChange } from '@/hooks/use-mandatory-password-change'

interface MandatoryPasswordChangeWrapperProps {
  children: React.ReactNode
}

export function MandatoryPasswordChangeWrapper({ children }: MandatoryPasswordChangeWrapperProps) {
  const { needsPasswordChange, isLoading, userName } = useMandatoryPasswordChange()
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  // Mostrar el modal cuando el usuario necesita cambiar su contraseña
  React.useEffect(() => {
    if (!isLoading && needsPasswordChange) {
      setShowModal(true)
    }
  }, [needsPasswordChange, isLoading])

  const handlePasswordChanged = async () => {
    setShowModal(false)
    
    // Refrescar la sesión con datos actualizados
    try {
      const refreshResponse = await fetch('/api/auth/refresh-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (refreshResponse.ok) {
        await getSession()
      }
    } catch (error) {
      // Error silencioso - el usuario puede continuar
    }
    
    // Recargar la página para actualizar el estado del hook
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  // Si está cargando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si necesita cambiar contraseña, mostrar el modal
  if (needsPasswordChange) {
    return (
      <>
        {/* Overlay de fondo para bloquear el acceso */}
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Restringido</h2>
              <p className="text-gray-600">Debes cambiar tu contraseña para continuar</p>
              <p className="text-sm text-gray-500 mt-2">Usuario: {userName}</p>
            </div>
          </div>
        </div>

        <MandatoryPasswordChangeModal
          isOpen={showModal}
          onPasswordChanged={handlePasswordChanged}
          userName={userName}
        />
      </>
    )
  }

  // Si no necesita cambiar contraseña, mostrar el contenido normal
  return <>{children}</>
}
