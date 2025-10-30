"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Calendar, Upload, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Story {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

interface CreateStoryFormProps {
  onStoryCreated?: (story: Story) => void
}

export function CreateStoryForm({ onStoryCreated }: CreateStoryFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    imageUrl: '',
    imageAlt: ''
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('')
  const [createdStory, setCreatedStory] = useState<Story | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Si hay una imagen seleccionada, subirla al bucket primero
      let finalImageUrl = formData.imageUrl;
      let finalImageAlt = formData.imageAlt;
      
      if (selectedImageFile) {
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
          const errorMessage = error instanceof Error ? error.message : 'Error al subir la imagen';
          toast(errorMessage, { type: 'error' });
          setUploading(false);
          setLoading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          summary: formData.summary,
          imageUrl: finalImageUrl || null,
          imageAlt: finalImageAlt || formData.title
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear historia')
      }

      const newStory = await response.json()
      setCreatedStory(newStory)

      if (onStoryCreated) {
        onStoryCreated(newStory)
      }

      // Cerrar el popup de creación y abrir el de éxito
      setIsOpen(false)
      setShowSuccessDialog(true)
      setFormData({ title: '', content: '', summary: '', imageUrl: '', imageAlt: '' })
      setSelectedImageFile(null)
      setImagePreviewUrl('')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Hubo un problema al crear la historia. Inténtalo de nuevo.";
      toast(errorMessage, { type: 'error' });
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    // Definir límites de caracteres
    const limits = {
      title: 100,
      content: 2000,
      summary: 300,
      imageUrl: 200,
      imageAlt: 100
    }
    
    // Verificar si el valor excede el límite
    if (limits[field as keyof typeof limits] && value.length > limits[field as keyof typeof limits]) {
      return // No actualizar si excede el límite
    }
    
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (file: File) => {
    try {
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
      const maxBytes = maxMb * 1024 * 1024;
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowed.includes(file.type)) {
        toast('Formato no permitido. Usa JPG, PNG, WEBP o GIF', { type: 'error' });
        return;
      }
      if (file.size > maxBytes) {
        toast(`El archivo es demasiado grande. Máximo ${maxMb}MB`, { type: 'error' });
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
      };
      reader.readAsDataURL(file);

      toast.success('Imagen seleccionada', {
        description: 'La imagen se subirá al bucket al crear la historia'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar la imagen';
      toast(errorMessage, { type: 'error' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // Si se cierra sin guardar, resetear el estado
        setSelectedImageFile(null);
        setImagePreviewUrl('');
        setFormData({ title: '', content: '', summary: '', imageUrl: '', imageAlt: '' });
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Historia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Historia</DialogTitle>
          <DialogDescription>
            Completa la información para crear una nueva historia de éxito.
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
                placeholder="Ingresa el título de la historia"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Contenido * <span className="text-xs text-gray-500">({formData.content.length}/2000)</span>
              </label>
              <textarea
                id="content"
                placeholder="Escribe el contenido completo de la historia..."
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                maxLength={2000}
                className="w-full min-h-[200px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="summary" className="text-sm font-medium">
                Resumen * <span className="text-xs text-gray-500">({formData.summary.length}/300)</span>
              </label>
              <textarea
                id="summary"
                placeholder="Escribe un resumen breve de la historia..."
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                maxLength={300}
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Imagen</label>
              {!imagePreviewUrl && !formData.imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="file-upload-story-create" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                      </span>
                      <input
                        id="file-upload-story-create"
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
                    <img src={imagePreviewUrl || formData.imageUrl} alt={formData.imageAlt || 'Vista previa'} className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        // Solo limpiar el estado local, no eliminar del bucket (aún no se ha subido)
                        setSelectedImageFile(null);
                        setImagePreviewUrl('');
                        setFormData(prev => ({ ...prev, imageUrl: '', imageAlt: '' }));
                        toast.success('Imagen eliminada', {
                          description: 'La imagen fue removida del formulario'
                        });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <label htmlFor="file-upload-story-replace-create" className="cursor-pointer">
                    <Button type="button" variant="outline" className="w-full" disabled={uploading || loading}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                    </Button>
                    <input
                      id="file-upload-story-replace-create"
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
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="imageAlt" className="text-sm font-medium">
                  Texto Alternativo <span className="text-xs text-gray-500">({formData.imageAlt.length}/100)</span>
                </label>
                <Input
                  id="imageAlt"
                  placeholder="Descripción de la imagen"
                  value={formData.imageAlt}
                  onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                  maxLength={100}
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
            <Button type="submit" disabled={loading || uploading}>
              {loading || uploading ? 'Procesando...' : 'Crear Historia'}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Popup de éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <FileText className="h-5 w-5" />
              ¡Historia Creada Exitosamente!
            </DialogTitle>
            <DialogDescription>
              La historia ha sido creada y está lista para ser publicada.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  <Calendar className="mr-1 h-3 w-3" />
                  {createdStory?.createdAt}
                </Badge>
                <Badge variant={createdStory?.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {createdStory?.status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
              <div className="text-sm text-green-700">
                <p><strong>Título:</strong> {createdStory?.title}</p>
                <p><strong>ID:</strong> {createdStory?.id}</p>
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
