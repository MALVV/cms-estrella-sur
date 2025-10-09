"use client"

import React, { useState } from 'react'
import { MandatoryPasswordChangeModal } from './mandatory-password-change-modal'

export function TestModal() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Modal de Cambio de Contraseña</h1>
      
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Mostrar Modal de Cambio de Contraseña
      </button>

      <MandatoryPasswordChangeModal
        isOpen={showModal}
        onPasswordChanged={() => {
          console.log('Contraseña cambiada')
          setShowModal(false)
        }}
        userName="Usuario Test"
      />
    </div>
  )
}
