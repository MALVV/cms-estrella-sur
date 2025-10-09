"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Star, StarOff, Video } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ToggleVideoTestimonialFeaturedDialogProps {
  video: {
    id: string
    title: string
    isFeatured: boolean
  }
  onVideoUpdated: (updatedVideo: any) => void
  children: React.ReactNode
}

export function ToggleVideoTestimonialFeaturedDialog({ video, onVideoUpdated, children }: ToggleVideoTestimonialFeaturedDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleToggle = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/video-testimonials/${video.id}/toggle-featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cambiar el estado destacado del video testimonial')
      }

      const updatedVideo = await response.json()
      
      if (onVideoUpdated) {
        onVideoUpdated(updatedVideo)
      }

      toast({
        title: "Estado destacado actualizado exitosamente",
        description: `El video testimonial "${video.title}" ha sido ${updatedVideo.isFeatured ? 'destacado' : 'removido de destacados'}.`,
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Error al cambiar estado destacado",
        description: error instanceof Error ? error.message : "Hubo un problema al cambiar el estado destacado del video testimonial.",
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
      <DialogContent className="mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {video.isFeatured ? (
              <StarOff className="h-5 w-5 text-orange-500" />
            ) : (
              <Star className="h-5 w-5 text-yellow-500" />
            )}
            {video.isFeatured ? 'Quitar Destacado' : 'Destacar'} Video Testimonial
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres {video.isFeatured ? 'quitar el destacado de' : 'destacar'} el video testimonial <strong>"{video.title}"</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className={`p-4 border rounded-lg ${
            video.isFeatured 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center gap-3">
              <Video className={`h-8 w-8 ${
                video.isFeatured ? 'text-orange-500' : 'text-yellow-500'
              }`} />
              <div>
                <p className={`font-medium ${
                  video.isFeatured ? 'text-orange-900' : 'text-yellow-900'
                }`}>
                  {video.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={video.isFeatured ? 'default' : 'secondary'}>
                    {video.isFeatured ? 'Destacado' : 'Normal'}
                  </Badge>
                  <span className={`text-xs ${
                    video.isFeatured ? 'text-orange-700' : 'text-yellow-700'
                  }`}>
                    {video.isFeatured ? 'Aparece primero en la lista' : 'Aparece en orden normal'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-3 ${
            video.isFeatured 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <p className={`text-sm ${
              video.isFeatured ? 'text-orange-800' : 'text-yellow-800'
            }`}>
              <strong>Información:</strong> {video.isFeatured 
                ? 'Al quitar el destacado, este video testimonial aparecerá en orden normal en la lista.' 
                : 'Al destacar este video testimonial, aparecerá primero en la lista y será más visible para los usuarios.'
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
              onClick={handleToggle}
              disabled={loading}
              variant={video.isFeatured ? 'destructive' : 'default'}
              className={video.isFeatured ? '' : 'bg-yellow-600 hover:bg-yellow-700'}
            >
              {loading ? 'Procesando...' : video.isFeatured ? 'Quitar Destacado' : 'Destacar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
