'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';

interface Methodology {
  id: string;
  title: string;
  isActive: boolean;
}

interface ToggleMethodologyStatusDialogProps {
  methodology: Methodology;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function ToggleMethodologyStatusDialog({ 
  methodology, 
  onSuccess, 
  children 
}: ToggleMethodologyStatusDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/methodologies/${methodology.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          isActive: !methodology.isActive
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado de la metodología');
      }

      toast({
        title: 'Éxito',
        description: `Metodología ${!methodology.isActive ? 'activada' : 'desactivada'} exitosamente`,
      });

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error al cambiar estado de la metodología:', error);
      toast({
        title: 'Error',
        description: 'Error al cambiar el estado de la metodología',
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
            {methodology.isActive ? 'Desactivar Metodología' : 'Activar Metodología'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres {methodology.isActive ? 'desactivar' : 'activar'} la metodología 
            <strong> "{methodology.title}"</strong>?
          </p>
          {methodology.isActive && (
            <p className="text-sm text-gray-500 mt-2">
              La metodología no será visible para los usuarios públicos.
            </p>
          )}
          {!methodology.isActive && (
            <p className="text-sm text-gray-500 mt-2">
              La metodología será visible para los usuarios públicos.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleToggleStatus} 
            disabled={loading}
            variant={methodology.isActive ? 'destructive' : 'default'}
          >
            {loading ? 'Procesando...' : (methodology.isActive ? 'Desactivar' : 'Activar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
