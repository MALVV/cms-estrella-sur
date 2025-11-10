'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface DeleteUserDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  onUserDeleted: (userId: string) => void;
  children: React.ReactNode;
}

export function DeleteUserDialog({ user, onUserDeleted, children }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      console.log('🗑️ Eliminando usuario:', {
        userId: user.id,
        userEmail: user.email,
      });

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `Error ${response.status}: ${response.statusText}`;
        console.error('❌ Error del servidor:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ Usuario eliminado exitosamente');

      // Llamar callback para actualizar el estado local
      onUserDeleted(user.id);

      toast({
        title: "Usuario eliminado exitosamente",
        description: `"${user.name}" (${user.email}) ha sido eliminado permanentemente.`,
      });

      setOpen(false);
    } catch (error) {
      console.error('❌ Error en handleDelete:', error);
      toast({
        title: "Error al eliminar usuario",
        description: error instanceof Error ? error.message : "Hubo un problema al eliminar el usuario.",
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
          <DialogTitle>Eliminar Usuario</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres eliminar al usuario 
            <strong> "{user.name}"</strong> ({user.email})?
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

