"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Video, Calendar, ImageIcon, Upload } from 'lucide-react'
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
  const [uploading, setUploading] = useState(false)
  const [createdVideo, setCreatedVideo] = useState<VideoTestimonial | null>(null)
  const [urlError, setUrlError] = useState('')
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>('')

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
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Imagen seleccionada',
        description: 'La imagen se subirá al bucket al crear el video testimonial',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar la imagen',
        variant: 'destructive',
      });
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
      let finalThumbnailUrl = formData.thumbnailUrl;
      
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
      }

      const response = await fetch('/api/video-testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          youtubeUrl: formData.youtubeUrl,
          thumbnailUrl: finalThumbnailUrl || undefined,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // Si se cierra sin guardar, resetear el estado
        setSelectedThumbnailFile(null);
        setThumbnailPreviewUrl('');
        setFormData({ title: '', description: '', youtubeUrl: '', thumbnailUrl: '', duration: '' });
        setUrlError('');
      }
    }}>
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
                    <label htmlFor="thumbnail-upload-create" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir miniatura'}
                      </span>
                      <input
                        id="thumbnail-upload-create"
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
                    <img src={thumbnailPreviewUrl || formData.thumbnailUrl} alt="Vista previa" className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedThumbnailFile(null);
                        setThumbnailPreviewUrl('');
                        setFormData(prev => ({ ...prev, thumbnailUrl: '' }));
                        toast({
                          title: 'Imagen eliminada',
                          description: 'Se eliminó del formulario',
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
            <Button type="submit" disabled={loading || uploading}>
              {loading || uploading ? 'Procesando...' : 'Crear Video Testimonial'}
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
