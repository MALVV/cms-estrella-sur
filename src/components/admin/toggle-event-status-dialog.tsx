'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState(false);
  
  const isActivating = !event.isActive;
  const action = isActivating ? 'activar' : 'desactivar';
  const actionCapitalized = isActivating ? 'Activar' : 'Desactivar';

  const handleToggleStatus = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !event.isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado del evento');
      }

      toast.success(`Evento ${action} exitosamente`);
      setIsOpen(false);
      onStatusChanged(event.id, !event.isActive);
    } catch (error) {
      console.error('Error toggling event status:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado del evento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actionCapitalized} Evento</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres {action} el evento "{event.title}"?
            {isActivating 
              ? ' El evento será visible en la página pública.' 
              : ' El evento ya no será visible en la página pública.'
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            variant={isActivating ? "default" : "destructive"}
            onClick={handleToggleStatus}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              actionCapitalized
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
