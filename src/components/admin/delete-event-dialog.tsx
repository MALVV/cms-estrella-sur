'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';
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
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Eliminar Evento
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar permanentemente el evento <strong>"{event.title}"</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Trash2 className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium text-red-900">{event.title}</p>
                <p className="text-sm text-red-700 line-clamp-2">{event.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer. El evento será eliminado permanentemente del sistema.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              variant="destructive"
            >
              {loading ? 'Eliminando...' : 'Eliminar Permanentemente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
