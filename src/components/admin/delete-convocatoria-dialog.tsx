'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Convocatoria {
  id: string;
  title: string;
}

interface DeleteConvocatoriaDialogProps {
  convocatoria: Convocatoria;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteConvocatoriaDialog({ convocatoria, open, onOpenChange, onSuccess }: DeleteConvocatoriaDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/convocatorias/${convocatoria.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar convocatoria');
      }

      toast.success('Convocatoria eliminada exitosamente');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar convocatoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Convocatoria</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres eliminar la convocatoria 
            <strong> "{convocatoria.title}"</strong>?
          </p>
          <p className="text-sm text-red-600 mt-2 font-medium">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
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

