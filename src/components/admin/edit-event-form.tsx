'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Edit, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  eventDate: string;
  location?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditEventFormProps {
  event: EventItem;
  onEventUpdated: (updatedEvent: EventItem) => void;
  children: React.ReactNode;
}

export const EditEventForm: React.FC<EditEventFormProps> = ({ event, onEventUpdated, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  
  // Calcular la fecha local desde el inicio
  const getLocalDateTime = (dateString: string) => {
    if (!dateString) return '';
    const eventDate = new Date(dateString);
    return new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };
  
  // Inicializar el estado con los valores del event desde el inicio
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    imageUrl: event?.imageUrl || '',
    imageAlt: event?.imageAlt || '',
    eventDate: event ? getLocalDateTime(event.eventDate) : '',
    location: event?.location || '',
    isActive: event?.isActive ?? true,
    isFeatured: event?.isFeatured ?? false,
  });
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.eventDate);
      const localDateTime = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setFormData({
        title: event.title || '',
        description: event.description || '',
        imageUrl: event.imageUrl || '',
        imageAlt: event.imageAlt || '',
        eventDate: localDateTime || '',
        location: event.location || '',
        isActive: event.isActive ?? true,
        isFeatured: event.isFeatured ?? false,
      });
      setImageMarkedForDeletion(false);
      setSelectedImageFile(null);
      setImagePreviewUrl('');
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.eventDate) {
      toast({
        title: 'Error',
        description: 'El título, descripción y fecha son obligatorios',
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
        console.log('[EditEventForm] handleSubmit - Iniciando subida de imagen al bucket (usuario presionó "Actualizar")');
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
          const originalImageUrl = event.imageUrl;
          if (originalImageUrl && originalImageUrl !== '/placeholder-event.jpg') {
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

          const uploadResponse = await fetch('/api/events/upload', {
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
      } else if (imageMarkedForDeletion) {
        // Si se marcó para eliminar, eliminar del bucket antes de actualizar
        const originalImageUrl = event.imageUrl;
        if (originalImageUrl && originalImageUrl !== '/placeholder-event.jpg') {
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
      }
      
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageMarkedForDeletion ? null : (finalImageUrl || null),
          imageAlt: imageMarkedForDeletion ? null : (finalImageAlt || null),
          eventDate: new Date(formData.eventDate).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar evento');
      }

      const updatedEvent = await response.json();

      toast({
        title: 'Éxito',
        description: 'Evento actualizado exitosamente',
      });

      setIsOpen(false);
      setImageMarkedForDeletion(false);
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      onEventUpdated(updatedEvent);
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el evento',
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
    console.log('[EditEventForm] handleFileUpload llamado - Solo creando preview local, NO subiendo al bucket');
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
        setImageMarkedForDeletion(false); // Si se selecciona una nueva imagen, ya no está marcada para eliminar
        console.log('[EditEventForm] Preview local creado - Archivo guardado para subir después');
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Imagen seleccionada',
        description: 'La imagen se subirá al bucket al guardar los cambios',
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
        setImageMarkedForDeletion(false);
        setSelectedImageFile(null);
        setImagePreviewUrl('');
        const eventDate = new Date(event.eventDate);
        const localDateTime = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setFormData({
          title: event.title || '',
          description: event.description || '',
          imageUrl: event.imageUrl || '',
          imageAlt: event.imageAlt || '',
          eventDate: localDateTime || '',
          location: event.location || '',
          isActive: event.isActive ?? true,
          isFeatured: event.isFeatured ?? false,
        });
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Título del evento"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descripción *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descripción breve del evento"
              rows={3}
              required
            />
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Fecha y Hora *</label>
              <Input
                type="datetime-local"
                value={formData.eventDate}
                onChange={(e) => handleChange('eventDate', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ubicación</label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Lugar del evento"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Imagen</label>
              {!imagePreviewUrl && !formData.imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="file-upload-edit-event" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                      </span>
                      <input
                        id="file-upload-edit-event"
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
                      src={imagePreviewUrl || formData.imageUrl}
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
                        console.log('[EditEventForm] Botón Eliminar presionado - Solo marcando para eliminar');
                        setSelectedImageFile(null);
                        setImagePreviewUrl('');
                        setFormData(prev => ({ ...prev, imageUrl: '', imageAlt: '' }));
                        setImageMarkedForDeletion(true);
                        toast({ 
                          title: 'Imagen marcada para eliminar', 
                          description: 'Se eliminará del bucket al guardar los cambios' 
                        });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <label htmlFor="file-upload-edit-event-replace" className="cursor-pointer">
                    <Button type="button" variant="outline" className="w-full" disabled={uploading || loading}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                    </Button>
                    <input
                      id="file-upload-edit-event-replace"
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
            <Button type="button" variant="outline" onClick={() => {
              setIsOpen(false);
              setImageMarkedForDeletion(false);
              setSelectedImageFile(null);
              setImagePreviewUrl('');
              // Resetear a valores originales
              const eventDate = new Date(event.eventDate);
              const localDateTime = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
              setFormData({
                title: event.title || '',
                description: event.description || '',
                imageUrl: event.imageUrl || '',
                imageAlt: event.imageAlt || '',
                eventDate: localDateTime || '',
                location: event.location || '',
                isActive: event.isActive ?? true,
                isFeatured: event.isFeatured ?? false,
              });
            }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading || uploading ? 'Procesando...' : 'Actualizar Evento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
