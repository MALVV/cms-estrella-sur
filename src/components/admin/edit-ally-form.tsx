'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Ally {
  id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface EditAllyFormProps {
  ally: Ally;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export const EditAllyForm: React.FC<EditAllyFormProps> = ({ ally, onSuccess, children }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    isActive: true,
  });

  // Límites de caracteres para mantener estética en las tarjetas
  const CHARACTER_LIMITS = {
    name: 40,
    role: 25,
    description: 150,
    imageAlt: 60,
  };

  useEffect(() => {
    setFormData({
      name: ally.name,
      role: ally.role,
      description: ally.description || '',
      imageUrl: ally.imageUrl,
      imageAlt: ally.imageAlt,
      isActive: ally.status === 'ACTIVE',
    });
    setImageMarkedForDeletion(false);
    setSelectedImageFile(null);
    setImagePreviewUrl('');
  }, [ally]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Si hay una imagen seleccionada, subirla al bucket primero
      let finalImageUrl: string | null = formData.imageUrl;
      let finalImageAlt: string | null = formData.imageAlt;
      
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

          // Eliminar la imagen anterior del bucket si existe
          const originalImageUrl = ally.imageUrl;
          if (originalImageUrl && originalImageUrl !== '/placeholder-ally.jpg') {
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

          const uploadResponse = await fetch('/api/allies/upload', {
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
          setIsLoading(false);
          return;
        } finally {
          setUploading(false);
        }
      } else if (imageMarkedForDeletion) {
        // Si se marcó para eliminar, eliminar del bucket antes de actualizar
        const originalImageUrl = ally.imageUrl;
        if (originalImageUrl && originalImageUrl !== '/placeholder-ally.jpg') {
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
      }

      const response = await fetch(`/api/allies/${ally.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl || null,
          imageAlt: finalImageAlt || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el aliado');
      }

      toast({
        title: 'Éxito',
        description: 'Aliado actualizado exitosamente',
      });
      setIsOpen(false);
      setImageMarkedForDeletion(false);
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating ally:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar el aliado',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
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

  // Función para obtener el color del contador según el porcentaje usado
  const getCounterColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // Si se cierra sin guardar, resetear el estado
        setImageMarkedForDeletion(false);
        setSelectedImageFile(null);
        setImagePreviewUrl('');
        setFormData({
          name: ally.name,
          role: ally.role,
          description: ally.description || '',
          imageUrl: ally.imageUrl,
          imageAlt: ally.imageAlt,
          isActive: ally.status === 'ACTIVE',
        });
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Aliado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ej: FUNDACIÓN MUNDO FELIZ"
                maxLength={CHARACTER_LIMITS.name}
              />
              <div className={`text-xs mt-1 ${getCounterColor(formData.name.length, CHARACTER_LIMITS.name)}`}>
                {formData.name.length}/{CHARACTER_LIMITS.name} caracteres
              </div>
            </div>
            <div>
              <Label htmlFor="role">Rol *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                placeholder="Ej: Aliado Estratégico"
                maxLength={CHARACTER_LIMITS.role}
              />
              <div className={`text-xs mt-1 ${getCounterColor(formData.role.length, CHARACTER_LIMITS.role)}`}>
                {formData.role.length}/{CHARACTER_LIMITS.role} caracteres
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del aliado..."
              rows={3}
              maxLength={CHARACTER_LIMITS.description}
            />
            <div className={`text-xs mt-1 ${getCounterColor(formData.description.length, CHARACTER_LIMITS.description)}`}>
              {formData.description.length}/{CHARACTER_LIMITS.description} caracteres
            </div>
          </div>

          <div className="space-y-4">
            <Label>Imagen Principal</Label>
            {!imagePreviewUrl && !formData.imageUrl ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <div className="mt-4">
                  <label htmlFor="file-upload-ally-edit" className="cursor-pointer">
                    <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                      {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                    </span>
                    <input
                      id="file-upload-ally-edit"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      disabled={uploading || isLoading}
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
                <label htmlFor="file-upload-ally-replace-edit" className="cursor-pointer">
                  <Button type="button" variant="outline" className="w-full" disabled={uploading || isLoading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                  </Button>
                  <input
                    id="file-upload-ally-replace-edit"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    disabled={uploading || isLoading}
                  />
                </label>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Texto Alternativo de la Imagen</Label>
              <Input
                id="imageAlt"
                value={formData.imageAlt}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                placeholder="Descripción de la imagen"
                maxLength={CHARACTER_LIMITS.imageAlt}
              />
              <div className={`text-xs mt-1 ${getCounterColor(formData.imageAlt.length, CHARACTER_LIMITS.imageAlt)}`}>
                {formData.imageAlt.length}/{CHARACTER_LIMITS.imageAlt} caracteres
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isActive">Aliado activo</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {isLoading || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Actualizar Aliado'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};