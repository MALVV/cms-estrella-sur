"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, UserX, Key, Loader2 } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'destructive' | 'warning' | 'default'
  icon?: React.ReactNode
  isLoading?: boolean
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'destructive',
  icon,
  isLoading = false
}: ConfirmationDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: <Trash2 className="h-6 w-6 text-gray-500" />,
          confirmButton: 'bg-gray-600 hover:bg-gray-700 text-white',
          border: 'border-gray-200 dark:border-gray-800'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          border: 'border-yellow-200 dark:border-yellow-800'
        }
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          border: 'border-blue-200 dark:border-blue-800'
        }
    }
  }

  const styles = getVariantStyles()
  const displayIcon = icon || styles.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${styles.border} bg-background`}>
              {displayIcon}
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. Por favor, confirma que deseas continuar.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 transition-all duration-200 hover:bg-gray-50"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 transition-all duration-200 ${styles.confirmButton}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Componentes específicos para diferentes acciones
export function DeleteUserDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName: string
  isLoading?: boolean
}) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Eliminar Usuario"
      description={`¿Estás seguro de que quieres eliminar a ${userName}?`}
      confirmText="Eliminar Usuario"
      variant="destructive"
      icon={<Trash2 className="h-6 w-6 text-gray-500" />}
      isLoading={isLoading}
    />
  )
}

export function DeactivateUserDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName: string
  isLoading?: boolean
}) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Desactivar Usuario"
      description={`¿Estás seguro de que quieres desactivar a ${userName}?`}
      confirmText="Desactivar"
      variant="warning"
      icon={<UserX className="h-6 w-6 text-gray-500" />}
      isLoading={isLoading}
    />
  )
}

export function ChangePasswordDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName: string
  isLoading?: boolean
}) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Cambiar Contraseña"
      description={`¿Estás seguro de que quieres cambiar la contraseña de ${userName}?`}
      confirmText="Cambiar Contraseña"
      variant="default"
      icon={<Key className="h-6 w-6 text-blue-500" />}
      isLoading={isLoading}
    />
  )
}
