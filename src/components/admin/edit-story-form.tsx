"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, Save, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface EditStoryFormProps {
  story: {
    id: string
    title: string
    content: string
    summary: string
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
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    imageUrl: '',
    imageAlt: '',
    isActive: true
  })
  const [loading, setLoading] = useState(false)

  // Inicializar el formulario con los datos de la story
  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title,
        content: story.content,
        summary: story.summary,
        imageUrl: story.imageUrl,
        imageAlt: story.imageAlt,
        isActive: story.status === 'ACTIVE'
      })
    }
  }, [story])

  const handleInputChange = (field: string, value: string | boolean) => {
    // Si es un boolean (checkbox), actualizar directamente
    if (typeof value === 'boolean') {
      setFormData(prev => ({ ...prev, [field]: value }))
      return
    }
    
    // Definir límites de caracteres para campos de texto
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/stories/${story.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          summary: formData.summary,
          imageUrl: formData.imageUrl,
          imageAlt: formData.imageAlt,
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
        title: "Historia actualizada exitosamente",
        description: "Los cambios han sido guardados correctamente.",
      })

      setIsOpen(false)
      
    } catch (error) {
      toast({
        title: "Error al actualizar historia",
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar la historia. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Resetear el formulario a los valores originales
    setFormData({
      title: story.title,
      content: story.content,
      summary: story.summary,
      imageUrl: story.imageUrl,
      imageAlt: story.imageAlt,
      isActive: story.status === 'ACTIVE'
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">
                  URL de Imagen <span className="text-xs text-gray-500">({formData.imageUrl.length}/200)</span>
                </label>
                <Input
                  id="imageUrl"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  maxLength={200}
                />
              </div>

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
