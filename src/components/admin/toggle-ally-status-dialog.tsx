'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Ally {
  id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface ToggleAllyStatusDialogProps {
  ally: Ally;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export const ToggleAllyStatusDialog: React.FC<ToggleAllyStatusDialogProps> = ({ ally, onSuccess, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isActivating = ally.status === 'INACTIVE';
  const action = isActivating ? 'activar' : 'desactivar';
  const actionCapitalized = isActivating ? 'Activar' : 'Desactivar';

  const handleToggleStatus = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/allies/${ally.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isActive: isActivating 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado del aliado');
      }

      toast.success(`Aliado ${action} exitosamente`);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error toggling ally status:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado del aliado');
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
          <DialogTitle>{actionCapitalized} Aliado</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres {action} el aliado "{ally.name}"?
            {isActivating 
              ? ' El aliado será visible en la página pública.' 
              : ' El aliado ya no será visible en la página pública.'
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
