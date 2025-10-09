'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  isActive: boolean;
}

interface ToggleEventStatusDialogProps {
  event: EventItem;
  onStatusChanged: (eventId: string, newStatus: boolean) => void;
  children: React.ReactNode;
}

export const ToggleEventStatusDialog: React.FC<ToggleEventStatusDialogProps> = ({ 
  event, 
  onStatusChanged, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          isActive: !event.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado');
      }

      toast({
        title: 'Éxito',
        description: `Evento ${!event.isActive ? 'activado' : 'desactivado'} exitosamente`,
      });

      setIsOpen(false);
      onStatusChanged(event.id, !event.isActive);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast({
        title: 'Error',
        description: 'Error al cambiar el estado del evento',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {event.isActive ? 'Desactivar Evento' : 'Activar Evento'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que quieres {event.isActive ? 'desactivar' : 'activar'} el evento 
            <strong> "{event.title}"</strong>?
          </p>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleToggleStatus} 
              disabled={loading}
              variant={event.isActive ? 'destructive' : 'default'}
            >
              {loading ? 'Procesando...' : (event.isActive ? 'Desactivar' : 'Activar')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
