"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'

interface DeleteStoryDialogProps {
  story: {
    id: string
    title: string
    description: string
  }
  onStoryDeleted: (storyId: string) => void
  children: React.ReactNode
}

export function DeleteStoryDialog({ story, onStoryDeleted, children }: DeleteStoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleDelete = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/stories/${story.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar la historia')
      }

      // Llamar callback para actualizar el estado local
      onStoryDeleted(story.id)

      toast({
        title: "Historia eliminada exitosamente",
        description: `"${story.title}" ha sido eliminada permanentemente.`,
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Error al eliminar historia",
        description: error instanceof Error ? error.message : "Hubo un problema al eliminar la historia.",
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
          <DialogTitle>Eliminar Historia</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres eliminar la historia 
            <strong> "{story.title}"</strong>?
          </p>
          <p className="text-sm text-red-600 mt-2 font-medium">
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
