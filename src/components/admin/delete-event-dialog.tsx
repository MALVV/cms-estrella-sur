'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

interface DeleteEventDialogProps {
  event: {
    id: string;
    title: string;
    description: string;
  };
  onEventDeleted: (eventId: string) => void;
  children: React.ReactNode;
}

export function DeleteEventDialog({ event, onEventDeleted, children }: DeleteEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el evento');
      }

      // Llamar callback para actualizar el estado local
      onEventDeleted(event.id);

      toast({
        title: "Evento eliminado exitosamente",
        description: `"${event.title}" ha sido eliminado permanentemente.`,
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Error al eliminar evento",
        description: error instanceof Error ? error.message : "Hubo un problema al eliminar el evento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Evento</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres eliminar el evento 
            <strong> "{event.title}"</strong>?
          </p>
          <p className="text-sm text-red-600 mt-2 font-medium">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
