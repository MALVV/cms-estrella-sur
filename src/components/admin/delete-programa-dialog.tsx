'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Programa {
  id: string;
  sectorName: string;
  description: string;
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

interface DeleteProgramaDialogProps {
  programa: Programa;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export const DeleteProgramaDialog: React.FC<DeleteProgramaDialogProps> = ({ programa, onSuccess, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/programas/${programa.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el programa');
      }

      toast.success('Programa eliminado exitosamente');
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error deleting programa:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el programa');
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
          <DialogTitle>Eliminar Programa</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar el programa "{programa.sectorName}"? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

