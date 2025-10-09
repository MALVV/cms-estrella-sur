"use client"

import React from 'react'
import { usePasswordChange } from '@/hooks/use-password-change'
import { ChangePasswordModal } from './change-password-modal'

interface PasswordChangeWrapperProps {
  children: React.ReactNode
}

export const PasswordChangeWrapper: React.FC<PasswordChangeWrapperProps> = ({ children }) => {
  const {
    showChangePasswordModal,
    mustChangePassword,
    handlePasswordChangeSuccess,
    handleCloseModal
  } = usePasswordChange()

  return (
    <>
      {children}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={handleCloseModal}
        onSuccess={handlePasswordChangeSuccess}
      />
    </>
  )
}
