"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function usePasswordChange() {
  const { data: session, status } = useSession()
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)

  useEffect(() => {
    // Solo verificar si la sesión está cargada
    if (status === 'loading') return

    // Verificar si el usuario debe cambiar su contraseña
    if (session?.user && (session.user as any).mustChangePassword) {
      setShowChangePasswordModal(true)
    }
  }, [session, status])

  const handlePasswordChangeSuccess = () => {
    setShowChangePasswordModal(false)
    // Recargar la sesión para actualizar el estado
    window.location.reload()
  }

  const handleCloseModal = () => {
    // No permitir cerrar el modal si debe cambiar la contraseña
    if ((session?.user as any).mustChangePassword) {
      return
    }
    setShowChangePasswordModal(false)
  }

  return {
    showChangePasswordModal,
    mustChangePassword: (session?.user as any)?.mustChangePassword || false,
    handlePasswordChangeSuccess,
    handleCloseModal
  }
}
