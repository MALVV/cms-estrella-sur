'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Trash2 } from 'lucide-react';

interface Methodology {
  id: string;
  title: string;
  isActive: boolean;
}

interface DeleteMethodologyDialogProps {
  methodology: Methodology;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function DeleteMethodologyDialog({ 
  methodology, 
  onSuccess, 
  children 
}: DeleteMethodologyDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      // Verificar que tenemos un token válido
      if (!session?.customToken) {
        throw new Error('No hay token de autenticación disponible. Por favor, inicia sesión nuevamente.');
      }

      const response = await fetch(`/api/public/methodologies/${methodology.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.customToken}`,
        },
      });

      if (!response.ok) {
        if (response.status !== 404) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Error al eliminar iniciativa: ${response.status} ${response.statusText}`);
        }
      }

      toast({
        title: 'Éxito',
        description: 'Iniciativa eliminada exitosamente',
      });

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error al eliminar iniciativa:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar la iniciativa',
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
          <DialogTitle>Eliminar Iniciativa</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres eliminar la iniciativa 
            <strong> "{methodology.title}"</strong>?
          </p>
          <p className="text-sm text-red-600 mt-2 font-medium">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete} 
            disabled={loading}
            variant="destructive"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
