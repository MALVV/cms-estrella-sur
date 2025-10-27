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

interface ToggleProgramaStatusDialogProps {
  programa: Programa;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export const ToggleProgramaStatusDialog: React.FC<ToggleProgramaStatusDialogProps> = ({ programa, onSuccess, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isActivating = !programa.isActive;
  const action = isActivating ? 'activar' : 'desactivar';
  const actionCapitalized = isActivating ? 'Activar' : 'Desactivar';

  const handleToggleStatus = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/programas/${programa.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isActive: !programa.isActive 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado del programa');
      }

      toast.success(`Programa ${action} exitosamente`);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error toggling programa status:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado del programa');
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
          <DialogTitle>{actionCapitalized} Programa</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres {action} el programa "{programa.sectorName}"?
            {isActivating 
              ? ' El programa será visible en la página pública.' 
              : ' El programa ya no será visible en la página pública.'
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

