"use client"

import React, { useState } from 'react'
import { MandatoryPasswordChangeModal } from './mandatory-password-change-modal'
import { useMandatoryPasswordChange } from '@/hooks/use-mandatory-password-change'

export function DebugModal() {
  const [showModal, setShowModal] = useState(false)
  const { needsPasswordChange, isLoading, userName } = useMandatoryPasswordChange()

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Debug Modal de Cambio de Contraseña</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Estado del Hook:</h2>
        <p>Loading: {isLoading ? 'Sí' : 'No'}</p>
        <p>Needs Password Change: {needsPasswordChange ? 'Sí' : 'No'}</p>
        <p>User Name: {userName || 'No definido'}</p>
      </div>

      <div className="space-x-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Mostrar Modal Manualmente
        </button>

        <button
          onClick={() => {
            console.log('Estado actual:', { needsPasswordChange, isLoading, userName })
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Log Estado Actual
        </button>
      </div>

      <MandatoryPasswordChangeModal
        isOpen={showModal}
        onPasswordChanged={() => {
          console.log('Contraseña cambiada desde debug')
          setShowModal(false)
        }}
        userName={userName || "Usuario Debug"}
      />
    </div>
  )
}
