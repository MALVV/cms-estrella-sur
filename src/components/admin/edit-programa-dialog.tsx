'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { EntityImagesGallery } from './entity-images-gallery';

interface Programa {
  id: string;
  sectorName: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  presentationVideo?: string;
  odsAlignment?: string;
  resultsAreas?: string;
  resultados?: string;
  targetGroups?: string;
  contentTopics?: string;
  moreInfoLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    news: number;
    imageLibrary: number;
  };
}

interface EditProgramaDialogProps {
  programa: Programa;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export const EditProgramaDialog: React.FC<EditProgramaDialogProps> = ({ programa, onSuccess, children }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  
  // Inicializar el estado con los valores del programa desde el inicio
  const [formData, setFormData] = useState({
    sectorName: programa?.sectorName || '',
    description: programa?.description || '',
    imageUrl: programa?.imageUrl || '',
    imageAlt: programa?.imageAlt || '',
    presentationVideo: programa?.presentationVideo || '',
    odsAlignment: programa?.odsAlignment || '',
    resultsAreas: programa?.resultsAreas || '',
    resultados: programa?.resultados || '',
    targetGroups: programa?.targetGroups || '',
    contentTopics: programa?.contentTopics || '',
    moreInfoLink: programa?.moreInfoLink || '',
  });

  useEffect(() => {
    if (programa) {
      setFormData({
        sectorName: programa.sectorName || '',
        description: programa.description || '',
        imageUrl: programa.imageUrl || '',
        imageAlt: programa.imageAlt || '',
        presentationVideo: programa.presentationVideo || '',
        odsAlignment: programa.odsAlignment || '',
        resultsAreas: programa.resultsAreas || '',
        resultados: programa.resultados || '',
        targetGroups: programa.targetGroups || '',
        contentTopics: programa.contentTopics || '',
        moreInfoLink: programa.moreInfoLink || '',
      });
      setImageMarkedForDeletion(false);
      setSelectedImageFile(null);
      setImagePreviewUrl('');
    }
  }, [programa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Si hay una imagen seleccionada, subirla al bucket primero
      let finalImageUrl: string | null = formData.imageUrl || null;
      let finalImageAlt: string | null = formData.imageAlt || null;
      
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
          const originalImageUrl = programa.imageUrl;
          if (originalImageUrl && originalImageUrl !== '/placeholder-news.jpg') {
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

          const uploadResponse = await fetch('/api/admin/programas/upload', {
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
        const originalImageUrl = programa.imageUrl;
        if (originalImageUrl && originalImageUrl !== '/placeholder-news.jpg') {
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

      const response = await fetch(`/api/admin/programas/${programa.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl || null,
          imageAlt: finalImageAlt || null,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar programa');
      }

      toast({
        title: 'Éxito',
        description: 'Programa actualizado exitosamente',
      });
      setIsOpen(false);
      setImageMarkedForDeletion(false);
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating programa:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar programa',
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // Si se cierra sin guardar, resetear el estado
        setImageMarkedForDeletion(false);
        setSelectedImageFile(null);
        setImagePreviewUrl('');
        setFormData({
          sectorName: programa.sectorName || '',
          description: programa.description || '',
          imageUrl: programa.imageUrl || '',
          imageAlt: programa.imageAlt || '',
          presentationVideo: programa.presentationVideo || '',
          odsAlignment: programa.odsAlignment || '',
          resultsAreas: programa.resultsAreas || '',
          resultados: programa.resultados || '',
          targetGroups: programa.targetGroups || '',
          contentTopics: programa.contentTopics || '',
          moreInfoLink: programa.moreInfoLink || '',
        });
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Programa</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="gallery">Galería de Imágenes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
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
              {!imagePreviewUrl && !formData.imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="file-upload-program-edit" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                      </span>
                      <input
                        id="file-upload-program-edit"
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
            <Button type="submit" disabled={isLoading || uploading}>
              {isLoading || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </form>
          </TabsContent>
          
          <TabsContent value="gallery" className="space-y-4">
            <EntityImagesGallery
              entityType="program"
              entityId={programa.id}
              entityName={programa.sectorName}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

