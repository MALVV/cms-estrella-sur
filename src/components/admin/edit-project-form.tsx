'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { isValidImageUrl } from '@/lib/utils';
import { Edit } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  executionStart: string;
  executionEnd: string;
  context: string;
  objectives: string;
  content: string;
  strategicAllies?: string;
  financing?: string;
  imageUrl?: string;
  imageAlt?: string;
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

interface EditProjectFormProps {
  project: Project;
  onProjectUpdated: (updatedProject: Project) => void;
  children: React.ReactNode;
}

export const EditProjectForm: React.FC<EditProjectFormProps> = ({ 
  project, 
  onProjectUpdated, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    executionStart: '',
    executionEnd: '',
    context: '',
    objectives: '',
    content: '',
    strategicAllies: '',
    financing: '',
    imageUrl: '',
    imageAlt: '',
    isActive: true,
    isFeatured: false,
  });
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        executionStart: project.executionStart ? new Date(project.executionStart).toISOString().split('T')[0] : '',
        executionEnd: project.executionEnd ? new Date(project.executionEnd).toISOString().split('T')[0] : '',
        context: project.context || '',
        objectives: project.objectives || '',
        content: project.content || '',
        strategicAllies: project.strategicAllies || '',
        financing: project.financing || '',
        imageUrl: project.imageUrl || '',
        imageAlt: project.imageAlt || '',
        isActive: project.isActive,
        isFeatured: project.isFeatured,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.executionStart || !formData.executionEnd || 
        !formData.context.trim() || !formData.objectives.trim() || !formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'El título, fechas de ejecución, contexto, objetivos y contenido son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    // Validar URL de imagen si se proporciona
    if (formData.imageUrl?.trim() && !isValidImageUrl(formData.imageUrl.trim())) {
      toast({
        title: 'Error',
        description: 'La URL de la imagen no es válida. Por favor, ingresa una URL válida de imagen.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          ...formData,
          executionStart: new Date(formData.executionStart).toISOString(),
          executionEnd: new Date(formData.executionEnd).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar proyecto');
      }

      const updatedProject = await response.json();

      toast({
        title: 'Éxito',
        description: 'Proyecto actualizado exitosamente',
      });

      setIsOpen(false);
      onProjectUpdated(updatedProject);
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el proyecto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Proyecto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título del Proyecto *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ej: SEMBRANDO UNA IDEA, COSECHANDO UN FUTURO"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Fecha de Inicio *</label>
              <Input
                type="date"
                value={formData.executionStart}
                onChange={(e) => handleChange('executionStart', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Fecha de Fin *</label>
              <Input
                type="date"
                value={formData.executionEnd}
                onChange={(e) => handleChange('executionEnd', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Contexto *</label>
            <Textarea
              value={formData.context}
              onChange={(e) => handleChange('context', e.target.value)}
              placeholder="Describe el contexto y la situación que motivó el proyecto..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Objetivos del Proyecto *</label>
            <Textarea
              value={formData.objectives}
              onChange={(e) => handleChange('objectives', e.target.value)}
              placeholder="Describe los objetivos principales del proyecto..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contenido del Proyecto *</label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Describe el contenido, actividades y metodología del proyecto..."
              rows={5}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Aliados Estratégicos</label>
            <Textarea
              value={formData.strategicAllies}
              onChange={(e) => handleChange('strategicAllies', e.target.value)}
              placeholder="Lista los aliados estratégicos del proyecto..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Financiamiento</label>
            <Textarea
              value={formData.financing}
              onChange={(e) => handleChange('financing', e.target.value)}
              placeholder="Describe las fuentes de financiamiento..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">URL de Imagen</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Texto Alternativo</label>
              <Input
                value={formData.imageAlt}
                onChange={(e) => handleChange('imageAlt', e.target.value)}
                placeholder="Descripción de la imagen"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Activo</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Destacado</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar Proyecto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
