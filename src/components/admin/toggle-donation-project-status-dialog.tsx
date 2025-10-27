"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Power, PowerOff } from 'lucide-react'

interface DonationProject {
  id: string
  title: string
  isActive: boolean
}

interface ToggleDonationProjectStatusDialogProps {
  project: DonationProject
  onStatusChanged: (projectId: string, newStatus: boolean) => void
  children: React.ReactNode
}

export function ToggleDonationProjectStatusDialog({ 
  project, 
  onStatusChanged, 
  children 
}: ToggleDonationProjectStatusDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isCurrentlyActive = project.isActive
  const newStatus = !isCurrentlyActive
  const actionText = isCurrentlyActive ? 'desactivar' : 'activar'
  const actionTextCapitalized = isCurrentlyActive ? 'Desactivar' : 'Activar'

  const handleToggleStatus = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/donation-projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar estado del proyecto')
      }

      // Llamar callback para actualizar el estado local
      onStatusChanged(project.id, newStatus)

      toast.success(`Proyecto ${actionText} exitosamente`, {
        description: `"${project.title}" ha sido ${actionText} en el sistema.`,
      })

      setOpen(false)
    } catch (error) {
      toast.error("Error al cambiar estado", {
        description: error instanceof Error ? error.message : "Hubo un problema al cambiar el estado del proyecto.",
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
            {isCurrentlyActive ? (
              <PowerOff className="h-5 w-5 text-orange-600" />
            ) : (
              <Power className="h-5 w-5 text-green-600" />
            )}
            {isCurrentlyActive ? 'Desactivar Proyecto' : 'Activar Proyecto'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Estás seguro de que quieres {actionText} el proyecto de donación{' '}
            <strong className="text-gray-900 dark:text-white">"{project.title}"</strong>?
          </p>
          {isCurrentlyActive ? (
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
              El proyecto ya no será visible en la página pública.
            </p>
          ) : (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              El proyecto será visible en la página pública.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant={isCurrentlyActive ? "destructive" : "default"}
            onClick={handleToggleStatus}
            disabled={loading}
          >
            {loading ? 'Procesando...' : actionTextCapitalized}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
