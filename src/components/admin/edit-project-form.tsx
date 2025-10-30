'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Edit, Upload, ImageIcon } from 'lucide-react';

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
  const [uploading, setUploading] = useState(false);
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

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/projects/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al subir imagen');
      }

      const data = await response.json();
      console.log('Imagen subida exitosamente:', data);
      console.log('URL de la imagen:', data.url);
      
      setFormData(prev => ({
        ...prev,
        imageUrl: data.url,
        imageAlt: data.alt || file.name,
      }));

      toast({
        title: 'Éxito',
        description: 'Imagen subida correctamente',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al subir la imagen',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
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

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Imagen</label>
              {!formData.imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="file-upload-edit-project" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                      </span>
                      <input
                        id="file-upload-edit-project"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        disabled={uploading}
                      />
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, GIF hasta 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-2">
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={formData.imageUrl}
                      alt={formData.imageAlt || 'Vista previa'}
                      className="w-full h-full object-cover"
                      onLoad={() => console.log('Imagen cargada exitosamente:', formData.imageUrl)}
                      onError={(e) => {
                        console.error('Error cargando imagen. URL:', formData.imageUrl);
                        // Intentar cargar la imagen directamente
                        const img = e.currentTarget;
                        img.style.display = 'none';
                        // Mostrar mensaje de error visual
                        const container = img.parentElement;
                        if (container) {
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700';
                          errorDiv.innerHTML = '<p class="text-red-500 text-sm">Error al cargar imagen</p>';
                          container.appendChild(errorDiv);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={async () => {
                        try {
                          if (formData.imageUrl) {
                            const controller = new AbortController();
                            const timer = setTimeout(() => controller.abort(), 15000);
                            const res = await fetch('/api/spaces/delete', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ url: formData.imageUrl }),
                              signal: controller.signal,
                            });
                            clearTimeout(timer);
                            if (!res.ok) {
                              const e = await res.json().catch(() => ({}));
                              throw new Error(e.error || 'No se pudo eliminar del bucket');
                            }
                          }
                          // Limpiar en UI
                          handleChange('imageUrl', '');
                          handleChange('imageAlt', '');

                          // Persistir en BD inmediatamente
                          try {
                            const saveRes = await fetch(`/api/projects/${project.id}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${session?.customToken}`,
                              },
                              body: JSON.stringify({
                                ...formData,
                                imageUrl: null,
                                imageAlt: null,
                                executionStart: formData.executionStart ? new Date(formData.executionStart).toISOString() : undefined,
                                executionEnd: formData.executionEnd ? new Date(formData.executionEnd).toISOString() : undefined,
                              }),
                            });
                            if (!saveRes.ok) {
                              console.warn('No se pudo persistir imageUrl=null para proyecto');
                            }
                          } catch (persistErr) {
                            console.warn('Error persistiendo imageUrl=null en proyecto:', persistErr);
                          }

                          toast({ title: 'Imagen eliminada', description: 'Se eliminó del bucket y se actualizó el proyecto' });
                        } catch (err) {
                          toast({ title: 'Error', description: err instanceof Error ? err.message : 'No se pudo eliminar la imagen', variant: 'destructive' });
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <label htmlFor="file-upload-edit-project-replace" className="cursor-pointer">
                    <Button type="button" variant="outline" className="w-full" disabled={uploading}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                    </Button>
                    <input
                      id="file-upload-edit-project-replace"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Texto alternativo (alt)</label>
              <Input
                value={formData.imageAlt}
                onChange={(e) => handleChange('imageAlt', e.target.value)}
                placeholder="Descripción de la imagen para accesibilidad"
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
