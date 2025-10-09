"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'

interface DeleteVideoTestimonialDialogProps {
  video: {
    id: string
    title: string
    description: string
  }
  onVideoDeleted: (videoId: string) => void
  children: React.ReactNode
}

export function DeleteVideoTestimonialDialog({ video, onVideoDeleted, children }: DeleteVideoTestimonialDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleDelete = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/video-testimonials/${video.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar el video testimonial')
      }

      // Llamar callback para actualizar el estado local
      onVideoDeleted(video.id)

      toast({
        title: "Video testimonial eliminado exitosamente",
        description: `"${video.title}" ha sido eliminado permanentemente.`,
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Error al eliminar video testimonial",
        description: error instanceof Error ? error.message : "Hubo un problema al eliminar el video testimonial.",
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
          <DialogTitle>Eliminar Video Testimonial</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres eliminar el video testimonial 
            <strong> "{video.title}"</strong>?
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
