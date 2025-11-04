'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Plus, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CreateProjectFormProps {
  onProjectCreated: () => void;
}

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onProjectCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
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

    try {
      setLoading(true);
      
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

          const uploadResponse = await fetch('/api/projects/upload', {
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
      }
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl || null,
          imageAlt: finalImageAlt || null,
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
      setSelectedImageFile(null);
      setImagePreviewUrl('');

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

  const handleFileUpload = async (file: File) => {
    try {
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
      const maxBytes = maxMb * 1024 * 1024;
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      if (!allowed.includes(file.type)) {
        throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF');
      }
      if (file.size > maxBytes) {
        throw new Error(`El archivo es demasiado grande. Máximo ${maxMb}MB`);
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

      toast({
        title: 'Imagen seleccionada',
        description: 'La imagen se subirá al bucket al crear el proyecto',
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar la imagen',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // Si se cierra sin guardar, resetear el estado
        setSelectedImageFile(null);
        setImagePreviewUrl('');
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
      }
    }}>
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

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Imagen</label>
              {!imagePreviewUrl && !formData.imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="file-upload-project" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                      </span>
                      <input
                        id="file-upload-project"
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
                <div className="space-y-4 mt-2">
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
                        // Solo limpiar el estado local, no eliminar del bucket (aún no se ha subido)
                        setSelectedImageFile(null);
                        setImagePreviewUrl('');
                        handleChange('imageUrl', '');
                        handleChange('imageAlt', '');
                        toast({ 
                          title: 'Imagen eliminada', 
                          description: 'La imagen fue removida del formulario' 
                        });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <label htmlFor="file-upload-project-replace" className="cursor-pointer">
                    <Button type="button" variant="outline" className="w-full" disabled={uploading || loading}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                    </Button>
                    <input
                      id="file-upload-project-replace"
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
            <Button type="submit" disabled={loading || uploading}>
              {loading || uploading ? 'Procesando...' : 'Crear Proyecto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
