'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { Trash2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  executionStart: string;
  executionEnd: string;
  context: string;
  objectives: string;
  content: string;
  strategicAllies?: string;
  financing?: string;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    name?: string;
    email: string;
  };
}

interface DeleteProjectDialogProps {
  project: Project;
  onProjectDeleted: (projectId: string) => void;
  children: React.ReactNode;
}

export const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({ 
  project, 
  onProjectDeleted, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const { isTokenValid, tokenExpired, refreshSession } = useAuthCheck();

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      // Verificar que tenemos un token válido
      if (!session?.customToken) {
        throw new Error('No hay token de autenticación disponible. Por favor, inicia sesión nuevamente.');
      }

      if (tokenExpired) {
        toast({
          title: 'Sesión expirada',
          description: 'Tu sesión ha expirado. Refrescando...',
          variant: 'destructive',
        });
        await refreshSession();
        return;
      }

      console.log('🗑️ Eliminando proyecto:', project.id);
      console.log('🎫 Token disponible:', session.customToken ? 'Sí' : 'No');
      
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.customToken}`,
        },
      });

      console.log('📊 Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error del servidor:', errorData);
        throw new Error(`Error al eliminar proyecto: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Proyecto eliminado exitosamente:', result);

      toast({
        title: 'Éxito',
        description: 'Proyecto eliminado exitosamente',
      });

      setIsOpen(false);
      onProjectDeleted(project.id);
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar el proyecto',
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
          <DialogTitle>Eliminar Proyecto</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres eliminar el proyecto 
            <strong> "{project.title}"</strong>?
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
};
