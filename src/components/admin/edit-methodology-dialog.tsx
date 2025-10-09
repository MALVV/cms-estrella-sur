'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Edit } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Methodology {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  ageGroup: string;
  category: 'EDUCACION' | 'SALUD' | 'SOCIAL' | 'AMBIENTAL';
  targetAudience: string;
  objectives: string;
  implementation: string;
  results: string;
  methodology?: string;
  resources?: string;
  evaluation?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    name?: string;
    email: string;
  };
}

interface EditMethodologyDialogProps {
  methodology: Methodology;
  onMethodologyUpdated: (methodology: Methodology) => void;
  children: React.ReactNode;
}

export function EditMethodologyDialog({ methodology, onMethodologyUpdated, children }: EditMethodologyDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    imageUrl: '',
    imageAlt: '',
    ageGroup: '',
    category: 'EDUCACION' as 'EDUCACION' | 'SALUD' | 'SOCIAL' | 'AMBIENTAL',
    targetAudience: '',
    objectives: '',
    implementation: '',
    results: '',
    methodology: '',
    resources: '',
    evaluation: ''
  });
  const [loading, setLoading] = useState(false);

  // Inicializar el formulario con los datos de la metodología
  useEffect(() => {
    if (methodology) {
      setFormData({
        title: methodology.title,
        description: methodology.description,
        shortDescription: methodology.shortDescription,
        imageUrl: methodology.imageUrl || '',
        imageAlt: methodology.imageAlt || '',
        ageGroup: methodology.ageGroup,
        category: methodology.category,
        targetAudience: methodology.targetAudience,
        objectives: methodology.objectives,
        implementation: methodology.implementation,
        results: methodology.results,
        methodology: methodology.methodology || '',
        resources: methodology.resources || '',
        evaluation: methodology.evaluation || ''
      });
    }
  }, [methodology]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Verificar que tenemos el token de sesión
    if (!session?.customToken) {
      toast({
        title: "Error de autenticación",
        description: "No se encontró el token de sesión. Por favor, inicia sesión nuevamente.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/methodologies/${methodology.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.customToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la metodología');
      }

      const updatedMethodology = await response.json();
      
      if (onMethodologyUpdated) {
        onMethodologyUpdated(updatedMethodology);
      }

      toast({
        title: "Metodología actualizada exitosamente",
        description: "Los cambios han sido guardados correctamente.",
      });

      setIsOpen(false);
      
    } catch (error) {
      toast({
        title: "Error al actualizar metodología",
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar la metodología. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Resetear el formulario a los valores originales
    setFormData({
      title: methodology.title,
      description: methodology.description,
      shortDescription: methodology.shortDescription,
      imageUrl: methodology.imageUrl || '',
      imageAlt: methodology.imageAlt || '',
      ageGroup: methodology.ageGroup,
      category: methodology.category,
      targetAudience: methodology.targetAudience,
      objectives: methodology.objectives,
      implementation: methodology.implementation,
      results: methodology.results,
      methodology: methodology.methodology || '',
      resources: methodology.resources || '',
      evaluation: methodology.evaluation || ''
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Metodología
          </DialogTitle>
          <DialogDescription>
            Modifica la información de la metodología.
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
                placeholder="Ingresa el título de la metodología"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="shortDescription" className="text-sm font-medium">
                Descripción Corta * <span className="text-xs text-gray-500">({formData.shortDescription.length}/200)</span>
              </label>
              <Input
                id="shortDescription"
                placeholder="Descripción breve de la metodología"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descripción Completa * <span className="text-xs text-gray-500">({formData.description.length}/500)</span>
              </label>
              <textarea
                id="description"
                placeholder="Describe la metodología en detalle..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={500}
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="ageGroup" className="text-sm font-medium">
                  Grupo de Edad *
                </label>
                <Input
                  id="ageGroup"
                  placeholder="Ej: 12-18 años"
                  value={formData.ageGroup}
                  onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Categoría *
                </label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EDUCACION">Educación</SelectItem>
                    <SelectItem value="SALUD">Salud</SelectItem>
                    <SelectItem value="SOCIAL">Social</SelectItem>
                    <SelectItem value="AMBIENTAL">Ambiental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="targetAudience" className="text-sm font-medium">
                Audiencia Objetivo *
              </label>
              <Input
                id="targetAudience"
                placeholder="Ej: Estudiantes de secundaria"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="objectives" className="text-sm font-medium">
                Objetivos *
              </label>
              <textarea
                id="objectives"
                placeholder="Describe los objetivos de la metodología..."
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="implementation" className="text-sm font-medium">
                Implementación *
              </label>
              <textarea
                id="implementation"
                placeholder="Describe cómo implementar la metodología..."
                value={formData.implementation}
                onChange={(e) => handleInputChange('implementation', e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="results" className="text-sm font-medium">
                Resultados *
              </label>
              <textarea
                id="results"
                placeholder="Describe los resultados esperados..."
                value={formData.results}
                onChange={(e) => handleInputChange('results', e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">
                  URL de Imagen
                </label>
                <Input
                  id="imageUrl"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="imageAlt" className="text-sm font-medium">
                  Texto Alternativo de Imagen
                </label>
                <Input
                  id="imageAlt"
                  placeholder="Descripción de la imagen"
                  value={formData.imageAlt}
                  onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                />
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
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
