'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Edit } from 'lucide-react';

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
      
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          ...formData,
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              {loading ? 'Actualizando...' : 'Actualizar Evento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
