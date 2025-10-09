"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Video, Calendar } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface VideoTestimonial {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  isActive: boolean;
  createdAt: string;
}

interface CreateVideoTestimonialFormProps {
  onVideoCreated?: (video: VideoTestimonial) => void
}

export function CreateVideoTestimonialForm({ onVideoCreated }: CreateVideoTestimonialFormProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    thumbnailUrl: '',
    duration: ''
  })
  const [loading, setLoading] = useState(false)
  const [createdVideo, setCreatedVideo] = useState<VideoTestimonial | null>(null)
  const [urlError, setUrlError] = useState('')

  // Función para validar URL de YouTube
  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/
    return youtubeRegex.test(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUrlError('')

    // Validar URL antes de enviar
    if (!validateYouTubeUrl(formData.youtubeUrl)) {
      setUrlError('URL de YouTube inválida. Formatos válidos: https://www.youtube.com/watch?v=..., https://youtu.be/..., https://www.youtube.com/embed/...')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/video-testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          youtubeUrl: formData.youtubeUrl,
          thumbnailUrl: formData.thumbnailUrl || undefined,
          duration: formData.duration ? parseInt(formData.duration) : undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear video testimonial')
      }

      const newVideo = await response.json()
      setCreatedVideo(newVideo)

      if (onVideoCreated) {
        onVideoCreated(newVideo)
      }

      // Cerrar el popup de creación y abrir el de éxito
      setIsOpen(false)
      setShowSuccessDialog(true)
      setFormData({ title: '', description: '', youtubeUrl: '', thumbnailUrl: '', duration: '' })
      
    } catch (error) {
      toast({
        title: "Error al crear video testimonial",
        description: error instanceof Error ? error.message : "Hubo un problema al crear el video testimonial. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    // Definir límites de caracteres
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
    
    // Validar URL de YouTube en tiempo real
    if (field === 'youtubeUrl') {
      if (value && !validateYouTubeUrl(value)) {
        setUrlError('URL de YouTube inválida')
      } else {
        setUrlError('')
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Video Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl mx-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Video Testimonial</DialogTitle>
          <DialogDescription>
            Completa la información para crear un nuevo video testimonial.
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
                placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                maxLength={200}
                required
                className={urlError ? 'border-red-500 focus:border-red-500' : ''}
              />
              {urlError && (
                <p className="text-sm text-red-600">{urlError}</p>
              )}
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
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Video Testimonial'}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Popup de éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Video className="h-5 w-5" />
              ¡Video Testimonial Creado Exitosamente!
            </DialogTitle>
            <DialogDescription>
              El video testimonial ha sido creado y está listo para ser publicado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  <Calendar className="mr-1 h-3 w-3" />
                  {createdVideo?.createdAt}
                </Badge>
                <Badge variant={createdVideo?.isActive ? 'default' : 'secondary'}>
                  {createdVideo?.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <div className="text-sm text-green-700">
                <p><strong>Título:</strong> {createdVideo?.title}</p>
                <p><strong>ID:</strong> {createdVideo?.id}</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setShowSuccessDialog(false)}>
                Continuar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
