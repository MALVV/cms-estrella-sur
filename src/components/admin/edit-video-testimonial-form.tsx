"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, Save, X, ImageIcon } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'

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
  const [uploading, setUploading] = useState(false)
  const [urlError, setUrlError] = useState('')
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>('')
  const [thumbnailMarkedForDeletion, setThumbnailMarkedForDeletion] = useState(false)

  // Función para validar URL de video (YouTube, Google Drive o Facebook)
  const validateVideoUrl = (url: string): boolean => {
    if (!url) return false
    
    // YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/
    if (youtubeRegex.test(url)) return true
    
    // Google Drive
    const driveRegex = /drive\.google\.com\/(file\/d\/|open\?id=)[a-zA-Z0-9_-]+/
    if (driveRegex.test(url)) return true
    
    // Facebook
    const facebookRegex = /(facebook\.com\/.*\/videos\/|facebook\.com\/watch|fb\.watch\/)/
    if (facebookRegex.test(url)) return true
    
    return false
  }

  const handleThumbnailUpload = async (file: File) => {
    try {
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
      const maxBytes = maxMb * 1024 * 1024;
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      if (!allowed.includes(file.type)) {
        toast({
          title: 'Error',
          description: 'Formato no permitido. Usa JPG, PNG, WEBP o GIF',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > maxBytes) {
        toast({
          title: 'Error',
          description: `El archivo es demasiado grande. Máximo ${maxMb}MB`,
          variant: 'destructive',
        });
        return;
      }

      // Crear preview local (no subir al bucket todavía)
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setThumbnailPreviewUrl(previewUrl);
        setSelectedThumbnailFile(file);
        setThumbnailMarkedForDeletion(false);
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Imagen seleccionada',
        description: 'La imagen se subirá al bucket al guardar los cambios',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar la imagen',
        variant: 'destructive',
      });
    }
  }

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
      setThumbnailMarkedForDeletion(false)
      setSelectedThumbnailFile(null)
      setThumbnailPreviewUrl('')
    }
  }, [video])

  const handleInputChange = (field: string, value: string | boolean) => {
    // Si es un boolean (checkbox), actualizar directamente
    if (typeof value === 'boolean') {
      setFormData(prev => ({ ...prev, [field]: value }))
      return
    }
    
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validar URL de video en tiempo real
    if (field === 'youtubeUrl') {
      if (value && !validateVideoUrl(value)) {
        setUrlError('URL inválida. Formatos válidos: YouTube, Google Drive o Facebook')
      } else {
        setUrlError('')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUrlError('')

    // Validar URL antes de enviar
    if (!validateVideoUrl(formData.youtubeUrl)) {
      setUrlError('URL inválida. Formatos válidos: YouTube, Google Drive o Facebook')
      setLoading(false)
      return
    }

    try {
      // Si hay una imagen seleccionada, subirla al bucket primero
      let finalThumbnailUrl: string | null = formData.thumbnailUrl || null;
      
      if (selectedThumbnailFile) {
        setUploading(true);
        try {
          const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
          const maxBytes = maxMb * 1024 * 1024;
          const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

          if (!allowed.includes(selectedThumbnailFile.type)) {
            throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF');
          }
          if (selectedThumbnailFile.size > maxBytes) {
            throw new Error(`El archivo es demasiado grande. Máximo ${maxMb}MB`);
          }

          // Eliminar la imagen anterior del bucket si existe
          const originalThumbnailUrl = video.thumbnailUrl;
          if (originalThumbnailUrl) {
            try {
              const controller = new AbortController();
              const timer = setTimeout(() => controller.abort(), 15000);
              await fetch('/api/spaces/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: originalThumbnailUrl }),
                signal: controller.signal,
              });
              clearTimeout(timer);
            } catch (err) {
              console.warn('No se pudo eliminar imagen anterior del bucket:', err);
            }
          }

          // Subir la nueva imagen
          const formDataToUpload = new FormData();
          formDataToUpload.append('file', selectedThumbnailFile);

          const uploadResponse = await fetch('/api/video-testimonials/upload-thumbnail', {
            method: 'POST',
            credentials: 'include',
            body: formDataToUpload,
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || 'Error al subir imagen');
          }

          const uploadData = await uploadResponse.json();
          finalThumbnailUrl = uploadData.url;
        } catch (error) {
          console.error('Error uploading file:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Error al subir la imagen',
            variant: 'destructive',
          });
          setUploading(false);
          setLoading(false);
          return;
        } finally {
          setUploading(false);
        }
      } else if (thumbnailMarkedForDeletion) {
        // Si se marcó para eliminar, eliminar del bucket antes de actualizar
        const originalThumbnailUrl = video.thumbnailUrl;
        if (originalThumbnailUrl) {
          try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 15000);
            await fetch('/api/spaces/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: originalThumbnailUrl }),
              signal: controller.signal,
            });
            clearTimeout(timer);
          } catch (err) {
            console.warn('No se pudo eliminar imagen anterior del bucket:', err);
          }
        }
        finalThumbnailUrl = null;
      } else {
        // Si no se tocó la imagen, mantener la original
        finalThumbnailUrl = video.thumbnailUrl || null;
      }

      const response = await fetch(`/api/video-testimonials/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          youtubeUrl: formData.youtubeUrl,
          thumbnailUrl: finalThumbnailUrl || undefined,
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
      setThumbnailMarkedForDeletion(false)
      setSelectedThumbnailFile(null)
      setThumbnailPreviewUrl('')
      
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
    setThumbnailMarkedForDeletion(false)
    setSelectedThumbnailFile(null)
    setThumbnailPreviewUrl('')
    setUrlError('')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // Si se cierra sin guardar, resetear el estado
        setThumbnailMarkedForDeletion(false);
        setSelectedThumbnailFile(null);
        setThumbnailPreviewUrl('');
        setUrlError('');
        setFormData({
          title: video.title,
          description: video.description,
          youtubeUrl: video.youtubeUrl,
          thumbnailUrl: video.thumbnailUrl || '',
          duration: video.duration ? video.duration.toString() : '',
          isActive: video.isActive,
          isFeatured: video.isFeatured
        });
      }
    }}>
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
                Título *
              </label>
              <Input
                id="title"
                placeholder="Ingresa el título del video testimonial"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descripción *
              </label>
              <textarea
                id="description"
                placeholder="Describe el video testimonial..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="youtubeUrl" className="text-sm font-medium">
                URL del Video * <span className="text-xs text-gray-500">(YouTube, Google Drive o Facebook)</span>
              </label>
              <Input
                id="youtubeUrl"
                placeholder="https://www.youtube.com/watch?v=... o https://drive.google.com/file/d/... o https://facebook.com/..."
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                required
                className={urlError ? 'border-red-500 focus:border-red-500' : ''}
              />
              {urlError && (
                <p className="text-sm text-red-600">{urlError}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Miniatura del Video</label>
              {!thumbnailPreviewUrl && !formData.thumbnailUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="thumbnail-upload-edit" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir miniatura'}
                      </span>
                      <input
                        id="thumbnail-upload-edit"
                        name="thumbnail-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleThumbnailUpload(file);
                        }}
                        disabled={uploading || loading}
                      />
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, WEBP o GIF hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20))}MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={thumbnailPreviewUrl || formData.thumbnailUrl || ''}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedThumbnailFile(null);
                        setThumbnailPreviewUrl('');
                        setFormData(prev => ({ ...prev, thumbnailUrl: '' }));
                        setThumbnailMarkedForDeletion(true);
                        toast({
                          title: 'Imagen marcada para eliminar',
                          description: 'Se eliminará del bucket al guardar los cambios',
                        });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Duración (segundos)
              </label>
              <Input
                id="duration"
                placeholder="180"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
              />
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
            <Button type="submit" disabled={loading || uploading}>
              <Save className="mr-2 h-4 w-4" />
              {loading || uploading ? 'Procesando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
