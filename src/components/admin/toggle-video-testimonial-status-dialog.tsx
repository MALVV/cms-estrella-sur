"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

interface ToggleVideoTestimonialStatusDialogProps {
  video: {
    id: string
    title: string
    isActive: boolean
  }
  onVideoUpdated: (updatedVideo: any) => void
  children: React.ReactNode
}

export function ToggleVideoTestimonialStatusDialog({ video, onVideoUpdated, children }: ToggleVideoTestimonialStatusDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleToggle = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/video-testimonials/${video.id}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cambiar el estado del video testimonial')
      }

      const updatedVideo = await response.json()
      
      if (onVideoUpdated) {
        onVideoUpdated(updatedVideo)
      }

      toast({
        title: "Estado actualizado exitosamente",
        description: `El video testimonial "${video.title}" ha sido ${updatedVideo.isActive ? 'activado' : 'desactivado'}.`,
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Error al cambiar estado",
        description: error instanceof Error ? error.message : "Hubo un problema al cambiar el estado del video testimonial.",
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
            {video.isActive ? 'Desactivar Video Testimonial' : 'Activar Video Testimonial'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres {video.isActive ? 'desactivar' : 'activar'} el video testimonial 
            <strong> "{video.title}"</strong>?
          </p>
          {video.isActive && (
            <p className="text-sm text-gray-500 mt-2">
              El video testimonial no será visible para los usuarios públicos.
            </p>
          )}
          {!video.isActive && (
            <p className="text-sm text-gray-500 mt-2">
              El video testimonial será visible para los usuarios públicos.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleToggle} 
            disabled={loading}
            variant={video.isActive ? 'destructive' : 'default'}
          >
            {loading ? 'Procesando...' : (video.isActive ? 'Desactivar' : 'Activar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
