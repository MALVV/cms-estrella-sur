'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

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
  createdAt: string;
  updatedAt: string;
}

interface EditMethodologyFormProps {
  methodology: Methodology;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface MethodologyFormData {
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  imageAlt: string;
  ageGroup: string;
  category: 'EDUCACION' | 'SALUD' | 'SOCIAL' | 'AMBIENTAL';
  targetAudience: string;
  objectives: string;
  implementation: string;
  results: string;
  methodology: string;
  resources: string;
  evaluation: string;
}

export function EditMethodologyForm({ methodology, onSuccess, onCancel }: EditMethodologyFormProps) {
  const [formData, setFormData] = useState<MethodologyFormData>({
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
    evaluation: methodology.evaluation || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof MethodologyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('El título es requerido');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('La descripción es requerida');
      return;
    }

    if (!formData.shortDescription.trim()) {
      toast.error('La descripción corta es requerida');
      return;
    }

    if (!formData.ageGroup.trim()) {
      toast.error('El grupo de edad es requerido');
      return;
    }

    if (!formData.targetAudience.trim()) {
      toast.error('El público objetivo es requerido');
      return;
    }

    if (!formData.objectives.trim()) {
      toast.error('Los objetivos son requeridos');
      return;
    }

    if (!formData.implementation.trim()) {
      toast.error('La implementación es requerida');
      return;
    }

    if (!formData.results.trim()) {
      toast.error('Los resultados son requeridos');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/methodologies/${methodology.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar metodología');
      }

      toast.success('Metodología actualizada exitosamente');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating methodology:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar metodología');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EDUCACION':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SALUD':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'SOCIAL':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'AMBIENTAL':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Editar Metodología
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Editando: {methodology.title}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Título de la metodología"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value as 'EDUCACION' | 'SALUD' | 'SOCIAL' | 'AMBIENTAL')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EDUCACION">Educación</SelectItem>
                    <SelectItem value="SALUD">Salud</SelectItem>
                    <SelectItem value="SOCIAL">Social</SelectItem>
                    <SelectItem value="AMBIENTAL">Ambiental</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  <Badge className={getCategoryColor(formData.category)}>
                    {formData.category}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Descripción Corta *</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Descripción breve de la metodología"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción Completa *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada de la metodología"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Información del Público */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Público Objetivo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Grupo de Edad *</Label>
                <Input
                  id="ageGroup"
                  value={formData.ageGroup}
                  onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                  placeholder="Ej: 6-12 años, Adultos, Todas las edades"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Público Objetivo *</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Ej: Estudiantes de primaria, Comunidades rurales"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contenido de la Metodología */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contenido de la Metodología</h3>
            
            <div className="space-y-2">
              <Label htmlFor="objectives">Objetivos *</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                placeholder="Objetivos específicos de la metodología"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="implementation">Implementación *</Label>
              <Textarea
                id="implementation"
                value={formData.implementation}
                onChange={(e) => handleInputChange('implementation', e.target.value)}
                placeholder="Cómo se implementa la metodología"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="results">Resultados Esperados *</Label>
              <Textarea
                id="results"
                value={formData.results}
                onChange={(e) => handleInputChange('results', e.target.value)}
                placeholder="Resultados esperados de la metodología"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="methodology">Metodología Detallada</Label>
              <Textarea
                id="methodology"
                value={formData.methodology}
                onChange={(e) => handleInputChange('methodology', e.target.value)}
                placeholder="Descripción detallada de la metodología (opcional)"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resources">Recursos Necesarios</Label>
              <Textarea
                id="resources"
                value={formData.resources}
                onChange={(e) => handleInputChange('resources', e.target.value)}
                placeholder="Recursos necesarios para implementar la metodología (opcional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluation">Sistema de Evaluación</Label>
              <Textarea
                id="evaluation"
                value={formData.evaluation}
                onChange={(e) => handleInputChange('evaluation', e.target.value)}
                placeholder="Cómo se evalúa la metodología (opcional)"
                rows={3}
              />
            </div>
          </div>

          {/* Imagen */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Imagen</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de la Imagen</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageAlt">Texto Alternativo</Label>
                <Input
                  id="imageAlt"
                  value={formData.imageAlt}
                  onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                  placeholder="Descripción de la imagen"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Actualizar Metodología
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
