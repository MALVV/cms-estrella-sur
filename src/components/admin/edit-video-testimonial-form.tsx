"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, Save, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface EditVideoTestimonialFormProps {
  video: {
    id: string
    title: string
    description: string
    youtubeUrl: string
    thumbnailUrl?: string
    duration?: number
    isActive: boolean
    isFeatured: boolean
    createdAt: string
    updatedAt: string
    creator?: {
      id: string
      name: string
      email: string
      role: string
    }
  }
  onVideoUpdated: (updatedVideo: any) => void
  children: React.ReactNode
}

export function EditVideoTestimonialForm({ video, onVideoUpdated, children }: EditVideoTestimonialFormProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    thumbnailUrl: '',
    duration: '',
    isActive: true,
    isFeatured: false
  })
  const [loading, setLoading] = useState(false)

  // Inicializar el formulario con los datos del video
  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        description: video.description,
        youtubeUrl: video.youtubeUrl,
        thumbnailUrl: video.thumbnailUrl || '',
        duration: video.duration ? video.duration.toString() : '',
        isActive: video.isActive,
        isFeatured: video.isFeatured
      })
    }
  }, [video])

  const handleInputChange = (field: string, value: string | boolean) => {
    // Si es un boolean (checkbox), actualizar directamente
    if (typeof value === 'boolean') {
      setFormData(prev => ({ ...prev, [field]: value }))
      return
    }
    
    // Definir límites de caracteres para campos de texto
    const limits = {
      title: 100,
      description: 200,
      youtubeUrl: 200,
      thumbnailUrl: 200,
      duration: 10
    }
    
    // Verificar si el valor excede el límite
    if (limits[field as keyof typeof limits] && value.length > limits[field as keyof typeof limits]) {
      return // No actualizar si excede el límite
    }
    
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/video-testimonials/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          youtubeUrl: formData.youtubeUrl,
          thumbnailUrl: formData.thumbnailUrl || undefined,
          duration: formData.duration ? parseInt(formData.duration) : undefined,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar el video testimonial')
      }

      const updatedVideo = await response.json()
      
      if (onVideoUpdated) {
        onVideoUpdated(updatedVideo)
      }

      toast({
        title: "Video testimonial actualizado exitosamente",
        description: "Los cambios han sido guardados correctamente.",
      })

      setIsOpen(false)
      
    } catch (error) {
      toast({
        title: "Error al actualizar video testimonial",
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar el video testimonial. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Resetear el formulario a los valores originales
    setFormData({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      thumbnailUrl: video.thumbnailUrl || '',
      duration: video.duration ? video.duration.toString() : '',
      isActive: video.isActive,
      isFeatured: video.isFeatured
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Video Testimonial
          </DialogTitle>
          <DialogDescription>
            Modifica la información del video testimonial.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título * <span className="text-xs text-gray-500">({formData.title.length}/100)</span>
              </label>
              <Input
                id="title"
                placeholder="Ingresa el título del video testimonial"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descripción * <span className="text-xs text-gray-500">({formData.description.length}/200)</span>
              </label>
              <textarea
                id="description"
                placeholder="Describe el video testimonial..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={200}
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="youtubeUrl" className="text-sm font-medium">
                URL de YouTube * <span className="text-xs text-gray-500">({formData.youtubeUrl.length}/200)</span>
              </label>
              <Input
                id="youtubeUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="thumbnailUrl" className="text-sm font-medium">
                  URL de Miniatura <span className="text-xs text-gray-500">({formData.thumbnailUrl.length}/200)</span>
                </label>
                <Input
                  id="thumbnailUrl"
                  placeholder="https://ejemplo.com/miniatura.jpg"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Duración (segundos) <span className="text-xs text-gray-500">({formData.duration.length}/10)</span>
                </label>
                <Input
                  id="duration"
                  placeholder="180"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Video activo (visible en el sitio web)
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium">
                  Video destacado
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
