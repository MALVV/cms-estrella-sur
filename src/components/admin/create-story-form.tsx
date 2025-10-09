"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Calendar } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

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
  const { toast } = useToast()
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
  const [createdStory, setCreatedStory] = useState<Story | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          summary: formData.summary,
          imageUrl: formData.imageUrl || '/placeholder-story.jpg',
          imageAlt: formData.imageAlt || formData.title
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear story')
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
      
    } catch (error) {
      toast({
        title: "Error al crear story",
        description: error instanceof Error ? error.message : "Hubo un problema al crear la story. Inténtalo de nuevo.",
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Story
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Story</DialogTitle>
          <DialogDescription>
            Completa la información para crear una nueva story de éxito.
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
                placeholder="Ingresa el título de la story"
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
                placeholder="Escribe el contenido completo de la story..."
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
                placeholder="Escribe un resumen breve de la story..."
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
              {loading ? 'Creando...' : 'Crear Story'}
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
              ¡Story Creada Exitosamente!
            </DialogTitle>
            <DialogDescription>
              La story ha sido creada y está lista para ser publicada.
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
