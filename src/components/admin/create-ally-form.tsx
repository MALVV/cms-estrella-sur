'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CreateAllyFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateAllyForm: React.FC<CreateAllyFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
  });
  const [uploading, setUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  // Límites de caracteres para mantener estética en las tarjetas
  const CHARACTER_LIMITS = {
    name: 40,
    role: 25,
    description: 150,
    imageAlt: 60,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        return;
      } finally {
        setUploading(false);
      }
    }

    onSubmit({
      ...formData,
      imageUrl: finalImageUrl || null,
      imageAlt: finalImageAlt || null,
    });
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
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Imagen seleccionada',
        description: 'La imagen se subirá al bucket al crear el aliado',
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
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Aliado</DialogTitle>
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
                  <label htmlFor="file-upload-ally-create" className="cursor-pointer">
                    <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                      {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                    </span>
                    <input
                      id="file-upload-ally-create"
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
                      // Solo limpiar el estado local, no eliminar del bucket (aún no se ha subido)
                      setSelectedImageFile(null);
                      setImagePreviewUrl('');
                      setFormData(prev => ({ ...prev, imageUrl: '', imageAlt: '' }));
                      toast({
                        title: 'Imagen eliminada',
                        description: 'Se eliminó del formulario',
                      });
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Procesando...' : 'Crear Aliado'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

