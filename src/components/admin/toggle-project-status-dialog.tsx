'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';

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

interface ToggleProjectStatusDialogProps {
  project: Project;
  onStatusChanged: (projectId: string, newStatus: boolean) => void;
  children: React.ReactNode;
}

export const ToggleProjectStatusDialog: React.FC<ToggleProjectStatusDialogProps> = ({ 
  project, 
  onStatusChanged, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          isActive: !project.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado del proyecto');
      }

      toast({
        title: 'Éxito',
        description: `Proyecto ${!project.isActive ? 'activado' : 'desactivado'} exitosamente`,
      });

      setIsOpen(false);
      onStatusChanged(project.id, !project.isActive);
    } catch (error) {
      console.error('Error al cambiar estado del proyecto:', error);
      toast({
        title: 'Error',
        description: 'Error al cambiar el estado del proyecto',
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
            {project.isActive ? 'Desactivar Proyecto' : 'Activar Proyecto'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres {project.isActive ? 'desactivar' : 'activar'} el proyecto 
            <strong> "{project.title}"</strong>?
          </p>
          {project.isActive && (
            <p className="text-sm text-gray-500 mt-2">
              El proyecto no será visible para los usuarios públicos.
            </p>
          )}
          {!project.isActive && (
            <p className="text-sm text-gray-500 mt-2">
              El proyecto será visible para los usuarios públicos.
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
            variant={project.isActive ? 'destructive' : 'default'}
          >
            {loading ? 'Procesando...' : (project.isActive ? 'Desactivar' : 'Activar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
