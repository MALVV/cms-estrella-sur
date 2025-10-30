'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface CreateProgramaDialogProps {
  onSuccess?: () => void;
  children: React.ReactNode;
}

export const CreateProgramaDialog: React.FC<CreateProgramaDialogProps> = ({ onSuccess, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    sectorName: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    presentationVideo: '',
    odsAlignment: '',
    resultsAreas: '',
    resultados: '',
    targetGroups: '',
    contentTopics: '',
    moreInfoLink: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación en el frontend
    if (!formData.sectorName.trim()) {
      toast.error('El nombre del sector es requerido');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('La descripción es requerida');
      return;
    }

    setIsLoading(true);

    try {
      // Mapear campos al formato que espera el backend
      const payload = {
        nombreSector: formData.sectorName.trim(),
        descripcion: formData.description.trim(),
        imageUrl: formData.imageUrl?.trim() || null,
        imageAlt: formData.imageAlt?.trim() || null,
        videoPresentacion: formData.presentationVideo?.trim() || null,
        alineacionODS: formData.odsAlignment?.trim() || null,
        subareasResultados: formData.resultsAreas?.trim() || null,
        resultados: formData.resultados?.trim() || null,
        gruposAtencion: formData.targetGroups?.trim() || null,
        contenidosTemas: formData.contentTopics?.trim() || null,
        enlaceMasInformacion: formData.moreInfoLink?.trim() || null,
      };

      console.log('Payload enviado:', payload); // Debug temporal

      const response = await fetch('/api/admin/programas', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear programa');
      }

      toast.success('Programa creado exitosamente');
      setIsOpen(false);
      
      // Reset form
      setFormData({
        sectorName: '',
        description: '',
        imageUrl: '',
        imageAlt: '',
        presentationVideo: '',
        odsAlignment: '',
        resultsAreas: '',
        resultados: '',
        targetGroups: '',
        contentTopics: '',
        moreInfoLink: '',
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Error creating programa:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear programa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
      const maxBytes = maxMb * 1024 * 1024;
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowed.includes(file.type)) {
        toast.error('Formato no permitido. Usa JPG, PNG, WEBP o GIF');
        return;
      }
      if (file.size > maxBytes) {
        toast.error(`El archivo es demasiado grande. Máximo ${maxMb}MB`);
        return;
      }
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/programas/upload', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Error al subir imagen');
      }
      const data = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url, imageAlt: data.alt || file.name }));
      toast.success('Imagen subida correctamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al subir la imagen');
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
          <DialogTitle>Crear Nuevo Programa</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sectorName">Nombre del Sector *</Label>
                <Input
                  id="sectorName"
                  value={formData.sectorName}
                  onChange={(e) => setFormData({ ...formData, sectorName: e.target.value })}
                  required
                  placeholder="Ej: Educación Primaria"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Descripción detallada del programa..."
                rows={4}
              />
            </div>
          </div>

          {/* Multimedia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Multimedia</h3>
            
            <div className="space-y-4">
              <Label>Imagen Principal</Label>
              {!formData.imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="file-upload-program-create" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                      </span>
                      <input
                        id="file-upload-program-create"
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
                    <img src={formData.imageUrl} alt={formData.imageAlt || 'Vista previa'} className="w-full h-full object-cover" />
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
                          setFormData(prev => ({ ...prev, imageUrl: '', imageAlt: '' }));
                          toast.success('Imagen eliminada', {
                            description: 'Se eliminó del bucket y del formulario'
                          });
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : 'No se pudo eliminar la imagen');
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <label htmlFor="file-upload-program-replace-create" className="cursor-pointer">
                    <Button type="button" variant="outline" className="w-full" disabled={uploading}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                    </Button>
                    <input
                      id="file-upload-program-replace-create"
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
              <div className="space-y-2">
                <Label htmlFor="imageAlt">Texto Alternativo de Imagen</Label>
                <Input
                  id="imageAlt"
                  value={formData.imageAlt}
                  onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                  placeholder="Descripción de la imagen"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="presentationVideo">URL del Video de Presentación</Label>
              <Input
                id="presentationVideo"
                value={formData.presentationVideo}
                onChange={(e) => setFormData({ ...formData, presentationVideo: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Detalles del Programa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detalles del Programa</h3>
            
            <div>
              <Label htmlFor="odsAlignment">Alineación a ODS</Label>
              <Textarea
                id="odsAlignment"
                value={formData.odsAlignment}
                onChange={(e) => setFormData({ ...formData, odsAlignment: e.target.value })}
                placeholder="Cómo se alinea con los Objetivos de Desarrollo Sostenible..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="resultsAreas">Subáreas de Resultados</Label>
              <Textarea
                id="resultsAreas"
                value={formData.resultsAreas}
                onChange={(e) => setFormData({ ...formData, resultsAreas: e.target.value })}
                placeholder="Subáreas específicas de resultados..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="resultados">Resultados</Label>
              <Textarea
                id="resultados"
                value={formData.resultados}
                onChange={(e) => setFormData({ ...formData, resultados: e.target.value })}
                placeholder="Resultados esperados del programa..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="targetGroups">Grupos de Atención</Label>
              <Textarea
                id="targetGroups"
                value={formData.targetGroups}
                onChange={(e) => setFormData({ ...formData, targetGroups: e.target.value })}
                placeholder="Grupos objetivo del programa..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="contentTopics">Contenidos/Temas</Label>
              <Textarea
                id="contentTopics"
                value={formData.contentTopics}
                onChange={(e) => setFormData({ ...formData, contentTopics: e.target.value })}
                placeholder="Contenidos y temas del programa..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="moreInfoLink">Enlace para Más Información</Label>
              <Input
                id="moreInfoLink"
                value={formData.moreInfoLink}
                onChange={(e) => setFormData({ ...formData, moreInfoLink: e.target.value })}
                placeholder="https://ejemplo.com/mas-informacion"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Programa'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

