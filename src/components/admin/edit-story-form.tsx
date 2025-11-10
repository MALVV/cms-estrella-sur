"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, Save, X, Upload, ImageIcon } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface EditStoryFormProps {
  story: {
    id: string
    title: string
    content: string
    imageUrl: string
    imageAlt: string
    status: 'ACTIVE' | 'INACTIVE'
    createdAt: string
    updatedAt: string
    author?: {
      id: string
      name: string
      email: string
      role: string
    }
  }
  onStoryUpdated: (updatedStory: any) => void
  children: React.ReactNode
}

export function EditStoryForm({ story, onStoryUpdated, children }: EditStoryFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    imageAlt: '',
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('')

  // Inicializar el formulario con los datos de la story
  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title,
        content: story.content,
        imageUrl: story.imageUrl || '',
        imageAlt: story.imageAlt || '',
        isActive: story.status === 'ACTIVE'
      })
      setImageMarkedForDeletion(false)
      setSelectedImageFile(null)
      setImagePreviewUrl('')
    }
  }, [story])

  const handleInputChange = (field: string, value: string | boolean) => {
    // Si es un boolean (checkbox), actualizar directamente
    if (typeof value === 'boolean') {
      setFormData(prev => ({ ...prev, [field]: value }))
      return
    }
    
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (file: File) => {
    console.log('[EditStoryForm] handleFileUpload llamado - Solo creando preview local, NO subiendo al bucket');
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
        setImagePreviewUrl(previewUrl);
        setSelectedImageFile(file);
        setFormData(prev => ({
          ...prev,
          imageAlt: file.name,
        }));
        setImageMarkedForDeletion(false); // Si se selecciona una nueva imagen, ya no está marcada para eliminar
        console.log('[EditStoryForm] Preview local creado - Archivo guardado para subir después');
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Si hay una imagen seleccionada, subirla al bucket primero
      let finalImageUrl: string | null = formData.imageUrl || null;
      let finalImageAlt: string | null = formData.imageAlt || null;
      
      if (selectedImageFile) {
        console.log('[EditStoryForm] handleSubmit - Iniciando subida de imagen al bucket (usuario presionó "Guardar")');
        setUploading(true);
        try {
          const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
          const maxBytes = maxMb * 1024 * 1024;
          const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

          if (!allowed.includes(selectedImageFile.type)) {
            throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF');
          }
          if (selectedImageFile.size > maxBytes) {
            throw new Error(`El archivo es demasiado grande. Máximo ${maxMb}MB`);
          }

          // Eliminar la imagen anterior del bucket si existe
          const originalImageUrl = story.imageUrl;
          if (originalImageUrl && originalImageUrl !== '/placeholder-story.jpg') {
            try {
              const controller = new AbortController();
              const timer = setTimeout(() => controller.abort(), 15000);
              await fetch('/api/spaces/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: originalImageUrl }),
                signal: controller.signal,
              });
              clearTimeout(timer);
            } catch (err) {
              console.warn('No se pudo eliminar imagen anterior del bucket:', err);
            }
          }

          // Subir la nueva imagen
          const formDataToUpload = new FormData();
          formDataToUpload.append('file', selectedImageFile);

          const uploadResponse = await fetch('/api/stories/upload', {
            method: 'POST',
            credentials: 'include',
            body: formDataToUpload,
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || 'Error al subir imagen');
          }

          const uploadData = await uploadResponse.json();
          finalImageUrl = uploadData.url;
          finalImageAlt = uploadData.alt || selectedImageFile.name;
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
      } else if (imageMarkedForDeletion) {
        // Si se marcó para eliminar, eliminar del bucket antes de actualizar
        const originalImageUrl = story.imageUrl;
        if (originalImageUrl && originalImageUrl !== '/placeholder-story.jpg') {
          try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 15000);
            await fetch('/api/spaces/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: originalImageUrl }),
              signal: controller.signal,
            });
            clearTimeout(timer);
          } catch (err) {
            console.warn('No se pudo eliminar imagen anterior del bucket:', err);
          }
        }
        finalImageUrl = null;
        finalImageAlt = null;
      } else {
        // Si no se tocó la imagen, mantener la original
        finalImageUrl = story.imageUrl || null;
        finalImageAlt = formData.imageAlt !== undefined && formData.imageAlt.trim() ? formData.imageAlt : (story.imageAlt || null);
      }

      const response = await fetch(`/api/stories/${story.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          imageUrl: finalImageUrl,
          imageAlt: finalImageAlt,
          isActive: formData.isActive
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar la historia')
      }

      const updatedStory = await response.json()
      
      if (onStoryUpdated) {
        onStoryUpdated(updatedStory)
      }

      toast({
        title: 'Éxito',
        description: 'Historia actualizada exitosamente',
      })

      setIsOpen(false)
      setImageMarkedForDeletion(false)
      setSelectedImageFile(null)
      setImagePreviewUrl('')
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar la historia. Inténtalo de nuevo.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Resetear el formulario a los valores originales
    setFormData({
      title: story.title,
      content: story.content,
      imageUrl: story.imageUrl || '',
      imageAlt: story.imageAlt || '',
      isActive: story.status === 'ACTIVE'
    })
    setImageMarkedForDeletion(false)
    setSelectedImageFile(null)
    setImagePreviewUrl('')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // Si se cierra sin guardar, resetear el estado
        setImageMarkedForDeletion(false);
        setSelectedImageFile(null);
        setImagePreviewUrl('');
        setFormData({
          title: story.title,
          content: story.content,
          imageUrl: story.imageUrl || '',
          imageAlt: story.imageAlt || '',
          isActive: story.status === 'ACTIVE'
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
            Editar Historia
          </DialogTitle>
          <DialogDescription>
            Modifica la información de la historia de éxito.
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
                placeholder="Ingresa el título de la historia"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Contenido *
              </label>
              <textarea
                id="content"
                placeholder="Escribe el contenido completo de la historia..."
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="w-full min-h-[200px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Imagen</label>
              {!imagePreviewUrl && !formData.imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="file-upload-story-edit" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                      </span>
                      <input
                        id="file-upload-story-edit"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
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
                      src={imagePreviewUrl || formData.imageUrl || ''}
                      alt={formData.imageAlt || 'Vista previa'}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        // Solo marcar para eliminar, no eliminar del bucket todavía
                        console.log('[EditStoryForm] Botón Eliminar presionado - Solo marcando para eliminar');
                        setSelectedImageFile(null);
                        setImagePreviewUrl('');
                        setFormData(prev => ({ ...prev, imageUrl: '', imageAlt: '' }));
                        setImageMarkedForDeletion(true);
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
              <div className="space-y-2">
                <label htmlFor="imageAlt" className="text-sm font-medium">
                  Texto Alternativo
                </label>
                <Input
                  id="imageAlt"
                  placeholder="Descripción de la imagen"
                  value={formData.imageAlt}
                  onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Historia activa (visible en el sitio web)
              </label>
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
