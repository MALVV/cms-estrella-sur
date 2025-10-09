'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { isValidImageUrl } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface CreateProjectFormProps {
  onProjectCreated: () => void;
}

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onProjectCreated }) => {
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
    if (formData.imageUrl.trim() && !isValidImageUrl(formData.imageUrl.trim())) {
      toast({
        title: 'Error',
        description: 'La URL de la imagen no es válida. Por favor, ingresa una URL válida de imagen.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/projects', {
        method: 'POST',
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
        throw new Error('Error al crear proyecto');
      }

      toast({
        title: 'Éxito',
        description: 'Proyecto creado exitosamente',
      });

      // Reset form
      setFormData({
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

      setIsOpen(false);
      onProjectCreated();
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      toast({
        title: 'Error',
        description: 'Error al crear el proyecto',
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
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
              {loading ? 'Creando...' : 'Crear Proyecto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
