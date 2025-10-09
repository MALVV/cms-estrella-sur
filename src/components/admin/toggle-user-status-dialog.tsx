"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertTriangle, UserCheck, UserX } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ToggleUserStatusDialogProps {
  user: {
    id: string
    name: string
    email: string
    status: 'ACTIVE' | 'INACTIVE'
  }
  onStatusChanged: (userId: string, newStatus: 'ACTIVE' | 'INACTIVE') => void
  children: React.ReactNode
}

export function ToggleUserStatusDialog({ user, onStatusChanged, children }: ToggleUserStatusDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const isCurrentlyActive = user.status === 'ACTIVE'
  const newStatus = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE'
  const actionText = isCurrentlyActive ? 'desactivar' : 'activar'
  const actionTextCapitalized = isCurrentlyActive ? 'Desactivar' : 'Activar'

  const handleToggleStatus = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/users/${user.id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: newStatus === 'ACTIVE' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar estado del usuario')
      }

      // Llamar callback para actualizar el estado local
      onStatusChanged(user.id, newStatus)

      toast({
        title: `Usuario ${actionText} exitosamente`,
        description: `${user.name} ha sido ${actionText} en el sistema.`,
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Error al cambiar estado",
        description: error instanceof Error ? error.message : "Hubo un problema al cambiar el estado del usuario.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {actionTextCapitalized} Usuario
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres {actionText} a <strong>{user.name}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {isCurrentlyActive ? (
                <UserX className="h-8 w-8 text-red-500" />
              ) : (
                <UserCheck className="h-8 w-8 text-green-500" />
              )}
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Estado actual: <span className={`font-medium ${isCurrentlyActive ? 'text-green-600' : 'text-red-600'}`}>
                    {isCurrentlyActive ? 'Activo' : 'Inactivo'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Nota:</strong> {isCurrentlyActive 
                ? 'Al desactivar este usuario, no podrá iniciar sesión en el sistema hasta que sea reactivado.'
                : 'Al activar este usuario, podrá iniciar sesión en el sistema normalmente.'
              }
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleToggleStatus}
              disabled={loading}
              variant={isCurrentlyActive ? 'destructive' : 'default'}
            >
              {loading ? 'Procesando...' : `${actionTextCapitalized} Usuario`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
