"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

interface DonationProject {
  id: string
  title: string
}

interface DeleteDonationProjectDialogProps {
  project: DonationProject
  onProjectDeleted: (projectId: string) => void
  children: React.ReactNode
}

export function DeleteDonationProjectDialog({ 
  project, 
  onProjectDeleted, 
  children 
}: DeleteDonationProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/donation-projects/${project.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar proyecto')
      }

      // Llamar callback para actualizar el estado local
      onProjectDeleted(project.id)

      toast.success("Proyecto eliminado exitosamente", {
        description: `"${project.title}" ha sido eliminado del sistema.`,
      })

      setOpen(false)
    } catch (error) {
      toast.error("Error al eliminar proyecto", {
        description: error instanceof Error ? error.message : "Hubo un problema al eliminar el proyecto.",
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
            <Trash2 className="h-5 w-5 text-red-600" />
            Eliminar Proyecto de Donación
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Estás seguro de que quieres eliminar el proyecto de donación{' '}
            <strong className="text-gray-900 dark:text-white">"{project.title}"</strong>?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
