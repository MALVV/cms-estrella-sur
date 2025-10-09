"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

interface ToggleStoryStatusDialogProps {
  story: {
    id: string
    title: string
    description: string
    status: 'ACTIVE' | 'INACTIVE'
  }
  onStatusChanged: (storyId: string, newStatus: 'ACTIVE' | 'INACTIVE') => void
  children: React.ReactNode
}

export function ToggleStoryStatusDialog({ story, onStatusChanged, children }: ToggleStoryStatusDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const isCurrentlyActive = story.status === 'ACTIVE'
  const newStatus = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE'
  const actionText = isCurrentlyActive ? 'desactivar' : 'activar'
  const actionTextCapitalized = isCurrentlyActive ? 'Desactivar' : 'Activar'

  const handleToggleStatus = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/stories/${story.id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: newStatus === 'ACTIVE' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar estado de la story')
      }

      // Llamar callback para actualizar el estado local
      onStatusChanged(story.id, newStatus)

      toast({
        title: `Story ${actionText} exitosamente`,
        description: `"${story.title}" ha sido ${actionText} en el sistema.`,
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Error al cambiar estado",
        description: error instanceof Error ? error.message : "Hubo un problema al cambiar el estado de la story.",
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
          <DialogTitle>
            {isCurrentlyActive ? 'Desactivar Story' : 'Activar Story'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres {actionText} la story 
            <strong> "{story.title}"</strong>?
          </p>
          {isCurrentlyActive && (
            <p className="text-sm text-gray-500 mt-2">
              La story no será visible para los usuarios públicos.
            </p>
          )}
          {!isCurrentlyActive && (
            <p className="text-sm text-gray-500 mt-2">
              La story será visible para los usuarios públicos.
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
